SecureFix Hostinger upload package
=================================

Full zip:
  https://github.com/AREFPLV/SecureFix/raw/cursor/booking-dual-delivery-e418/host-download/securefix_public_html_20261104_host.zip

Parts:
  https://github.com/AREFPLV/SecureFix/raw/cursor/booking-dual-delivery-e418/host-download/securefix_public_html_20261104_host.zip.00.part
  https://github.com/AREFPLV/SecureFix/raw/cursor/booking-dual-delivery-e418/host-download/securefix_public_html_20261104_host.zip.01.part

Join:
  cat securefix_public_html_20261104_host.zip.*.part > securefix_public_html_20261104_host.zip

Upload/extract into public_html. Keep .htaccess and api/booking.php.

Booking fix in this build:
- Sends via Web3Forms AND Hostinger PHP together
- PHP also saves each booking under api/bookings/ (blocked from public web)
- FormSubmit is only a last-resort fallback

Built: 2026-11-04
