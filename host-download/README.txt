SecureFix Hostinger upload package
=================================

Built: 2026-11-06 (Europe/London) — booking delivery fix

Full zip:
  https://github.com/AREFPLV/SecureFix/raw/cursor/forms-repair-inbox-e418/host-download/securefix_public_html_20261106_host.zip

Parts:
  https://github.com/AREFPLV/SecureFix/raw/cursor/forms-repair-inbox-e418/host-download/securefix_public_html_20261106_host.zip.00.part
  https://github.com/AREFPLV/SecureFix/raw/cursor/forms-repair-inbox-e418/host-download/securefix_public_html_20261106_host.zip.01.part

Join parts:
  cat securefix_public_html_20261106_host.zip.*.part > securefix_public_html_20261106_host.zip

Upload / extract into Hostinger public_html.
Keep .htaccess and api/booking.php from this package.

Fixes:
- Booking no longer shows a false "submitted" screen when email delivery fails
- Host PHP tried first (/api/booking then /api/booking.php), then Web3Forms, then FormSubmit
- All forms deliver to repair@securefix.uk
