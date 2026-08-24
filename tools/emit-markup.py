"""Emit the exact <picture> markup for a photo slug, for pasting into the HTML.

This site has no build step, so the responsive markup is checked into the HTML by
hand. Hand-typing five srcset entries per photo across a dozen pages is how you
get a 404 or a wrong `sizes` that quietly serves the 1280px file to a phone, so
the markup is generated from what is actually on disk instead.

    python tools/emit-markup.py grid3 smart-classroom-lesson "Smart classroom" "Alt text"
    python tools/emit-markup.py --list-presets

Presets carry the `sizes` value for each layout slot, derived from the real CSS:
the content column is 1124px (max-w 1180 minus 2x28px .wrap padding).
"""
import json
import os
import re
import sys
from collections import defaultdict

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, "images", "optimized")

# slot label -> (sizes attribute, prose describing where it applies)
PRESETS = {
    "grid3": (
        "(max-width:480px) calc(100vw - 56px), "
        "(max-width:760px) calc((100vw - 70px) / 2), "
        "(max-width:1180px) calc((100vw - 96px) / 3), 361px",
        ".photo-gallery / .photo-gallery.portrait-set - 3-up, 2-up <=760, 1-up <=480",
    ),
    # about.html puts its content in `.wrap.side-layout`, a `250px 1fr` grid with a
    # 50px gap, so the column is 300px narrower than the full 1124px - 824px, giving
    # 261px cells, not 361px. The sidebar collapses at 980px, and below that the
    # `grid3` maths applies again.
    "grid3-side": (
        "(max-width:480px) calc(100vw - 56px), "
        "(max-width:760px) calc((100vw - 70px) / 2), "
        "(max-width:980px) calc((100vw - 96px) / 3), "
        "(max-width:1180px) calc((100vw - 396px) / 3), 261px",
        ".photo-gallery 3-up inside .wrap.side-layout (about.html)",
    ),
    "grid2": (
        "(max-width:760px) calc(100vw - 56px), "
        "(max-width:1180px) calc((100vw - 76px) / 2), 552px",
        ".photo-gallery.wide-set - 2-up, full width <=760",
    ),
    "figure": (
        "(max-width:1180px) calc(100vw - 56px), 1124px",
        ".photo-figure spanning the whole content column",
    ),
    "figure-half": (
        "(max-width:900px) calc(100vw - 56px), 540px",
        ".photo-figure inside a two-column split",
    ),
    "row-lead": (
        "(max-width:760px) calc(100vw - 56px), "
        "(max-width:1180px) calc((100vw - 88px) * 0.41), 450px",
        ".campus-photo-row first cell (1.4fr of 3.4fr)",
    ),
    "row": (
        "(max-width:760px) calc(100vw - 56px), "
        "(max-width:1180px) calc((100vw - 88px) * 0.294), 321px",
        ".campus-photo-row second/third cell (1fr of 3.4fr)",
    ),
    # .gallery-grid is 4x150px with 14px gaps -> a 1124px column gives 270px
    # cells; 2-up at <=980, 1-up at <=480.
    "mosaic": (
        "(max-width:480px) calc(100vw - 56px), "
        "(max-width:980px) calc((100vw - 70px) / 2), "
        "(max-width:1180px) calc((100vw - 98px) / 4), 270px",
        ".gallery-tile - single cell",
    ),
    "mosaic-wide": (
        "(max-width:980px) calc(100vw - 56px), "
        "(max-width:1180px) calc((100vw - 70px) / 2), 555px",
        ".gallery-tile.wide - spans 2 columns (full width once 2-up)",
    ),
}


def rungs():
    found = defaultdict(list)
    for name in os.listdir(OUT_DIR):
        m = re.match(r"^(.*)-(\d+)\.webp$", name)
        if m:
            found[m.group(1)].append(int(m.group(2)))
    return {slug: sorted(w) for slug, w in found.items()}


def markup(preset, slug, caption, alt, sub=None, eager=False, classes="", pos=None):
    available = rungs()
    if slug not in available:
        sys.exit(f"no derivatives for '{slug}' - run tools/optimize-images.py")
    widths = available[slug]
    sizes = PRESETS[preset][0]

    with Image.open(os.path.join(OUT_DIR, f"{slug}-{widths[-1]}.webp")) as im:
        w, h = im.size

    webp = ", ".join(f"images/optimized/{slug}-{n}.webp {n}w" for n in widths)
    jpg = ", ".join(f"images/optimized/{slug}-{n}.jpg {n}w" for n in widths)
    # Default src is the rung nearest a 1x desktop tile; browsers that understand
    # srcset ignore it, so it only matters for very old ones.
    default = min(widths, key=lambda n: abs(n - 640))

    # Lazy images are already demoted by the browser; an explicit
    # fetchpriority="low" would only slow one down once it does scroll in.
    load = ('loading="eager" fetchpriority="high"' if eager else 'loading="lazy"')

    # .gallery-tile is a div with a <span> label, not a <figure>/<figcaption>.
    tile = preset.startswith("mosaic")
    pad = "  " if tile else "  "
    open_tag = (
        f'<div class="gallery-tile has-photo{(" " + classes) if classes else ""}"'
        + (f' style="--pos:{pos}"' if pos else "")
        + ">"
        if tile
        else "<figure" + (f' style="--pos:{pos}"' if pos else "") + ">"
    )

    lines = [
        f"      {open_tag}",
        f"      {pad}<picture>",
        f'      {pad}  <source type="image/webp" srcset="{webp}" sizes="{sizes}">',
        f'      {pad}  <img src="images/optimized/{slug}-{default}.jpg" srcset="{jpg}"',
        f'      {pad}       sizes="{sizes}"',
        f'      {pad}       width="{w}" height="{h}" alt="{alt}" {load} decoding="async">',
        f"      {pad}</picture>",
    ]
    if caption:
        if tile:
            lines.append(f"      {pad}<span>{caption}</span>")
        else:
            cap = caption if not sub else f"{caption}<small>{sub}</small>"
            lines.append(f"      {pad}<figcaption>{cap}</figcaption>")
    lines.append("      </div>" if tile else "      </figure>")
    return "\n".join(lines)


def main():
    if "--list-presets" in sys.argv:
        for key, (sizes, why) in PRESETS.items():
            print(f"{key:12} {why}\n{'':12} sizes=\"{sizes}\"\n")
        return

    # Batch mode: a JSON file of {preset, slug, caption, alt, sub?, eager?} objects.
    if sys.argv[1] == "--batch":
        with open(sys.argv[2], encoding="utf-8") as fh:
            for block in json.load(fh):
                if "comment" in block:
                    print(f"\n<!-- {block['comment']} -->")
                    continue
                print(markup(block["preset"], block["slug"], block.get("caption"),
                             block["alt"], block.get("sub"), block.get("eager", False),
                             block.get("classes", ""), block.get("pos")))
        return

    preset, slug, caption, alt = sys.argv[1:5]
    sub = sys.argv[5] if len(sys.argv) > 5 else None
    print(markup(preset, slug, caption, alt, sub, "--eager" in sys.argv))


if __name__ == "__main__":
    main()
