<?php
/**
 * Live Google reviews for Hostinger. Same public Maps listing as serve.py.
 * No API key. Cached for two minutes.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$placeId = 'ChIJSVMnvdMddkgRfZBMxr6FMyU';
$reviewsUrl = 'https://search.google.com/local/reviews?placeid=' . $placeId;
$cacheFile = sys_get_temp_dir() . '/securefix-reviews.json';
$cacheSeconds = 120;

if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < $cacheSeconds) {
    $cached = file_get_contents($cacheFile);
    if ($cached) {
        echo $cached;
        exit;
    }
}

try {
    $payload = fetch_public_reviews($placeId, $reviewsUrl);
    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    file_put_contents($cacheFile, $json);
    echo $json;
} catch (Throwable $error) {
    if (is_file($cacheFile)) {
        echo file_get_contents($cacheFile);
        exit;
    }
    http_response_code(200);
    echo json_encode([
        'ok' => false,
        'source' => 'error',
        'error' => 'Google reviews are temporarily unavailable.',
        'googleUrl' => $reviewsUrl,
        'rating' => 0,
        'totalReviews' => 0,
        'reviews' => [],
    ]);
}

function http_get(string $url): string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'Accept-Language: en-GB,en;q=0.9',
            'Accept: text/html,application/json;q=0.9,*/*;q=0.8',
        ],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $code >= 400) {
        throw new RuntimeException('Google request failed');
    }
    return $body;
}

function fetch_public_reviews(string $placeId, string $reviewsUrl): array
{
    $page = http_get('https://www.google.com/maps/place/?q=place_id:' . $placeId . '&hl=en-GB');
    if (!preg_match('#href="(/maps/preview/place\?[^"]+)"#', $page, $match)) {
        throw new RuntimeException('Google did not return a place preview');
    }
    $preview = 'https://www.google.com' . html_entity_decode($match[1], ENT_QUOTES);
    return parse_preview(http_get($preview), $reviewsUrl);
}

function dig($node, array $path)
{
    $current = $node;
    foreach ($path as $key) {
        if (!is_array($current) || !array_key_exists($key, $current)) {
            return null;
        }
        $current = $current[$key];
    }
    return $current;
}

function is_list_array($node): bool
{
    return is_array($node) && array_is_list($node);
}

function summary_from($node): ?array
{
    if (!is_list_array($node) || count($node) < 9) {
        return null;
    }
    $rating = $node[7];
    $total = $node[8];
    $nested = $node[3] ?? null;
    if (!is_numeric($rating) || !is_int($total)) {
        return null;
    }
    if (!($rating > 0 && $rating <= 5 && $total >= 0)) {
        return null;
    }
    if (!is_list_array($nested)) {
        return null;
    }
    foreach ($nested as $item) {
        if (is_string($item) && stripos($item, 'review') !== false) {
            return ['rating' => (float) $rating, 'total' => $total];
        }
    }
    return null;
}

function is_review_list($node): bool
{
    if (!is_list_array($node) || !$node) {
        return false;
    }
    $matched = 0;
    $slice = array_slice($node, 0, 8);
    foreach ($slice as $item) {
        $date = dig($item, [0, 1, 6]);
        $rating = dig($item, [0, 2, 0, 0]);
        if (
            is_string($date)
            && (stripos($date, 'ago') !== false || in_array(strtolower($date), ['today', 'yesterday'], true))
            && is_numeric($rating)
            && $rating >= 1
            && $rating <= 5
        ) {
            $matched++;
        }
    }
    return $matched >= 1 && $matched === min(count($node), 8);
}

function review_text($item): string
{
    $text = dig($item, [0, 2, 15, 0, 0]);
    if (is_string($text) && trim($text) !== '') {
        return trim(trim($text), '"');
    }
    $found = [];
    $walk = function ($node) use (&$walk, &$found) {
        if (is_string($node)) {
            $cleaned = trim($node);
            if (strlen($cleaned) > 20 && stripos($cleaned, 'http') === false && str_contains($cleaned, ' ')) {
                $found[] = $cleaned;
            }
        } elseif (is_list_array($node)) {
            foreach ($node as $child) {
                $walk($child);
            }
        }
    };
    $walk(dig($item, [0, 2]));
    if (!$found) {
        return '';
    }
    usort($found, fn($a, $b) => strlen($b) <=> strlen($a));
    return trim(trim($found[0]), '"');
}

function parse_review($item): ?array
{
    $name = dig($item, [0, 1, 4, 5, 0]) ?: 'Google user';
    if (!is_string($name)) {
        $name = 'Google user';
    }
    $photo = dig($item, [0, 1, 4, 5, 1]) ?: '';
    if (is_string($photo) && str_starts_with($photo, '//')) {
        $photo = 'https:' . $photo;
    } elseif (!is_string($photo)) {
        $photo = '';
    }
    $author = dig($item, [0, 1, 4, 2, 0]) ?: '';
    if (!is_string($author)) {
        $author = '';
    }
    $date = dig($item, [0, 1, 6]) ?: '';
    if (!is_string($date)) {
        $date = '';
    }
    $rating = dig($item, [0, 2, 0, 0]) ?: 0;
    $text = review_text($item);
    if ($text === '') {
        return null;
    }
    $stamp = dig($item, [0, 1, 2]);
    $stamp = is_numeric($stamp) ? $stamp : 0;
    return [
        'name' => trim($name) !== '' ? trim($name) : 'Google user',
        'rating' => $rating,
        'text' => $text,
        'device' => '',
        'date' => $date,
        'time' => $stamp,
        'authorUrl' => $author,
        'photoUrl' => $photo,
    ];
}

function parse_preview(string $raw, string $reviewsUrl): array
{
    $text = $raw;
    if (str_starts_with($text, ")]}'")) {
        $parts = explode("\n", $text, 2);
        $text = $parts[1] ?? '';
    }
    $data = json_decode($text, true);
    if (!is_array($data)) {
        throw new RuntimeException('Google listing did not include reviews');
    }
    $summary = null;
    $reviewsNode = null;
    $walk = function ($node) use (&$walk, &$summary, &$reviewsNode) {
        if (!is_list_array($node)) {
            return;
        }
        $found = summary_from($node);
        if ($found && ($summary === null || $found['total'] > $summary['total'])) {
            $summary = $found;
        }
        if (is_review_list($node) && ($reviewsNode === null || count($node) > count($reviewsNode))) {
            $reviewsNode = $node;
        }
        foreach ($node as $child) {
            if (is_list_array($child)) {
                $walk($child);
            }
        }
    };
    $walk($data);
    $reviews = [];
    foreach ($reviewsNode ?? [] as $item) {
        $parsed = parse_review($item);
        if ($parsed) {
            $reviews[] = $parsed;
        }
    }
    usort($reviews, fn($a, $b) => ($b['time'] <=> $a['time']));
    if (!$reviews || !$summary) {
        throw new RuntimeException('Google listing did not include reviews');
    }
    return [
        'ok' => true,
        'source' => 'google',
        'rating' => $summary['rating'],
        'totalReviews' => $summary['total'],
        'googleUrl' => $reviewsUrl,
        'reviews' => $reviews,
        'fetchedAt' => gmdate('Y-m-d\TH:i:s\Z'),
    ];
}
