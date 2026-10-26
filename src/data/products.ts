/**
 * ════════════════════════════════════════════════════════════════════════════
 *  COOCASE PRODUCT CATALOGUE — the single place to add or change products.
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Products follow the supplier photo archives in catalogue/ (one product per
 *  case style and lock type, with sizes as versions). Photos are generated from
 *  those archives by scripts/catalogue-photos.py into public/products/<slug>/.
 *
 *  ADD A PRODUCT: copy the template below into the `products` list and fill it in.
 *
 *    {
 *      slug: "my-new-case",                 // URL: /en/products/my-new-case (unique, lowercase, dashes)
 *      name: { en: "My New Case", zh: "新款箱" },   // or a plain string for model names like "Fusion V28"
 *      category: "aluminium-topcase",       // see `categoryOrder` below
 *      kind: "keylessTopcase",              // a key from the dictionaries, or { en: "…" }
 *      desc: { en: "Short description shown on the product page." },
 *      volume: "30 – 65 L",                 // optional, shown on cards
 *      maxLoadKg: 10,                       // optional
 *      material: "aluminium",               // aluminium | plastic | steel | fabric
 *      lock: "keyless",                     // optional: keyless | key | both
 *      features: ["keyless", "waterproof", { en: "Any new feature text" }],
 *      variants: [{ label: "45L", image: photo("my-new-case", "45l") }],
 *      specs: [{ label: { en: "Dimensions" }, value: "450 × 380 × 320 mm" }],
 *      images: photos("my-new-case", "main", "g01", "g02"),
 *    },
 *
 *  TEXT: `name`, `kind`, `desc`, `features` and variant `note` accept either a key that
 *  already has translations in src/i18n/dictionaries/*.ts, or inline text
 *  { en: "…", zh: "…", … }. Missing languages fall back to English.
 *
 *  IMAGES: files live in public/products/<slug>/ and are listed in `images`
 *  (the first one is the main photo). Anything without a photo shows a branded
 *  "image coming soon" placeholder.
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
  /** Size / version code, e.g. "45L". Not translated. */
  label: string;
  image?: string;
  note?: VariantNote | LocalizedText;
}

export interface Colour {
  /** Supplier colour code, e.g. "PU1355". */
  code: string;
  label: LocalizedText;
  image: string;
}

export interface Spec {
  label: LocalizedText;
  value: string | LocalizedText;
}

export interface Product {
  slug: string;
  /** Product title. Plain strings (model names) are shown as-is in every language. */
  name: string | LocalizedText;
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
  /** Colour options (plastic cases). */
  colours?: Colour[];
  /** Extra detail rows for the product page. */
  specs?: Spec[];
  badge?: BadgeKey;
  /** Shown in the keyless section on the home page. */
  featured?: boolean;
}

export const categoryOrder: CategoryId[] = ["aluminium-topcase", "aluminium-sidecase", "plastic-topcase", "specialty"];

/** Optional cover photo per category on the home page. Falls back to the category's first product photo. */
export const categoryImages: Partial<Record<CategoryId, string>> = {
  "aluminium-topcase": "/products/keyless-aluminium-top-case/g01.webp",
  "aluminium-sidecase": "/products/key-aluminium-side-cases/g02.webp",
  "plastic-topcase": "/products/plastic-astra-s48/keyless.webp",
  specialty: "/products/keyless-wheel-top-case/g04.webp",
};

/**
 * Optional stock photos per category for products that have no `images` yet.
 * Empty now that every product has real photos; products without photos show
 * the "image coming soon" placeholder instead.
 */
export const placeholderPhotos: Partial<Record<CategoryId, string[]>> = {};

// ── Helpers ──────────────────────────────────────────────────────────────────
export const photo = (slug: string, name: string) => `/products/${slug}/${name}.webp`;
export const photos = (slug: string, ...names: string[]) => names.map((n) => photo(slug, n));
const gallery = (slug: string, count: number) =>
  photos(slug, ...Array.from({ length: count }, (_, i) => `g${String(i + 1).padStart(2, "0")}`));
/** One variant per size, each with its own studio photo named after the size (e.g. "45l"). */
const sized = (slug: string, ...labels: string[]): Variant[] =>
  labels.map((label) => ({ label, image: photo(slug, label.toLowerCase()) }));

const ALU_TOP: FeatureKey[] = ["aviationAluminium", "germanHardware", "waterproof", "shockproof", "siliconeSeal", "softLiner", "camo"];
const ALU_SIDE: FeatureKey[] = ["aviationAluminium", "germanHardware", "waterproof", "shockproof", "compressionCorners", "triangleHandles"];

const SIDE_OPENING: LocalizedText = {
  en: "A top case whose lid also opens to the side, so you can reach your gear without unloading anything strapped on top. Aviation-grade aluminium, German-made hardware and a soft, shock-absorbing liner.",
  es: "Un baúl cuya tapa también se abre lateralmente, para llegar a tus cosas sin descargar lo que llevas amarrado encima. Aluminio aeronáutico, herrajes alemanes y un forro suave y amortiguador.",
  zh: "箱盖除可上开外还能侧开，无需卸下绑在箱顶的物品即可取放随身物品。航空级铝合金、德国五金，配柔软减震内衬。",
  it: "Un bauletto il cui coperchio si apre anche lateralmente, per raggiungere il contenuto senza togliere ciò che è fissato sopra. Alluminio aeronautico, minuteria tedesca e interno morbido e ammortizzante.",
  fr: "Un top case dont le couvercle s'ouvre aussi sur le côté : accédez à vos affaires sans détacher ce qui est sanglé dessus. Aluminium aéronautique, quincaillerie allemande et doublure souple amortissante.",
  id: "Top box yang tutupnya juga bisa dibuka dari samping, sehingga barang bisa diambil tanpa menurunkan muatan yang diikat di atasnya. Aluminium kelas penerbangan, komponen buatan Jerman, dan lapisan dalam peredam guncangan.",
  ja: "フタが上だけでなく横にも開くトップケース。上に積んだ荷物を降ろさずに中身を出し入れできます。航空機グレードのアルミ、ドイツ製ハードウェア、柔らかい衝撃吸収インナー付き。",
};

const WHEEL_KEY: LocalizedText = {
  en: "Detachable wheels and a trolley handle turn this key-lock aluminium top case into a rolling suitcase, so heavy luggage moves easily once you're off the bike.",
  es: "Las ruedas desmontables y el asa trolley convierten este baúl de aluminio con llave en una maleta con ruedas, para mover el equipaje pesado con facilidad al bajar de la moto.",
  zh: "可拆卸滚轮与拉杆让这款钥匙锁铝合金尾箱秒变行李箱，下车后也能轻松拖行重物。",
  it: "Ruote rimovibili e maniglia trolley trasformano questo bauletto in alluminio con chiave in un trolley: i bagagli pesanti scorrono facilmente appena sceso dalla moto.",
  fr: "Des roues amovibles et une poignée trolley transforment ce top case aluminium à clé en valise à roulettes : vos bagages lourds roulent facilement dès que vous descendez de moto.",
  id: "Roda lepas-pasang dan gagang troli mengubah top box aluminium berkunci ini menjadi koper beroda, sehingga barang berat mudah ditarik setelah turun dari motor.",
  ja: "脱着式ホイールとキャリーハンドルで、このキー式アルミトップケースがキャリーケースに。バイクを降りた後も重い荷物をラクに運べます。",
};

const LUGGAGE: LocalizedText = {
  en: "Aluminium-alloy trolley suitcases with spinner wheels and a telescopic handle, in a wide range of colours and graphics. Built with the same materials and finish as COOCASE motorcycle cases.",
  es: "Maletas trolley de aleación de aluminio con ruedas giratorias y asa telescópica, en una amplia gama de colores y gráficos. Fabricadas con los mismos materiales y acabados que las maletas para moto COOCASE.",
  zh: "铝合金拉杆行李箱，配万向轮与伸缩拉杆，提供多种颜色与图案，采用与 COOCASE 摩托车箱相同的材料与工艺。",
  it: "Trolley in lega di alluminio con ruote piroettanti e maniglia telescopica, in molti colori e grafiche. Stessi materiali e finiture delle valigie moto COOCASE.",
  fr: "Valises trolley en alliage d'aluminium avec roues pivotantes et poignée télescopique, dans un large choix de couleurs et de graphismes. Mêmes matériaux et finitions que les valises moto COOCASE.",
  id: "Koper troli paduan aluminium dengan roda putar dan gagang teleskopik, tersedia dalam banyak warna dan grafis. Dibuat dengan bahan dan finishing yang sama seperti box motor COOCASE.",
  ja: "360度回転ホイールと伸縮ハンドルを備えたアルミ合金製スーツケース。豊富なカラーとグラフィック。COOCASE のバイク用ケースと同じ素材と仕上げです。",
};

// Plastic-case colour palette (supplier PU codes) — names from the photo files.
const PALETTE: Record<string, LocalizedText> = {
  "1355": { en: "Bright orange", zh: "亮橙", es: "Naranja brillante", it: "Arancio brillante", fr: "Orange vif", id: "Oranye cerah", ja: "ブライトオレンジ" },
  "1478": { en: "Fluorescent green", zh: "荧光草绿", es: "Verde flúor", it: "Verde fluo", fr: "Vert fluo", id: "Hijau neon", ja: "蛍光グリーン" },
  "148sm": { en: "Matte black", zh: "磨砂黑", es: "Negro mate", it: "Nero opaco", fr: "Noir mat", id: "Hitam doff", ja: "マットブラック" },
  "1647": { en: "Bright silver", zh: "亮银", es: "Plata brillante", it: "Argento brillante", fr: "Argent brillant", id: "Perak cerah", ja: "ブライトシルバー" },
  "2415": { en: "Bright blue", zh: "亮蓝", es: "Azul brillante", it: "Blu brillante", fr: "Bleu vif", id: "Biru cerah", ja: "ブライトブルー" },
  "4325": { en: "Pink", zh: "粉红", es: "Rosa", it: "Rosa", fr: "Rose", id: "Merah muda", ja: "ピンク" },
  "4432": { en: "Beige", zh: "米黄", es: "Beige", it: "Beige", fr: "Beige", id: "Krem", ja: "ベージュ" },
  "4490": { en: "Pearl white", zh: "珍珠白", es: "Blanco perla", it: "Bianco perla", fr: "Blanc nacré", id: "Putih mutiara", ja: "パールホワイト" },
  "5221": { en: "Light blue", zh: "浅蓝", es: "Azul claro", it: "Azzurro", fr: "Bleu clair", id: "Biru muda", ja: "ライトブルー" },
  "5853": { en: "Metallic grey", zh: "金属灰", es: "Gris metalizado", it: "Grigio metallizzato", fr: "Gris métallisé", id: "Abu-abu metalik", ja: "メタリックグレー" },
  "5854": { en: "Sparkle black", zh: "闪光黑", es: "Negro brillante", it: "Nero glitterato", fr: "Noir pailleté", id: "Hitam berkilau", ja: "スパークルブラック" },
  "5855": { en: "Pearl yellow", zh: "珠光黄", es: "Amarillo perla", it: "Giallo perla", fr: "Jaune nacré", id: "Kuning mutiara", ja: "パールイエロー" },
  "5857": { en: "Wine red", zh: "酒红", es: "Rojo vino", it: "Rosso vino", fr: "Bordeaux", id: "Merah anggur", ja: "ワインレッド" },
  "5859": { en: "Translucent blue", zh: "透明蓝", es: "Azul translúcido", it: "Blu trasparente", fr: "Bleu translucide", id: "Biru transparan", ja: "クリアブルー" },
  "6090": { en: "Sparkle red", zh: "闪鲜红", es: "Rojo brillante", it: "Rosso glitterato", fr: "Rouge pailleté", id: "Merah berkilau", ja: "スパークルレッド" },
  "7156": { en: "Snow white", zh: "冰雪白", es: "Blanco nieve", it: "Bianco neve", fr: "Blanc neige", id: "Putih salju", ja: "スノーホワイト" },
};
const colours = (slug: string, ...codes: string[]): Colour[] =>
  codes.map((c) => ({ code: `PU${c.replace(/[a-z]+$/, "")}`, label: PALETTE[c], image: photo(slug, `colour-${c}`) }));

type PlasticVersions = { keyless?: boolean; key?: boolean; remote?: boolean };
const plastic = (slug: string, name: string, volume: number, v: PlasticVersions, galleryCount: number, extra: Partial<Product> = {}): Product => ({
  slug,
  name,
  category: "plastic-topcase",
  kind: "plasticKeyless",
  desc: "plastic",
  images: [photo(slug, v.keyless ? "keyless" : "key"), ...gallery(slug, galleryCount)],
  volume: `${volume} L`,
  maxLoadKg: 10,
  material: "plastic",
  lock: v.keyless && v.key ? "both" : v.keyless ? "keyless" : "key",
  features: [
    ...(v.keyless ? (["keyless"] as FeatureKey[]) : []),
    ...(v.key ? (["keyLock"] as FeatureKey[]) : []),
    ...(v.remote ? (["remoteControl"] as FeatureKey[]) : []),
    "ledBrakeLight", "waterproof", "shockproof",
  ],
  variants: [
    ...(v.keyless ? [{ label: name, image: photo(slug, "keyless"), note: "keyless" as const }] : []),
    ...(v.key ? [{ label: name, image: photo(slug, "key"), note: "keyLock" as const }] : []),
    ...(v.remote ? [{ label: `${name} L`, image: photo(slug, "remote"), note: "remote" as const }] : []),
  ],
  badge: v.keyless ? "keyless" : undefined,
  ...extra,
});

// ── Catalogue ────────────────────────────────────────────────────────────────
export const products: Product[] = [
  // Aluminium top cases
  {
    slug: "keyless-aluminium-top-case",
    name: { en: "Keyless Aluminium Top Case", zh: "无钥匙铝合金尾箱", es: "Baúl de aluminio sin llave", it: "Bauletto in alluminio senza chiave", fr: "Top case aluminium sans clé", id: "Top Box Aluminium Tanpa Kunci", ja: "キーレス アルミトップケース" },
    category: "aluminium-topcase",
    kind: "keylessTopcase",
    desc: "keylessTop",
    images: [photo("keyless-aluminium-top-case", "45l"), ...gallery("keyless-aluminium-top-case", 10)],
    volume: "32 – 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["keyless", "twoHelmets", ...ALU_TOP],
    variants: sized("keyless-aluminium-top-case", "32L", "36L", "45L", "55L", "65L"),
    badge: "keyless",
    featured: true,
  },
  {
    slug: "keyless-tass-backrest-top-case",
    name: { en: "Keyless TASS Backrest Top Case", zh: "无钥匙 TASS 靠背尾箱", es: "Baúl TASS con respaldo, sin llave", it: "Bauletto TASS con schienale, senza chiave", fr: "Top case TASS à dosseret, sans clé", id: "Top Box TASS dengan Sandaran, Tanpa Kunci", ja: "キーレス TASS バックレスト付きトップケース" },
    category: "aluminium-topcase",
    kind: "backrestTopcase",
    desc: "tass",
    images: [photo("keyless-tass-backrest-top-case", "g01"), photo("keyless-tass-backrest-top-case", "ab55l"), ...gallery("keyless-tass-backrest-top-case", 8).slice(1)],
    volume: "55 / 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["integratedBackrest", "keyless", ...ALU_TOP],
    variants: sized("keyless-tass-backrest-top-case", "AB55L", "AB65L"),
    badge: "integratedBackrest",
    featured: true,
  },
  {
    slug: "keyless-side-opening-top-case",
    name: { en: "Keyless Side-Opening Top Case", zh: "无钥匙侧开尾箱", es: "Baúl de apertura lateral, sin llave", it: "Bauletto ad apertura laterale, senza chiave", fr: "Top case à ouverture latérale, sans clé", id: "Top Box Buka Samping Tanpa Kunci", ja: "キーレス サイドオープン トップケース" },
    category: "aluminium-topcase",
    kind: "keylessTopcase",
    desc: SIDE_OPENING,
    images: [photo("keyless-side-opening-top-case", "so45l"), ...gallery("keyless-side-opening-top-case", 6)],
    volume: "45 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["keyless", ...ALU_TOP],
    variants: [{ label: "SO45L", image: photo("keyless-side-opening-top-case", "so45l"), note: "sideOpen" }],
    badge: "keyless",
    featured: true,
  },
  {
    slug: "key-aluminium-top-case",
    name: { en: "Aluminium Top Case (Key Lock)", zh: "铝合金尾箱（钥匙锁）", es: "Baúl de aluminio (con llave)", it: "Bauletto in alluminio (con chiave)", fr: "Top case aluminium (à clé)", id: "Top Box Aluminium (Kunci)", ja: "アルミトップケース（キー式）" },
    category: "aluminium-topcase",
    kind: "topcase",
    desc: "classicTop",
    images: [photo("key-aluminium-top-case", "45l"), ...gallery("key-aluminium-top-case", 9)],
    volume: "27 – 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["keyLock", "twoHelmets", ...ALU_TOP],
    variants: sized("key-aluminium-top-case", "27L", "30L", "32L", "36L", "45L", "55L", "65L"),
    badge: "camo",
  },
  {
    slug: "key-tass-backrest-top-case",
    name: { en: "TASS Backrest Top Case (Key Lock)", zh: "TASS 靠背尾箱（钥匙锁）", es: "Baúl TASS con respaldo (con llave)", it: "Bauletto TASS con schienale (con chiave)", fr: "Top case TASS à dosseret (à clé)", id: "Top Box TASS dengan Sandaran (Kunci)", ja: "TASS バックレスト付きトップケース（キー式）" },
    category: "aluminium-topcase",
    kind: "backrestTopcase",
    desc: "tass",
    images: [photo("key-tass-backrest-top-case", "g01"), ...gallery("key-tass-backrest-top-case", 9).slice(1)],
    volume: "45 – 65 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["integratedBackrest", "keyLock", ...ALU_TOP],
    variants: [
      ...sized("key-tass-backrest-top-case", "AB45L", "AB55L", "AB65L"),
      { label: "ABSO45L", image: photo("key-tass-backrest-top-case", "abso45l"), note: "sideOpen" },
    ],
    badge: "integratedBackrest",
  },
  {
    slug: "key-side-opening-top-case",
    name: { en: "Side-Opening Top Case (Key Lock)", zh: "侧开尾箱（钥匙锁）", es: "Baúl de apertura lateral (con llave)", it: "Bauletto ad apertura laterale (con chiave)", fr: "Top case à ouverture latérale (à clé)", id: "Top Box Buka Samping (Kunci)", ja: "サイドオープン トップケース（キー式）" },
    category: "aluminium-topcase",
    kind: "topcase",
    desc: SIDE_OPENING,
    images: [photo("key-side-opening-top-case", "so45l"), ...gallery("key-side-opening-top-case", 7)],
    volume: "45 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["keyLock", ...ALU_TOP],
    variants: [{ label: "SO45L", image: photo("key-side-opening-top-case", "so45l"), note: "sideOpen" }],
  },

  // Aluminium side cases
  {
    slug: "keyless-aluminium-side-cases",
    name: { en: "Keyless Aluminium Side Cases", zh: "无钥匙铝合金边箱", es: "Maletas laterales de aluminio sin llave", it: "Valigie laterali in alluminio senza chiave", fr: "Valises latérales aluminium sans clé", id: "Side Box Aluminium Tanpa Kunci", ja: "キーレス アルミサイドケース" },
    category: "aluminium-sidecase",
    kind: "keylessSidecase",
    desc: "keylessSide",
    images: [photo("keyless-aluminium-side-cases", "36l"), ...gallery("keyless-aluminium-side-cases", 6)],
    volume: "28 / 36 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["keyless", ...ALU_SIDE],
    variants: sized("keyless-aluminium-side-cases", "28L", "36L"),
    badge: "keyless",
    featured: true,
  },
  {
    slug: "keyless-38l-dual-use-case",
    name: { en: "Keyless 38L Dual-Use Case", zh: "无钥匙 38L 两用箱", es: "Maleta de doble uso 38 L, sin llave", it: "Valigia 38L a doppio uso, senza chiave", fr: "Valise double usage 38 L, sans clé", id: "Box Dua Fungsi 38L Tanpa Kunci", ja: "キーレス 38L 2WAYケース" },
    category: "aluminium-sidecase",
    kind: "dualUse",
    desc: "dualUse",
    images: [photo("keyless-38l-dual-use-case", "38l"), ...gallery("keyless-38l-dual-use-case", 9)],
    volume: "38 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["keyless", ...ALU_SIDE],
    variants: sized("keyless-38l-dual-use-case", "38L"),
    badge: "keyless",
    featured: true,
  },
  {
    slug: "key-aluminium-side-cases",
    name: { en: "Aluminium Side Cases (Key Lock)", zh: "铝合金边箱（钥匙锁）", es: "Maletas laterales de aluminio (con llave)", it: "Valigie laterali in alluminio (con chiave)", fr: "Valises latérales aluminium (à clé)", id: "Side Box Aluminium (Kunci)", ja: "アルミサイドケース（キー式）" },
    category: "aluminium-sidecase",
    kind: "sidecase",
    desc: "classicSide",
    images: [photo("key-aluminium-side-cases", "g01"), ...gallery("key-aluminium-side-cases", 9).slice(1)],
    volume: "24 – 46 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["keyLock", "camo", ...ALU_SIDE],
    variants: sized("key-aluminium-side-cases", "24L", "28L", "36L", "46L"),
    badge: "camo",
  },

  // Plastic top cases
  plastic("plastic-vivo-s28", "Vivo S28", 28, { keyless: true, key: true }, 5),
  plastic("plastic-s30", "S30", 28, { keyless: true, key: true }, 6, {
    colours: colours("plastic-s30", "1355", "1478", "1647", "2415", "4325", "4432", "4490", "5221", "5853", "5854", "5855", "5857", "5859", "6090", "7156"),
  }),
  plastic("plastic-urban-s40", "Urban S40", 40, { key: true }, 5),
  plastic("plastic-astra-s48", "Astra S48", 48, { keyless: true, key: true, remote: true }, 6),
  plastic("plastic-fusion-v28", "Fusion V28", 28, { keyless: true, key: true }, 6, {
    colours: colours("plastic-fusion-v28", "1355", "1478", "148sm", "1647", "4325", "4432", "4490", "5221", "5853", "5854", "5855", "5857", "6090", "7156"),
  }),
  plastic("plastic-wizard-v36", "Wizard V36", 36, { keyless: true, key: true, remote: true }, 6, {
    colours: colours("plastic-wizard-v36", "1355", "1478", "148sm", "1647", "2415", "4325", "4432", "4490", "5221", "5853", "5854", "5855", "5857", "5859", "6090", "7156"),
  }),
  plastic("plastic-reflex-v50", "Reflex V50", 50, { keyless: true, key: true }, 7),

  // Specialty luggage
  {
    slug: "keyless-wheel-top-case",
    name: { en: "Keyless Detachable-Wheel Case", zh: "无钥匙可拆滚轮箱", es: "Maleta con ruedas desmontables, sin llave", it: "Valigia con ruote rimovibili, senza chiave", fr: "Valise à roues amovibles, sans clé", id: "Box Roda Lepas-Pasang Tanpa Kunci", ja: "キーレス 脱着式ホイールケース" },
    category: "specialty",
    kind: "wheelCase",
    desc: "wheel",
    images: [photo("keyless-wheel-top-case", "58l"), photo("keyless-wheel-top-case", "g01"), ...gallery("keyless-wheel-top-case", 9).slice(1)],
    volume: "48 / 58 / 68 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "keyless",
    features: ["detachableWheels", "keyless", "aviationAluminium", "germanHardware", "waterproof", "shockproof"],
    variants: sized("keyless-wheel-top-case", "48L", "58L", "68L"),
    badge: "detachableWheels",
    featured: true,
  },
  {
    slug: "key-wheel-top-case",
    name: { en: "Detachable-Wheel Case (Key Lock)", zh: "可拆滚轮箱（钥匙锁）", es: "Maleta con ruedas desmontables (con llave)", it: "Valigia con ruote rimovibili (con chiave)", fr: "Valise à roues amovibles (à clé)", id: "Box Roda Lepas-Pasang (Kunci)", ja: "脱着式ホイールケース（キー式）" },
    category: "specialty",
    kind: "wheelCase",
    desc: WHEEL_KEY,
    images: [photo("key-wheel-top-case", "g03"), photo("key-wheel-top-case", "g01"), photo("key-wheel-top-case", "48l"), photo("key-wheel-top-case", "g02"), ...gallery("key-wheel-top-case", 10).slice(3)],
    volume: "48 / 58 / 68 L",
    maxLoadKg: 10,
    material: "aluminium",
    lock: "key",
    features: ["detachableWheels", "keyLock", "aviationAluminium", "germanHardware", "waterproof", "shockproof"],
    variants: sized("key-wheel-top-case", "48L", "58L", "68L"),
    badge: "detachableWheels",
  },
  {
    slug: "aluminium-luggage-case",
    name: { en: "Aluminium Luggage Case", zh: "铝合金行李箱", es: "Maleta trolley de aluminio", it: "Valigia trolley in alluminio", fr: "Valise trolley en aluminium", id: "Koper Aluminium", ja: "アルミ スーツケース" },
    category: "specialty",
    kind: "customCase",
    desc: LUGGAGE,
    images: [photo("aluminium-luggage-case", "g05"), photo("aluminium-luggage-case", "g04"), photo("aluminium-luggage-case", "main"), ...gallery("aluminium-luggage-case", 12).filter((g) => !/g0[45]/.test(g))],
    material: "aluminium",
    features: ["aviationAluminium", "camo", "customisable"],
    badge: "camo",
  },
];

/** The product's own photos, or the optional stock photos for its category. */
export function productPhotos(p: Product): string[] {
  if (p.images?.length) return p.images;
  const pool = placeholderPhotos[p.category] ?? [];
  if (!pool.length) return [];
  // Rotate the pool so neighbouring products in a category don't all start with the same photo.
  const n = products.filter((x) => x.category === p.category).findIndex((x) => x.slug === p.slug) % pool.length;
  return [...pool.slice(n), ...pool.slice(0, n)];
}

export const isPlaceholderPhoto = (src: string) => Object.values(placeholderPhotos).some((pool) => pool?.includes(src));

export function categoryPhoto(c: CategoryId) {
  return categoryImages[c] ?? productPhotos(products.find((p) => p.category === c)!)[0];
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
