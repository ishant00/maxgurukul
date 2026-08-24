"""Print the widths and pixel dimensions available for each optimized slug.

Handy when writing markup: the width/height attributes on an <img> must match a
real derivative so the browser reserves the correct box.

    python tools/list-derivatives.py
"""
import json
import os
import re
from collections import defaultdict

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, "images", "optimized")

with open(os.path.join(HERE, "photos.json"), encoding="utf-8") as fh:
    manifest = json.load(fh)
notes = {p["slug"]: p["note"] for p in manifest["photos"]}

by_slug = defaultdict(list)
for name in sorted(os.listdir(OUT_DIR)):
    m = re.match(r"^(.*)-(\d+)\.webp$", name)
    if m:
        by_slug[m.group(1)].append(int(m.group(2)))

for slug in sorted(by_slug):
    widths = sorted(by_slug[slug])
    largest = os.path.join(OUT_DIR, f"{slug}-{widths[-1]}.webp")
    with Image.open(largest) as im:
        w, h = im.size
    ratio = w / h
    shape = "landscape" if ratio > 1.05 else ("portrait" if ratio < 0.95 else "square")
    kb = os.path.getsize(os.path.join(OUT_DIR, f"{slug}-{widths[0]}.webp")) / 1024
    print(f"{slug:28} {widths}  {w}x{h}  ratio {ratio:.3f} ({shape})  "
          f"smallest webp {kb:.0f} KB")
    if slug in notes:
        print(f"{'':28} {notes[slug]}")
