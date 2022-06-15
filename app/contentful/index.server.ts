import * as contentful from "contentful";
import invariant from "tiny-invariant";
import type {
  IPage,
  IPost,
  SpecificLocale,
} from "~/@types/generated/contentful";
import { getEnv } from "~/utils";

const CONTENTFUL_ENV_ID = getEnv("CONTENTFUL_ENV_ID");
const CONTENTFUL_SPACE_ID = getEnv("CONTENTFUL_SPACE_ID");
const CONTENTFUL_ACCESS_TOKEN = getEnv("CONTENTFUL_ACCESS_TOKEN");
const CONTENTFUL_PREVIEW_ACCESS_TOKEN = getEnv(
  "CONTENTFUL_PREVIEW_ACCESS_TOKEN",
  { default: null }
);

type ContentfulClients = "regular" | "preview";
let clients: { [k in ContentfulClients]?: contentful.ContentfulClientApi } = {};
export function getClient(
  which: ContentfulClients = "regular"
): contentful.ContentfulClientApi {
  if (clients[which]) {
    return clients[which]!;
  }
  if (which === "preview" && !CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    throw new Error(
      "preview content requested, but no preview access token was provided"
    );
  }
  clients[which] = contentful.createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken:
      which === "preview"
        ? CONTENTFUL_PREVIEW_ACCESS_TOKEN!
        : CONTENTFUL_ACCESS_TOKEN,
    host: which === "preview" ? "preview.contentful.com" : "cdn.contentful.com",
    environment: CONTENTFUL_ENV_ID,
  });
  return clients[which]!;
}

export async function getPageBySlug(
  slug: string,
  options: { locale: "*"; preview: boolean }
): Promise<IPage>;
export async function getPageBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPage>>;
export async function getPageBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPage> | IPage> {
  const client = getClient(options.preview ? "preview" : "regular");
  const entries = await client.getEntries({
    content_type: "page",
    limit: 1,
    "fields.slug[in]": slug,
    include: 10, // Include up to 10 levels deep of embedded entries, becuase we want the entire page in one call
    locale: options.locale,
  });
  invariant(
    entries.items.length > 0,
    `expected a page entry with slug of '${slug}'`
  );
  const page = entries.items[0] as IPage | SpecificLocale<IPage>;
  return page;
}
export async function getRecentPosts(
  locale: "*",
  tag?: string
): Promise<IPost[]>;
export async function getRecentPosts(
  locale: string,
  tag?: string
): Promise<SpecificLocale<IPost>[]>;
export async function getRecentPosts(
  locale: string,
  tag?: string
): Promise<IPost[] | SpecificLocale<IPost>[]> {
  const client = getClient();
  const tagQuery = tag ? { "metadata.tags.sys.id[in]": tag } : {};
  const entries = await client.getEntries({
    content_type: "post",
    limit: 10,
    order: "sys.createdAt",
    locale,
    ...tagQuery,
  });
  const posts = entries.items as SpecificLocale<IPost>[];
  return posts;
}

export async function getPostBySlug(
  slug: string,
  options: { locale: "*"; preview: boolean }
): Promise<IPost>;
export async function getPostBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPost>>;
export async function getPostBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPost> | IPost> {
  const client = getClient(options.preview ? "preview" : "regular");
  const entries = await client.getEntries({
    content_type: "post",
    limit: 1,
    "fields.slug[in]": slug,
    locale: options.locale,
  });
  invariant(
    entries.items.length > 0,
    `expected a post entry with slug of '${slug}'`
  );
  const post = entries.items[0] as SpecificLocale<IPost>;
  return post;
}
