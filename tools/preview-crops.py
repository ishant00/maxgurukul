"""Render what `object-fit:cover` will actually show in a given box.

The Browser pane will not composite frames in this environment, so screenshots
are unavailable - but the crop is pure arithmetic, and cover + object-position is
cheap to reproduce exactly. This renders each slot at its real CSS pixel size so
the crop can be judged directly, which is the only part of a photo choice that a
network trace cannot tell you.

    python tools/preview-crops.py tools/.review/crops.json out.png

Each entry: {slug, w, h, pos, label}. `pos` is the object-position Y as a
percentage (matching --pos: center N%); 50 is the CSS default.
"""
import json
import os
import sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, "images", "optimized")

PAD = 14
LABEL_H = 18


def source_for(slug, need_w):
    """Smallest rung at least as wide as the box, so the crop is not upscaled."""
    rungs = sorted(
        int(f.rsplit("-", 1)[1].split(".")[0])
        for f in os.listdir(OUT_DIR)
        if f.startswith(slug + "-") and f.endswith(".webp")
        and f.rsplit("-", 1)[0] == slug
    )
    pick = next((r for r in rungs if r >= need_w), rungs[-1])
    return os.path.join(OUT_DIR, f"{slug}-{pick}.webp")


def cover(path, box_w, box_h, pos_y=50.0):
    """Exactly what object-fit:cover + object-position:center N% renders."""
    with Image.open(path) as im:
        im = im.convert("RGB")
        sw, sh = im.size
        scale = max(box_w / sw, box_h / sh)
        rw, rh = max(1, round(sw * scale)), max(1, round(sh * scale))
        im = im.resize((rw, rh), Image.LANCZOS)
        # object-position distributes the overflow by the given percentage.
        left = round((rw - box_w) * 0.5)
        top = round((rh - box_h) * (pos_y / 100.0))
        return im.crop((left, top, left + box_w, top + box_h))


def main():
    spec_path, out_path = sys.argv[1], sys.argv[2]
    with open(spec_path, encoding="utf-8") as fh:
        entries = json.load(fh)

    tiles = []
    for e in entries:
        w, h = int(e["w"]), int(e["h"])
        img = cover(source_for(e["slug"], w), w, h, float(e.get("pos", 50)))
        tiles.append((e.get("label", e["slug"]), e["slug"], img))

    # Simple vertical stack - each slot is a different size, so a grid would
    # letterbox and defeat the point.
    width = max(t[2].width for t in tiles) + PAD * 2
    height = sum(t[2].height + LABEL_H + PAD for t in tiles) + PAD
    sheet = Image.new("RGB", (width, height), (243, 245, 249))
    draw = ImageDraw.Draw(sheet)

    y = PAD
    for label, slug, img in tiles:
        draw.text((PAD, y), f"{label}  -  {slug}  ({img.width}x{img.height})",
                  fill=(20, 40, 74))
        y += LABEL_H
        sheet.paste(img, (PAD, y))
        draw.rectangle([PAD, y, PAD + img.width - 1, y + img.height - 1],
                       outline=(200, 208, 220))
        y += img.height + PAD

    sheet.save(out_path)
    print(f"{out_path}  {sheet.width}x{sheet.height}  ({len(tiles)} slots)")


if __name__ == "__main__":
    main()
