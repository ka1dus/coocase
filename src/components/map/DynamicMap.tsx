"use client";

import dynamic from "next/dynamic";

/** Leaflet touches `window`, so the map only renders in the browser. */
const DynamicMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-brand-mist" />,
});

export default DynamicMap;
