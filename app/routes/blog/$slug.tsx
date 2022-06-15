import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { IPost, SpecificLocale } from "~/@types/generated/contentful";
import { Hero } from "~/components/Hero";
import { getDescriptionFromNode, richTextOptions } from "~/contentful";
import { getPostBySlug } from "~/contentful/index.server";
import { i18n } from "~/i18n.server";
import type { MetaInfo } from "~/route-utils";
import * as routeUtils from "~/route-utils";

export const meta = routeUtils.meta;

function getDescriptionFromPost(post: SpecificLocale<IPost>): string {
  if (post.fields.description) {
    return post.fields.description;
  } else if (post.fields.body) {
    return getDescriptionFromNode(post.fields.body);
  } else {
    // We did our best
    return "";
  }
}

export interface LoaderData {
  post: SpecificLocale<IPost>;
  meta: MetaInfo;
}

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const url = new URL(request.url);
  invariant(params.slug, "expected params.slug to be defined");
  const locale = await i18n.getLocale(request);
  const post = await getPostBySlug(params.slug, {
    locale,
    preview: url.searchParams.get("preview") === "1",
  });
  return {
    post,
    meta: routeUtils.getMetaInfo({
      title: post.fields.title,
      description: getDescriptionFromPost(post),
      requestUrl: request.url,
      openGraphImageUrl: post.fields.image?.fields.file.url,
    }),
  };
};

export default function BlogPost() {
  const { post } = useLoaderData<LoaderData>();
  return (
    <main className="relative">
      <Hero
        background={{
          url: post.fields.image
            ? post.fields.image.fields.file.url
            : "/heroBackground.png",
        }}
        size={post.fields.image ? "medium" : "small"}
        title={post.fields.title}
      />
      <div className="mx-4 md:mx-auto md:w-3/4">
        {post.fields.body &&
          documentToReactComponents(post.fields.body, richTextOptions)}
      </div>
    </main>
  );
}
