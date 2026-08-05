<?php
/**
 * One-time password hash generator.
 *
 * Open this in a browser, type the password you want, copy the generated hash
 * into config.php as ADMIN_PASS_HASH, then DELETE THIS FILE.
 */

$hash = '';
$typed = '';
$tooShort = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    $typed = (string) $_POST['password'];
    if (strlen($typed) < 8) {
        $tooShort = true;
    } else {
        $hash = password_hash($typed, PASSWORD_BCRYPT, ['cost' => 12]);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Generate password hash</title>
<link rel="stylesheet" href="admin.css">
</head>
<body class="login-body">
<div class="login-card" style="max-width:620px;">
  <div class="login-head">
    <h1>Password setup</h1>
    <p>Generate the hash for <code>config.php</code></p>
  </div>

  <div class="alert alert-info">
    Delete this file (<code>admin/setup.php</code>) once you have pasted the hash
    into <code>config.php</code>. Anyone who can reach this page can generate hashes.
  </div>

  <?php if ($tooShort): ?>
    <div class="alert alert-error">Use at least 8 characters.</div>
  <?php endif; ?>

  <form method="post" autocomplete="off">
    <div class="field">
      <label for="password">Choose a password</label>
      <input type="text" id="password" name="password" required minlength="8"
             value="<?php echo htmlspecialchars($typed, ENT_QUOTES, 'UTF-8'); ?>"
             placeholder="At least 8 characters">
    </div>
    <button type="submit" class="btn btn-primary btn-full">Generate hash</button>
  </form>

  <?php if ($hash !== ''): ?>
    <div class="setup-result">
      <p><strong>1.</strong> Copy this line into <code>admin/config.php</code>, replacing the existing <code>ADMIN_PASS_HASH</code> line:</p>
      <pre class="hash-out">define('ADMIN_PASS_HASH', '<?php echo htmlspecialchars($hash, ENT_QUOTES, 'UTF-8'); ?>');</pre>
      <p><strong>2.</strong> Verify: <?php echo password_verify($typed, $hash) ? '<span class="ok-text">hash checks out ✓</span>' : '<span class="err-text">verification failed</span>'; ?></p>
      <p><strong>3.</strong> Delete <code>admin/setup.php</code>, then sign in at <a href="index.php">admin/index.php</a>.</p>
    </div>
  <?php endif; ?>
</div>
</body>
</html>
