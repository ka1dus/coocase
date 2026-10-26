"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Box, Check, KeyRound, Layers, Maximize2, Weight } from "lucide-react";
import { productPhotos, type Product, type Variant } from "@/data/products";
import { useI18n } from "@/i18n/provider";
import { format } from "@/i18n";
import { href } from "@/lib/paths";
import { localize, productText } from "@/lib/productText";
import { useLightbox, type LightboxImage } from "./Lightbox";
import ProductCard from "./ProductCard";
import ProductImage from "./ProductImage";

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { locale, t } = useI18n();
  const pt = productText(t, locale);
  const kind = pt.kind(product);
  const title = pt.name(product);
  const variantLabel = (v: Variant) => (v.note ? `${v.label} · ${pt.note(v.note)}` : v.label);

  // Gallery: product photos, then any variant photos. Empty until images are added.
  const gallery: LightboxImage[] = [];
  const seen = new Set<string>();
  const push = (src: string | undefined, caption?: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    gallery.push({ src, caption });
  };
  productPhotos(product).forEach((src) => push(src, title));
  product.variants?.forEach((v) => push(v.image, variantLabel(v)));

  const [active, setActive] = useState(0);
  const lightbox = useLightbox(gallery);
  const colourLightbox = useLightbox((product.colours ?? []).map((c) => ({ src: c.image, caption: `${localize(locale, c.label)} · ${c.code}` })));
  const current = gallery[active];

  const materialLabel = {
    aluminium: t.product.materialAluminium,
    plastic: t.product.materialPlastic,
    steel: t.product.materialSteel,
    fabric: t.product.materialFabric,
  }[product.material];
  const lockLabel = product.lock && { keyless: t.product.lockKeyless, key: t.product.lockKey, both: t.product.lockBoth }[product.lock];

  const specs = [
    product.volume && { Icon: Box, label: t.common.volume, value: product.volume },
    product.maxLoadKg && {
      Icon: Weight,
      label: t.common.maxLoad,
      value: `${product.maxLoadKg} kg${product.category === "aluminium-sidecase" ? ` ${t.product.perCase}` : ""}`,
    },
    { Icon: Layers, label: t.common.material, value: materialLabel },
    lockLabel && { Icon: KeyRound, label: t.common.lock, value: lockLabel },
  ].filter(Boolean) as { Icon: typeof Box; label: string; value: string }[];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href={href(locale, "/products")}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-steel hover:text-brand-red"
        >
          <ArrowLeft size={14} /> {t.common.backToCatalog}
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="group relative aspect-square w-full overflow-hidden border border-brand-line bg-white">
              {current ? (
                <button onClick={() => lightbox.open(active)} className="absolute inset-0" aria-label={t.common.zoom}>
                  <ProductImage
                    src={current.src}
                    alt={current.caption ?? title}
                    category={product.category}
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain p-8"
                  />
                  <span className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-brand-carbon/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-brand-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 size={12} /> {t.common.zoom}
                  </span>
                </button>
              ) : (
                <ProductImage
                  alt={`${title} — ${kind}`}
                  category={product.category}
                  title={title}
                  subtitle={kind}
                  comingSoon={t.common.imageComingSoon}
                />
              )}
              {product.badge && (
                <span className="absolute left-3 top-3 bg-brand-carbon px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-white">
                  {t.badges[product.badge]}
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
                {gallery.map((g, i) => (
                  <button
                    key={g.src}
                    onClick={() => setActive(i)}
                    aria-label={g.caption ?? `Image ${i + 1}`}
                    className={`relative aspect-square overflow-hidden border bg-white transition-colors ${
                      i === active ? "border-brand-red" : "border-brand-line hover:border-brand-carbon"
                    }`}
                  >
                    <ProductImage src={g.src} alt="" category={product.category} sizes="96px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="eyebrow">{t.categories[product.category].name}</p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">{title}</h1>
            <p className="mt-2 text-lg text-brand-steel">{kind}</p>
            <p className="mt-6 leading-relaxed text-brand-carbon/80">{pt.desc(product)}</p>

            <dl className="mt-8 grid grid-cols-2 gap-3">
              {specs.map(({ Icon, label, value }) => (
                <div key={label} className="flex gap-3 border border-brand-line p-4">
                  <Icon size={18} className="mt-0.5 shrink-0 text-brand-red" />
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-steel">{label}</dt>
                    <dd className="mt-1 text-sm font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em]">{t.product.features}</h2>
            <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {product.features.map((f) => {
                const text = pt.feature(f);
                return (
                  <li key={text} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand-red" />
                    {text}
                  </li>
                );
              })}
            </ul>

            {product.specs && product.specs.length > 0 && (
              <>
                <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em]">{t.product.detailsTitle}</h2>
                <dl className="mt-4 divide-y divide-brand-line border-y border-brand-line">
                  {product.specs.map((s) => (
                    <div key={s.label.en} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5 text-sm">
                      <dt className="text-brand-steel">{localize(locale, s.label)}</dt>
                      <dd className="font-medium">{pt.specValue(s)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`${href(locale, "/contact")}?product=${product.slug}`}
                className="inline-flex items-center gap-3 bg-brand-red px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-brand-white transition-colors hover:bg-brand-red-dark"
              >
                {t.product.inquire} <ArrowRight size={14} />
              </Link>
            </div>
            <p className="mt-6 border-l-2 border-brand-red pl-3 text-xs leading-relaxed text-brand-steel">{t.common.patentNotice}</p>
          </div>
        </div>
      </div>

      {/* Sizes & versions */}
      {product.variants && product.variants.length > 0 && (
        <section className="border-t border-brand-line bg-brand-mist py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold uppercase">{t.product.sizesTitle}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {product.variants.map((v, i) => {
                const tile = (
                  <>
                    <div className="relative aspect-[4/3] bg-white">
                      <ProductImage
                        src={v.image}
                        alt={variantLabel(v)}
                        category={product.category}
                        compact
                        sizes="(min-width: 1024px) 16vw, 50vw"
                        className="object-contain p-3"
                      />
                    </div>
                    <div className="border-t border-brand-line px-3 py-2.5">
                      <p className="font-display text-lg font-bold">{v.label}</p>
                      {v.note && <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-red">{pt.note(v.note)}</p>}
                    </div>
                  </>
                );
                return v.image ? (
                  <button
                    key={`${v.label}-${i}`}
                    onClick={() => lightbox.open(gallery.findIndex((g) => g.src === v.image))}
                    className="border border-brand-line bg-brand-white text-left transition-colors hover:border-brand-carbon"
                  >
                    {tile}
                  </button>
                ) : (
                  <div key={`${v.label}-${i}`} className="border border-brand-line bg-brand-white">
                    {tile}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Colour options */}
      {product.colours && product.colours.length > 0 && (
        <section className="border-t border-brand-line py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold uppercase">{t.product.coloursTitle}</h2>
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {product.colours.map((c, i) => (
                <button
                  key={c.code}
                  onClick={() => colourLightbox.open(i)}
                  className="border border-brand-line bg-brand-white text-left transition-colors hover:border-brand-carbon"
                >
                  <div className="relative aspect-square bg-white">
                    <ProductImage src={c.image} alt={localize(locale, c.label)} category={product.category} sizes="(min-width: 1024px) 12vw, 33vw" className="object-contain p-2" />
                  </div>
                  <div className="border-t border-brand-line px-2 py-2">
                    <p className="text-xs font-semibold leading-tight">{localize(locale, c.label)}</p>
                    <p className="font-mono text-[10px] text-brand-steel">{c.code}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-brand-line py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow">{format(t.product.relatedEyebrow, { category: t.categories[product.category].short })}</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase">{t.product.related}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {lightbox.element}
      {colourLightbox.element}
    </>
  );
}
