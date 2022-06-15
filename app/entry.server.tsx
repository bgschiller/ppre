import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { i18n, fileLoadPath } from "./i18n.server";
import i18nConfig from "./i18n-config";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const i18nInstance = createInstance();

  const lng = await i18n.getLocale(request);
  const ns = i18n.getRouteNamespaces(remixContext);

  await i18nInstance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18nConfig,
      lng,
      ns,
      backend: {
        loadPath: fileLoadPath,
      },
    });
  const markup = renderToString(
    <I18nextProvider i18n={i18nInstance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
