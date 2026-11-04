SecureFix Hostinger upload package
=================================

Download the full zip:

  https://github.com/AREFPLV/SecureFix/raw/cursor/fix-live-booking-e418/host-download/securefix_public_html_20261104_host.zip

Or two parts:

  https://github.com/AREFPLV/SecureFix/raw/cursor/fix-live-booking-e418/host-download/securefix_public_html_20261104_host.zip.00.part
  https://github.com/AREFPLV/SecureFix/raw/cursor/fix-live-booking-e418/host-download/securefix_public_html_20261104_host.zip.01.part

Join parts:
  cat securefix_public_html_20261104_host.zip.*.part > securefix_public_html_20261104_host.zip

Upload to Hostinger public_html, extract so index.html, .htaccess and api/booking.php
are at the site root. Keep .htaccess.

This build fixes live booking: forms post to /api/booking.php → repair@securefix.uk
(FormSubmit was blocked by Cloudflare on the live site).

Built: 2026-11-04
