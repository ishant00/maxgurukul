<?php
require_once __DIR__ . '/bootstrap.php';

if (is_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$notice = '';

if (isset($_GET['expired'])) {
    $notice = 'Your session expired. Please sign in again.';
}
if (isset($_GET['loggedout'])) {
    $notice = 'You have been signed out.';
}

// Track failed attempts per session to slow down guessing.
if (!isset($_SESSION['attempts'])) {
    $_SESSION['attempts'] = 0;
}
if (!isset($_SESSION['lock_until'])) {
    $_SESSION['lock_until'] = 0;
}

$lockedFor = max(0, $_SESSION['lock_until'] - time());

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();

    if ($lockedFor > 0) {
        $error = 'Too many failed attempts. Try again in ' . ceil($lockedFor / 60) . ' minute(s).';
    } elseif (ADMIN_PASS_HASH === '') {
        $error = 'No password is configured yet. Open setup.php to generate a password hash, paste it into config.php, then delete setup.php.';
    } else {
        $user = post_str('username', 60);
        $pass = isset($_POST['password']) ? (string) $_POST['password'] : '';

        $userOk = hash_equals(ADMIN_USER, $user);
        $passOk = password_verify($pass, ADMIN_PASS_HASH);

        if ($userOk && $passOk) {
            session_regenerate_id(true);
            $_SESSION['admin'] = ADMIN_USER;
            $_SESSION['last_seen'] = time();
            $_SESSION['attempts'] = 0;
            $_SESSION['lock_until'] = 0;
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            header('Location: dashboard.php');
            exit;
        }

        $_SESSION['attempts']++;
        if ($_SESSION['attempts'] >= MAX_LOGIN_ATTEMPTS) {
            $_SESSION['lock_until'] = time() + LOCKOUT_SECONDS;
            $_SESSION['attempts'] = 0;
            $error = 'Too many failed attempts. Locked for ' . (LOCKOUT_SECONDS / 60) . ' minutes.';
        } else {
            $remaining = MAX_LOGIN_ATTEMPTS - $_SESSION['attempts'];
            $error = 'Incorrect username or password. ' . $remaining . ' attempt(s) left.';
        }
        // Constant-ish delay to blunt rapid guessing.
        usleep(400000);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Admin Sign In | Max The Gurukul</title>
<link rel="icon" href="../images/logo.png">
<link rel="stylesheet" href="admin.css">
</head>
<body class="login-body">

<div class="login-card">
  <div class="login-head">
    <img src="../images/logo.png" alt="Max The Gurukul">
    <h1>Admin Panel</h1>
    <p>Notification management</p>
  </div>

  <?php if ($error): ?>
    <div class="alert alert-error"><?php echo e($error); ?></div>
  <?php elseif ($notice): ?>
    <div class="alert alert-info"><?php echo e($notice); ?></div>
  <?php endif; ?>

  <form method="post" autocomplete="off">
    <input type="hidden" name="csrf" value="<?php echo e(csrf_token()); ?>">
    <div class="field">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required autofocus autocapitalize="none" autocomplete="username">
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autocomplete="current-password">
    </div>
    <button type="submit" class="btn btn-primary btn-full">Sign In</button>
  </form>

  <p class="login-foot"><a href="../index.html">&larr; Back to website</a></p>
</div>

</body>
</html>
