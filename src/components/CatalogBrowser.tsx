"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { categoryOrder, products, type CategoryId } from "@/data/products";
import { useI18n } from "@/i18n/provider";
import { productText } from "@/lib/productText";
import { format } from "@/i18n";
import ProductCard from "./ProductCard";

export default function CatalogBrowser() {
  const { locale, t } = useI18n();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = (categoryOrder as string[]).includes(params.get("category") ?? "") ? (params.get("category") as CategoryId) : null;
  const query = params.get("q") ?? "";

  const update = (next: { category?: CategoryId | null; q?: string }) => {
    const sp = new URLSearchParams(params.toString());
    if ("category" in next) {
      if (next.category) sp.set("category", next.category);
      else sp.delete("category");
    }
    if ("q" in next) {
      if (next.q) sp.set("q", next.q);
      else sp.delete("q");
    }
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const pt = productText(t, locale);
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!words.length) return true;
      const haystack = [
        pt.name(p),
        typeof p.name === "string" ? "" : p.name.en,
        ...(p.colours ?? []).map((c) => `${c.code} ${c.label[locale] ?? c.label.en}`),
        p.volume,
        pt.kind(p),
        t.categories[p.category].name,
        pt.desc(p),
        ...p.features.map(pt.feature),
        ...(p.variants ?? []).map((v) => v.label),
        ...(p.specs ?? []).map(pt.specValue),
      ]
        .join(" ")
        .toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [category, query, t, locale]);

  const chip = (active: boolean) =>
    `border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
      active ? "border-brand-red bg-brand-red text-brand-white" : "border-brand-line bg-brand-white hover:border-brand-carbon"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button className={chip(!category)} onClick={() => update({ category: null })}>
            {t.catalog.all}
          </button>
          {categoryOrder.map((c) => (
            <button key={c} className={chip(category === c)} onClick={() => update({ category: c })}>
              {t.categories[c].short}
            </button>
          ))}
        </div>
        <label className="flex w-full items-center gap-2 border border-brand-line bg-brand-white px-3 py-2.5 focus-within:border-brand-carbon lg:w-80">
          <Search size={16} className="text-brand-steel" />
          <input
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={t.common.searchPlaceholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-brand-steel"
          />
          {query && (
            <button aria-label={t.common.close} onClick={() => update({ q: "" })} className="text-brand-steel hover:text-brand-red">
              <X size={14} />
            </button>
          )}
        </label>
      </div>

      {category && <p className="mt-6 text-sm text-brand-steel">{t.categories[category].text}</p>}
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-steel">
        {format(t.catalog.results, { count: results.length })}
      </p>

      {results.length ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-dashed border-brand-line p-10 text-center text-brand-steel">{t.common.noResults}</p>
      )}
    </div>
  );
}
