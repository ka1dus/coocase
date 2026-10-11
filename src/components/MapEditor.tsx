"use client";

/**
 * Owner tool for editing the distributor map without touching code.
 * There is no backend, so edits are kept as a draft in this browser and
 * published by downloading distributors.json and replacing
 * src/data/distributors.json in the repository (see README.md).
 */
import { useEffect, useMemo, useState } from "react";
import { Copy, Download, MapPinPlus, RotateCcw, Trash2, Upload } from "lucide-react";
import published from "@/data/distributors.json";
import { distributorTypes, regions, type Distributor } from "@/data/distributors";
import DynamicMap from "./map/DynamicMap";

const DRAFT_KEY = "coocase-distributors-draft";

const blank = (lat: number, lng: number): Distributor => ({
  id: `new-${Date.now().toString(36)}`,
  name: "",
  type: "distributor",
  region: "europe",
  country: "",
  city: "",
  address: "",
  lat,
  lng,
  email: "",
  phone: "",
  website: "",
});

function readDraft(): Distributor[] | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Distributor[]) : null;
  } catch {
    return null;
  }
}

export default function MapEditor() {
  const [items, setItems] = useState<Distributor[]>(published as Distributor[]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setItems(draft);
      setHasDraft(true);
    }
  }, []);

  const save = (next: Distributor[]) => {
    setItems(next);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      setHasDraft(true);
    } catch {
      /* storage unavailable — edits still work for this session */
    }
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const selected = items.find((d) => d.id === selectedId) ?? null;
  const update = (patch: Partial<Distributor>) => selected && save(items.map((d) => (d.id === selected.id ? { ...d, ...patch } : d)));

  const problems = useMemo(() => {
    const out: string[] = [];
    const ids = new Set<string>();
    for (const d of items) {
      if (ids.has(d.id)) out.push(`Duplicate id "${d.id}"`);
      ids.add(d.id);
      if (!d.country) out.push(`"${d.id}" has no country`);
      if (Math.abs(d.lat) > 90 || Math.abs(d.lng) > 180) out.push(`"${d.id}" has invalid coordinates`);
    }
    return out;
  }, [items]);

  const json = JSON.stringify(items, null, 2) + "\n";

  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "distributors.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error();
      save(parsed);
      flash(`Imported ${parsed.length} locations`);
    } catch {
      flash("That file is not a valid distributors.json");
    }
  };

  const field = "mt-1 w-full border border-brand-line bg-white px-2.5 py-2 text-sm outline-none focus:border-brand-carbon";
  const lbl = "block font-mono text-[10px] uppercase tracking-[0.15em] text-brand-steel";
  const btn = "inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-medium transition-colors";

  return (
    <div className="flex h-screen flex-col bg-brand-white text-brand-carbon">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line px-4 py-3">
        <div>
          <h1 className="text-lg font-bold">Distributor map editor</h1>
          <p className="text-xs text-brand-steel">
            {items.length} locations · {hasDraft ? "unpublished draft saved in this browser" : "showing published data"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setAdding((v) => !v)}
            className={`${btn} ${adding ? "border-brand-red bg-brand-red text-white" : "border-brand-carbon hover:bg-brand-mist"}`}
          >
            <MapPinPlus size={14} /> {adding ? "Click the map to place the pin…" : "Add pin"}
          </button>
          <label className={`${btn} cursor-pointer border-brand-line hover:border-brand-carbon`}>
            <Upload size={14} /> Import JSON
            <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
          </label>
          <button
            onClick={() => {
              navigator.clipboard.writeText(json).then(() => flash("JSON copied to clipboard"));
            }}
            className={`${btn} border-brand-line hover:border-brand-carbon`}
          >
            <Copy size={14} /> Copy JSON
          </button>
          <button onClick={download} className={`${btn} border-brand-red bg-brand-red text-white hover:bg-brand-red-dark`}>
            <Download size={14} /> Download distributors.json
          </button>
          <button
            onClick={() => {
              if (!confirm("Discard your draft and reload the published locations?")) return;
              try {
                localStorage.removeItem(DRAFT_KEY);
              } catch {}
              setItems(published as Distributor[]);
              setHasDraft(false);
              setSelectedId(null);
            }}
            className={`${btn} border-brand-line text-brand-steel hover:border-brand-carbon`}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </header>

      <div className="grid flex-1 overflow-hidden lg:grid-cols-[380px_1fr]">
        <aside className="flex flex-col overflow-hidden border-r border-brand-line">
          <details className="border-b border-brand-line bg-brand-mist px-4 py-3 text-xs leading-relaxed" open={!hasDraft}>
            <summary className="cursor-pointer font-semibold">How to publish changes</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-brand-steel">
              <li>Drag pins to move them, or use “Add pin” and click the map.</li>
              <li>Select a pin to edit its name, address and contact details.</li>
              <li>Click “Download distributors.json”.</li>
              <li>Replace <code>src/data/distributors.json</code> in the project with the downloaded file, then commit and redeploy (Vercel redeploys automatically on push).</li>
            </ol>
            <p className="mt-2 text-brand-steel">Drafts are stored only in this browser until you publish.</p>
          </details>

          {problems.length > 0 && (
            <div className="border-b border-brand-line bg-red-50 px-4 py-2 text-xs text-brand-red">
              {problems.slice(0, 3).map((p) => (
                <p key={p}>⚠ {p}</p>
              ))}
            </div>
          )}

          {selected ? (
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedId(null)} className="text-xs text-brand-steel hover:text-brand-red">
                  ← All locations
                </button>
                <button
                  onClick={() => {
                    if (!confirm(`Delete "${selected.name || selected.country}"?`)) return;
                    save(items.filter((d) => d.id !== selected.id));
                    setSelectedId(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-brand-red hover:underline"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
              <label className={lbl}>
                Company name <span className="normal-case tracking-normal">(empty = shows “Distributor”)</span>
                <input className={field} value={selected.name} onChange={(e) => update({ name: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={lbl}>
                  Type
                  <select className={field} value={selected.type} onChange={(e) => update({ type: e.target.value as Distributor["type"] })}>
                    {distributorTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className={lbl}>
                  Region
                  <select className={field} value={selected.region} onChange={(e) => update({ region: e.target.value as Distributor["region"] })}>
                    {regions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label className={lbl}>
                  Country *
                  <input className={field} value={selected.country} onChange={(e) => update({ country: e.target.value })} />
                </label>
                <label className={lbl}>
                  City
                  <input className={field} value={selected.city} onChange={(e) => update({ city: e.target.value })} />
                </label>
              </div>
              <label className={lbl}>
                Address
                <textarea rows={2} className={field} value={selected.address} onChange={(e) => update({ address: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={lbl}>
                  Latitude
                  <input type="number" step="0.0001" className={field} value={selected.lat} onChange={(e) => update({ lat: Number(e.target.value) })} />
                </label>
                <label className={lbl}>
                  Longitude
                  <input type="number" step="0.0001" className={field} value={selected.lng} onChange={(e) => update({ lng: Number(e.target.value) })} />
                </label>
              </div>
              <label className={lbl}>
                Email
                <input className={field} value={selected.email} onChange={(e) => update({ email: e.target.value })} />
              </label>
              <label className={lbl}>
                Phone
                <input className={field} value={selected.phone} onChange={(e) => update({ phone: e.target.value })} />
              </label>
              <label className={lbl}>
                Website
                <input className={field} placeholder="https://" value={selected.website} onChange={(e) => update({ website: e.target.value })} />
              </label>
              <label className={lbl}>
                ID <span className="normal-case tracking-normal">(unique, no spaces)</span>
                <input className={field} value={selected.id} onChange={(e) => {
                  const id = e.target.value.replace(/\s+/g, "-");
                  update({ id });
                  setSelectedId(id);
                }} />
              </label>
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {items.map((d) => (
                <li key={d.id}>
                  <button onClick={() => setSelectedId(d.id)} className="w-full border-b border-brand-line px-4 py-3 text-left hover:bg-brand-mist">
                    <span className="block text-sm font-semibold">{d.country || "(no country)"}</span>
                    <span className="block text-xs text-brand-steel">
                      {d.name || d.type} · {d.city} · {d.lat}, {d.lng}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className={`relative z-0 min-h-[400px] ${adding ? "cursor-crosshair" : ""}`}>
          <DynamicMap
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
            editable
            onMove={(id, lat, lng) => save(items.map((d) => (d.id === id ? { ...d, lat, lng } : d)))}
            onMapClick={(lat, lng) => {
              if (!adding) return;
              const d = blank(lat, lng);
              save([...items, d]);
              setSelectedId(d.id);
              setAdding(false);
            }}
          />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[2000] -translate-x-1/2 bg-brand-carbon px-4 py-2 text-sm text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}
