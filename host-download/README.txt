SecureFix host build — 4 Nov 2026

Download both parts, then join them before unzipping:

  cat securefix_public_html_20261104_host.zip.part0 \
      securefix_public_html_20261104_host.zip.part1 \
      > securefix_public_html_20261104_host.zip

  unzip securefix_public_html_20261104_host.zip -d /path/to/webroot

Unzip so index.html is at the site root (public_html / www / htdocs).
