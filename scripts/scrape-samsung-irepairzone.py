#!/usr/bin/env python3
"""Scrape iRepairZone Samsung phone repair prices into scripts/price-sources/samsung.md.

Screen / display prices are kept identical to iRepairZone.
Every other priced fault gets +£20.
"""

from __future__ import annotations

import json
import re
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/workspace")
URLS = Path("/tmp/samsung-scrape/urls.txt")
OUT_MD = ROOT / "scripts/price-sources/samsung.md"
OUT_JSON = Path("/tmp/samsung-scrape/samsung-prices.json")

OTHER_FAULT_BUMP = 20.0
UA = "SecureFixPriceSync/1.0 (+https://securefix.co.uk)"

COOKIE_RE = re.compile(
    r"setRepairCostCookie\(\s*'([^']*)'\s*,\s*'([^']*)'",
    re.S,
)
MONEY_BLOCK_RE = re.compile(
    r'alt="([^"]+)"[^>]*>.*?class="money">([^<]+)',
    re.S | re.I,
)
TITLE_RE = re.compile(r"<title>([^<]+)</title>", re.I)


def slug_to_name(url: str) -> str:
    slug = url.rstrip("/").split("/")[-1]
    slug = re.sub(r"-repair$", "", slug)
    parts = slug.replace("samsung-", "").split("-")
    nice: list[str] = ["Samsung"]
    for part in parts:
        if part in {"4g", "5g"}:
            nice.append(part.upper())
        elif part == "plus":
            nice.append("Plus")
        elif part == "fe":
            nice.append("FE")
        elif re.fullmatch(r"s\d+.*|a\d+.*|j\d+.*|z|note|fold|flip|ultra|edge|core|lite|mini|pro", part, re.I):
            nice.append(part.upper() if re.match(r"^[asjz]\d", part, re.I) else part.capitalize())
        else:
            nice.append(part.capitalize())
    # Galaxy prefix after Samsung when missing
    if len(nice) > 1 and nice[1].lower() != "galaxy":
        nice.insert(1, "Galaxy")
    return " ".join(nice)


def parse_price(raw: str) -> float | None:
    token = raw.strip().replace(",", "")
    if re.search(
        r"n/?a|na|xxx|not applicable|coming soon|book and get|get price|quote",
        token,
        re.I,
    ):
        return None
    numbers = re.findall(r"\d+(?:\.\d+)?", token)
    if not numbers:
        return None
    return float(numbers[0])


def is_screen_label(label: str) -> bool:
    lower = label.lower()
    if re.search(r"tempered|protector|protection|phone case", lower):
        return False
    return bool(re.search(r"screen|oled|lcd|display", lower))


def normalize_label(label: str, model_name: str) -> str:
    clean = re.sub(r"\s+", " ", label).strip()
    # Drop repeated model prefix
    prefixes = [
        model_name,
        model_name.replace("Samsung ", ""),
        "Samsung Galaxy Samsung Galaxy ",
        "Samsung Galaxy ",
        "Samsung ",
    ]
    changed = True
    while changed:
        changed = False
        for prefix in prefixes:
            if prefix and clean.lower().startswith(prefix.lower()):
                clean = clean[len(prefix) :].strip(" -")
                changed = True
                break
    lower = clean.lower()

    if "not aware" in lower or "other fault" in lower:
        return "Other Fault Diagnostics"
    if "dead condition" in lower:
        return "Dead Condition Repair"
    if "back cover" in lower or "back glass" in lower:
        return "Back Glass Replacement"
    if "battery" in lower:
        return "Battery Replacement"
    if "charg" in lower or "dock" in lower:
        return "Charging Dock Repair"
    if "ear" in lower or "loud" in lower or "speaker" in lower:
        return "Ear or Loud Speaker Replacement"
    if "inner screen" in lower:
        return "Inner Screen Replacement"
    if "outer screen" in lower:
        return "Outer Screen Replacement"
    if "premium" in lower and "screen" in lower:
        return "Front Screen Replacement (Premium)"
    if "standard" in lower and "screen" in lower:
        return "Front Screen Replacement (Standard)"
    if "front screen" in lower or ("screen" in lower and "replacement" in lower):
        return "Front Screen Replacement"
    if "front camera" in lower:
        return "Front Camera Repair"
    if "rear camera" in lower or "back camera" in lower:
        return "Rear Camera Repair"
    if "camera lens" in lower:
        return "Rear Camera Lens Replacement"
    if "housing" in lower:
        return "Housing Replacement"
    return clean or label


def screen_rank(label: str) -> int:
    lower = label.lower()
    if "inner" in lower:
        return 0
    if "premium" in lower:
        return 1
    if "outer" in lower:
        return 2
    if "standard" in lower:
        return 4
    return 3


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def clean_model_name(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"&#039;|&amp;", "'", text)
    text = re.sub(r"^(Samsung\s+Galaxy\s+)+\s*", "Samsung Galaxy ", text, flags=re.I)
    text = re.sub(
        r"\s+(Repair Service|Repairs?|Service)\s*$",
        "",
        text,
        flags=re.I,
    ).strip()
    return text


def model_name_from_html(html: str, url: str) -> str:
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    if h1:
        text = clean_model_name(re.sub(r"<[^>]+>", "", h1.group(1)))
        if text.lower().startswith("samsung"):
            return text
    title_m = TITLE_RE.search(html)
    if title_m:
        raw_title = clean_model_name(title_m.group(1))
        raw_title = re.split(r"\s+Repair\b|\s+\|", raw_title, maxsplit=1)[0].strip()
        raw_title = clean_model_name(raw_title)
        if raw_title.lower().startswith("samsung"):
            return raw_title
    return slug_to_name(url)


def extract_model(html: str, url: str) -> dict | None:
    model_name = model_name_from_html(html, url)
    repairs: dict[str, dict] = {}

    def add(label: str, price_raw: str) -> None:
        price = parse_price(price_raw)
        if price is None:
            return
        # Skip logos / nav alt text that happen to sit near a money span.
        if not re.search(
            r"screen|battery|charg|dock|cover|glass|camera|speaker|ear|loud|"
            r"dead|fault|housing|lens|diagnos|not aware|mic|button|software|"
            r"liquid|water|port",
            label,
            re.I,
        ):
            return
        norm = normalize_label(label, model_name)
        if not norm or norm.lower() in {"irepair zone", "samsung", "galaxy"}:
            return
        source_price = price
        if not is_screen_label(norm):
            price = round(price + OTHER_FAULT_BUMP, 2)
        entry = {
            "label": norm,
            "price": price,
            "sourcePrice": source_price,
            "priceText": f"£{price:.2f}",
        }
        prev = repairs.get(norm)
        if prev is None:
            repairs[norm] = entry
            return
        # Prefer Premium / Inner when competing under the same normalized key
        if screen_rank(norm) < screen_rank(prev["label"]) or (
            screen_rank(norm) == screen_rank(prev["label"]) and price > prev["price"]
        ):
            repairs[norm] = entry

    for cost, label in COOKIE_RE.findall(html):
        add(label, cost)

    # Back cover / graded blocks sometimes only expose money spans
    for label, money in MONEY_BLOCK_RE.findall(html):
        add(label, money)

    # Collapse Standard/Premium front screens into one Front Screen line.
    # Keep foldable Inner + Outer screens as separate priced jobs.
    front_keys = [
        k
        for k in repairs
        if is_screen_label(k) and "inner" not in k.lower() and "outer" not in k.lower()
    ]
    if front_keys:
        best = sorted(front_keys, key=lambda k: (screen_rank(k), -repairs[k]["price"]))[0]
        winner = repairs[best]
        for key in front_keys:
            repairs.pop(key, None)
        winner = {**winner, "label": "Front Screen Replacement"}
        repairs["Front Screen Replacement"] = winner

    if not repairs:
        return None

    # Stable repair order for the booking tiles
    order = [
        "Front Screen Replacement",
        "Inner Screen Replacement",
        "Outer Screen Replacement",
        "Back Glass Replacement",
        "Battery Replacement",
        "Charging Dock Repair",
        "Ear or Loud Speaker Replacement",
        "Front Camera Repair",
        "Rear Camera Repair",
        "Rear Camera Lens Replacement",
        "Housing Replacement",
        "Dead Condition Repair",
        "Other Fault Diagnostics",
    ]
    ordered = []
    seen = set()
    for key in order:
        if key in repairs:
            ordered.append(repairs[key])
            seen.add(key)
    for key, value in repairs.items():
        if key not in seen:
            ordered.append(value)

    return {"name": model_name, "url": url, "repairs": ordered}

def emit_md(models: list[dict]) -> str:
    lines = [
        "---",
        "description: Samsung phone repair prices matched to iRepairZone (screens same; other faults +£20).",
        "title: Samsung Phone Repairs - iRepairZone matched",
        "source: https://irepairzone.co.uk/devices-catagory/mobile/samsung",
        "---",
        "",
        "# Step 1",
        "",
        "### Please Select the Samsung Model:",
        "",
        "Phone Models",
        "",
        "".join(m["name"] for m in models),
        "",
        "# Step 2",
        "",
        "### Please select the Samsung issue to fix:",
        "",
    ]
    for model in models:
        lines.append(model["name"])
        lines.append("")
        blob = "".join(f"{r['label']} £{r['price']:.2f}" for r in model["repairs"])
        lines.append(blob)
        lines.append("")
    return "\n".join(lines)


def main() -> None:
    urls = [u.strip() for u in URLS.read_text().splitlines() if u.strip()]
    # Prefer the cleaner A56 slug; sitemap still points at a flaky -repair URL.
    urls = [
        "https://irepairzone.co.uk/devices/samsung-galaxy-a56"
        if u.endswith("/samsung-galaxy-a56-repair")
        else u
        for u in urls
    ]
    # Deduplicate while preserving order
    seen_urls: set[str] = set()
    deduped: list[str] = []
    for url in urls:
        if url in seen_urls:
            continue
        seen_urls.add(url)
        deduped.append(url)
    urls = deduped
    print(f"scraping {len(urls)} samsung device pages…")
    models: list[dict] = []
    failed: list[str] = []

    def one(url: str):
        for attempt in range(3):
            try:
                html = fetch(url)
                return extract_model(html, url)
            except Exception as exc:  # noqa: BLE001
                if attempt == 2:
                    return {"error": str(exc), "url": url}
                time.sleep(1.5 * (attempt + 1))
        return {"error": "unknown", "url": url}

    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(one, url): url for url in urls}
        for fut in as_completed(futures):
            result = fut.result()
            if not result:
                failed.append(futures[fut])
                print(" empty", futures[fut])
            elif "error" in result:
                failed.append(result["url"])
                print(" fail", result["url"], result["error"])
            else:
                models.append(result)
                print(f" ok {result['name']} ({len(result['repairs'])} repairs)")

    models.sort(key=lambda m: m["name"].lower())
    OUT_JSON.write_text(json.dumps({"models": models, "failed": failed}, indent=2), encoding="utf-8")
    OUT_MD.write_text(emit_md(models), encoding="utf-8")
    print(f"wrote {OUT_MD} with {len(models)} models; failed={len(failed)}")


if __name__ == "__main__":
    main()
