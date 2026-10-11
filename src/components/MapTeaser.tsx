"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { distributors } from "@/data/distributors";
import { useI18n } from "@/i18n/provider";
import { format } from "@/i18n";
import { href } from "@/lib/paths";
import DynamicMap from "./map/DynamicMap";

export default function MapTeaser({ count }: { count: number }) {
  const { locale, t } = useI18n();
  return (
    <div className="relative">
      <div className="relative z-0 aspect-[4/3] overflow-hidden border border-brand-white/10 sm:aspect-[16/10]">
        <DynamicMap items={distributors} scrollWheelZoom={false} initialZoom={1} minZoom={1} />
      </div>
      <Link
        href={href(locale, "/distributors")}
        className="absolute bottom-4 left-4 z-[500] flex items-center gap-2 bg-brand-white px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-carbon shadow-lg transition-colors hover:bg-brand-red hover:text-brand-white"
      >
        {format(t.distributors.count, { count: distributors.length })} · {count} {t.home.statCountries}
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}
