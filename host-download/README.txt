SecureFix Hostinger upload package
=================================

Built: 2026-11-06 — booking email delivery fix

Full zip:
  https://github.com/AREFPLV/SecureFix/raw/cursor/forms-repair-inbox-e418/host-download/securefix_public_html_20261106_host.zip

Parts:
  …zip.00.part and …zip.01.part in this folder
  cat securefix_public_html_20261106_host.zip.*.part > securefix_public_html_20261106_host.zip

Upload / extract into Hostinger public_html (keep .htaccess + api/).

IMPORTANT — emails to repair@securefix.uk
-----------------------------------------
1. In hPanel → Emails, create mailbox repair@securefix.uk (if missing).
2. On the server, copy:
     api/mail-config.example.php  →  api/mail-config.php
3. Edit api/mail-config.php and set password to the mailbox password.
4. Bookings then send via Hostinger SMTP (smtp.hostinger.com) to repair@.

Bookings are also saved under api/bookings/ even if mail is delayed.
