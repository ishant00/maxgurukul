# Image pipeline

Helper scripts for the photographs on this site. Several HTML comments point
here — this is the explanation they refer to.

Nothing here runs at page-load or build time; the site is plain static HTML with
no build step. These are one-off scripts you run by hand when photos change.
Python 3 with Pillow is the only requirement.

```bash
py tools/optimize-images.py     # rebuild derivatives that are missing or stale
py tools/check-html.py          # validate markup and asset paths before deploy
```

## Why the pipeline exists

Every file in `images/` is an untouched phone original: 24 MP (5712×4284) at
3–7 MB. Serving them directly is what made the gallery stutter, for two reasons
that are worth separating:

- **Transfer.** The gallery pulled roughly 30 MB of JPEG on first load.
- **Decode.** Far more important. Each 24 MP frame expands to a ~98 MB RGBA
  bitmap that the browser has to decode on the main thread. Thirty of those is
  ~200 megapixels of decode work, and `loading="lazy"` does not help — it only
  delays *when* the decode happens, not how expensive it is. This is why simply
  adding lazy-loading to the original markup would not have fixed the jank.

Two further traps in the originals:

- **EXIF orientation.** 34 of the 44 photos carry `Orientation=6` (rotate 90°
  clockwise). Browsers honour that for `<img>`; Pillow does not unless you call
  `ImageOps.exif_transpose()`. So the on-disk pixel dimensions are *not* the
  dimensions the browser paints. The rotation is baked into every derivative,
  which is why the `width`/`height` attributes in the markup look "wrong"
  against the original files.
- **MPO.** The iPhone originals report format `MPO` — an HDR dual-frame JPEG
  carrying a second full-size image the browser downloads and never displays.
  The derivatives are single-frame.

## Derivatives

`optimize-images.py` reads `photos.json` and writes, per entry:

```
images/optimized/<slug>-<width>.webp     # what browsers actually get
images/optimized/<slug>-<width>.jpg      # fallback for old browsers
```

Widths are `400, 640, 900, 1280`, plus `1800` for photos used at full content
width. WebP quality 82, JPEG 84, metadata stripped, a light unsharp mask so the
downscaled copies stay crisp. **Derivatives are never upscaled** — a rung wider
than the source is skipped, so the five legacy 500×333 files produce a single
400px step and nothing else. That is why those five are unused in page content:
in a 361px cell they would be soft on any retina phone, and the brief was not to
trade sharpness for speed.

Originals are never served. They stay in `images/` as the masters, and
`images/optimized/` is the only directory the pages reference.

## Scripts

| Script | Purpose |
| --- | --- |
| `optimize-images.py` | Build the responsive derivatives. `--force` rebuilds all. |
| `check-html.py` | **Run before every deploy.** Block-tag balance, missing assets, and case-exact paths. |
| `emit-markup.py` | Generate a `<picture>` block with a correct `sizes` for a named slot. |
| `list-derivatives.py` | Which widths exist for a slug, and their real pixel sizes. |
| `photo-usage.py` | Which photo appears on which page, and which are unused. |
| `preview-crops.py` | Render what `object-fit:cover` will actually show in a given box. |
| `rewrite-logos.py` | Point every page's logo and favicon at the optimized logo. |
| `audit-images.py` | Byte size and dimensions of everything under `images/`. |
| `audit-orientation.py` | EXIF orientation tag per photo. |
| `contact-sheet.py` | Labelled contact sheets for visual review. Scratch. |

### `check-html.py` catches two things a browser won't

There is no build step, so nothing otherwise catches a missing `</div>` until it
renders wrong. It also checks paths **case-exactly**: Windows happily resolves
`logo.png` to `logo.PNG`, the cPanel Linux host does not. That class of bug is
invisible locally and a 404 in production. It also rejects `../` asset paths,
since every page sits at the deploy root and `../` escapes it.

It currently reports 10 missing PDFs under `documents/disclosure/` referenced by
`mandatory-disclosure.html`. Those were missing beforehand and are unrelated to
the images — the files need to be supplied.

### `emit-markup.py` and the `sizes` presets

Getting `sizes` right is the whole point: it is what lets the browser pick a
400px file for a 361px cell instead of a 1280px one. Each preset encodes the
real measured slot width at each breakpoint, derived from the CSS rather than
guessed.

```bash
py tools/emit-markup.py --list-presets
py tools/emit-markup.py grid3 library-reading "Library" "Students reading in the library"
```

`grid3-side` exists because `about.html` wraps its content in `.wrap.side-layout`
— a `250px 1fr` grid with a 50px gap — so its column is 824px, not 1124px, and
its cells are 261px rather than 361px. Using the plain `grid3` preset there made
the browser fetch a rung larger than needed on retina screens.

### `preview-crops.py` and why crops need checking

`object-fit: cover` discards whatever does not fit, and a portrait photo in a
landscape box loses the top and bottom of the frame — which is how you end up
with a decapitated archer. This renders the exact crop at the exact CSS pixel
size so it can be judged before the markup is written. It caught two real
problems: an archer whose bow was cut off, and two "different" tiles that turned
out to be the same volleyball court in the same kit.

```bash
py tools/preview-crops.py my-crops.json out.png
```

Spec entries are `{slug, w, h, pos, label}`, where `pos` is the
`object-position` Y percentage. Write the spec anywhere; it is throwaway input.

## Two constraints worth knowing before editing the markup

**A photo row must be orientation-homogeneous.** Grid items stretch to the row
height, and that overrides `aspect-ratio`. Put a 3:4 portrait in a row sized for
4:3 landscapes and it loses about 44% of its height. `.photo-gallery` and
`.photo-gallery.portrait-set` exist to keep each row uniform — check the
orientation notes in `photos.json` before swapping a photo into an existing row.

**A CSS `background-image` cannot carry `srcset` or `loading="lazy"`.** The
`student-life.html` mosaic was seven CSS backgrounds, which meant seven
unavoidable full-size downloads with no way to defer or size them. Those tiles
are now real `<picture>` elements sitting under the gradient scrim
(`.gallery-tile.has-photo`), which is what made that page's initial load drop to
71 KB.

## Adding a photo

1. Drop the original into `images/<Folder>/`.
2. Add an entry to `photos.json` — `slug`, `src`, and a `note` describing what it
   shows *and its orientation*. The note is what makes row-uniformity checkable.
3. `py tools/optimize-images.py`
4. `py tools/preview-crops.py` for the slot you have in mind, and look at it.
5. `py tools/emit-markup.py <preset> <slug> "<caption>" "<alt>"`, paste it in.
6. `py tools/check-html.py`
7. `py tools/photo-usage.py` — check you are not repeating a photo that already
   appears on two other pages when an unused one would do.

## Deploying

Upload `images/optimized/` and `images/favicon.png` along with the HTML and CSS.
The pages reference **only** `images/optimized/`, so the originals do not need to
go up at all — that is 168 MB of `images/` versus 34 MB of derivatives. Keep the
originals as the masters; they are what these scripts rebuild from.

`DEPLOY-cPanel.md` has the full checklist, including the `image/webp` MIME type
the host may be missing.
