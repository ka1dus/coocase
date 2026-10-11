export const locales = ["en", "zh", "it", "fr", "id", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Shown in the language switcher — each language is written in its own script. */
export const localeNames: Record<Locale, { native: string; english: string; htmlLang: string }> = {
  en: { native: "English", english: "English", htmlLang: "en" },
  zh: { native: "中文", english: "Chinese (Simplified)", htmlLang: "zh-CN" },
  it: { native: "Italiano", english: "Italian", htmlLang: "it" },
  fr: { native: "Français", english: "French", htmlLang: "fr" },
  id: { native: "Bahasa Indonesia", english: "Indonesian", htmlLang: "id" },
  ja: { native: "日本語", english: "Japanese", htmlLang: "ja" },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
