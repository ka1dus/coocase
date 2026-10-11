/**
 * Distributor locations shown on the /distributors map.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  SITE OWNER: edit src/data/distributors.json to change the map pins.│
 * │  Easiest way: open /admin/map-editor on the running site, drag/add  │
 * │  pins, click "Download JSON" and replace distributors.json with it. │
 * │  See README.md → "Editing distributor locations".                   │
 * └──────────────────────────────────────────────────────────────────────┘
 */
import data from "./distributors.json";

export type DistributorType = "hq" | "office" | "factory" | "distributor";
export type Region = "europe" | "americas" | "middle-east" | "asia" | "oceania";

export interface Distributor {
  id: string;
  /** Company name. Leave empty to show the type ("Distributor") instead. */
  name: string;
  type: DistributorType;
  region: Region;
  country: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  email: string;
  phone: string;
  website: string;
}

export const regions: Region[] = ["europe", "americas", "middle-east", "asia", "oceania"];
export const distributorTypes: DistributorType[] = ["hq", "office", "factory", "distributor"];

export const distributors = data as Distributor[];
