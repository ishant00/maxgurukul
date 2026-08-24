"""Point every page's logo and favicon at the optimized derivatives.

images/logo.png is a 1.19 MB full-size PNG. It was loaded three times on every
page - as the favicon, as the header wordmark, and as the footer wordmark - which
made it the single largest asset on the site, on all fourteen pages, before any
content had rendered.

This rewrites those three references to images/optimized/logo-*.{webp,png} and
images/favicon.png. The header and footer markup is byte-identical across all
fourteen files, so the substitution is exact-match and refuses to run if a file
does not look the way it is expected to.

    python tools/rewrite-logos.py            # apply
    python tools/rewrite-logos.py --check    # report only, change nothing
"""
import glob
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CHECK = "--check" in sys.argv

LOGO_SIZES = 'sizes="122px"'

# --- favicon: a 64px icon instead of a 1.19 MB 1500px PNG -------------------
FAVICON_FROM = '<link rel="icon" href="images/logo.png">'
FAVICON_TO = '<link rel="icon" type="image/png" href="images/favicon.png">'

# --- header wordmark: .brand img is 122px wide (116/100/90 at breakpoints) ---
# Anchored on the leading newline plus exact indentation. Without the newline the
# 6-space header pattern is also a substring of the 10-space footer line, and the
# header rule would silently eat the footer one too.
HEADER_FROM = '\n      <img src="images/logo.png" alt="Max The Gurukul logo">'
HEADER_TO = (
    '\n      <picture>\n'
    '        <source type="image/webp" srcset="images/optimized/logo-160.webp 160w, images/optimized/logo-320.webp 320w, images/optimized/logo-480.webp 480w" ' + LOGO_SIZES + '>\n'
    '        <img src="images/optimized/logo-160.png" srcset="images/optimized/logo-160.png 160w, images/optimized/logo-320.png 320w, images/optimized/logo-480.png 480w" ' + LOGO_SIZES + '\n'
    '             width="480" height="320" alt="Max The Gurukul logo" decoding="async">\n'
    '      </picture>'
)

# --- footer wordmark ---------------------------------------------------------
# js/script.js replaces the whole <footer> at runtime, so this copy only ever
# renders for a visitor without JavaScript - but that visitor should not be the
# one person who downloads the 1.19 MB file.
FOOTER_FROM = '\n          <img src="images/logo.png" alt="Max The Gurukul logo">'
FOOTER_TO = (
    '\n          <picture>\n'
    '            <source type="image/webp" srcset="images/optimized/logo-240.webp 240w, images/optimized/logo-480.webp 480w" sizes="250px">\n'
    '            <img src="images/optimized/logo-320.png" srcset="images/optimized/logo-240.png 240w, images/optimized/logo-320.png 320w, images/optimized/logo-480.png 480w" sizes="250px"\n'
    '                 width="250" height="167" alt="Max The Gurukul logo" decoding="async" loading="lazy">\n'
    '          </picture>'
)

RULES = [
    ("favicon", FAVICON_FROM, FAVICON_TO),
    ("footer logo", FOOTER_FROM, FOOTER_TO),
    ("header logo", HEADER_FROM, HEADER_TO),
]

changed = skipped = 0
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as fh:
        text = original = fh.read()

    done, missing = [], []
    for label, src, dest in RULES:
        if src in text:
            text = text.replace(src, dest)
            done.append(label)
        elif dest in text:
            done.append(f"{label} (already)")
        else:
            missing.append(label)

    if missing:
        print(f"  !! {name}: could not find {', '.join(missing)} - left untouched")
        skipped += 1
        continue

    if text != original and not CHECK:
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(text)
    if text != original:
        changed += 1
    print(f"  {'would fix' if CHECK else 'ok':10} {name:28} {', '.join(done)}")

print(f"\n{changed} file(s) {'need changes' if CHECK else 'updated'}, {skipped} skipped.")
