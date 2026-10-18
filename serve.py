#!/usr/bin/env python3
"""Serve the SecureFix public_html site, with SPA fallback for client routes."""

import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public_html")
PORT = int(os.environ.get("PORT", "8765"))


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        rel = self.path.split("?", 1)[0].split("#", 1)[0]
        fs_path = self.translate_path(rel)
        if os.path.isdir(fs_path):
            index = os.path.join(fs_path, "index.html")
            if os.path.isfile(index):
                return super().do_GET()
        if os.path.isfile(fs_path):
            return super().do_GET()
        # Real missing assets should 404. Client routes fall back to the app shell.
        _, ext = os.path.splitext(rel.rstrip("/"))
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
