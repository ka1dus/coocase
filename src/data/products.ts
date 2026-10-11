/**
 * ════════════════════════════════════════════════════════════════════════════
 *  COOCASE PRODUCT CATALOGUE — the single place to add or change products.
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  ADD A PRODUCT: copy the template below into the `products` list and fill it in.
 *
 *    {
 *      slug: "my-new-case",                 // URL: /en/products/my-new-case (unique, lowercase, dashes)
 *      model: "Q-J2-C008",                  // product title (model names are not translated)
 *      category: "aluminium-topcase",       // see `categoryOrder` below
 *      kind: { en: "Aluminium-alloy keyless topcase", zh: "铝合金无钥匙尾箱" },
 *      desc: { en: "Short description shown on the product page." },
 *      volume: "30 – 65 L",                 // optional, shown on cards
 *      maxLoadKg: 10,                       // optional
 *      material: "aluminium",               // aluminium | plastic | steel | fabric
 *      lock: "keyless",                     // optional: keyless | key | both
 *      features: ["keyless", "waterproof", { en: "Any new feature text" }],
 *      variants: [{ label: "45KL" }, { label: "55KL", image: "/products/my-new-case/55.jpg" }],
 *      specs: [{ label: { en: "Dimensions" }, value: "450 × 380 × 320 mm" }],
 *      images: ["/products/my-new-case/main.jpg", "/products/my-new-case/side.jpg"],
 *    },
 *
 *  TEXT: `kind`, `desc`, `features` and variant `note` accept either
 *    • a key that already has translations in src/i18n/dictionaries/*.ts (e.g. "keyless"), or
 *    • inline text: { en: "…" } — add zh / it / fr / id / ja whenever you have them.
 *      Missing languages fall back to English automatically.
 *
 *  IMAGES: put files in public/products/<slug>/ and list them in `images`
 *  (the first one is the main photo). Products, variants and categories without
 *  images show a branded "image coming soon" placeholder, so everything is optional.
 *
 *  EXTRA DETAILS: add rows to `specs` (dimensions, weight, colours, fitment…).
 */
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

export type CategoryId = keyof Dictionary["categories"];
export type KindKey = keyof Dictionary["kinds"];
export type DescKey = keyof Dictionary["descs"];
export type FeatureKey = keyof Dictionary["features"];
export type VariantNote = keyof Dictionary["variantNotes"];
export type BadgeKey = keyof Dictionary["badges"];

/** Inline translated text. English is required; other languages fall back to it. */
export type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, "en">, string>>;

export interface Variant {
  /** Size / version code, e.g. "45KL". Not translated. */
  label: string;
  image?: string;
  note?: VariantNote | LocalizedText;
}

export interface Spec {
  label: LocalizedText;
  value: string | LocalizedText;
}

export interface Product {
  slug: string;
  model: string;
  category: CategoryId;
  kind: KindKey | LocalizedText;
  desc: DescKey | LocalizedText;
  /** Photos; the first is the main image. Empty → placeholder. */
  images?: string[];
  /** Size range shown on cards, e.g. "30 – 65 L". */
  volume?: string;
  maxLoadKg?: number;
  material: "aluminium" | "plastic" | "steel" | "fabric";
  lock?: "keyless" | "key" | "both";
  features: (FeatureKey | LocalizedText)[];
  variants?: Variant[];
  /** Extra detail rows for the product page. */
  specs?: Spec[];
  badge?: BadgeKey;
  /** Shows the list of motorcycle brands covered by COOCASE racks. */
  fitmentList?: boolean;
  /** Shown in the "keyless COO-Series" section on the home page. */
  featured?: boolean;
}

export const categoryOrder: CategoryId[] = [
  "aluminium-topcase",
  "aluminium-sidecase",
  "plastic-topcase",
  "specialty",
  "racks-accessories",
  "dealer-display",
];

/** Optional cover photo per category on the home page. Falls back to `placeholderPhotos`. */
export const categoryImages: Partial<Record<CategoryId, string>> = {};

/**
 * TEMPORARY stock photos (from the previous COOCASE site), shown for any product
 * that has no `images` yet. As soon as a product gets its own `images`, these stop
 * showing for it. Set this to {} to show "image coming soon" panels instead.
 */
const STOCK = "/products/_placeholders";
export const placeholderPhotos: Partial<Record<CategoryId, string[]>> = {
  "aluminium-topcase": [`${STOCK}/cruiser-road.jpg`, `${STOCK}/sport-red.jpg`, `${STOCK}/electric-wall.jpg`],
  "aluminium-sidecase": [`${STOCK}/sport-blue.jpg`, `${STOCK}/sport-yellow.jpg`],
  "plastic-topcase": [`${STOCK}/sport-white.jpg`, `${STOCK}/sport-blue.jpg`],
  specialty: [`${STOCK}/electric-wall.jpg`, `${STOCK}/cruiser-road.jpg`],
  "racks-accessories": [`${STOCK}/sport-yellow.jpg`, `${STOCK}/sport-white.jpg`],
  "dealer-display": [`${STOCK}/sport-yellow.jpg`, `${STOCK}/cruiser-road.jpg`],
};

export const isPlaceholderPhoto = (src: string) => src.startsWith(`${STOCK}/`);

const sizes = (...labels: string[]): Variant[] => labels.map((label) => ({ label }));

const KEYLESS_TOP: FeatureKey[] = [
  "keyless", "aviationAluminium", "germanHardware", "waterproof", "shockproof",
  "siliconeSeal", "softLiner", "twoHelmets", "camo",
];
const KEYLESS_SIDE: FeatureKey[] = [
  "keyless", "aviationAluminium", "germanHardware", "waterproof", "shockproof",
  "compressionCorners", "triangleHandles", "sShape",
];

function keylessSeries(code: "C004" | "C006" | "C007"): Product[] {
  const id = code.toLowerCase();
  return [
    {
      slug: `q-j2-${id}-keyless-topcase`,
      model: `Q-J2-${code}`,
      category: "aluminium-topcase",
      kind: "keylessTopcase",
      desc: "keylessTop",
      volume: "30 – 65 L",
      maxLoadKg: 10,
      material: "aluminium",
      lock: "keyless",
      features: KEYLESS_TOP,
      variants: sizes("30KL", "32KL", "36RKL", "45KL", "55KL", "65KL"),
      badge: "keyless",
      featured: true,
    },
    {
      slug: `q-j2-${id}-keyless-sidecase`,
      model: `Q-J2-${code}`,
      category: "aluminium-sidecase",
      kind: "keylessSidecase",
      desc: "keylessSide",
      volume: "28 / 36 L",
      maxLoadKg: 10,
      material: "aluminium",
      lock: "keyless",
      features: KEYLESS_SIDE,
      variants: [{ label: "28KL" }, { label: "36KL" }, { label: "36KL", note: "sShape" }],
      badge: "keyless",
      featured: true,
    },
  ];
}

const plastic = (slug: string, model: string, volume: number, versions: { keyless?: boolean; push?: boolean }): Product => ({
  slug,
  model,
  category: "plastic-topcase",
  kind: "plasticKeyless",
  desc: "plastic",
  volume: `${volume} L`,
  maxLoadKg: 10,
  material: "plastic",
  lock: versions.keyless && versions.push ? "both" : versions.keyless ? "keyless" : "key",
  features: [
    ...(versions.keyless ? (["keyless"] as FeatureKey[]) : []),
    ...(versions.push ? (["pushButton", "remoteControl"] as FeatureKey[]) : []),
    "ledBrakeLight", "waterproof", "shockproof",
  ],
  variants: [
    ...(versions.keyless ? [{ label: model, note: "keyless" as const }] : []),
    ...(versions.push ? [{ label: model, note: "push" as const }] : []),
  ],
  badge: versions.keyless ? "keyless" : "pushButton",
});

const [c004Top, c004Side] = keylessSeries("C004");
const [c006Top, c006Side] = keylessSeries("C006");
const [c007Top, c007Side] = keylessSeries("C007");

export const products: Product[] = [
  // ── Aluminium topcases ──────────────────────────────────────────────────────
  c004Top,
  c006Top,
  c007Top,
  {
    slug: "q-j2-stamping-c",
    model: "Q-J2-Stamping-C",
    category: "aluminium-topcase",
    kind: "keylessTopcase",
    desc: "stampingC",
    volume: "36 – 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["keyless", "debossed", "aviationAluminium", "germanHardware", "waterproof", "shockproof", "twoHelmets", "softLiner"],
    variants: sizes("36KL", "45KL", "55KL", "65KL"),
    badge: "debossed",
  },
  {
    slug: "q-j2-stamping-x",
    model: "Q-J2-Stamping-X",
    category: "aluminium-topcase",
    kind: "topcase",
    desc: "stampingX",
    volume: "45 / 55 / 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["debossed", "aviationAluminium", "germanHardware", "waterproof", "shockproof", "twoHelmets", "softLiner"],
    variants: sizes("45L", "55L", "65L"),
    badge: "debossed",
  },
  {
    slug: "q-j2-tass-adjustable-backrest",
    model: "Q-J2 TASS",
    category: "aluminium-topcase",
    kind: "backrestTopcase",
    desc: "tass",
    volume: "45 / 55 / 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["integratedBackrest", "keyless", "aviationAluminium", "germanHardware", "waterproof", "shockproof", "twoHelmets"],
    variants: [{ label: "AB45KL" }, { label: "AB55KL" }, { label: "AB65KL" }, { label: "So45KL", note: "sideOpen" }],
    badge: "integratedBackrest",
  },
  {
    slug: "q-j2-38kl-dual-use",
    model: "Q-J2-38KL",
    category: "aluminium-topcase",
    kind: "dualUse",
    desc: "dualUse",
    volume: "38 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["keyless", "aviationAluminium", "germanHardware", "waterproof", "shockproof", "compressionCorners", "triangleHandles", "sShape"],
    variants: [{ label: "38KL" }, { label: "38KL", note: "sShape" }],
    badge: "keyless",
  },
  {
    slug: "q-j2-coo-topcase",
    model: "Q-J2-C004 / C006 / C007",
    category: "aluminium-topcase",
    kind: "topcase",
    desc: "classicTop",
    volume: "30 – 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["keyLock", "aviationAluminium", "germanHardware", "waterproof", "shockproof", "twoHelmets", "softLiner", "quickRelease", "camo"],
    variants: [{ label: "30L", note: "quickRelease" }, ...sizes("32L", "36L", "45L", "55L", "65L")],
    badge: "camo",
  },
  {
    slug: "reflective-series-topcase",
    model: "Reflective Series",
    category: "aluminium-topcase",
    kind: "reflectiveTopcase",
    desc: "reflective",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["reflective", "aviationAluminium", "waterproof", "shockproof", "customisable"],
    variants: sizes("#1", "#2", "#3", "#4", "#5", "#6", "#7"),
    badge: "reflective",
  },

  // ── Aluminium sidecases ─────────────────────────────────────────────────────
  c004Side,
  c006Side,
  c007Side,
  {
    slug: "q-j2-coo-sidecase",
    model: "Q-J2-C004 / C006 / C007",
    category: "aluminium-sidecase",
    kind: "sidecase",
    desc: "classicSide",
    volume: "24 – 46 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["keyLock", "aviationAluminium", "germanHardware", "waterproof", "shockproof", "compressionCorners", "triangleHandles", "sShape"],
    variants: [
      ...sizes("24L", "28L", "36L"),
      { label: "36L", note: "sShape" },
      { label: "46L" },
      { label: "46L", note: "sShape" },
    ],
  },
  {
    slug: "mini-series",
    model: "MINI Series",
    category: "aluminium-sidecase",
    kind: "miniCase",
    desc: "mini",
    volume: "15 – 27 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["customisable", "quickRelease", "compressionCorners", "triangleHandles", "germanHardware", "waterproof", "shockproof"],
    variants: [
      ...sizes("15L", "17L", "19L"),
      { label: "20L", note: "quickRelease" },
      { label: "27L" },
      { label: "27L", note: "quickRelease" },
    ],
    badge: "customisable",
  },

  // ── Plastic topcases ────────────────────────────────────────────────────────
  plastic("plastic-fusion-v28", "Fusion V28", 28, { keyless: true, push: true }),
  plastic("plastic-wizard-v36", "Wizard V36", 36, { keyless: true, push: true }),
  plastic("plastic-vivo-s28", "Vivo S28", 28, { keyless: true, push: true }),
  plastic("plastic-astra-s48", "Astra S48", 48, { keyless: true, push: true }),
  plastic("plastic-reflex-v50", "Reflex V50", 50, { keyless: true, push: true }),
  plastic("plastic-urban-s40", "Urban S40", 40, { push: true }),
  plastic("plastic-s30", "S30", 28, { keyless: true }),

  // ── Specialty luggage ───────────────────────────────────────────────────────
  {
    slug: "detachable-wheel-keyless-case",
    model: "Detachable Wheel Case",
    category: "specialty",
    kind: "wheelCase",
    desc: "wheel",
    volume: "48 / 58 / 68 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["detachableWheels", "keyless", "aviationAluminium", "germanHardware", "shockproof"],
    variants: sizes("48L", "58L", "68L"),
    badge: "detachableWheels",
  },
  {
    slug: "custom-series-2",
    model: "Custom Series 2",
    category: "specialty",
    kind: "customCase",
    desc: "custom2",
    volume: "22 / 90 / 160 L",
    maxLoadKg: 10,
    material: "aluminium",
    features: ["customisable", "foam", "aviationAluminium", "germanHardware", "shockproof"],
    variants: sizes("22L", "90L", "160L"),
    badge: "customisable",
  },

  // ── Racks & accessories ─────────────────────────────────────────────────────
  {
    slug: "model-specific-racks",
    model: "COOCASE Rack Series",
    category: "racks-accessories",
    kind: "rack",
    desc: "modelRacks",
    material: "steel",
    features: ["universalFit", "stainless", "quickAssembly"],
    fitmentList: true,
    badge: "universalFit",
  },
  {
    slug: "u03-multifunctional-side-racks",
    model: "U-03 Side Racks",
    category: "racks-accessories",
    kind: "rack",
    desc: "sideRack",
    maxLoadKg: 25,
    material: "steel",
    features: ["stainless", "quickAssembly", "universalFit"],
    badge: "universalFit",
  },
  {
    slug: "universal-racks",
    model: "Universal Racks A / B / C / D",
    category: "racks-accessories",
    kind: "rack",
    desc: "universalRacks",
    material: "steel",
    features: ["universalFit", "quickAssembly"],
    variants: sizes("Type A", "Type B", "Type C", "Type D"),
  },
  {
    slug: "topcase-base-plates",
    model: "Base Plates & Locks",
    category: "racks-accessories",
    kind: "accessory",
    desc: "basePlates",
    material: "steel",
    features: ["universalFit", "keyless"],
    variants: sizes("Q-J2", "Q-J2-Stamping-C", "Q-J2-Stamping-X", "Q-J2-Economic", "X-Series", "Keyless lock", "4th gen lock", "3rd gen lock"),
  },
  {
    slug: "inner-and-divider-bags",
    model: "Inner & Divider Bags",
    category: "racks-accessories",
    kind: "accessory",
    desc: "bags",
    material: "fabric",
    features: ["multiPocket", "shockproof"],
    variants: sizes("Inner bag 28 / 36L", "Inner bag 45 / 55 / 65L", "Divider bag", "Thermal bag"),
  },
  {
    slug: "backrests",
    model: "Backrests & AB Base",
    category: "racks-accessories",
    kind: "accessory",
    desc: "backrests",
    material: "steel",
    features: ["integratedBackrest", "universalFit"],
    variants: sizes("Premium", "Economic", "AB base"),
  },
  {
    slug: "plastic-topcase-accessories",
    model: "Plastic Topcase Accessories",
    category: "racks-accessories",
    kind: "accessory",
    desc: "plasticAcc",
    material: "plastic",
    features: ["ledBrakeLight"],
    variants: sizes("Backrest A / B / C", "Inner liner", "Brake light"),
  },

  // ── Dealer display racks ────────────────────────────────────────────────────
  {
    slug: "dealer-display-racks",
    model: "Display Racks",
    category: "dealer-display",
    kind: "display",
    desc: "display",
    material: "steel",
    features: ["quickAssembly"],
    variants: sizes("Jumbo 7–13", "3 cases A", "3 cases B", "4 cases", "6 cases"),
  },
];

export const rackBrands = [
  "BMW", "Benelli", "CFMoto", "Ducati", "Gilera", "Honda", "Kawasaki", "Kove", "KTM", "Kymco",
  "LML", "Peugeot", "Piaggio", "QJMotor", "Royal Enfield", "Suzuki", "SYM", "Triumph", "Voge",
  "Yamaha", "Zongshen", "Zontes",
];

/** The product's own photos, or the temporary stock photos for its category. */
export function productPhotos(p: Product): string[] {
  if (p.images?.length) return p.images;
  const pool = placeholderPhotos[p.category] ?? [];
  if (!pool.length) return [];
  // Rotate the pool so neighbouring products in a category don't all start with the same photo.
  const n = products.filter((x) => x.category === p.category).findIndex((x) => x.slug === p.slug) % pool.length;
  return [...pool.slice(n), ...pool.slice(0, n)];
}

export function categoryPhoto(c: CategoryId) {
  return categoryImages[c] ?? placeholderPhotos[c]?.[0];
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
