<?php
/**
 * Same-origin booking endpoint for Hostinger.
 * 1) Always persists the booking under api/bookings/ (Deny from web).
 * 2) Attempts PHP mail() to repair@securefix.uk.
 * Returns success if the booking was saved and/or mailed.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
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

// Persist every booking so a silent mail() failure never loses the request.
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

$fromCandidates = ['noreply@securefix.uk', 'info@securefix.uk', 'repair@securefix.uk'];
$mailed = false;
$mailError = null;

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
        break;
    }
    $mailError = 'mail() returned false for ' . $from;
}

if ($saved || $mailed) {
    echo json_encode([
        'success' => true,
        'saved' => $saved,
        'mailed' => $mailed,
        'reference' => $reference,
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
