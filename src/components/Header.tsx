"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { href } from "@/lib/paths";
import LanguageSwitcher from "./LanguageSwitcher";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <Image src="/images/brand/logo.png" alt="COOCASE logo" width={32} height={32} className="h-8 w-8" priority />
      <span className={`font-display text-2xl font-bold tracking-wide ${dark ? "text-brand-white" : "text-brand-carbon"}`}>
        COO<span className="text-brand-red">CASE</span>
      </span>
    </span>
  );
}

export default function Header() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const links = [
    { path: "/", label: t.nav.home },
    { path: "/products", label: t.nav.catalog },
    { path: "/distributors", label: t.nav.distributors },
    { path: "/about", label: t.nav.about },
    { path: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const isActive = (path: string) => {
    const full = href(locale, path);
    return path === "/" ? pathname === full : pathname.startsWith(full);
  };

  return (
    <header className="sticky top-0 z-[1000] border-b border-brand-line bg-brand-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={href(locale)} aria-label="COOCASE home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.path}
              href={href(locale, l.path)}
              className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:text-brand-red ${
                isActive(l.path) ? "text-brand-red" : "text-brand-carbon"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label={t.nav.search}
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-brand-carbon transition-colors hover:text-brand-red"
          >
            <Search size={20} />
          </button>
          <LanguageSwitcher />
          <button
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-brand-carbon lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-brand-line bg-brand-white">
          <form
            className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`${href(locale, "/products")}${query ? `?q=${encodeURIComponent(query)}` : ""}`);
            }}
          >
            <Search size={18} className="text-brand-steel" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-brand-steel"
            />
            <button type="button" aria-label={t.common.close} onClick={() => setSearchOpen(false)} className="text-brand-steel hover:text-brand-red">
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="border-t border-brand-line bg-brand-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.path}
                href={href(locale, l.path)}
                className={`border-b border-brand-line py-4 font-mono text-sm uppercase tracking-[0.2em] last:border-0 ${
                  isActive(l.path) ? "text-brand-red" : "text-brand-carbon"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
