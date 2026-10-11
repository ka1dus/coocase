import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";
import en from "./dictionaries/en";
import zh from "./dictionaries/zh";
import it from "./dictionaries/it";
import fr from "./dictionaries/fr";
import id from "./dictionaries/id";
import ja from "./dictionaries/ja";

const dictionaries: Record<Locale, Dictionary> = { en, zh, it, fr, id, ja };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Replaces {placeholders} in a translated string. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}

export type { Dictionary };
