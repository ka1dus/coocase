"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Distributor } from "@/data/distributors";

/**
 * Map tiles. OpenStreetMap's public tiles are fine for low traffic; for production
 * traffic set NEXT_PUBLIC_MAP_TILE_URL (and _ATTRIBUTION) to a provider such as
 * MapTiler, Stadia or Mapbox. See README.md.
 */
const TILE_URL = process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const WORLD_CENTER: [number, number] = [25, 30];

function pinIcon(type: Distributor["type"], active: boolean) {
  const office = type !== "distributor";
  const size = active ? 22 : office ? 16 : 14;
  const html = `<span style="
      display:block;width:${size}px;height:${size}px;
      background:${office ? "#121212" : "#fb0015"};
      border:2px solid #fff;
      border-radius:${office ? "2px" : "9999px"};
      box-shadow:0 0 0 ${active ? 6 : 0}px rgba(251,0,21,.25),0 2px 6px rgba(0,0,0,.35);
      transition:all .2s"></span>`;
  return L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] });
}

function FlyTo({ target }: { target?: { bounds?: L.LatLngBoundsExpression; point?: [number, number]; zoom?: number; key: number } }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    if (target.point) map.flyTo(target.point, target.zoom ?? 6, { duration: 0.8 });
    else if (target.bounds) map.flyToBounds(target.bounds, { padding: [40, 40], duration: 0.8, maxZoom: 6 });
  }, [map, target]);
  return null;
}

function ClickCapture({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onClick?.(+e.latlng.lat.toFixed(4), +e.latlng.lng.toFixed(4)) });
  return null;
}

export interface LeafletMapProps {
  items: Distributor[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  renderPopup?: (d: Distributor) => React.ReactNode;
  target?: { bounds?: L.LatLngBoundsExpression; point?: [number, number]; zoom?: number; key: number };
  scrollWheelZoom?: boolean;
  minZoom?: number;
  initialZoom?: number;
  /** Map editor only: markers become draggable and the map reports clicks. */
  editable?: boolean;
  onMove?: (id: string, lat: number, lng: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

export default function LeafletMap({
  items,
  selectedId,
  onSelect,
  renderPopup,
  target,
  scrollWheelZoom = true,
  minZoom = 2,
  initialZoom = 2,
  editable = false,
  onMove,
  onMapClick,
  className = "h-full w-full",
}: LeafletMapProps) {
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const hasPopup = !!renderPopup;
  useEffect(() => {
    if (selectedId && hasPopup) markerRefs.current[selectedId]?.openPopup();
  }, [selectedId, hasPopup]);

  const worldBounds = useMemo(() => L.latLngBounds([-85, -200], [85, 200]), []);

  return (
    <MapContainer
      center={WORLD_CENTER}
      zoom={initialZoom}
      minZoom={minZoom}
      maxBounds={worldBounds}
      maxBoundsViscosity={0.8}
      worldCopyJump
      scrollWheelZoom={scrollWheelZoom}
      className={className}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} className="map-tiles-mono" />
      <FlyTo target={target} />
      {editable && <ClickCapture onClick={onMapClick} />}
      {items.map((d) => (
        <Marker
          key={d.id}
          position={[d.lat, d.lng]}
          icon={pinIcon(d.type, d.id === selectedId)}
          zIndexOffset={d.id === selectedId ? 1000 : d.type === "distributor" ? 0 : 500}
          draggable={editable}
          ref={(m) => {
            markerRefs.current[d.id] = m;
          }}
          eventHandlers={{
            click: () => onSelect?.(d.id),
            dragend: (e) => {
              const p = (e.target as L.Marker).getLatLng();
              onMove?.(d.id, +p.lat.toFixed(4), +p.lng.toFixed(4));
            },
          }}
        >
          {renderPopup && <Popup>{renderPopup(d)}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
}
