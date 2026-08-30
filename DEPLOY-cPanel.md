# Deploying to cPanel

The public site is plain HTML/CSS/JS and works on any host. Only the admin panel
needs PHP, which cPanel already has. No database is required — notifications live
in `data/notifications.json`.

## 1. Upload

Upload everything to `public_html/` (or the docroot of the addon domain), keeping
the folder structure:

```
public_html/
  index.html, about.html, contact.html, ...   (14 pages)
  css/style.css
  css/chatbot.css
  js/script.js
  js/chatbot.js
  js/notifications.js
  images/
    optimized/            <-- required: every photo on the site is served from here
    favicon.png
    logo.png
    pw-logo.svg
    school-building-1.jpg  school-building-2.jpg  school-building-3.jpg
    Faculty images/       (Chairman.jpg, principalnew.jpeg, mentor.jpg)
  data/
    notifications.json
    .htaccess
  admin/
    index.php  dashboard.php  logout.php  setup.php
    bootstrap.php  config.php  admin.css  .htaccess
```

### `images/optimized/` is not optional

The pages reference **only** `images/optimized/` for photography — 226 responsive
derivatives, 34 MB. If that folder is missing, every photograph on the site is a
broken image. It is the single most important thing to check after upload.

The camera originals in `images/Classroom/`, `images/Coridor/`, `images/Library/`,
`images/Science Lab/`, `images/Sports/` and `images/hostel/` are **not referenced
by any page** and do not need to go up at all — that is 168 MB of 24 MP phone
originals versus 34 MB of derivatives. Keep them locally as the masters; they are
what `tools/optimize-images.py` rebuilds from. See `tools/README.md`.

The loose files listed above *are* referenced and do need uploading:
`school-building-*.jpg` are `.page-hero` background textures in `css/style.css`,
the three faculty portraits appear on `about.html`, and `pw-logo.svg` on
`results.html`.

### Filenames are case-sensitive on the server

cPanel is Linux; your machine is not. `logo.png` and `logo.PNG` are the same file
on Windows and two different files on the host, so a wrong-case reference works
locally and 404s in production. Do not rename anything on upload — including
`images/Faculty images/` with its space, and `Reception.JPG` with its uppercase
extension.

`py tools/check-html.py` checks every asset path case-exactly for exactly this
reason. Run it before you upload; it should report `ok` for all 13 content pages.

In cPanel's File Manager, turn on **Settings → Show Hidden Files (dotfiles)** or
the three `.htaccess` files will not appear after upload. They matter — the two
inside `admin/` and `data/` are what stop `config.php` from being readable and
stop PHP from running inside `data/`.

The third, at the root, is the only optional one: it gzips HTML/CSS/JS and sets a
one-year cache on `images/optimized/`, which is what makes a repeat visit to the
Gallery essentially free. Every directive is wrapped in `<IfModule>`, so on a host
missing `mod_expires` or `mod_deflate` the block is skipped rather than throwing a
500. Deleting it costs performance, not correctness. It also registers the
`image/webp` MIME type — some older cPanel `mime.types` files predate WebP, and
without it Apache serves the derivatives as `application/octet-stream` and the
browser downloads them instead of painting them. **If photos download instead of
displaying after upload, that MIME type is the first thing to check.**

## 2. Permissions

| Path | Permission |
|---|---|
| `data/` | `755` |
| `data/notifications.json` | `644` |
| `admin/*.php` | `644` |

The admin panel writes to `data/notifications.json`. If the dashboard shows a
"directory is not writable" warning, set `data/` to `775` — on most cPanel
accounts PHP runs as your own user and `755` is enough.

## 3. Set the admin password

`ADMIN_PASS_HASH` in `admin/config.php` is **deliberately empty**, so login is
refused until you set it. This is a one-time step:

1. Visit `https://yourdomain.com/admin/setup.php`
2. Type the password you want (8+ characters) and press **Generate hash**
3. Copy the whole `define('ADMIN_PASS_HASH', '$2y$12$...');` line it prints
4. Edit `admin/config.php` and replace the existing `ADMIN_PASS_HASH` line with it
5. **Delete `admin/setup.php`** — anyone who reaches that page can generate hashes
6. Sign in at `https://yourdomain.com/admin/`

The username is `admin` by default; change `ADMIN_USER` in `config.php` if you
want something else. The password itself is never stored — only the bcrypt hash.

## 4. Using the panel

Everything at `/admin/dashboard.php`:

- **Add / edit** a notification: title (required), body, category, date, and an
  optional link
- **Active** — off hides it from the site entirely
- **Pinned** — keeps it at the top of the bell list
- **Show in bar** — also displays it in the orange strip across the top of the page
- **Arrows** reorder; **Delete** removes

Saving rewrites `data/notifications.json`. The public pages fetch that file
directly, so changes are live on the next page load — no rebuild. A `.bak` copy
of the previous version is kept next to it on every save.

## 5. HTTPS

Enable **AutoSSL** in cPanel and force HTTPS (cPanel → Domains → Force HTTPS
Redirect). The admin session cookie is marked `secure` automatically once the
site is served over HTTPS, so this is worth doing before you log in for real.

## 6. After upload — three things to check

1. Open the **Gallery**. If the photos are broken, `images/optimized/` did not go
   up. If they *download* instead of displaying, the host is missing the
   `image/webp` MIME type — the root `.htaccess` supplies it, so check that it
   uploaded (dotfiles are hidden by default).
2. Open any page on a **phone**. The header logo, the contact form and the
   two-column sections should all be full-width single columns.
3. Open the browser console on two or three pages. It should be empty.

## Known gap: the disclosure PDFs

`mandatory-disclosure.html` links 10 PDFs under `documents/disclosure/` that do
not exist in the project — affiliation and recognition certificates, the trust
deed, the fee structure and so on. Those links will 404 until the actual documents
are supplied and dropped into that folder with the exact filenames the page uses.
`py tools/check-html.py` lists them.

This is unrelated to the images and predates the image work; it is recorded here
because it is the one remaining set of broken links on the site.

## What was not tested locally

PHP is not installed on this machine (`php: command not found`), so the admin
panel has **never been executed** — it was written but not run. The HTML, CSS,
JS, drawer, and notification UI were all verified in a browser. Expect to shake
out any PHP-side issue on first run on the server.

The root `.htaccess` could not be tested either: the local preview is a static
file server, not Apache, so the compression and cache headers have never actually
been emitted. The `<IfModule>` guards mean a missing module degrades quietly
instead of 500-ing, but if the site returns a 500 immediately after upload, rename
that file to `_htaccess` and reload — that isolates it in one step.
