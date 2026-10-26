"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { href } from "@/lib/paths";
import { productText } from "@/lib/productText";
import { productPhotos, type Product } from "@/data/products";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useI18n();
  const pt = productText(t, locale);
  return (
    <Link
      href={href(locale, `/products/${product.slug}`)}
      className="group flex flex-col border border-brand-line bg-brand-white transition-all hover:-translate-y-0.5 hover:border-brand-carbon hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <ProductImage
          src={productPhotos(product)[0]}
          alt={`${pt.name(product)} — ${pt.kind(product)}`}
          category={product.category}
          comingSoon={t.common.imageComingSoon}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 bg-brand-carbon px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-white">
            <Lock size={10} className="text-brand-red" />
            {t.badges[product.badge]}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-brand-line p-5">
        <span className="eyebrow">{t.categories[product.category].short}</span>
        <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight">{pt.name(product)}</h3>
        <p className="mt-1 text-sm text-brand-steel">{pt.kind(product)}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-brand-carbon/70">
          {product.volume && <span>{product.volume}</span>}
          {product.maxLoadKg && <span>{t.common.maxLoad} {product.maxLoadKg} kg</span>}
        </div>
        <span className="mt-auto flex items-center gap-2 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-red">
          {t.common.viewDetails}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
