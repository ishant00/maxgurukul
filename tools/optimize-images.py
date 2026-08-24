"""Generate web-ready responsive derivatives from the camera originals.

    python tools/optimize-images.py            # only what is missing or stale
    python tools/optimize-images.py --force    # rebuild everything

Why this exists
---------------
Every photo in images/ is an untouched phone original: 24 MP (5712x4284) at
3-7 MB, and most carry EXIF orientation 6, meaning the stored pixels are
sideways and the browser rotates them at paint time. Serving those directly
cost the gallery ~30 MB of transfer and ~200 megapixels of main-thread JPEG
decode, which is what made the page stutter.

This script reads tools/photos.json and writes, for each entry:

    images/optimized/<slug>-<width>.webp
    images/optimized/<slug>-<width>.jpg     (fallback for old browsers)

with EXIF rotation baked into the pixels, all metadata stripped, and a light
unsharp mask so the downscaled copies stay crisp. Originals are never touched
and are never served — they stay in the repo as the masters.

Derivatives are never upscaled: a width larger than the source is skipped, so
the low-resolution 500x333 legacy files produce a single 400px step and nothing
more.
"""
import json
import os
import sys

from PIL import Image, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, "images", "optimized")
MANIFEST = os.path.join(HERE, "photos.json")

# Slot widths, chosen from the real layout: the content column is 1124px, so a
# 3-up gallery tile is ~361 CSS px (400 at 1x, 800-1120 at 2-3x), a 2-up tablet
# tile ~555px, and a 1-up phone tile ~424px. 1800 is only for full-bleed use.
WIDTHS = [400, 640, 900, 1280]
HERO_WIDTH = 1800

WEBP_QUALITY = 82
JPEG_QUALITY = 84
LOGO_WIDTHS = [160, 240, 320, 480]
FAVICON_SIZE = 64

FORCE = "--force" in sys.argv


def is_stale(src, dest):
    """True when dest needs (re)building."""
    if FORCE or not os.path.exists(dest):
        return True
    return os.path.getmtime(dest) < os.path.getmtime(src)


def load_upright(path, min_width):
    """Open an image, apply EXIF rotation, return it in RGB.

    JPEG draft mode lets libjpeg decode at 1/2, 1/4 or 1/8 scale, which is far
    cheaper than a full 24 MP decode. We only ever draft down to something still
    at least 2x the width we need, so the Lanczos step below has plenty of pixels
    to work with and quality is unaffected.
    """
    im = Image.open(path)
    if im.format in ("JPEG", "MPO"):
        im.draft("RGB", (min_width * 2, min_width * 2))
    im = ImageOps.exif_transpose(im)
    return im.convert("RGB")


def resize(im, width):
    height = max(1, round(im.height * width / im.width))
    out = im.resize((width, height), Image.LANCZOS)
    # Downscaling always costs a little acuity; a mild unsharp mask puts it back
    # without the halos that a heavier setting would introduce.
    return out.filter(ImageFilter.UnsharpMask(radius=0.7, percent=65, threshold=3))


def build_photo(entry):
    src = os.path.join(ROOT, entry["src"])
    if not os.path.exists(src):
        print(f"  !! missing source: {entry['src']}")
        return 0, 0

    slug = entry["slug"]
    widths = WIDTHS + ([HERO_WIDTH] if entry.get("hero") else [])

    with Image.open(src) as probe:
        native_width = ImageOps.exif_transpose(probe).width
    # Never upscale. Keep one step at the native width if every ladder rung is
    # bigger than the source, so small legacy files still get a stripped,
    # recompressed copy to serve.
    widths = [w for w in widths if w <= native_width] or [native_width]

    targets = []
    for width in widths:
        for ext in ("webp", "jpg"):
            dest = os.path.join(OUT_DIR, f"{slug}-{width}.{ext}")
            if is_stale(src, dest):
                targets.append((width, ext, dest))
    if not targets:
        return 0, 0

    written = 0
    total_bytes = 0
    base = load_upright(src, min(w for w, _, _ in targets))
    try:
        by_width = {}
        for width, ext, dest in targets:
            if width not in by_width:
                by_width[width] = resize(base, width)
            im = by_width[width]
            if ext == "webp":
                im.save(dest, "WEBP", quality=WEBP_QUALITY, method=6)
            else:
                im.save(dest, "JPEG", quality=JPEG_QUALITY,
                        optimize=True, progressive=True)
            written += 1
            total_bytes += os.path.getsize(dest)
    finally:
        base.close()

    src_mb = os.path.getsize(src) / 1048576
    print(f"  {slug:28} {native_width}px source ({src_mb:.1f} MB) "
          f"-> {written} files, largest webp "
          f"{os.path.getsize(os.path.join(OUT_DIR, f'{slug}-{max(widths)}.webp')) / 1024:.0f} KB")
    return written, total_bytes


def build_logo(entry):
    """The logo is a transparent PNG, so it stays PNG (+ WebP) rather than JPEG."""
    src = os.path.join(ROOT, entry["src"])
    if not os.path.exists(src):
        print(f"  !! missing source: {entry['src']}")
        return 0

    written = 0
    with Image.open(src) as im:
        im = im.convert("RGBA")
        for width in LOGO_WIDTHS:
            if width > im.width:
                continue
            height = max(1, round(im.height * width / im.width))
            small = im.resize((width, height), Image.LANCZOS)
            for ext in ("png", "webp"):
                dest = os.path.join(OUT_DIR, f"{entry['slug']}-{width}.{ext}")
                if not is_stale(src, dest):
                    continue
                if ext == "png":
                    small.save(dest, "PNG", optimize=True)
                else:
                    small.save(dest, "WEBP", quality=90, method=6, lossless=False)
                written += 1

        # A 1.2 MB PNG as the favicon made every page pay for a 16px icon.
        favicon = os.path.join(ROOT, "images", "favicon.png")
        if is_stale(src, favicon):
            icon = im.copy()
            icon.thumbnail((FAVICON_SIZE, FAVICON_SIZE), Image.LANCZOS)
            square = Image.new("RGBA", (FAVICON_SIZE, FAVICON_SIZE), (0, 0, 0, 0))
            square.paste(icon, ((FAVICON_SIZE - icon.width) // 2,
                                (FAVICON_SIZE - icon.height) // 2))
            square.save(favicon, "PNG", optimize=True)
            written += 1
            print(f"  favicon.png                  {FAVICON_SIZE}px "
                  f"({os.path.getsize(favicon) / 1024:.1f} KB)")
    return written


def main():
    with open(MANIFEST, encoding="utf-8") as fh:
        manifest = json.load(fh)

    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Building derivatives into images/optimized/"
          f"{' (forced rebuild)' if FORCE else ''}\n")

    files = 0
    for entry in manifest["photos"]:
        written, _ = build_photo(entry)
        files += written

    print()
    files += build_logo(manifest["logo"])

    out_bytes = sum(os.path.getsize(os.path.join(OUT_DIR, f))
                    for f in os.listdir(OUT_DIR))
    print(f"\n{files} file(s) written this run. "
          f"images/optimized/ now holds {len(os.listdir(OUT_DIR))} files, "
          f"{out_bytes / 1048576:.1f} MB total.")


if __name__ == "__main__":
    main()
