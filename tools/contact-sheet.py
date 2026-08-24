"""Build labelled contact sheets of every photo under images/ for visual review.

Writes tools/.review/sheet-N.jpg plus an index mapping to stdout.
Scratch output only — safe to delete.
"""
import os

from PIL import Image, ImageDraw, ImageOps

SRC = "images"
OUT = os.path.join("tools", ".review")
SKIP_DIRS = {"optimized"}
CELL = 300          # cell width in the sheet
COLS, ROWS = 5, 4   # 12 photos per sheet
LABEL_H = 22

os.makedirs(OUT, exist_ok=True)

photos = []
for dirpath, dirnames, filenames in os.walk(SRC):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
    for name in sorted(filenames):
        if name.lower().endswith((".jpg", ".jpeg", ".png")):
            photos.append(os.path.join(dirpath, name).replace(os.sep, "/"))
photos.sort()

per_sheet = COLS * ROWS
for sheet_no in range((len(photos) + per_sheet - 1) // per_sheet):
    chunk = photos[sheet_no * per_sheet:(sheet_no + 1) * per_sheet]
    cell_h = int(CELL * 1.15)
    sheet = Image.new("RGB", (COLS * CELL, ROWS * (cell_h + LABEL_H)), "#1b1b1b")
    draw = ImageDraw.Draw(sheet)
    for i, path in enumerate(chunk):
        idx = sheet_no * per_sheet + i
        col, row = i % COLS, i // COLS
        x, y = col * CELL, row * (cell_h + LABEL_H)
        with Image.open(path) as im:
            # Browsers honour EXIF orientation; match that so the sheet shows
            # what a visitor actually sees.
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((CELL - 8, cell_h - 8), Image.LANCZOS)
            sheet.paste(im, (x + (CELL - im.width) // 2, y + (cell_h - im.height) // 2))
        draw.text((x + 6, y + cell_h + 5), f"[{idx}] {os.path.basename(path)}", fill="#ffcc66")
        print(f"[{idx}] {path}")
    dest = os.path.join(OUT, f"sheet-{sheet_no}.jpg")
    sheet.save(dest, "JPEG", quality=72, optimize=True)
    print(f"  -> wrote {dest}")
