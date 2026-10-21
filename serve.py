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
import urllib.parse
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
EXTRA_ROUTES = {"/team-chat", "/book-call-out"}


def canonical_route(path):
    path = urllib.parse.unquote(path.split("?", 1)[0].split("#", 1)[0])
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    return path or "/"


LEGACY_EXACT = {
    "/repair/smartphone/apple-phone/iphone-14-pro/premium-screen-replacement":
        "https://securefix.uk/repair/smartphone/apple-phone/iphone-14-pro/new-screen-replacement-oled-compatible-most-popular-premium-quality",
    "/repair/smartphone/apple-phone/iphone-14-pro/battery-replacement":
        "https://securefix.uk/repair/smartphone/apple-phone/iphone-14-pro/battery-replacement-apple-original-or-oem-quality",
    "/repair/smartphone/apple-phone/iphone-14-pro/charging-unit-repair":
        "https://securefix.uk/repair/smartphone/apple-phone/iphone-14-pro/not-charging-or-charging-port-repair-dock-replacement",
    "/repair/smartphone/google/pixel-8/back-glass-replacement":
        "https://securefix.uk/repair/smartphone/google/google-pixel-8/back-cover-replacement",
}

LEGACY_PREFIX = (
    ("/repair/smartphone/google/pixel-8", "https://securefix.uk/repair/smartphone/google/google-pixel-8"),
    ("/repair/smartphone/samsung-phone/galaxy-s24-ultra", "https://securefix.uk/repair/smartphone/samsung-phone"),
    ("/repair/smartphone/samsung-phone/galaxy-s24", "https://securefix.uk/repair/smartphone/samsung-phone"),
    ("/repair/pc-laptop/apple-mac/macbook-pro-14", "https://securefix.uk/repair/pc-laptop/apple-mac"),
    ("/repair/tablet-ipad/apple-ipad/ipad-10th", "https://securefix.uk/repair/tablet-ipad/apple-ipad"),
)


def legacy_redirect(route):
    exact = LEGACY_EXACT.get(route)
    if exact:
        return exact
    for prefix, target in LEGACY_PREFIX:
        if route == prefix or route.startswith(prefix + "/"):
            return target
    return None


def load_known_routes():
    sitemap = os.path.join(ROOT, "sitemap.xml")
    routes = set(EXTRA_ROUTES)
    if os.path.isfile(sitemap):
        text = open(sitemap, encoding="utf-8").read()
        for loc in re.findall(r"<loc>([^<]+)</loc>", text):
            routes.add(canonical_route(urllib.parse.urlparse(loc).path or "/"))
    return routes


KNOWN_ROUTES = load_known_routes()


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
    def _redirect_www(self):
        host = (self.headers.get("Host") or "").split(":")[0].lower()
        if host != "www.securefix.uk":
            return False
        self.send_response(301)
        self.send_header("Location", "https://securefix.uk" + self.path)
        self.send_header("Content-Length", "0")
        self.end_headers()
        return True

    def _send_not_found(self):
        fs_path = os.path.join(ROOT, "404.html")
        with open(fs_path, "rb") as handle:
            body = handle.read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self._security_headers()
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self._redirect_www():
            return
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

        route = canonical_route(path)
        legacy = legacy_redirect(route)
        if route == "/book-call-out":
            legacy = "https://securefix.uk/call-out"
        if legacy:
            self.send_response(301)
            self.send_header("Location", legacy)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        if path != "/" and path.endswith("/"):
            target = path.rstrip("/") or "/"
            query = ""
            if "?" in self.path:
                query = "?" + self.path.split("?", 1)[1]
            host = (self.headers.get("Host") or "").split(":")[0].lower()
            location = target + query
            if host.endswith("securefix.uk"):
                location = "https://securefix.uk" + location
            self.send_response(301)
            self.send_header("Location", location)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        rel = "" if route == "/" else route.lstrip("/")
        candidate = os.path.normpath(os.path.join(ROOT, rel))
        if not candidate.startswith(os.path.normpath(ROOT)):
            self._send_not_found()
            return
        if route == "/" or os.path.isdir(candidate):
            index = os.path.join(candidate if route != "/" else ROOT, "index.html")
            if os.path.isfile(index):
                self._send_file(index)
                return
        if os.path.isfile(candidate):
            self._send_file(candidate)
            return
        _, ext = os.path.splitext(route)
        if ext:
            self.send_error(404, "File not found")
            return
        self._send_not_found()

    def _send_file(self, fs_path, status=200):
        with open(fs_path, "rb") as handle:
            body = handle.read()
        content_type = self.guess_type(fs_path)
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        if content_type.startswith("text/html"):
            self._security_headers()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _security_headers(self):
        self.send_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Content-Security-Policy", "upgrade-insecure-requests")


def main():
    handler = partial(Handler, directory=ROOT)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
