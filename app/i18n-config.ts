import type { InitOptions } from "i18next";

export const supportedLanguages = ["en-US"] as const;
export type SupportedLang = typeof supportedLanguages[number];

export const fallbackLanguage = "en-US";

export const urlLoadPath = "/locales/{{lng}}/{{ns}}.json";

const config: InitOptions = {
  supportedLngs: supportedLanguages,
  defaultNS: "common",
  fallbackLng: fallbackLanguage,
  react: { useSuspense: false },
};
export default config;
