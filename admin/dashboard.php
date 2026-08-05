<?php
require_once __DIR__ . '/bootstrap.php';
require_login();

$data = load_notifications();
$items = $data['notifications'];

/* ------------------------- Actions ------------------------- */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $action = post_str('action', 20);

    if ($action === 'save') {
        $id       = (int) post_str('id', 10);
        $title    = post_str('title', 160);
        $body     = post_str('body', 1000);
        $category = post_str('category', 20);
        $link     = clean_link(post_str('link', 200));
        $linkText = post_str('linkText', 60);
        $date     = post_str('date', 10);
        $active   = !empty($_POST['active']);
        $pinned   = !empty($_POST['pinned']);
        $showInBar = !empty($_POST['showInBar']);

        $errors = [];
        if ($title === '') {
            $errors[] = 'Title is required.';
        }
        if (!isset(CATEGORIES[$category])) {
            $category = 'general';
        }
        if ($date === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            $date = date('Y-m-d');
        }
        if ($link !== '' && $linkText === '') {
            $linkText = 'Read more';
        }
        if ($link === '') {
            $linkText = '';
        }

        if ($errors) {
            flash_set('error', implode(' ', $errors));
        } else {
            $record = [
                'category'  => $category,
                'title'     => $title,
                'body'      => $body,
                'link'      => $link,
                'linkText'  => $linkText,
                'date'      => $date,
                'active'    => $active,
                'pinned'    => $pinned,
                'showInBar' => $showInBar,
            ];

            if ($id > 0 && ($idx = find_index($items, $id)) >= 0) {
                $record['id'] = $id;
                $items[$idx] = $record;
                $msg = 'Notification updated.';
            } else {
                $record['id'] = next_id($items);
                array_unshift($items, $record);
                $msg = 'Notification added.';
            }

            $data['notifications'] = $items;
            $result = save_notifications($data);
            flash_set($result === true ? 'ok' : 'error', $result === true ? $msg : $result);
        }
        header('Location: dashboard.php');
        exit;
    }

    if ($action === 'delete') {
        $id = (int) post_str('id', 10);
        $idx = find_index($items, $id);
        if ($idx >= 0) {
            array_splice($items, $idx, 1);
            $data['notifications'] = $items;
            $result = save_notifications($data);
            flash_set($result === true ? 'ok' : 'error', $result === true ? 'Notification deleted.' : $result);
        }
        header('Location: dashboard.php');
        exit;
    }

    if ($action === 'toggle') {
        $id = (int) post_str('id', 10);
        $field = post_str('field', 20);
        if (in_array($field, ['active', 'pinned', 'showInBar'], true)) {
            $idx = find_index($items, $id);
            if ($idx >= 0) {
                $items[$idx][$field] = empty($items[$idx][$field]);
                $data['notifications'] = $items;
                $result = save_notifications($data);
                flash_set($result === true ? 'ok' : 'error', $result === true ? 'Updated.' : $result);
            }
        }
        header('Location: dashboard.php');
        exit;
    }

    if ($action === 'move') {
        $id = (int) post_str('id', 10);
        $dir = post_str('dir', 4) === 'up' ? -1 : 1;
        $idx = find_index($items, $id);
        $swap = $idx + $dir;
        if ($idx >= 0 && $swap >= 0 && $swap < count($items)) {
            $tmp = $items[$idx];
            $items[$idx] = $items[$swap];
            $items[$swap] = $tmp;
            $data['notifications'] = $items;
            $result = save_notifications($data);
            if ($result !== true) {
                flash_set('error', $result);
            }
        }
        header('Location: dashboard.php');
        exit;
    }
}

/* ------------------------- Render ------------------------- */

$editing = null;
if (isset($_GET['edit'])) {
    $idx = find_index($items, (int) $_GET['edit']);
    if ($idx >= 0) {
        $editing = $items[$idx];
    }
}

$flash = flash_get();
$dataDir = dirname(DATA_FILE);
$writable = is_dir($dataDir) ? is_writable($dataDir) : is_writable(dirname($dataDir));
$activeCount = 0;
foreach ($items as $n) {
    if (!empty($n['active'])) {
        $activeCount++;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Notifications | Max The Gurukul Admin</title>
<link rel="icon" href="../images/logo.png">
<link rel="stylesheet" href="admin.css">
</head>
<body>

<header class="admin-bar">
  <div class="admin-bar-inner">
    <div class="admin-brand">
      <img src="../images/logo.png" alt="">
      <span>Max The Gurukul <em>Admin</em></span>
    </div>
    <div class="admin-bar-right">
      <a href="../index.html" target="_blank" rel="noopener" class="ghost-link">View site &nearr;</a>
      <a href="logout.php" class="btn btn-ghost btn-sm">Sign out</a>
    </div>
  </div>
</header>

<main class="admin-wrap">

  <?php if ($flash): ?>
    <div class="alert alert-<?php echo $flash['type'] === 'ok' ? 'ok' : ($flash['type'] === 'info' ? 'info' : 'error'); ?>">
      <?php echo e($flash['msg']); ?>
    </div>
  <?php endif; ?>

  <?php if (!$writable): ?>
    <div class="alert alert-error">
      The <code>data/</code> folder is not writable, so changes cannot be saved.
      In cPanel File Manager set its permissions to <strong>755</strong>
      (and <code>notifications.json</code> to <strong>644</strong>).
    </div>
  <?php endif; ?>

  <div class="page-head">
    <div>
      <h1>Notifications</h1>
      <p><?php echo count($items); ?> total &middot; <?php echo $activeCount; ?> live on the website</p>
    </div>
    <a href="#editor" class="btn btn-primary">+ New notification</a>
  </div>

  <section class="card" id="editor">
    <h2><?php echo $editing ? 'Edit notification' : 'Add a notification'; ?></h2>
    <form method="post" class="notif-form">
      <input type="hidden" name="csrf" value="<?php echo e(csrf_token()); ?>">
      <input type="hidden" name="action" value="save">
      <input type="hidden" name="id" value="<?php echo $editing ? (int) $editing['id'] : 0; ?>">

      <div class="grid-2">
        <div class="field span-2">
          <label for="title">Title <span class="req">*</span></label>
          <input type="text" id="title" name="title" maxlength="160" required
                 value="<?php echo $editing ? e($editing['title']) : ''; ?>"
                 placeholder="e.g. Admission Form 2026-27 is now open">
        </div>

        <div class="field span-2">
          <label for="body">Details</label>
          <textarea id="body" name="body" rows="3" maxlength="1000"
                    placeholder="One or two sentences shown in the notification panel."><?php echo $editing ? e($editing['body']) : ''; ?></textarea>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <select id="category" name="category">
            <?php foreach (CATEGORIES as $key => $label): ?>
              <option value="<?php echo e($key); ?>"
                <?php echo ($editing && $editing['category'] === $key) ? 'selected' : ''; ?>>
                <?php echo e($label); ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="field">
          <label for="date">Date</label>
          <input type="date" id="date" name="date"
                 value="<?php echo e($editing && !empty($editing['date']) ? $editing['date'] : date('Y-m-d')); ?>">
        </div>

        <div class="field">
          <label for="link">Link <span class="hint">(page on this site)</span></label>
          <input type="text" id="link" name="link" maxlength="200"
                 value="<?php echo $editing ? e($editing['link']) : ''; ?>"
                 placeholder="admissions.html#apply">
        </div>

        <div class="field">
          <label for="linkText">Link text</label>
          <input type="text" id="linkText" name="linkText" maxlength="60"
                 value="<?php echo $editing ? e($editing['linkText']) : ''; ?>"
                 placeholder="Apply now">
        </div>
      </div>

      <div class="toggle-row">
        <label class="check">
          <input type="checkbox" name="active" value="1"
            <?php echo (!$editing || !empty($editing['active'])) ? 'checked' : ''; ?>>
          <span>Live on website</span>
        </label>
        <label class="check">
          <input type="checkbox" name="pinned" value="1"
            <?php echo ($editing && !empty($editing['pinned'])) ? 'checked' : ''; ?>>
          <span>Pin to top</span>
        </label>
        <label class="check">
          <input type="checkbox" name="showInBar" value="1"
            <?php echo ($editing && !empty($editing['showInBar'])) ? 'checked' : ''; ?>>
          <span>Show in the orange bar</span>
        </label>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          <?php echo $editing ? 'Save changes' : 'Add notification'; ?>
        </button>
        <?php if ($editing): ?>
          <a href="dashboard.php" class="btn btn-ghost">Cancel</a>
        <?php endif; ?>
      </div>
    </form>
  </section>

  <section class="card">
    <h2>All notifications</h2>

    <?php if (!count($items)): ?>
      <p class="empty">Nothing here yet. Add your first notification above.</p>
    <?php else: ?>
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Notification</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          <?php foreach ($items as $i => $n): ?>
            <tr class="<?php echo empty($n['active']) ? 'is-off' : ''; ?>">
              <td class="order-cell">
                <form method="post" class="inline">
                  <input type="hidden" name="csrf" value="<?php echo e(csrf_token()); ?>">
                  <input type="hidden" name="action" value="move">
                  <input type="hidden" name="id" value="<?php echo (int) $n['id']; ?>">
                  <button name="dir" value="up" class="icon-btn" title="Move up"
                    <?php echo $i === 0 ? 'disabled' : ''; ?>>&uarr;</button>
                  <button name="dir" value="down" class="icon-btn" title="Move down"
                    <?php echo $i === count($items) - 1 ? 'disabled' : ''; ?>>&darr;</button>
                </form>
              </td>
              <td>
                <strong class="row-title"><?php echo e($n['title']); ?></strong>
                <?php if (!empty($n['body'])): ?>
                  <p class="row-body"><?php echo e($n['body']); ?></p>
                <?php endif; ?>
                <?php if (!empty($n['link'])): ?>
                  <span class="row-link"><?php echo e($n['link']); ?></span>
                <?php endif; ?>
              </td>
              <td>
                <span class="tag tag-<?php echo e($n['category']); ?>">
                  <?php echo e(isset(CATEGORIES[$n['category']]) ? CATEGORIES[$n['category']] : 'Notice'); ?>
                </span>
              </td>
              <td class="nowrap"><?php echo e(!empty($n['date']) ? $n['date'] : '—'); ?></td>
              <td>
                <div class="status-toggles">
                  <?php
                  $flags = [
                      'active'    => ['Live', 'Draft'],
                      'pinned'    => ['Pinned', 'Pin'],
                      'showInBar' => ['In bar', 'Bar'],
                  ];
                  foreach ($flags as $field => $labels):
                      $on = !empty($n[$field]);
                  ?>
                    <form method="post" class="inline">
                      <input type="hidden" name="csrf" value="<?php echo e(csrf_token()); ?>">
                      <input type="hidden" name="action" value="toggle">
                      <input type="hidden" name="id" value="<?php echo (int) $n['id']; ?>">
                      <input type="hidden" name="field" value="<?php echo e($field); ?>">
                      <button class="pill-btn <?php echo $on ? 'on' : 'off'; ?>">
                        <?php echo e($on ? $labels[0] : $labels[1]); ?>
                      </button>
                    </form>
                  <?php endforeach; ?>
                </div>
              </td>
              <td class="nowrap">
                <a href="dashboard.php?edit=<?php echo (int) $n['id']; ?>#editor" class="btn btn-ghost btn-sm">Edit</a>
                <form method="post" class="inline"
                      onsubmit="return confirm('Delete this notification permanently?');">
                  <input type="hidden" name="csrf" value="<?php echo e(csrf_token()); ?>">
                  <input type="hidden" name="action" value="delete">
                  <input type="hidden" name="id" value="<?php echo (int) $n['id']; ?>">
                  <button class="btn btn-danger btn-sm">Delete</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </section>

  <p class="footnote">
    Changes are written to <code>data/notifications.json</code> and appear on the
    website immediately. Last updated:
    <strong><?php echo e(!empty($data['updated']) ? $data['updated'] : '—'); ?></strong>
  </p>

</main>

</body>
</html>
