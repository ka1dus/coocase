"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { href } from "@/lib/paths";
import { productText } from "@/lib/productText";
import { productPhotos, type Product } from "@/data/products";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { locale, t } = useI18n();
  const pt = productText(t, locale);
  const [first, second] = productPhotos(product);
  const name = pt.name(product);
  const sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw";

  return (
    <Link href={href(locale, `/products/${product.slug}`)} className="group flex flex-col">
      <div className="stage relative aspect-[4/3] overflow-hidden">
        <ProductImage
          src={first}
          alt={`${name} — ${pt.kind(product)}`}
          category={product.category}
          comingSoon={t.common.imageComingSoon}
          sizes={sizes}
          priority={priority}
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Second photo fades in on hover, like a turntable view. */}
        {second && (
          <Image
            src={second}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <span className="absolute left-0 top-4 bg-brand-carbon px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-white">
            {t.badges[product.badge]}
          </span>
        )}
        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center bg-brand-red text-brand-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="flex flex-1 flex-col border-b border-brand-line pb-5 pt-5 transition-colors group-hover:border-brand-red">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-steel">{t.categories[product.category].short}</span>
        <h3 className="mt-2 font-display text-[1.35rem] font-bold uppercase leading-tight transition-colors group-hover:text-brand-red">{name}</h3>
        <p className="mt-1 text-sm text-brand-steel">{pt.kind(product)}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 font-mono text-[11px] uppercase tracking-wider text-brand-carbon/70">
          {product.volume && <span>{product.volume}</span>}
          {product.volume && product.maxLoadKg && <span className="h-1 w-1 bg-brand-red" />}
          {product.maxLoadKg && <span>{t.common.maxLoad} {product.maxLoadKg} kg</span>}
        </div>
      </div>
    </Link>
  );
}
