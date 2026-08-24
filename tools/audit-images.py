"""Report every file under images/ with its byte size and pixel dimensions.

Diagnostic helper — run from the site root:  python tools/audit-images.py
"""
import os

from PIL import Image

ROOT = "images"
IMG_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp")

rows = []
total = 0
for dirpath, _dirnames, filenames in os.walk(ROOT):
    for name in sorted(filenames):
        path = os.path.join(dirpath, name)
        size = os.path.getsize(path)
        total += size
        rel = path.replace(os.sep, "/")
        if name.lower().endswith(IMG_EXT):
            try:
                with Image.open(path) as im:
                    rows.append((rel, size, im.size[0], im.size[1], im.format))
            except Exception as exc:  # unreadable / mislabelled file
                rows.append((rel, size, 0, 0, "ERR:" + str(exc)[:28]))
        else:
            rows.append((rel, size, 0, 0, "(other)"))

rows.sort(key=lambda r: -r[1])
print(f"{'size(MB)':>9} {'WxH':>12}  {'fmt':<8} path")
for rel, size, w, h, fmt in rows:
    print(f"{size / 1048576:9.2f} {f'{w}x{h}':>12}  {fmt:<8} {rel}")
print(f"\nTOTAL {ROOT}/ = {total / 1048576:.1f} MB across {len(rows)} files")
