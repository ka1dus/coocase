import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { LocalizedText, Product, Spec, Variant } from "@/data/products";

/** Picks the current language from inline text, falling back to English. */
export const localize = (locale: Locale, text: LocalizedText) => text[locale] ?? text.en;

const fromTable = <K extends string>(table: Record<K, string>, locale: Locale, v: K | LocalizedText) =>
  typeof v === "string" ? table[v] : localize(locale, v);

/** Translated text accessors for a product (dictionary keys or inline text). */
export function productText(t: Dictionary, locale: Locale) {
  return {
    name: (p: Product) => (typeof p.name === "string" ? p.name : localize(locale, p.name)),
    kind: (p: Product) => fromTable(t.kinds, locale, p.kind),
    desc: (p: Product) => fromTable(t.descs, locale, p.desc),
    feature: (f: Product["features"][number]) => fromTable(t.features, locale, f),
    note: (n: NonNullable<Variant["note"]>) => fromTable(t.variantNotes, locale, n),
    specValue: (s: Spec) => (typeof s.value === "string" ? s.value : localize(locale, s.value)),
  };
}
