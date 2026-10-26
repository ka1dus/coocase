"use client";

import { useMemo, useState } from "react";
import type { LatLngBoundsExpression } from "leaflet";
import Link from "next/link";
import { Building2, Factory, Globe2, Mail, MapPin, Navigation, Phone, RotateCcw, Search, Store, X } from "lucide-react";
import { distributors, regions, type Distributor, type Region } from "@/data/distributors";
import { useI18n } from "@/i18n/provider";
import { format } from "@/i18n";
import { href } from "@/lib/paths";
import DynamicMap from "./map/DynamicMap";

const typeIcon = { hq: Building2, office: Building2, factory: Factory, distributor: Store };

const split = (value: string, sep: string | RegExp) =>
  value
    .split(sep)
    .map((v) => v.trim())
    .filter(Boolean);

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function DistributorsExplorer() {
  const { locale, t } = useI18n();
  const [region, setRegion] = useState<Region | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [target, setTarget] = useState<{ bounds?: LatLngBoundsExpression; point?: [number, number]; zoom?: number; key: number }>();

  const visible = useMemo(
    () => (region === "all" ? distributors : distributors.filter((d) => d.region === region)),
    [region],
  );

  // COOCASE's own locations first, then named distributors, then countries without a listed company;
  // alphabetical by country within each group. The search box filters the list only.
  const rank = (d: Distributor) => (d.type !== "distributor" ? 0 : d.name ? 1 : 2);
  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible
      .filter((d) => !q || [d.country, d.city, d.name, d.address].join(" ").toLowerCase().includes(q))
      .sort((a, b) => rank(a) - rank(b) || a.country.localeCompare(b.country));
  }, [visible, query]);

  const title = (d: Distributor) => d.name || t.distributors.types[d.type];

  const pickRegion = (r: Region | "all") => {
    setRegion(r);
    setSelectedId(null);
    const items = r === "all" ? distributors : distributors.filter((d) => d.region === r);
    const lats = items.map((d) => d.lat);
    const lngs = items.map((d) => d.lng);
    setTarget({
      bounds: [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      key: Date.now(),
    });
  };

  const select = (d: Distributor) => {
    setSelectedId(d.id);
    setTarget({ point: [d.lat, d.lng], zoom: d.address ? 12 : 5, key: Date.now() });
  };

  const renderPopup = (d: Distributor) => (
    <div className="min-w-48 text-brand-carbon">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-red">{t.distributors.types[d.type]}</p>
      <p className="mt-1 text-sm font-semibold">{d.name || `COOCASE · ${d.country}`}</p>
      <p className="text-xs text-brand-steel">
        {d.city}, {d.country}
      </p>
      {d.address && <p className="mt-2 text-xs">{d.address}</p>}
      <div className="mt-2 space-y-1 text-xs">
        {d.email && (
          <a href={`mailto:${d.email}`} className="flex items-center gap-1.5 !text-brand-carbon hover:!text-brand-red">
            <Mail size={12} /> {d.email}
          </a>
        )}
        {split(d.phone, "/").map((p) => (
          <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 !text-brand-carbon hover:!text-brand-red">
            <Phone size={12} /> {p}
          </a>
        ))}
        {split(d.website, /\s+/).map((w) => (
          <a key={w} href={w} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 !text-brand-carbon hover:!text-brand-red">
            <Globe2 size={12} /> {hostname(w)}
          </a>
        ))}
        {!d.name && (
          <Link href={`${href(locale, "/contact")}?interest=general`} className="flex items-center gap-1.5 !text-brand-red hover:underline">
            <Mail size={12} /> {t.distributors.askLocal}
          </Link>
        )}
        <a
          href={`https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lng}#map=13/${d.lat}/${d.lng}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 !text-brand-carbon hover:!text-brand-red"
        >
          <Navigation size={12} /> {t.distributors.directions}
        </a>
      </div>
    </div>
  );

  const chip = (active: boolean) =>
    `border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
      active ? "border-brand-red bg-brand-red text-brand-white" : "border-brand-line bg-brand-white hover:border-brand-carbon"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button className={chip(region === "all")} onClick={() => pickRegion("all")}>
          {t.distributors.all}
        </button>
        {regions.map((r) => (
          <button key={r} className={chip(region === r)} onClick={() => pickRegion(r)}>
            {t.distributors.regions[r]}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-0 border border-brand-line lg:grid-cols-[360px_1fr]">
        <aside className="order-2 flex max-h-[600px] flex-col border-brand-line lg:order-1 lg:border-r">
          <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em]">{t.distributors.listTitle}</h2>
            <span className="font-mono text-[11px] text-brand-steel">{format(t.distributors.count, { count: sorted.length })}</span>
          </div>
          <label className="flex items-center gap-2 border-b border-brand-line px-5 py-3 focus-within:bg-brand-mist">
            <Search size={14} className="shrink-0 text-brand-steel" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.distributors.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-brand-steel"
            />
            {query && (
              <button aria-label={t.common.close} onClick={() => setQuery("")} className="text-brand-steel hover:text-brand-red">
                <X size={14} />
              </button>
            )}
          </label>
          <ul className="flex-1 overflow-y-auto">
            {sorted.length === 0 && <li className="px-5 py-8 text-center text-sm text-brand-steel">{t.common.noResults}</li>}
            {sorted.map((d) => {
              const Icon = typeIcon[d.type];
              return (
                <li key={d.id}>
                  <button
                    onClick={() => select(d)}
                    className={`flex w-full items-start gap-3 border-b border-brand-line px-5 py-4 text-left transition-colors hover:bg-brand-mist ${
                      selectedId === d.id ? "bg-brand-mist" : ""
                    }`}
                  >
                    <Icon size={16} className={`mt-0.5 shrink-0 ${d.type === "distributor" ? "text-brand-red" : "text-brand-carbon"}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{d.country}</span>
                      <span className={`block truncate text-xs ${d.name ? "text-brand-carbon/80" : "text-brand-steel"}`}>{title(d)}</span>
                      <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-brand-steel">{d.city}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="relative order-1 z-0 h-[420px] lg:order-2 lg:h-[600px]">
          <DynamicMap items={visible} selectedId={selectedId} onSelect={(id) => setSelectedId(id)} renderPopup={renderPopup} target={target} />
          <button
            onClick={() => pickRegion("all")}
            className="absolute right-3 top-3 z-[500] flex items-center gap-1.5 border border-brand-line bg-brand-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] shadow hover:border-brand-carbon"
          >
            <RotateCcw size={12} /> {t.distributors.resetView}
          </button>
          <div className="absolute bottom-3 left-3 z-[500] flex flex-wrap gap-3 bg-brand-white/95 px-3 py-2 text-[11px] shadow">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border-2 border-white bg-brand-carbon shadow" /> {t.distributors.types.office} / {t.distributors.types.factory}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full border-2 border-white bg-brand-red shadow" /> {t.distributors.types.distributor}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-steel">
        <MapPin size={12} /> {t.distributors.text}
      </p>
    </div>
  );
}
