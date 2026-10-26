"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { useI18n } from "@/i18n/provider";
import ProductCard from "../ProductCard";

/** Horizontally scrolling row of product cards with arrow controls. */
export default function ProductCarousel({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 24), behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2">
        <button aria-label={t.common.previous} onClick={() => scroll(-1)} className="flex h-11 w-11 items-center justify-center border border-brand-line bg-brand-white hover:border-brand-carbon">
          <ChevronLeft size={18} />
        </button>
        <button aria-label={t.common.next} onClick={() => scroll(1)} className="flex h-11 w-11 items-center justify-center bg-brand-carbon text-brand-white hover:bg-brand-red">
          <ChevronRight size={18} />
        </button>
      </div>
      <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8">
        {products.map((p) => (
          <div key={p.slug} data-card className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[31%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
