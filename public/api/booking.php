<?php
/**
 * Same-origin booking endpoint for Hostinger.
 * 1) Always persists the booking under api/bookings/ (Deny from web).
 * 2) Emails repair@securefix.uk via SMTP (mail-config.php) when configured,
 *    otherwise falls back to PHP mail().
 * All website forms (repair, recycling, Business IT, call-out, trade-in, Protect, chat) POST here.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'POST only']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data) || !$data) {
    $data = $_POST;
}
if (!is_array($data) || !$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid booking payload.']);
    exit;
}

// Honeypot — bots that fill this are rejected quietly.
if (!empty($data['_honey']) || !empty($data['website'])) {
    echo json_encode(['success' => true, 'saved' => false, 'mailed' => false]);
    exit;
}

$to = 'repair@securefix.uk';
$subject = isset($data['_subject'])
    ? trim(preg_replace('/[\r\n]+/', ' ', (string) $data['_subject']))
    : 'New SecureFix booking';
if ($subject === '') {
    $subject = 'New SecureFix booking';
}
$subject = function_exists('mb_substr') ? mb_substr($subject, 0, 180) : substr($subject, 0, 180);

$replyTo = '';
foreach (['_replyto', 'customer_email', 'email', 'replyto'] as $key) {
    if (!empty($data[$key]) && filter_var($data[$key], FILTER_VALIDATE_EMAIL)) {
        $replyTo = (string) $data[$key];
        break;
    }
}

$skip = [
    '_subject' => true,
    '_captcha' => true,
    '_honey' => true,
    '_replyto' => true,
    '_template' => true,
    '_next' => true,
    'website' => true,
    'access_key' => true,
];

$lines = [];
foreach ($data as $key => $value) {
    if (isset($skip[$key])) {
        continue;
    }
    if ($value === null || $value === '') {
        continue;
    }
    if (is_array($value)) {
        $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    $label = str_replace('_', ' ', (string) $key);
    $lines[] = $label . ': ' . trim(str_replace(["\r", "\n"], ['', "\n"], (string) $value));
}

if (!$lines) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Booking had no fields to send.']);
    exit;
}

$body = implode("\n", $lines) . "\n";
$reference = !empty($data['booking_reference'])
    ? preg_replace('/[^A-Za-z0-9\-]/', '', (string) $data['booking_reference'])
    : ('SF-' . date('Ymd-His'));

// Persist every booking so a silent mail failure never loses the request.
$bookingsDir = __DIR__ . '/bookings';
$saved = false;
$saveError = null;
if (!is_dir($bookingsDir)) {
    @mkdir($bookingsDir, 0750, true);
}
$deny = $bookingsDir . '/.htaccess';
if (!is_file($deny)) {
    @file_put_contents($deny, "Require all denied\nDeny from all\n");
}
$index = $bookingsDir . '/index.html';
if (!is_file($index)) {
    @file_put_contents($index, '');
}

$record = [
    'receivedAt' => gmdate('c'),
    'reference' => $reference,
    'to' => $to,
    'subject' => $subject,
    'replyTo' => $replyTo,
    'payload' => $data,
    'body' => $body,
];
$file = $bookingsDir . '/' . date('Ymd-His') . '-' . $reference . '.json';
if (@file_put_contents($file, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) !== false) {
    $saved = true;
} else {
    $saveError = 'Could not write booking file on the server.';
}

/**
 * @return array<string,mixed>|null
 */
function securefix_mail_config()
{
    $path = __DIR__ . '/mail-config.php';
    if (!is_file($path)) {
        return null;
    }
    $config = include $path;
    return is_array($config) ? $config : null;
}

/**
 * Minimal SMTP client for Hostinger (ssl://smtp.hostinger.com:465).
 *
 * @param array<string,mixed> $config
 * @return array{ok:bool,error?:string}
 */
function securefix_smtp_send(array $config, $to, $subject, $bodyText, $replyTo = '')
{
    $host = (string) ($config['host'] ?? 'smtp.hostinger.com');
    $port = (int) ($config['port'] ?? 465);
    $encryption = strtolower((string) ($config['encryption'] ?? 'ssl'));
    $username = (string) ($config['username'] ?? '');
    $password = (string) ($config['password'] ?? '');
    $fromEmail = (string) ($config['from_email'] ?? $username);
    $fromName = (string) ($config['from_name'] ?? 'SecureFix Bookings');
    $to = (string) ($config['to'] ?? $to);

    if ($username === '' || $password === '' || $password === 'REPLACE_WITH_MAILBOX_PASSWORD') {
        return ['ok' => false, 'error' => 'SMTP password not configured in mail-config.php'];
    }

    $remote = ($encryption === 'ssl' ? 'ssl://' : '') . $host;
    $errno = 0;
    $errstr = '';
    $fp = @stream_socket_client(
        $remote . ':' . $port,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
    );
    if (!$fp) {
        return ['ok' => false, 'error' => 'SMTP connect failed: ' . $errstr];
    }
    stream_set_timeout($fp, 20);

    $read = function () use ($fp) {
        $data = '';
        while (!feof($fp)) {
            $line = fgets($fp, 515);
            if ($line === false) {
                break;
            }
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        return $data;
    };
    $write = function ($cmd) use ($fp) {
        fwrite($fp, $cmd . "\r\n");
    };
    $expect = function ($prefix, $label) use ($read) {
        $resp = $read();
        if (strpos($resp, $prefix) !== 0) {
            return 'SMTP ' . $label . ' failed: ' . trim($resp);
        }
        return null;
    };

    if ($err = $expect('220', 'banner')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }

    $write('EHLO securefix.uk');
    if ($err = $expect('250', 'EHLO')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }

    if ($encryption === 'tls') {
        $write('STARTTLS');
        if ($err = $expect('220', 'STARTTLS')) {
            fclose($fp);
            return ['ok' => false, 'error' => $err];
        }
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($fp);
            return ['ok' => false, 'error' => 'STARTTLS crypto failed'];
        }
        $write('EHLO securefix.uk');
        if ($err = $expect('250', 'EHLO2')) {
            fclose($fp);
            return ['ok' => false, 'error' => $err];
        }
    }

    $write('AUTH LOGIN');
    if ($err = $expect('334', 'AUTH')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }
    $write(base64_encode($username));
    if ($err = $expect('334', 'USER')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }
    $write(base64_encode($password));
    if ($err = $expect('235', 'PASS')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }

    $write('MAIL FROM:<' . $fromEmail . '>');
    if ($err = $expect('250', 'MAIL FROM')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }
    $write('RCPT TO:<' . $to . '>');
    if ($err = $expect('250', 'RCPT TO')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }
    $write('DATA');
    if ($err = $expect('354', 'DATA')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $msgId = bin2hex(random_bytes(8));
    $headers = [
        'Date: ' . date('r'),
        'From: ' . sprintf('%s <%s>', $fromName, $fromEmail),
        'To: <' . $to . '>',
        'Subject: ' . $encodedSubject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'Message-ID: <' . $msgId . '@securefix.uk>',
        'X-Mailer: SecureFix-Hostinger-SMTP',
    ];
    if ($replyTo !== '') {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    $message = implode("\r\n", $headers) . "\r\n\r\n" . str_replace(["\r\n", "\r"], "\n", $bodyText);
    $message = str_replace("\n", "\r\n", $message);
    $message = preg_replace('/^\./m', '..', $message);
    $write($message);
    $write('.');
    if ($err = $expect('250', 'END')) {
        fclose($fp);
        return ['ok' => false, 'error' => $err];
    }
    $write('QUIT');
    fclose($fp);
    return ['ok' => true];
}

$mailed = false;
$mailError = null;
$mailChannel = null;

$config = securefix_mail_config();
if (is_array($config)) {
    $smtp = securefix_smtp_send($config, $to, $subject, $body, $replyTo);
    if (!empty($smtp['ok'])) {
        $mailed = true;
        $mailChannel = 'smtp';
    } else {
        $mailError = $smtp['error'] ?? 'SMTP send failed';
    }
}

if (!$mailed) {
    // Prefer repair@ as From so Hostinger accepts domain mail.
    $fromCandidates = ['repair@securefix.uk', 'info@securefix.uk', 'noreply@securefix.uk'];
    foreach ($fromCandidates as $from) {
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: SecureFix Bookings <' . $from . '>',
            'X-Mailer: SecureFix-Hostinger',
        ];
        if ($replyTo !== '') {
            $headers[] = 'Reply-To: ' . $replyTo;
        }
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $ok = @mail($to, $encodedSubject, $body, implode("\r\n", $headers), '-f' . $from);
        if ($ok) {
            $mailed = true;
            $mailChannel = 'mail';
            break;
        }
        $mailError = 'mail() returned false for ' . $from;
    }
}

if ($saved || $mailed) {
    echo json_encode([
        'success' => true,
        'saved' => $saved,
        'mailed' => $mailed,
        'mail_channel' => $mailChannel,
        'reference' => $reference,
        'mail_error' => $mailed ? null : $mailError,
    ]);
    exit;
}

http_response_code(502);
echo json_encode([
    'success' => false,
    'message' => $saveError ?: ($mailError ?: 'Could not save or email the booking.'),
    'saved' => false,
    'mailed' => false,
]);
