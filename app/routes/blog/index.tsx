import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import type { IPost, SpecificLocale } from "~/@types/generated/contentful";
import { ArticleCard } from "~/components/ArticleCard";
import { Grid } from "~/components/Grid";
import { Hero } from "~/components/Hero";
import { Inset } from "~/components/Inset";
import { getImageProps } from "~/contentful";
import { getRecentPosts } from "~/contentful/index.server";
import { i18n } from "~/i18n.server";
import type { MetaInfo } from "~/route-utils";
import { getMetaInfo } from "~/route-utils";

export interface LoaderData {
  posts: SpecificLocale<IPost>[];
  meta: MetaInfo;
}

const i18nNamespaces = ["common", "tags"];

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");
  const locale = await i18n.getLocale(request);
  const posts = await getRecentPosts(locale, tag ? tag : undefined);
  return {
    posts,
    meta: getMetaInfo({
      title: "Blog",
      description: "Our blog.",
      requestUrl: request.url,
    }),
  };
};

export const handle = {
  i18n: i18nNamespaces,
};

export default function Blog() {
  const { posts } = useLoaderData<LoaderData>();
  const { t } = useTranslation(i18nNamespaces);
  return (
    <main className="relative">
      <Hero
        background={{
          url: "/heroBackground.png",
        }}
        size="small"
        title={t("Blog")}
      />
      <Inset padded>
        <Grid cols={3}>
          {posts.map((post, index) => {
            const updatedDate = new Date(post.sys.updatedAt);
            return (
              <ArticleCard
                key={index}
                buttonTo={post.fields.slug}
                category={
                  post.metadata.tags[0] && {
                    label: t(`tags:${post.metadata.tags[0].sys.id}`),
                    to: `/blog?tag=${post.metadata.tags[0].sys.id}`,
                  }
                }
                date={updatedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
                imageProps={
                  post.fields.image && getImageProps(post.fields.image)
                }
                title={post.fields.title}
              />
            );
          })}
        </Grid>
      </Inset>
    </main>
  );
}
