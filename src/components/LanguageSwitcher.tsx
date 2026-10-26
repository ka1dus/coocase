"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { switchLocalePath } from "@/lib/paths";

function Switcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const choose = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const qs = search.toString();
    router.push(switchLocalePath(pathname, next) + (qs ? `?${qs}` : ""));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${localeNames[locale].native}`}
        className="flex h-10 items-center gap-1.5 px-2 transition-colors hover:text-brand-red"
      >
        <Globe size={18} />
        <span className="font-mono text-xs uppercase tracking-widest">{locale}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.language}
          className="absolute right-0 top-full mt-2 w-60 border border-brand-line bg-brand-white py-1 shadow-xl"
        >
          <li className="px-4 pb-2 pt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-brand-steel">{t.nav.language}</li>
          {locales.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === locale}
                lang={localeNames[l].htmlLang}
                onClick={() => choose(l)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-brand-mist ${
                  l === locale ? "text-brand-red" : "text-brand-carbon"
                }`}
              >
                <span>
                  <span className="font-medium">{localeNames[l].native}</span>
                  {localeNames[l].native !== localeNames[l].english && (
                    <span className="ml-2 text-xs text-brand-steel">{localeNames[l].english}</span>
                  )}
                </span>
                {l === locale && <Check size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LanguageSwitcher() {
  return (
    <Suspense fallback={<div className="h-10 w-16" />}>
      <Switcher />
    </Suspense>
  );
}
