import Backend from "i18next-fs-backend";
import { RemixI18Next } from "remix-i18next";
import { fallbackLanguage, supportedLanguages } from "./i18n-config";
import path from "path";

export const fileLoadPath = path.resolve(
  path.join(__dirname, "..", "public", "locales", "{{lng}}", "{{ns}}.json")
);
class SubdomainRemixI18Next extends RemixI18Next {
  public async getLocale(request: Request): Promise<string> {
    const hostHeader = request.headers.get("host");
    const subdomain = hostHeader?.split(".", 1)?.[0];
    const supportedLang =
      subdomain &&
      supportedLanguages.find((lang) => {
        // strip off the country specific part of a locale (eg, the "-US" from en-US),
        // as that may not appear in the subdomain.
        const [locale] = lang.split("-", 1);
        return locale === subdomain || lang == subdomain;
      });
    return supportedLang || super.getLocale(request);
  }
}

export const i18n = new SubdomainRemixI18Next({
  detection: {
    fallbackLanguage,
    supportedLanguages: supportedLanguages.slice(),
  },
  i18next: {
    backend: {
      loadPath: fileLoadPath,
    },
  },
  backend: Backend,
});
