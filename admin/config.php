<?php
/**
 * Admin configuration.
 *
 * Set ADMIN_PASS_HASH by opening /admin/setup.php in a browser, typing the
 * password you want, and pasting the generated hash below. Delete setup.php
 * afterwards. Never store the plain password in this file.
 */

// Login username.
define('ADMIN_USER', 'admin');

// bcrypt hash of the password. Empty by default: the panel refuses to log in
// until you generate a hash with setup.php and paste it here.
define('ADMIN_PASS_HASH', '');

// Where the public notifications file lives, relative to this directory.
define('DATA_FILE', __DIR__ . '/../data/notifications.json');

// Session idle timeout in seconds (30 minutes).
define('SESSION_TIMEOUT', 1800);

// Lockout after this many failed logins, for this many seconds.
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_SECONDS', 900);
