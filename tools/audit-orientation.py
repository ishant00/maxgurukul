"""Print the EXIF Orientation tag for every photo under images/.

Browsers honour EXIF orientation for <img>; Pillow does not unless you call
ImageOps.exif_transpose(). Any value other than 1 means the on-disk pixel
dimensions are NOT the dimensions the browser paints.
"""
import os

from PIL import Image, ImageOps

SRC = "images"
SKIP_DIRS = {"optimized"}
MEANING = {
    1: "normal", 2: "mirror-h", 3: "rotate-180", 4: "mirror-v",
    5: "transpose", 6: "rotate-90-cw", 7: "transverse", 8: "rotate-270-cw",
}

for dirpath, dirnames, filenames in os.walk(SRC):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
    for name in sorted(filenames):
        if not name.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        path = os.path.join(dirpath, name)
        with Image.open(path) as im:
            raw = im.size
            orient = (im.getexif() or {}).get(274, 1)
            shown = ImageOps.exif_transpose(im).size
        flag = "  <-- flips" if raw != shown else ""
        print(f"{path.replace(os.sep, '/'):46} file={raw[0]}x{raw[1]:<5} "
              f"orient={orient} ({MEANING.get(orient, '?')}) browser={shown[0]}x{shown[1]}{flag}")
