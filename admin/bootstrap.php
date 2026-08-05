<?php
/**
 * Shared bootstrap: session handling, CSRF, auth guard and the JSON store.
 */

require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_name('MTGADMIN');
    session_start();
}

/* ------------------------- CSRF ------------------------- */

function csrf_token()
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_check()
{
    $sent = isset($_POST['csrf']) ? $_POST['csrf'] : '';
    if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $sent)) {
        http_response_code(400);
        exit('Invalid request token. Go back, reload the page and try again.');
    }
}

/* ------------------------- Auth ------------------------- */

function is_logged_in()
{
    if (empty($_SESSION['admin'])) {
        return false;
    }
    if (isset($_SESSION['last_seen']) && (time() - $_SESSION['last_seen']) > SESSION_TIMEOUT) {
        admin_logout();
        return false;
    }
    $_SESSION['last_seen'] = time();
    return true;
}

function require_login()
{
    if (!is_logged_in()) {
        header('Location: index.php?expired=1');
        exit;
    }
}

function admin_logout()
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

/* --------------------- Notification store --------------------- */

function default_data()
{
    return ['updated' => date('c'), 'notifications' => []];
}

function load_notifications()
{
    if (!file_exists(DATA_FILE)) {
        return default_data();
    }
    $raw = file_get_contents(DATA_FILE);
    if ($raw === false || trim($raw) === '') {
        return default_data();
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['notifications']) || !is_array($data['notifications'])) {
        return default_data();
    }
    return $data;
}

/**
 * Write atomically so a crash mid-write can't leave the public site with a
 * truncated JSON file. Keeps one .bak of the previous version.
 */
function save_notifications(array $data)
{
    $data['updated'] = date('c');
    $dir = dirname(DATA_FILE);
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        return 'Could not create the data directory.';
    }
    if (!is_writable($dir)) {
        return 'The data directory is not writable. Set its permissions to 755 in cPanel File Manager.';
    }

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return 'Could not encode the data.';
    }

    if (file_exists(DATA_FILE)) {
        @copy(DATA_FILE, DATA_FILE . '.bak');
    }

    $tmp = DATA_FILE . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        return 'Could not write the data file.';
    }
    if (!rename($tmp, DATA_FILE)) {
        @unlink($tmp);
        return 'Could not replace the data file.';
    }
    @chmod(DATA_FILE, 0644);
    return true;
}

function next_id(array $items)
{
    $max = 0;
    foreach ($items as $n) {
        if (isset($n['id']) && (int) $n['id'] > $max) {
            $max = (int) $n['id'];
        }
    }
    return $max + 1;
}

function find_index(array $items, $id)
{
    foreach ($items as $i => $n) {
        if (isset($n['id']) && (int) $n['id'] === (int) $id) {
            return $i;
        }
    }
    return -1;
}

/* --------------------- Input helpers --------------------- */

const CATEGORIES = [
    'admission' => 'Admission',
    'event'     => 'Event',
    'exam'      => 'Exam',
    'holiday'   => 'Holiday',
    'general'   => 'Notice',
];

function post_str($key, $max = 500)
{
    $v = isset($_POST[$key]) ? (string) $_POST[$key] : '';
    $v = str_replace(["\r\n", "\r"], "\n", trim($v));
    if (function_exists('mb_substr')) {
        return mb_substr($v, 0, $max);
    }
    return substr($v, 0, $max);
}

function e($s)
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

/**
 * Links must stay relative to the site so the public JS will render them;
 * it rejects absolute and scheme-bearing URLs.
 */
function clean_link($link)
{
    $link = trim($link);
    if ($link === '') {
        return '';
    }
    if (preg_match('#^([a-z][a-z0-9+.\-]*:|//|/)#i', $link)) {
        return '';
    }
    return $link;
}

function flash_set($type, $msg)
{
    $_SESSION['flash'] = ['type' => $type, 'msg' => $msg];
}

function flash_get()
{
    if (empty($_SESSION['flash'])) {
        return null;
    }
    $f = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $f;
}
