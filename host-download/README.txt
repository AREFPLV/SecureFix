SecureFix Hostinger upload package
=================================

Download these part files from this folder, then join them on your computer:

  securefix_public_html_20261104_host.zip.00.part
  securefix_public_html_20261104_host.zip.01.part

Join (Mac / Linux):
  cat securefix_public_html_20261104_host.zip.*.part > securefix_public_html_20261104_host.zip

Join (Windows PowerShell):
  Get-Content securefix_public_html_20261104_host.zip.*.part -Enc Byte -Read 0 | Set-Content securefix_public_html_20261104_host.zip -Enc Byte

Or download the full zip from the agent artifacts if available:
  securefix_public_html_20261104_host.zip

Upload to Hostinger
-------------------
1. Open Hostinger File Manager → public_html
2. Upload securefix_public_html_20261104_host.zip
3. Extract it into public_html so index.html and .htaccess are at the root
4. Keep .htaccess (do not delete it)
5. Delete the zip from the server after extract

Includes: iPhone fault tiles, Samsung series picker, +£30 mobile screens, homepage fix.
Built: 2026-11-04
