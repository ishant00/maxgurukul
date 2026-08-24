"""Check every page for unbalanced block tags and for image paths that 404.

There is no build step here, so nothing catches a missing </div> or a typo in a
srcset until it renders wrong in a browser - and a wrong-case path renders fine
on Windows and 404s on the cPanel Linux host. This checks both from the files.

    python tools/check-html.py
"""
import glob
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# Only block-level containers - self-closing and void elements would need a real
# parser, and these are the ones that actually get miscounted by hand.
TAGS = ("main", "section", "header", "footer", "nav", "div", "figure", "picture", "ul", "ol")
TAG_RE = re.compile(r"<(/?)(" + "|".join(TAGS) + r")\b[^>]*>", re.I)

# src/srcset/href on anything pointing into images/, plus url() in inline styles.
SRC_RE = re.compile(r'(?:src|href)="([^"]+)"|srcset="([^"]+)"|url\(\s*[\'"]?([^\'")]+)')

# Comments are blanked out before tag counting, otherwise prose that mentions a
# tag by name ("each <picture> offers WebP...") is counted as real markup.
COMMENT_RE = re.compile(r"<!--.*?-->", re.S)


def strip_comments(text):
    """Blank comment bodies but keep every newline, so line numbers stay true."""
    return COMMENT_RE.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), text)


problems = 0


def local_targets(text):
    for m in SRC_RE.finditer(text):
        plain, srcset, css = m.groups()
        if plain:
            yield plain
        elif srcset:
            for part in srcset.split(","):
                bit = part.strip().split()
                if bit:
                    yield bit[0]
        elif css:
            yield css


for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as fh:
        text = fh.read()

    notes = []

    # --- nesting -------------------------------------------------------------
    stack = []
    for lineno, line in enumerate(strip_comments(text).split("\n"), 1):
        for m in TAG_RE.finditer(line):
            closing, tag = m.group(1), m.group(2).lower()
            if closing:
                if stack and stack[-1][0] == tag:
                    stack.pop()
                else:
                    top = f"<{stack[-1][0]}> opened line {stack[-1][1]}" if stack else "nothing open"
                    notes.append(f"line {lineno}: stray </{tag}> - {top}")
            else:
                stack.append((tag, lineno))
    for tag, lineno in stack:
        notes.append(f"line {lineno}: <{tag}> never closed")

    # --- asset paths ---------------------------------------------------------
    # Comments stripped here too: several of them quote the old broken paths as
    # an explanation of what was fixed, which is not a reference to check.
    for target in local_targets(strip_comments(text)):
        if re.match(r"^(https?:|mailto:|tel:|data:|#|/)", target):
            continue
        # page.html#anchor is a link, not an asset - the fragment is not a path.
        target = target.split("#", 1)[0].split("?", 1)[0]
        if not target:
            continue
        # Every page sits at the deploy root, so a `../` asset path escapes it.
        # It can still resolve locally by accident - `site/../site/images/x.jpg`
        # works here only because the parent folder happens to contain `site/` -
        # and then 404s from public_html/ in production.
        if target.startswith("../"):
            notes.append(f"escapes site root: {target}")
            continue
        resolved = os.path.normpath(os.path.join(ROOT, target.replace("%20", " ")))
        if not os.path.exists(resolved):
            notes.append(f"missing asset: {target}")
        else:
            # Case-exact check: Windows resolves logo.png -> logo.PNG, Linux does not.
            folder, leaf = os.path.split(resolved)
            if leaf and leaf not in os.listdir(folder):
                real = next((f for f in os.listdir(folder) if f.lower() == leaf.lower()), "?")
                notes.append(f"case mismatch: {target} (on disk: {real})")

    if notes:
        problems += 1
        print(f"\n{name}")
        for note in dict.fromkeys(notes):
            print(f"  {note}")
    else:
        print(f"  ok  {name}")

print(f"\n{problems} file(s) with problems.")
sys.exit(1 if problems else 0)
