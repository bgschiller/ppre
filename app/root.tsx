import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { i18n } from "~/i18n.server";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";
import { getEnv } from "./utils";
import { supportedLanguages } from "./i18n-config";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  GLOBALS: string;
  locale: string;
  user: Awaited<ReturnType<typeof getUser>>;
  PUBLICLY_AVAILABLE_ORIGIN: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const PUBLICLY_AVAILABLE_ORIGIN = getEnv("PUBLICLY_AVAILABLE_ORIGIN", {
    default: null,
  });

  return json<LoaderData>({
    user: await getUser(request),
    locale: await i18n.getLocale(request),
    PUBLICLY_AVAILABLE_ORIGIN: PUBLICLY_AVAILABLE_ORIGIN,
    GLOBALS: JSON.stringify({
      SENTRY_DSN: getEnv("SENTRY_DSN", { default: null }),
    }),
  });
};

/**
 * Construct <link rel="alternate"> tags to inform search engines and browsers
 * about locale variants of the page, as described at https://developers.google.com/search/docs/advanced/crawling/localized-versions#html
 */
function useAlternateLinks() {
  const { locale, PUBLICLY_AVAILABLE_ORIGIN } = useLoaderData<LoaderData>();
  const { pathname, search } = useLocation();
  if (!PUBLICLY_AVAILABLE_ORIGIN) return [];
  const links = supportedLanguages
    .filter((lang) => lang !== locale) // skip current locale
    .map((lang) => (
      <link
        key={lang}
        rel="alternate"
        hrefLang={lang}
        href={`https://${lang}.${PUBLICLY_AVAILABLE_ORIGIN}${pathname}${search}`}
      />
    ));
  links.push(
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={`https://${PUBLICLY_AVAILABLE_ORIGIN}${pathname}${search}`}
    />
  );
  return links;
}

export const handle = {
  // In the handle export, we could add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  i18n: [],
};

export default function App() {
  let { locale, GLOBALS } = useLoaderData<LoaderData>();
  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  const alternateLinks = useAlternateLinks();

  return (
    <html lang={locale} className="h-full" dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        {alternateLinks}
      </head>
      <body className="flex min-h-screen flex-col">
        <Nav sticky={true} />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: `window.GLOBALS=${GLOBALS}` }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
