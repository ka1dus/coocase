import type { Locale } from "@/i18n/config";

export const href = (locale: Locale, path = "") => `/${locale}${path === "/" ? "" : path}`;

/** Swaps the locale segment of a pathname, keeping the rest of the URL. */
export function switchLocalePath(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  parts[1] = next;
  return parts.join("/") || `/${next}`;
}
