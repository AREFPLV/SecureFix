<?php
/**
 * Same-origin booking inbox for Hostinger.
 * Browsers post here so we are not blocked by FormSubmit Cloudflare challenges.
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
    echo json_encode(['success' => true]);
    exit;
}

$to = 'repair@securefix.uk';
$subject = isset($data['_subject'])
    ? trim(preg_replace('/[\r\n]+/', ' ', (string) $data['_subject']))
    : 'New SecureFix booking';
if ($subject === '') {
    $subject = 'New SecureFix booking';
}
$subject = mb_substr($subject, 0, 180);

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
$from = 'noreply@securefix.uk';

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: SecureFix Bookings <' . $from . '>',
    'X-Mailer: SecureFix-Hostinger',
];
if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . $replyTo;
}

$ok = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$ok) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Host mail() could not send the booking. Check Hostinger email for noreply@securefix.uk / repair@securefix.uk.',
    ]);
    exit;
}

echo json_encode(['success' => true]);
