"use client";

import { useMemo, useState } from "react";
import type { LatLngBoundsExpression } from "leaflet";
import { Building2, Factory, Globe2, Mail, MapPin, Navigation, Phone, RotateCcw, Store } from "lucide-react";
import { distributors, regions, type Distributor, type Region } from "@/data/distributors";
import { useI18n } from "@/i18n/provider";
import { format } from "@/i18n";
import DynamicMap from "./map/DynamicMap";

const typeIcon = { hq: Building2, office: Building2, factory: Factory, distributor: Store };

export default function DistributorsExplorer() {
  const { t } = useI18n();
  const [region, setRegion] = useState<Region | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [target, setTarget] = useState<{ bounds?: LatLngBoundsExpression; point?: [number, number]; zoom?: number; key: number }>();

  const visible = useMemo(
    () => (region === "all" ? distributors : distributors.filter((d) => d.region === region)),
    [region],
  );

  // Head office first, then alphabetical by country.
  const sorted = useMemo(
    () =>
      [...visible].sort((a, b) =>
        a.type === b.type ? a.country.localeCompare(b.country) : a.type === "distributor" ? 1 : b.type === "distributor" ? -1 : 0,
      ),
    [visible],
  );

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
    setTarget({ point: [d.lat, d.lng], zoom: d.type === "distributor" ? 5 : 11, key: Date.now() });
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
        {d.phone && (
          <a href={`tel:${d.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 !text-brand-carbon hover:!text-brand-red">
            <Phone size={12} /> {d.phone}
          </a>
        )}
        {d.website && (
          <a href={d.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 !text-brand-carbon hover:!text-brand-red">
            <Globe2 size={12} /> {t.distributors.website}
          </a>
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

      <div className="mt-6 grid gap-0 border border-brand-line lg:grid-cols-[340px_1fr]">
        <aside className="order-2 flex max-h-[560px] flex-col border-brand-line lg:order-1 lg:border-r">
          <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em]">{t.distributors.listTitle}</h2>
            <span className="font-mono text-[11px] text-brand-steel">{format(t.distributors.count, { count: visible.length })}</span>
          </div>
          <ul className="flex-1 overflow-y-auto">
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
                      <span className="block truncate text-xs text-brand-steel">
                        {title(d)} · {d.city}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="relative order-1 z-0 h-[420px] lg:order-2 lg:h-[560px]">
          <DynamicMap items={visible} selectedId={selectedId} onSelect={(id) => setSelectedId(id)} renderPopup={renderPopup} target={target} />
          <button
            onClick={() => pickRegion("all")}
            className="absolute right-3 top-3 z-[500] flex items-center gap-1.5 border border-brand-line bg-brand-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] shadow hover:border-brand-carbon"
          >
            <RotateCcw size={12} /> {t.distributors.resetView}
          </button>
          <div className="absolute bottom-3 left-3 z-[500] flex flex-wrap gap-3 bg-brand-white/95 px-3 py-2 text-[11px] shadow">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border-2 border-white bg-brand-carbon shadow" /> {t.distributors.types.hq} / {t.distributors.types.factory}
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
