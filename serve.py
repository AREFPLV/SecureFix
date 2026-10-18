#!/usr/bin/env python3
"""Serve the SecureFix site and a live Google reviews feed.

/api/reviews polls the Places API (newest reviews) and caches the result so
the page can refresh without calling Google on every browser poll.
Set GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) in the environment or in
a .env file next to this script.
"""

import json
import os
import threading
import time
import urllib.error
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public_html")
PORT = int(os.environ.get("PORT", "8765"))
PLACE_ID = "ChIJSVMnvdMddkgRfZBMxr6FMyU"
REVIEWS_URL = f"https://search.google.com/local/reviews?placeid={PLACE_ID}"
REFRESH_SECONDS = int(os.environ.get("REVIEWS_REFRESH_SECONDS", "120"))

_cache_lock = threading.Lock()
_cache = {"at": 0.0, "payload": None}


def _env_file_value(name):
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if not os.path.isfile(path):
        return ""
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            if key.strip() == name:
                return value.strip().strip('"').strip("'")
    return ""


def places_api_key():
    return (
        _env_file_value("GOOGLE_PLACES_API_KEY")
        or _env_file_value("GOOGLE_MAPS_API_KEY")
        or os.environ.get("GOOGLE_PLACES_API_KEY")
        or os.environ.get("GOOGLE_MAPS_API_KEY")
        or ""
    ).strip()


def map_google_review(review):
    author = review.get("authorAttribution") or {}
    text_obj = review.get("text") or review.get("originalText") or {}
    text = (text_obj.get("text") or "").strip()
    if not text:
        return None
    name = (author.get("displayName") or "Google user").strip()
    return {
        "name": name,
        "rating": review.get("rating") or 0,
        "text": text,
        "device": "",
        "date": review.get("relativePublishTimeDescription") or "",
        "time": review.get("publishTime") or "",
        "authorUrl": author.get("uri") or "",
        "photoUrl": author.get("photoUri") or "",
    }


def _places_request(api_key, sort_newest):
    query = "languageCode=en-GB&regionCode=GB"
    if sort_newest:
        query += "&reviewsSort=NEWEST"
    url = f"https://places.googleapis.com/v1/places/{PLACE_ID}?{query}"
    request = urllib.request.Request(
        url,
        headers={
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=12) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_google_reviews(api_key):
    try:
        place = _places_request(api_key, sort_newest=True)
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        if error.code == 400 and "reviewsSort" in body:
            place = _places_request(api_key, sort_newest=False)
        else:
            raise RuntimeError(f"Google Places HTTP {error.code}") from error

    reviews = [mapped for item in (place.get("reviews") or []) if (mapped := map_google_review(item))]
    reviews.sort(key=lambda item: item.get("time") or "", reverse=True)
    rating = place.get("rating")
    total = place.get("userRatingCount")
    return {
        "ok": True,
        "source": "google",
        "rating": float(rating) if rating is not None else 0,
        "totalReviews": int(total) if total is not None else len(reviews),
        "googleUrl": REVIEWS_URL,
        "reviews": reviews,
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def reviews_payload():
    now = time.time()
    with _cache_lock:
        cached = _cache["payload"]
        fresh = cached and now - _cache["at"] < REFRESH_SECONDS
    if fresh:
        return cached

    api_key = places_api_key()
    if not api_key:
        return {
            "ok": False,
            "source": "unconfigured",
            "error": "Set GOOGLE_PLACES_API_KEY to load live Google reviews.",
            "googleUrl": REVIEWS_URL,
            "rating": 0,
            "totalReviews": 0,
            "reviews": [],
        }

    try:
        payload = fetch_google_reviews(api_key)
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
