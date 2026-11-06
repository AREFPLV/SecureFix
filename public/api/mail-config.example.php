<?php
/**
 * Copy this file to mail-config.php on Hostinger and fill in the repair@ mailbox password.
 * Create the mailbox in hPanel → Emails → Email Accounts (repair@securefix.uk).
 * Do NOT commit mail-config.php (it is gitignored).
 */
return [
    'host' => 'smtp.hostinger.com',
    'port' => 465,
    'encryption' => 'ssl', // ssl (465) or tls (587)
    'username' => 'repair@securefix.uk',
    'password' => 'REPLACE_WITH_MAILBOX_PASSWORD',
    'from_email' => 'repair@securefix.uk',
    'from_name' => 'SecureFix Bookings',
    'to' => 'repair@securefix.uk',
];
