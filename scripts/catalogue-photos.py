"""
Builds the website's product photos from the supplier photo archives.

  python3 scripts/catalogue-photos.py catalogue public/products

Reads the ZIP files in catalogue/ directly (no 16 GB extraction), takes the
photos chosen in PICKS below and writes web-sized WebP copies to
public/products/<slug>/<name>.webp (max 1600 px on the long side).

To use a different photo: change its file name in PICKS and re-run.
"""
import os, sys, zipfile, glob, re
from PIL import Image, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]
MAX_SIDE, QUALITY = 1600, 80

KT, KK = "KEYLESS Aluminum Top case", "KEY Aluminum Top case"
KS, KSD = "KEYLESS Aluminum Side case", "KEY Aluminum Side case"
KLP, KP = "KEYLESS Plastic case", "KEY Plastic case"
LUG = "Aluminum Luggage case"

# slug -> list of (output name, folder inside zip, file stem)
PICKS = {
  "keyless-aluminium-top-case": [
    ("32l", f"{KT} A/32L", "DSC_7099"), ("36l", f"{KT} A/36L", "DSC_4986"), ("45l", f"{KT} A/45L", "DSC_3085"),
    ("55l", f"{KT} B/55L", "DSC_3155"), ("65l", f"{KT} B/65L", "DSC_2702"),
    ("g01", f"{KT} A/45L", "DSC_3116"), ("g02", f"{KT} A/45L", "DSC_3122"), ("g03", f"{KT} A/45L", "DSC_3730"),
    ("g04", f"{KT} A/45L", "DSC_4968"), ("g05", f"{KT} B/55L", "DSC_3214"), ("g06", f"{KT} B/65L", "DSC_3737"),
    ("g07", f"{KT} B/65L", "DSC_5742"), ("g08", f"{KT} A/36L", "DSC_7717"), ("g09", f"{KT} A/45L", "DSC_3097"),
    ("g10", f"{KT} B/55L", "DSC_3174"),
  ],
  "keyless-tass-backrest-top-case": [
    ("ab55l", f"{KT} C/AB55L", "DSC_5303"), ("ab65l", f"{KT} C/AB65L", "DSC_5147"),
    ("g01", f"{KT} C/AB55L", "DSC_5306"), ("g02", f"{KT} C/AB55L", "DSC_5051"), ("g03", f"{KT} C/AB55L", "DSC_5058"),
    ("g04", f"{KT} C/AB55L", "DSC_5132"), ("g05", f"{KT} C/AB55L", "DSC_5137"), ("g06", f"{KT} C/AB55L", "DSC_7671"),
    ("g07", f"{KT} C/AB65L", "DSC_5149"), ("g08", f"{KT} C/AB65L", "DSC_5153"),
  ],
  "keyless-side-opening-top-case": [
    ("so45l", f"{KT} C/SO45L", "DSC_5766"),
    ("g01", f"{KT} C/SO45L", "DSC_5758"), ("g02", f"{KT} C/SO45L", "DSC_5763"), ("g03", f"{KT} C/SO45L", "DSC_5773"),
    ("g04", f"{KT} C/SO45L", "DSC_5781"), ("g05", f"{KT} C/SO45L", "DSC_5795"), ("g06", f"{KT} C/SO45L", "DSC_5770"),
  ],
  "keyless-wheel-top-case": [
    ("48l", f"{KT} A/48L", "DSC_5082"), ("58l", f"{KT} C/58L", "DSC_2610"), ("68l", f"{KT} C/68L", "DSC_7700"),
    ("g01", f"{KT} C/58L", "DSC_7633"), ("g02", f"{KT} A/48L", "DSC_5086"), ("g03", f"{KT} C/58L", "DSC_7630"),
    ("g04", f"{KT} C/58L", "DSC_7640"), ("g05", f"{KT} C/68L", "DSC_7676"), ("g06", f"{KT} C/68L", "DSC_7684"),
    ("g07", f"{KT} C/68L", "DSC_8226"), ("g08", f"{KT} C/68L", "DSC_8234"), ("g09", f"{KT} A/48L", "DSC_5089"),
  ],
  "key-aluminium-top-case": [
    ("27l", f"{KK} A/27L", "DSC_7721"), ("30l", f"{KK} A/30L", "DSC_4341"), ("32l", f"{KK} A/32L", "DSC_1482"),
    ("36l", f"{KK} A/36L", "DSC_0271"), ("45l", f"{KK} B/45L", "DSC_4963"), ("55l", f"{KK} C/55L", "DSC_0884"),
    ("65l", f"{KK} C/65L", "DSC_0921"),
    ("g01", f"{KK} B/45L", "DSC_1256"), ("g02", f"{KK} B/45L", "DSC_4895"), ("g03", f"{KK} B/45L", "DSC_6881"),
    ("g04", f"{KK} B/45L", "DSC_7776"), ("g05", f"{KK} C/55L", "DSC_6931"), ("g06", f"{KK} C/65L", "DSC_5449"),
    ("g07", f"{KK} A/30L", "DSC_7256"), ("g08", f"{KK} C/55L", "DSC_0803"), ("g09", f"{KK} B/45L", "DSC_0862"),
  ],
  "key-tass-backrest-top-case": [
    ("ab45l", f"{KK} D/AB45L", "DSC_1317"), ("ab55l", f"{KK} D/AB55L", "DSC_9894"), ("ab65l", f"{KK} D/AB65L", "DSC_9908"),
    ("abso45l", f"{KK} E/ABSO45L", "DSC_0032"),
    ("g01", f"{KK} D/AB45L", "DSC_1322"), ("g02", f"{KK} D/AB55L", "DSC_0044"), ("g03", f"{KK} D/AB55L", "DSC_0053"),
    ("g04", f"{KK} D/AB55L", "DSC_1026"), ("g05", f"{KK} D/AB55L", "DSC_9122"), ("g06", f"{KK} D/AB45L", "DSC_9881"),
    ("g07", f"{KK} E/ABSO45L", "DSC_0035"), ("g08", f"{KK} E/ABSO45L", "DSC_1690"), ("g09", f"{KK} D/AB65L", "DSC_0066"),
  ],
  "key-side-opening-top-case": [
    ("so45l", f"{KK} D/SO45L", "DSC_1490"),
    ("g01", f"{KK} D/SO45L", "DSC_1487"), ("g02", f"{KK} D/SO45L", "DSC_1494"), ("g03", f"{KK} D/SO45L", "DSC_1498"),
    ("g04", f"{KK} D/SO45L", "DSC_1564"), ("g05", f"{KK} D/SO45L", "DSC_1605"), ("g06", f"{KK} D/SO45L", "DSC_1612"),
    ("g07", f"{KK} D/SO45L", "DSC_1634"),
  ],
  "key-wheel-top-case": [
    ("48l", f"{KK} E/48L", "DSC_1330"), ("58l", f"{KK} E/58L", "DSC_1810"), ("68l", f"{KK} D/68L", "DSC_1358"),
    ("g01", f"{KK} E/48L", "DSC_1342"), ("g02", f"{KK} E/48L", "DSC_1336"), ("g03", f"{KK} E/48L", "DSC_1338"),
    ("g04", f"{KK} E/48L", "DSC_9921"), ("g05", f"{KK} E/48L", "DSC_9925"), ("g06", f"{KK} E/58L", "DSC_1817"),
    ("g07", f"{KK} E/58L", "DSC_5066"), ("g08", f"{KK} E/58L", "DSC_5069"), ("g09", f"{KK} D/68L", "DSC_1365"),
    ("g10", f"{KK} D/68L", "DSC_1368"),
  ],
  "keyless-aluminium-side-cases": [
    ("28l", f"{KS}/28L side case", "DSC_7518"), ("36l", f"{KS}/36L side case", "DSC_7516"),
    ("g01", f"{KS}/28L side case", "DSC_7520"), ("g02", f"{KS}/28L side case", "DSC_7522"), ("g03", f"{KS}/36L side case", "DSC_7513"),
    ("g04", f"{KS}/36L side case", "DSC_7964"), ("g05", f"{KS}/36L side case", "DSC_7967"), ("g06", f"{KS}/36L side case", "DSC_7968"),
  ],
  "keyless-38l-dual-use-case": [
    ("38l", f"{KS}/38L side case", "DSC_4363"),
    ("g01", f"{KS}/38L side case", "DSC_4346"), ("g02", f"{KS}/38L side case", "DSC_4358"), ("g03", f"{KS}/38L side case", "DSC_4374"),
    ("g04", f"{KS}/38L side case", "DSC_4387"), ("g05", f"{KS}/38L side case", "DSC_4392"), ("g06", f"{KS}/38L side case", "DSC_4421"),
    ("g07", f"{KS}/38L side case", "DSC_4445"), ("g08", f"{KS}/38L side case", "DSC_4450"), ("g09", f"{KS}/38L side case", "DSC_7922"),
  ],
  "key-aluminium-side-cases": [
    ("24l", f"{KSD}/24L side case", "DSC_7599"), ("28l", f"{KSD}/28L side case", "DSC_1045"),
    ("36l", f"{KSD}/36L side case", "DSC_0842"), ("46l", f"{KSD}/46L side case", "DSC_1052"),
    ("g01", f"{KSD}/36L side case", "DSC_7160"), ("g02", f"{KSD}/28L side case", "DSC_8317"), ("g03", f"{KSD}/28L side case", "DSC_8323"),
    ("g04", f"{KSD}/28L side case", "DSC_8330"), ("g05", f"{KSD}/28L side case", "DSC_0870"), ("g06", f"{KSD}/36L side case", "DSC_5173"),
    ("g07", f"{KSD}/36L side case", "DSC_7174"), ("g08", f"{KSD}/46L side case", "DSC_1057"), ("g09", f"{KSD}/24L side case", "DSC_7605"),
  ],
  "plastic-vivo-s28": [
    ("keyless", f"{KLP}/S28", "DSC_3075"), ("key", f"{KP}/S28", "DSC_3593"),
    ("g01", f"{KLP}/S28", "DSC_3076"), ("g02", f"{KP}/S28", "IMG_3246"), ("g03", f"{KP}/S28", "IMG_3249"),
    ("g04", f"{KP}/S28", "S28-1"), ("g05", f"{KP}/S28", "S28-4"),
  ],
  "plastic-s30": [
    ("keyless", f"{KLP}/S30", "DSC_3314"), ("key", f"{KP}/S30", "IMG_3278"),
    ("g01", f"{KLP}/S30", "DSC_3320"), ("g02", f"{KLP}/S30", "DSC_3507"), ("g03", f"{KLP}/S30", "DSC_4925"),
    ("g04", f"{KLP}/S30", "DSC_4928"), ("g05", f"{KLP}/S30", "DSC_3515"), ("g06", f"{KP}/S30", "IMG_3260"),
  ],
  "plastic-urban-s40": [
    ("key", f"{KP}/S40", "S40"),
    ("g01", f"{KP}/S40", "IMG_3163"), ("g02", f"{KP}/S40", "IMG_3183"), ("g03", f"{KP}/S40", "IMG_3176"),
    ("g04", f"{KP}/S40", "S40 WITH 2 HELMETS 1"), ("g05", f"{KP}/S40", "Urban S40"),
  ],
  "plastic-astra-s48": [
    ("keyless", f"{KLP}/S48", "DSC_2532"), ("key", f"{KP}/S48", "DSC_7064"), ("remote", f"{KP}/S48/L MODEL", "IMG_0666"),
    ("g01", f"{KLP}/S48", "DSC_4162"), ("g02", f"{KLP}/S48", "DSC_5669"), ("g03", f"{KLP}/S48", "DSC_7268"),
    ("g04", f"{KP}/S48", "DSC_7081"), ("g05", f"{KP}/S48", "IMG_0635"), ("g06", f"{KP}/S48/L MODEL", "IMG_0661"),
  ],
  "plastic-fusion-v28": [
    ("keyless", f"{KLP}/V28", "DSC_2521"), ("key", f"{KP}/V28", "FUSION 06"),
    ("g01", f"{KLP}/V28", "DSC_2524"), ("g02", f"{KLP}/V28", "DSC_7567"), ("g03", f"{KP}/V28", "FUSION 08"),
    ("g04", f"{KP}/V28", "IMG_3092"), ("g05", f"{KP}/V28", "IMG_3082"), ("g06", f"{KP}/V28", "IMG_3098"),
  ],
  "plastic-wizard-v36": [
    ("keyless", f"{KLP}/V36", "DSC_2679"), ("key", f"{KP}/V36", "V36-1"), ("remote", f"{KP}/V36/v36 L model", "IMG_0804"),
    ("g01", f"{KLP}/V36", "DSC_3859"), ("g02", f"{KLP}/V36", "DSC_7581"), ("g03", f"{KP}/V36", "IMG_0723"),
    ("g04", f"{KP}/V36", "V36 in PU5854 with clear lens"), ("g05", f"{KP}/V36", "V36-pear white"),
    ("g06", f"{KP}/V36/v36 L model", "IMG_0661"),
  ],
  "plastic-reflex-v50": [
    ("keyless", f"{KLP}/V50", "DSC_2527"), ("key", f"{KP}/V50", "DSC_6243"),
    ("g01", f"{KLP}/V50", "DSC_4960"), ("g02", f"{KLP}/V50", "DSC_5666"), ("g03", f"{KLP}/V50", "DSC_7192"),
    ("g04", f"{KP}/V50", "DSC_6251"), ("g05", f"{KP}/V50", "DSC_6263"), ("g06", f"{KP}/V50", "REFLEX-3"),
    ("g07", f"{KP}/V50", "DSC_6235"),
  ],
  "aluminium-luggage-case": [
    ("main", LUG, "DSC_0399"),
    ("g01", LUG, "DSC_0385"), ("g02", LUG, "DSC_0670"), ("g03", LUG, "DSC_2046"), ("g04", LUG, "DSC_3067"),
    ("g05", LUG, "DSC_3083"), ("g06", LUG, "DSC_3114"), ("g07", LUG, "DSC_3327"), ("g08", LUG, "DSC_3341"),
    ("g09", LUG, "DSC_3880"), ("g10", LUG, "DSC_3908"), ("g11", LUG, "DSC_7833"), ("g12", LUG, "DSC_9304"),
  ],
}

# Plastic-case colour swatches: (slug, folder). Output: colour-<PU code>.webp
COLOURS = [
  ("plastic-s30", f"{KP}/S30"),
  ("plastic-fusion-v28", f"{KP}/V28/颜色/红灯罩"),
  ("plastic-wizard-v36", f"{KP}/V36/颜色/红灯罩"),
]

def index():
    idx = {}
    for z in glob.glob(os.path.join(SRC, "*.zip")):
        for i in zipfile.ZipFile(z).infolist():
            n = i.filename
            if i.is_dir() or "__MACOSX" in n: continue
            stem, ext = os.path.splitext(os.path.basename(n))
            if ext.lower() not in (".jpg", ".jpeg", ".png"): continue
            idx[(os.path.dirname(n).lower(), stem.lower())] = (z, n)
    return idx

def convert(zpath, member, dest):
    with zipfile.ZipFile(zpath).open(member) as f:
        im = Image.open(f)
        im.draft("RGB", (MAX_SIDE * 2, MAX_SIDE * 2))  # cheap JPEG downscale while decoding
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        im.save(dest, "WEBP", quality=QUALITY, method=5)
    return im.size

if __name__ == "__main__":
    idx = index()
    missing, done = [], 0
    for slug, picks in PICKS.items():
        for name, folder, stem in picks:
            hit = idx.get((folder.lower(), stem.lower()))
            if not hit: missing.append(f"{slug}: {folder}/{stem}"); continue
            convert(*hit, os.path.join(OUT, slug, f"{name}.webp")); done += 1
    for slug, folder in COLOURS:
        for (d, stem), hit in idx.items():
            if d != folder.lower(): continue
            m = re.match(r"pu(\d+[a-z]*)", stem)
            if not m: continue
            convert(*hit, os.path.join(OUT, slug, f"colour-{m.group(1)}.webp")); done += 1
    print("written", done)
    if missing: print("MISSING:\n  " + "\n  ".join(missing))
