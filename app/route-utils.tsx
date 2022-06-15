import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { SpecificLocale, IPage } from "./@types/generated/contentful";
import {
  createDocumentFromSection,
  getSections,
  richTextOptions,
} from "./contentful";
import { getPageBySlug } from "./contentful/index.server";
import { i18n } from "./i18n.server";
import { getEnv } from "./utils";

// Generally speaking, contentful Pages = "website", contentful Posts = "article", and shopify products = "product.item"
type OpenGraphType = "website" | "article" | "product.item";

export interface MetaInfo {
  title: string;
  description: string;
  openGraphUrl: string;
  openGraphType: OpenGraphType;
  openGraphImageUrl: string;
}

export const meta: MetaFunction = ({ data }: { data: { meta: MetaInfo } }) => {
  return {
    title: data.meta.title,
    description: data.meta.description,
    "og:title": data.meta.title,
    "og:description": data.meta.description,
    "og:url": data.meta.openGraphUrl,
    "og:type": data.meta.openGraphType,
    "og:image": data.meta.openGraphImageUrl,
  };
};

export function getMetaInfo({
  title,
  description,
  requestUrl,
  openGraphType,
  openGraphImageUrl,
}: {
  title: string;
  description: string;
  requestUrl: string;
  openGraphType?: OpenGraphType;
  openGraphImageUrl?: string;
}): MetaInfo {
  const url = new URL(requestUrl);
  const origin = getEnv("PUBLICLY_AVAILABLE_ORIGIN");
  return {
    title,
    description,
    openGraphUrl: `${origin}${url.pathname}`,
    openGraphType: openGraphType || "website",
    openGraphImageUrl: openGraphImageUrl
      ? openGraphImageUrl
      : `${origin}/logo.svg`,
  };
}

export interface ContentfulPageLoaderData {
  page: SpecificLocale<IPage>;
  meta: MetaInfo;
}

export function getContentfulPageLoader(slug?: string) {
  const contentfulPageLoader: LoaderFunction = async ({
    params,
    request,
  }): Promise<ContentfulPageLoaderData> => {
    const url = new URL(request.url);
    const slugToQuery = slug || params.slug;
    invariant(
      slugToQuery,
      "expected slug to be passed as an argument or params.slug to be defined"
    );
    const locale = await i18n.getLocale(request);
    const page = await getPageBySlug(slugToQuery, {
      locale,
      preview: url.searchParams.get("preview") === "1",
    });
    return {
      page,
      meta: getMetaInfo({
        title: page.fields.title,
        description: page.fields.description,
        requestUrl: request.url,
        openGraphImageUrl: page.fields.openGraphImage?.fields.file.url,
      }),
    };
  };
  return contentfulPageLoader;
}

export function ContentfulPageComponent() {
  const { page } = useLoaderData<ContentfulPageLoaderData>();
  return (
    <main className="pb-8">
      {page.fields.body &&
        getSections(page.fields.body).map((section, index) => {
          if (section.type === "inset") {
            return (
              <div key={index} className="mx-4 md:mx-auto md:w-3/4">
                {documentToReactComponents(
                  createDocumentFromSection(section),
                  richTextOptions
                )}
              </div>
            );
          } else {
            return documentToReactComponents(
              createDocumentFromSection(section),
              richTextOptions
            );
          }
        })}
    </main>
  );
}
