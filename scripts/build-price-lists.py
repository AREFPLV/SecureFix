#!/usr/bin/env python3
"""Turn the saved booking price lists into src/data/priceLists.ts."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path("/workspace")
OUT = ROOT / "src/data/priceLists.ts"
TOOLS = ROOT / "scripts/price-sources"

PRICE_RE = re.compile(
    r"(?:£\s*N/?A|£\s*XXX|Not Applicable|£\s*\d+(?:\.\d+)?(?:\s*(?:–|-|to)\s*£?\s*\d+(?:\.\d+)?)?)",
    re.IGNORECASE,
)

STOP_LINES = re.compile(r"^(advantages|# step 3|copyright ©|quick links)\b", re.I)


def clean(text: str) -> str:
    text = text.replace("\\[", "[").replace("\\]", "]").replace("\\", "")
    text = text.replace("**", "")
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text).strip(" |-–")
    return text


def money(value: str) -> str:
    number = float(value)
    return f"{number:.2f}"


def parse_price(token: str) -> tuple[float | None, str]:
    token = clean(token)
    if re.search(r"n/?a|xxx|not applicable", token, re.I):
        return None, token
    numbers = re.findall(r"\d+(?:\.\d+)?", token)
    if not numbers:
        return None, token
    if len(numbers) > 1:
        return float(numbers[0]), f"£{money(numbers[0])}–£{money(numbers[1])}"
    return float(numbers[0]), f"£{money(numbers[0])}"


def parse_repairs(blob: str) -> list[dict]:
    blob = clean(blob)
    repairs: list[dict] = []
    cursor = 0
    for match in PRICE_RE.finditer(blob):
        label = clean(blob[cursor : match.start()])
        cursor = match.end()
        label = re.sub(r"^[\d.]+", "", label).strip(" -–")
        if len(label) < 3:
            continue
        if re.search(r"any issue", label, re.I):
            continue
        price, text = parse_price(match.group(0))
        if price is None:
            continue
        if any(item["label"].lower() == label.lower() for item in repairs):
            continue
        repairs.append({"label": label, "price": price, "priceText": text})
    return repairs


def clean_model(name: str) -> str:
    name = clean(name)
    name = re.sub(r"\s*repair pricing$", "", name, flags=re.I)
    name = re.sub(r"\s*[-–:]?\s*issues?$", "", name, flags=re.I)
    name = re.sub(r"\s+repair$", "", name, flags=re.I)
    name = name.replace("Samsung-", "Samsung ")
    name = name.replace("-Galaxy-", " Galaxy ")
    name = re.sub(r"\s+", " ", name).strip(" -–")
    return name


def is_heading(line: str) -> bool:
    if not line or line.startswith("#") or line.startswith("|") or line.startswith("["):
        return False
    if "£" in line or STOP_LINES.match(line):
        return False
    if len(line) > 160:
        return False
    if line.lower() in {"phone models", "ipad models", "huawei models", "macbook models", "one plus models", "google phone models"}:
        return False
    return True


def parse_step2(text: str) -> list[dict]:
    start = text.lower().find("please select")
    # Use the second "please select" (the issue step) when present.
    issue_at = text.lower().find("issue to fix")
    chunk = text[issue_at:] if issue_at >= 0 else text[start:]
    models: list[dict] = []
    current_name = ""
    current_lines: list[str] = []

    def flush() -> None:
        nonlocal current_name, current_lines
        if not current_name:
            current_lines = []
            return
        repairs = parse_repairs(" ".join(current_lines))
        name = clean_model(current_name)
        if name and repairs:
            models.append({"name": name, "repairs": repairs})
        current_name = ""
        current_lines = []

    for raw in chunk.splitlines():
        line = clean(raw)
        if not line:
            continue
        if STOP_LINES.match(line) or line.startswith("# Step 3") or line.lower().startswith("advantages"):
            break
        if line.startswith("#") or line.startswith("###") or line.lower().startswith("please select"):
            continue
        if is_heading(line):
            flush()
            current_name = line
            continue
        if current_name:
            current_lines.append(line)
    flush()
    return dedupe_models(models)


def parse_tables(text: str) -> list[dict]:
    models: list[dict] = []
    current = ""
    repairs: list[dict] = []

    def flush() -> None:
        nonlocal current, repairs
        if current and repairs:
            models.append({"name": clean_model(current), "repairs": repairs})
        current = ""
        repairs = []

    for raw in text.splitlines():
        line = clean(raw)
        if line.startswith("#### "):
            flush()
            current = re.sub(r"^####\s+", "", line)
            continue
        if not line.startswith("|") or "Issues Description" in line or line.startswith("| ---"):
            continue
        cells = [clean(cell) for cell in line.strip("|").split("|")]
        if len(cells) < 2 or "£" not in cells[1]:
            continue
        label = cells[0]
        if re.search(r"buy new watch", label, re.I):
            label = "Replacement watch of the same model"
        price, text_price = parse_price(cells[1])
        if price is None:
            continue
        repairs.append({"label": label, "price": price, "priceText": text_price})
    flush()
    return dedupe_models(models)


def dedupe_models(models: list[dict]) -> list[dict]:
    chosen: dict[str, dict] = {}
    order: list[str] = []
    for model in models:
        key = re.sub(r"[^a-z0-9]+", "", model["name"].lower())
        if key not in chosen or len(model["repairs"]) > len(chosen[key]["repairs"]):
            if key not in chosen:
                order.append(key)
            chosen[key] = model
    return [chosen[key] for key in order]


def ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def emit(devices: list[dict]) -> str:
    lines = [
        "/* Generated by scripts/build-price-lists.py. Workshop price for each listed model. */",
        "",
        "export type ListedRepair = {",
        "  label: string",
        "  price: number",
        "  priceText: string",
        "}",
        "",
        "export type ListedModel = {",
        "  name: string",
        "  repairs: ListedRepair[]",
        "}",
        "",
        "export type ListedDevice = {",
        "  id: string",
        "  categoryId: string",
        "  brandId: string",
        "  models: ListedModel[]",
        "}",
        "",
        "export const listedDevices: ListedDevice[] = [",
    ]
    for device in devices:
        lines.append("  {")
        lines.append(f"    id: {ts_string(device['id'])},")
        lines.append(f"    categoryId: {ts_string(device['categoryId'])},")
        lines.append(f"    brandId: {ts_string(device['brandId'])},")
        lines.append("    models: [")
        for model in device["models"]:
            lines.append(f"      {{ name: {ts_string(model['name'])}, repairs: [")
            for repair in model["repairs"]:
                lines.append(
                    "        { "
                    f"label: {ts_string(repair['label'])}, "
                    f"price: {repair['price']}, "
                    f"priceText: {ts_string(repair['priceText'])} "
                    "},"
                )
            lines.append("      ] },")
        lines.append("    ],")
        lines.append("  },")
    lines.append("]")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    sources = [
        ("iphone", "smartphone", "apple-phone", TOOLS / "iphone.md", "step"),
        ("ipad", "tablet-ipad", "apple-ipad", TOOLS / "ipad.md", "step"),
        ("samsung", "smartphone", "samsung-phone", TOOLS / "samsung.md", "step"),
        ("macbook", "pc-laptop", "apple-mac", TOOLS / "macbook.md", "step"),
        ("oneplus", "smartphone", "oneplus", TOOLS / "oneplus.md", "step"),
        ("huawei", "smartphone", "huawei", TOOLS / "huawei.md", "step"),
        ("pixel", "smartphone", "google", TOOLS / "pixel.md", "step"),
        ("watch", "smart-watch", "apple-watch", TOOLS / "watch.md", "step"),
    ]
    devices = []
    for device_id, category_id, brand_id, path, kind in sources:
        text = path.read_text(encoding="utf-8")
        models = parse_tables(text) if kind == "table" else parse_step2(text)
        print(f"{device_id}: {len(models)} models, repairs {[len(m['repairs']) for m in models[:3]]}")
        if models:
            sample = models[0]
            print(" ", sample["name"], sample["repairs"][0]["label"], sample["repairs"][0]["priceText"])
        devices.append(
            {"id": device_id, "categoryId": category_id, "brandId": brand_id, "models": models}
        )
    OUT.write_text(emit(devices), encoding="utf-8")
    print("wrote", OUT, "bytes", OUT.stat().st_size)


if __name__ == "__main__":
    main()
