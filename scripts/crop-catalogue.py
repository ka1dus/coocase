"""
Extracts product / lifestyle images from the catalogue spreads.
Usage: python3 scripts/crop-catalogue.py <dir-with-imageN.png> public/images
The source spreads are 1595x1081 PNGs exported from the 2026-2027 catalogue (.docx).
Re-run after replacing spreads with higher-resolution exports for sharper images.
"""
import sys, os
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

def same(prefix, img, boxes):
    return {f"{prefix}/{k}": (img, b) for k, b in boxes.items()}

TOP_VARIANTS = {"30": (60,485,195,585), "32": (420,480,560,585), "36": (60,695,195,805),
                "45": (415,695,560,805), "55": (50,900,200,1012), "65": (395,895,580,1012)}
KL_SIDE = {"main": (865,165,1185,410), "28": (865,590,1025,705), "36s": (1215,585,1400,710)}

C = {
    "brand/logo": (1, (0,0,160,158)),
    # lifestyle
    "life/fuji-cover": (1, (905,195,1595,1081)),
    "life/sakura-cover": (1, (0,195,495,968)),
    "life/sakura-rear": (31, (800,85,1595,1081)),
    "life/sakura-side": (38, (800,90,1545,1081)),
    "life/fuji-lake": (35, (800,90,1595,1081)),
    "life/expo": (45, (800,0,1595,1081)),
    "life/38kl-open": (7, (850,637,1543,1022)),
    "life/scooter-plastic": (7, (400,350,797,540)),
    "life/c004-a": (8, (850,785,1192,1010)), "life/c004-b": (8, (1200,785,1543,1010)),
    "life/c006-a": (15, (850,785,1192,1010)), "life/c006-b": (15, (1200,785,1543,1010)),
    "life/c007-a": (22, (850,785,1192,1010)), "life/c007-b": (22, (1200,785,1543,1010)),
    "life/mini": (31, (57,680,518,1032)),
    "life/stamping-c": (32, (63,765,352,998)), "life/stamping-x": (32, (860,765,1150,998)),
    "life/tass-1": (33, (798,0,1196,252)), "life/tass-2": (33, (1198,0,1595,252)),
    "life/tass-3": (33, (798,255,1196,515)), "life/tass-4": (33, (798,568,1196,823)),
    "life/tass-5": (33, (798,825,1595,1081)),
    "life/wheel": (34, (798,575,1496,1081)),
    "life/plastic": (47, (0,300,797,1081)),
    "life/backrest-scooter": (36, (1200,632,1522,1000)),
    # features
    "feat/anatomy": (6, (390,205,885,605)),
    "feat/waterproof": (6, (50,165,235,295)), "feat/pressure": (6, (50,372,235,500)),
    "feat/smart-bottom": (6, (50,548,235,682)), "feat/double-frame": (6, (1085,270,1180,410)),
    "feat/silent-catch": (6, (1076,528,1180,682)), "feat/organizer": (6, (1360,240,1530,385)),
    "feat/liner": (6, (1360,410,1530,525)), "feat/xband": (6, (1375,553,1530,682)),
    "feat/keyless-lock": (39, (72,855,255,978)), "feat/lock-4th": (39, (307,855,490,978)),
    "feat/lock-3rd": (39, (542,855,725,978)),
    # factory
    "factory/robot": (49, (75,120,490,515)), "factory/robot-2": (49, (500,228,737,515)),
    "factory/press": (49, (75,560,670,955)), "factory/laser": (49, (872,192,1467,515)),
    "factory/laser-machine": (49, (1255,108,1524,255)), "factory/bending": (49, (872,655,1467,978)),
    # products
    "p/38kl/main": (7, (860,160,1265,365)), "p/38kl/38": (7, (862,505,988,592)),
    "p/38kl/38s": (7, (1208,465,1358,598)),
    "p/classic-top/c004": (30, (58,118,267,302)), "p/classic-top/c006": (30, (293,118,502,302)),
    "p/classic-top/c007": (30, (528,118,737,302)),
    "p/classic-side/c004": (30, (853,123,1072,302)), "p/classic-side/c006": (30, (1088,123,1307,302)),
    "p/classic-side/c007": (30, (1318,113,1537,302)),
    "p/classic-side/24": (30, (868,468,1012,592)), "p/classic-side/28": (30, (1223,478,1387,592)),
    "p/classic-side/36": (30, (863,678,1022,802)), "p/classic-side/46": (30, (1216,678,1392,802)),
    "p/classic-side/36s": (30, (873,888,1182,1012)), "p/classic-side/46s": (30, (1213,888,1522,1012)),
    "p/mini/main": (31, (52,108,348,268)), "p/mini/27": (31, (393,178,552,272)),
    "p/mini/17": (31, (52,402,218,508)), "p/mini/27b": (31, (272,402,438,508)),
    "p/mini/20": (31, (492,408,648,508)),
    "p/stamping-c/main": (32, (62,152,503,312)), "p/stamping-c/45": (32, (58,508,258,592)),
    "p/stamping-c/55": (32, (398,503,658,592)), "p/stamping-c/65": (32, (398,773,692,867)),
    "p/stamping-x/main": (32, (858,228,1172,422)), "p/stamping-x/45": (32, (858,612,992,712)),
    "p/stamping-x/55": (32, (1208,603,1362,717)), "p/stamping-x/65": (32, (1198,853,1372,967)),
    "p/tass/main": (33, (58,143,722,392)), "p/tass/45": (33, (62,428,348,565)),
    "p/tass/55": (33, (412,428,698,565)), "p/tass/so45": (33, (62,748,348,892)),
    "p/tass/65": (33, (412,743,698,887)),
    "p/wheel/48": (34, (58,172,192,412)), "p/wheel/58": (34, (298,145,437,412)),
    "p/wheel/68": (34, (538,128,672,412)), "p/wheel/detail": (34, (798,138,1522,552)),
    "p/custom2/22": (34, (95,672,175,828)), "p/custom2/90": (34, (292,648,413,828)),
    "p/custom2/160": (34, (562,648,663,828)),
    "acc/divider-in-case": (36, (58,148,702,402)), "acc/inner-bag-side": (36, (72,493,248,692)),
    "acc/inner-bag-top": (36, (298,500,692,692)), "acc/divider-bag": (36, (72,838,332,977)),
    "acc/premium-backrest": (36, (848,153,1162,277)), "acc/economic-backrest": (36, (1203,153,1512,277)),
    "acc/thermal-bag": (36, (868,393,1012,592)), "acc/ab-base": (36, (1228,398,1527,522)),
    "racks/type-a": (40, (55,165,702,625)), "racks/type-c": (40, (858,138,1537,367)),
    "racks/type-b": (40, (868,643,1522,1037)), "racks/u03": (40, (398,733,702,972)),
    "racks/base-q-j2": (39, (78,583,252,767)), "racks/base-stamping-c": (39, (310,583,487,767)),
    "racks/base-economic": (39, (876,583,1052,767)), "racks/base-x": (39, (1108,583,1284,767)),
    "combo/q-j2": (39, (88,200,242,328)), "combo/stamping-c": (39, (322,200,478,328)),
    "combo/stamping-x": (39, (552,200,712,328)), "combo/economic": (39, (888,200,1042,328)),
    "combo/x-series": (39, (1118,200,1272,328)),
    "plastic/fusion-v28": (46, (72,262,208,382)), "plastic/wizard-v36": (46, (422,262,558,382)),
    "plastic/vivo-s28": (46, (72,537,208,657)), "plastic/astra-s48": (46, (407,532,573,657)),
    "plastic/s30": (46, (72,812,208,937)), "plastic/reflex-v50": (46, (407,807,573,937)),
    "plastic/fusion-v28-push": (46, (867,262,1003,382)), "plastic/urban-s40": (46, (1222,267,1358,382)),
    "plastic/vivo-s28-push": (46, (867,537,1003,657)), "plastic/astra-s48-push": (46, (1202,532,1368,657)),
    "plastic/wizard-v36-push": (46, (867,812,1003,937)), "plastic/reflex-v50-push": (46, (1202,802,1368,937)),
    "plastic/acc-backrest": (47, (878,158,1302,302)), "plastic/acc-liner": (47, (878,578,1302,732)),
    "plastic/acc-brakelight": (47, (878,828,1090,984)), "plastic/acc-scooter": (47, (1138,838,1547,1081)),
    "display/jumbo": (48, (65,150,732,465)), "display/4": (48, (65,575,390,995)),
    "display/6": (48, (406,575,732,995)), "display/3a": (48, (861,150,1529,465)),
    "display/3b": (48, (861,575,1529,995)),
    "docs/colour-chart-1": (37, (0,90,1595,1050)), "docs/colour-chart-2": (38, (0,90,797,1050)),
    "docs/fitment-1": (41, (0,0,797,1081)), "docs/fitment-2": (42, (0,0,1595,1081)),
    "docs/fitment-3": (43, (0,0,1595,1081)), "docs/fitment-4": (44, (0,0,1595,1081)),
    "docs/network": (50, (0,0,1595,1081)),
}
for series, img in (("c004", 8), ("c006", 15), ("c007", 22)):
    C[f"p/{series}-top/main"] = (img, (55,115,405,385))
    for k, b in TOP_VARIANTS.items(): C[f"p/{series}-top/{k}"] = (img, b)
    for k, b in KL_SIDE.items(): C[f"p/{series}-side/{k}"] = (img, b)
for k, b in TOP_VARIANTS.items(): C[f"p/classic-top/{k}"] = (30, b)
rows = [(108,227),(238,357),(368,487),(503,617),(633,752),(763,882),(888,1007)]
for i, (y0, y1) in enumerate(rows, 1):
    C[f"p/reflective/{i}"] = (35, (122,y0,275,y1))
    C[f"p/reflective/{i}-night"] = (35, (522,y0,673,y1))

# Product photos now come from real image files (see README → Products), so only
# the brand logo, lifestyle and factory photos are extracted from the catalogue.
KEEP = ("brand", "life", "factory")
C = {k: v for k, v in C.items() if k.split("/")[0] in KEEP}

# regions (in spread coordinates) painted white to drop overlapping catalogue text/icons
WHITEOUT = {
    "p/tass/main": [(405,158,700,198)],
    "p/wheel/detail": [(1070,150,1335,232)],
    "p/classic-side/36s": [(1040,862,1160,918)],
    "p/classic-side/46s": [(1398,862,1522,918)],
    "racks/base-q-j2": [(55,565,120,610)], "racks/base-stamping-c": [(290,565,355,610)],
}
from PIL import ImageDraw
cache = {}
for name, (img, box) in C.items():
    if img not in cache: cache[img] = Image.open(os.path.join(SRC, f"image{img}.png")).convert("RGB")
    src = cache[img]
    if name in WHITEOUT:
        src = src.copy(); d = ImageDraw.Draw(src)
        for r in WHITEOUT[name]: d.rectangle(r, fill="white")
    im = src.crop(box)
    path = os.path.join(OUT, name + (".png" if name == "brand/logo" else ".webp"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if name == "brand/logo": im.save(path)
    else: im.save(path, "WEBP", quality=88, method=6)
print(len(C), "images written")
