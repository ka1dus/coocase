"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { href } from "@/lib/paths";
import { categoryOrder } from "@/data/products";
import { company } from "@/data/company";
import { Logo } from "./Header";

export default function Footer() {
  const { locale, t } = useI18n();
  const heading = "mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-brand-white/50";
  const link = "text-sm text-brand-white/70 transition-colors hover:text-brand-red";

  return (
    <footer className="bg-brand-carbon text-brand-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-white/60">{t.footer.tagline}</p>
        </div>

        <div>
          <h3 className={heading}>{t.footer.catalog}</h3>
          <ul className="space-y-3">
            {categoryOrder.map((c) => (
              <li key={c}>
                <Link href={`${href(locale, "/products")}?category=${c}`} className={link}>
                  {t.categories[c].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>{t.footer.company}</h3>
          <ul className="space-y-3">
            <li><Link href={href(locale, "/about")} className={link}>{t.nav.about}</Link></li>
            <li><Link href={href(locale, "/distributors")} className={link}>{t.nav.distributors}</Link></li>
            <li><Link href={href(locale, "/contact")} className={link}>{t.nav.contact}</Link></li>
            <li><Link href={href(locale, "/products")} className={link}>{t.home.fullCatalog}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={heading}>{t.footer.hq}</h3>
          <p className="text-sm font-semibold">VASIX</p>
          <p className="mt-1 text-sm text-brand-white/60">{company.offices[0].address}</p>
          <ul className="mt-4 space-y-1">
            {company.emails.map((e) => (
              <li key={e}>
                <a href={`mailto:${e}`} className={link}>{e}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-white/40 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} COOCASE. {t.footer.rights}</span>
          <span>{t.footer.founded}</span>
        </div>
      </div>
    </footer>
  );
}
