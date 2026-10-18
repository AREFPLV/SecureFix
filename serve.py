#!/usr/bin/env python3
"""Serve the SecureFix site and its public Google reviews.

/api/reviews reads the public Google Maps listing for this shop (no API key),
caches it, and the page polls that feed so new reviews show up on their own.
"""

import html
import json
import os
import re
import threading
import time
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public_html")
PORT = int(os.environ.get("PORT", "8765"))
PLACE_ID = "ChIJSVMnvdMddkgRfZBMxr6FMyU"
REVIEWS_URL = f"https://search.google.com/local/reviews?placeid={PLACE_ID}"
REFRESH_SECONDS = int(os.environ.get("REVIEWS_REFRESH_SECONDS", "120"))
BROWSER = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)

_cache_lock = threading.Lock()
_cache = {"at": 0.0, "payload": None}


def _get(url):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": BROWSER,
            "Accept-Language": "en-GB,en;q=0.9",
            "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read()


def _dig(node, *path):
    current = node
    for key in path:
        if not isinstance(current, list) or not isinstance(key, int) or key >= len(current):
            return None
        current = current[key]
    return current


def _is_review_list(node):
    if not isinstance(node, list) or not node:
        return False
    matched = 0
    for item in node[:8]:
        date = _dig(item, 0, 1, 6)
        rating = _dig(item, 0, 2, 0, 0)
        if (
            isinstance(date, str)
            and ("ago" in date or date.lower() in {"today", "yesterday"})
            and isinstance(rating, (int, float))
            and 1 <= rating <= 5
        ):
            matched += 1
    return matched >= 1 and matched == min(len(node), 8)


def _summary_from(node):
    if not isinstance(node, list) or len(node) < 9:
        return None
    rating = node[7]
    total = node[8]
    nested = node[3] if len(node) > 3 else None
    if not isinstance(rating, (int, float)) or not isinstance(total, int):
        return None
    if not (0 < rating <= 5 and total >= 0):
        return None
    if not isinstance(nested, list):
        return None
    if not any(isinstance(item, str) and "review" in item.lower() for item in nested):
        return None
    return {"rating": float(rating), "total": total}


def _review_text(item):
    text = _dig(item, 0, 2, 15, 0, 0)
    if isinstance(text, str) and text.strip():
        return text.strip().strip('"').strip()
    body = _dig(item, 0, 2)
    found = []

    def walk(node):
        if isinstance(node, str):
            cleaned = node.strip()
            if len(cleaned) > 20 and "http" not in cleaned and " " in cleaned:
                found.append(cleaned)
        elif isinstance(node, list):
            for child in node:
                walk(child)

    walk(body)
    if not found:
        return ""
    return max(found, key=len).strip().strip('"').strip()


def _parse_review(item):
    name = _dig(item, 0, 1, 4, 5, 0) or "Google user"
    if not isinstance(name, str):
        name = "Google user"
    photo = _dig(item, 0, 1, 4, 5, 1) or ""
    if isinstance(photo, str) and photo.startswith("//"):
        photo = "https:" + photo
    elif not isinstance(photo, str):
        photo = ""
    author_url = _dig(item, 0, 1, 4, 2, 0) or ""
    if not isinstance(author_url, str):
        author_url = ""
    date = _dig(item, 0, 1, 6) or ""
    if not isinstance(date, str):
        date = ""
    rating = _dig(item, 0, 2, 0, 0) or 0
    text = _review_text(item)
    if not text:
        return None
    stamp = _dig(item, 0, 1, 2)
    stamp = stamp if isinstance(stamp, (int, float)) else 0
    return {
        "name": name.strip() or "Google user",
        "rating": rating,
        "text": text,
        "device": "",
        "date": date,
        "time": stamp,
        "authorUrl": author_url,
        "photoUrl": photo,
    }


def parse_preview(raw):
    text = raw.decode("utf-8", "replace") if isinstance(raw, (bytes, bytearray)) else raw
    if text.startswith(")]}'"):
        text = text.split("\n", 1)[1]
    data = json.loads(text)
    summary = None
    reviews_node = None

    def walk(node):
        nonlocal summary, reviews_node
        if not isinstance(node, list):
            return
        found = _summary_from(node)
        if found and (summary is None or found["total"] > summary["total"]):
            summary = found
        if _is_review_list(node) and (reviews_node is None or len(node) > len(reviews_node)):
            reviews_node = node
        for child in node:
            if isinstance(child, list):
                walk(child)

    walk(data)
    reviews = []
    for item in reviews_node or []:
        parsed = _parse_review(item)
        if parsed:
            reviews.append(parsed)
    reviews.sort(key=lambda item: item.get("time") or 0, reverse=True)
    if not reviews or not summary:
        raise RuntimeError("Google listing did not include reviews")
    return {
        "ok": True,
        "source": "google",
        "rating": summary["rating"],
        "totalReviews": summary["total"],
        "googleUrl": REVIEWS_URL,
        "reviews": reviews,
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def fetch_public_reviews():
    page = _get(
        f"https://www.google.com/maps/place/?q=place_id:{PLACE_ID}&hl=en-GB"
    ).decode("utf-8", "replace")
    match = re.search(r'href="(/maps/preview/place\?[^"]+)"', page)
    if not match:
        raise RuntimeError("Google did not return a place preview")
    preview_url = "https://www.google.com" + html.unescape(match.group(1))
    return parse_preview(_get(preview_url))


def reviews_payload():
    now = time.time()
    with _cache_lock:
        cached = _cache["payload"]
        fresh = cached and now - _cache["at"] < REFRESH_SECONDS
    if fresh:
        return cached

    try:
        payload = fetch_public_reviews()
    except Exception as error:
        print(f"Google reviews refresh failed: {error}", flush=True)
        with _cache_lock:
            if _cache["payload"] and _cache["payload"].get("source") == "google":
                return _cache["payload"]
        return {
            "ok": False,
            "source": "error",
            "error": "Google reviews are temporarily unavailable.",
            "googleUrl": REVIEWS_URL,
            "rating": 0,
            "totalReviews": 0,
            "reviews": [],
        }

    with _cache_lock:
        _cache["at"] = now
        _cache["payload"] = payload
    print(
        f"Google reviews refreshed: {payload['rating']} from {payload['totalReviews']} reviews, showing {len(payload['reviews'])}",
        flush=True,
    )
    return payload


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path == "/api/reviews":
            body = json.dumps(reviews_payload()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path.startswith("/api/"):
            self.send_error(404, "Not found")
            return

        fs_path = self.translate_path(path)
        if os.path.isdir(fs_path):
            index = os.path.join(fs_path, "index.html")
            if os.path.isfile(index):
                return super().do_GET()
        if os.path.isfile(fs_path):
            return super().do_GET()
        _, ext = os.path.splitext(path.rstrip("/"))
        if ext:
            self.send_error(404, "File not found")
            return
        self.path = "/index.html"
        return super().do_GET()


def main():
    handler = partial(Handler, directory=ROOT)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
