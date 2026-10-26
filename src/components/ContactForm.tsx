"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Send } from "lucide-react";
import { company } from "@/data/company";
import { products } from "@/data/products";
import { useI18n } from "@/i18n/provider";
import { productText } from "@/lib/productText";

/**
 * There is no backend yet, so submitting opens the visitor's email app with the
 * message pre-filled. To collect messages server-side later, replace `submit`
 * with a POST to a form service (Formspree, Resend, etc.) or an API route.
 */
export default function ContactForm() {
  const { locale, t } = useI18n();
  const pt = productText(t, locale);
  const params = useSearchParams();
  const initialInterest =
    params.get("interest") === "distributor"
      ? "distributor"
      : products.some((p) => p.slug === params.get("product"))
        ? params.get("product")!
        : "general";
  const [interest, setInterest] = useState(initialInterest);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const product = products.find((p) => p.slug === interest);
    const subject =
      interest === "distributor"
        ? t.contact.distributor
        : product
          ? `${pt.name(product)} — ${pt.kind(product)}`
          : t.contact.general;
    const line = (label: string, key: string) => (f.get(key) ? [`${label}: ${f.get(key)}`] : []);
    const body = [
      ...line(t.contact.name, "name"),
      ...line(t.contact.email, "email"),
      ...line(t.contact.phone, "phone"),
      ...line(t.contact.country, "country"),
      `${t.contact.interest}: ${subject}`,
      "",
      String(f.get("message")),
    ].join("\n");
    window.location.href = `mailto:${company.emails.join(",")}?subject=${encodeURIComponent(`[COOCASE] ${subject}`)}&body=${encodeURIComponent(body)}`;
  };

  const label = "font-mono text-[10px] uppercase tracking-[0.2em] text-brand-steel";
  const input = "mt-2 w-full border border-brand-line bg-brand-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-carbon";
  const req = <span className="text-brand-red" aria-label={t.contact.required}> *</span>;

  return (
    <form onSubmit={submit} className="grid gap-5 border border-brand-line bg-brand-mist p-6 sm:grid-cols-2 sm:p-8">
      <label className="block">
        <span className={label}>{t.contact.name}{req}</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className="block">
        <span className={label}>{t.contact.email}{req}</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block">
        <span className={label}>{t.contact.phone}</span>
        <input name="phone" type="tel" autoComplete="tel" className={input} />
      </label>
      <label className="block">
        <span className={label}>{t.contact.country}</span>
        <input name="country" autoComplete="country-name" className={input} />
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>{t.contact.interest}</span>
        <select value={interest} onChange={(e) => setInterest(e.target.value)} className={input}>
          <option value="general">{t.contact.general}</option>
          <option value="distributor">{t.contact.distributor}</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {pt.name(p)}
            </option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>{t.contact.message}{req}</span>
        <textarea name="message" required rows={6} placeholder={t.contact.messagePlaceholder} className={`${input} resize-y`} />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center gap-3 bg-brand-red px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-brand-white transition-colors hover:bg-brand-red-dark"
        >
          {t.contact.send} <Send size={14} />
        </button>
        <p className="mt-3 text-xs text-brand-steel">{t.contact.note}</p>
      </div>
    </form>
  );
}
