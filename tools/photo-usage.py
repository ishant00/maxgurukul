"""Report which photo is used on which page, and which are unused.

The brief was explicit about not repeating the same photo when a better option
exists. With 30 photos and a dozen pages that is not something to eyeball - this
counts real references in the HTML so a placement decision can be checked.

    python tools/photo-usage.py
"""
import glob
import json
import os
import re
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

with open(os.path.join(HERE, "photos.json"), encoding="utf-8") as fh:
    slugs = [p["slug"] for p in json.load(fh)["photos"]]

COMMENT_RE = re.compile(r"<!--.*?-->", re.S)

pages = defaultdict(set)
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as fh:
        text = COMMENT_RE.sub("", fh.read())
    for slug in slugs:
        # -<digits>. pins the match to a real derivative reference, so
        # `campus-corridor` does not also match `campus-corridor-wide-400.webp`.
        if re.search(rf"/{re.escape(slug)}-\d+\.(?:webp|jpg)", text):
            pages[slug].add(name)

width = max(len(s) for s in slugs)
unused = []
for slug in slugs:
    used = sorted(pages[slug])
    if not used:
        unused.append(slug)
        continue
    flag = "  <-- 4+ pages" if len(used) >= 4 else ""
    print(f"{slug:{width}}  {len(used)}  {', '.join(used)}{flag}")

print(f"\nplaced: {len(slugs) - len(unused)}/{len(slugs)}")
if unused:
    print("unused: " + ", ".join(unused))
