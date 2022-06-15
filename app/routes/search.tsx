import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useRef, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { Hero } from "~/components/Hero";
import type { InstantSearchServerState } from "react-instantsearch-hooks-web";
import { InstantSearchSSRProvider } from "react-instantsearch-hooks-web";
import { createBrowserHistory } from "history";
import { ArticleCard } from "~/components/ArticleCard";
import {
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch-hooks-web";
import type { BaseHit, UiState } from "instantsearch.js";
import { getServerState } from "react-instantsearch-hooks-server";
import { useTranslation } from "react-i18next";
import { useLoaderData, useLocation } from "@remix-run/react";
import type { SupportedLang } from "~/i18n-config";
import { getEnv } from "~/utils";
import { Inset } from "~/components/Inset";
import type { IPage, IPost } from "~/@types/generated/contentful";
import { SearchIcon, XIcon } from "@heroicons/react/outline";

const DEBOUNCE_TIME = 400;
const i18nNamespaces = ["common", "tags"];
const indexName = "prod_site_search";

function Hit({ hit }: { hit: (IPost | IPage) & BaseHit }) {
  const { t, i18n } = useTranslation(i18nNamespaces);
  const locale = i18n.language as SupportedLang;
  const type = hit.sys.contentType.sys.id;
  let linkTo;
  let imageProps;
  if (type === "page") {
    linkTo = `/${hit.fields.slug["en-US"]}`;
  } else if (type === "post") {
    linkTo = `/blog/${hit.fields.slug["en-US"]}`;
    const imageField = (hit as IPost).fields.image;
    if (imageField) {
      // TODO: Contentful doesn't index assets in to Algolia, which means we need to index things in a different way (or find some other workaround)
      // Reference: https://github.com/deptagency/dash/issues/103
      // imageProps = getImageProps(imageField[locale], { locale });
    }
  } else {
    throw new Error("encountered search entry with unhandled content type");
  }
  const updatedDate = new Date(hit.sys.updatedAt);
  return (
    <ArticleCard
      buttonTo={linkTo}
      category={
        hit.metadata.tags[0] && {
          label: t(`tags:${hit.metadata.tags[0].sys.id}`),
          to: `/blog?tag=${hit.metadata.tags[0].sys.id}`,
        }
      }
      date={updatedDate.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
      })}
      imageProps={imageProps}
      title={hit.fields.title[locale]}
    />
  );
}

interface AlgoliaWrapperProps {
  apiKey: string;
  appId: string;
  initialUiState: UiState;
  serverState?: InstantSearchServerState;
}

function AlgoliaWrapper({
  apiKey,
  appId,
  initialUiState,
  serverState,
}: AlgoliaWrapperProps) {
  const debouncedSetStateRef = useRef<null | NodeJS.Timeout>(null);
  const [searchClient] = useState(algoliasearch(appId, apiKey));
  // TODO: We need translations, but we can't useTranslation in this component because Algolia instantsearch breaks if we do.
  // Reference: https://github.com/devetry/dept-dxp/issues/103 and https://github.com/algolia/react-instantsearch/issues/3482
  // const { t } = useTranslation(i18nNamespaces);

  function onSearchStateChange({
    uiState,
    setUiState,
  }: {
    uiState: UiState;
    setUiState(
      uiState: UiState | ((previousUiState: UiState) => UiState)
    ): void;
  }) {
    if (debouncedSetStateRef.current) {
      clearTimeout(debouncedSetStateRef.current);
    }
    debouncedSetStateRef.current = setTimeout(() => {
      const history = createBrowserHistory();
      history.push({ search: writeParams(uiState).toString() });
    }, DEBOUNCE_TIME);
    setUiState(uiState);
  }

  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={indexName}
        searchClient={searchClient}
        // TODO: This works for setting the initial state on a refresh, but things break when the user clicks back or forward.
        // We can't test or fix this right now because of this Algolia bug: https://github.com/algolia/react-instantsearch/issues/3482
        // Reference: https://github.com/devetry/dept-d xp/issues/103
        initialUiState={initialUiState}
        onStateChange={onSearchStateChange}
      >
        <div className="flex flex-wrap gap-2 sm:gap-10">
          <div className="w-full sm:w-60">
            <SearchBox
              // TODO: Translate this
              placeholder="Search..."
              submitIconComponent={({ classNames }) => (
                <SearchIcon className={classNames.submitIcon} />
              )}
              resetIconComponent={({ classNames }) => (
                <XIcon className={classNames.resetIcon} />
              )}
              classNames={{
                form: "flex",
                input:
                  "hide-webkit-cancel-button border border-gray-300 outline-offset-0 p-2 w-44",
                submit: "px-2",
                submitIcon: "w-6",
                reset: "px-2",
                resetIcon: "w-6",
              }}
            />
            <RefinementList
              attribute="metadata.tags.sys.id"
              classNames={{
                list: "my-4",
                item: "my-1",
                checkbox: "mr-2",
              }}
              // TODO: This needs `transformItems` in order to translate each tag, but we can't useTranslation in this component because Angolia instantsearch breaks if we do.
              // Reference: https://github.com/devetry/dept-dxp/issues/103 and https://github.com/algolia/react-instantsearch/issues/3482
              // transformItems={(items: any) =>
              //   items.map((item: any) => ({
              //     ...item,
              //     label: t(`tags:${item.label}`),
              //   }))
              // }
            />
          </div>
          <div className="grow">
            <Hits
              classNames={{
                list: "grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3",
              }}
              hitComponent={Hit}
            />
            <Pagination
              classNames={{
                root: "mt-6",
                item: "inline-block",
                link: "py-2 px-3",
              }}
            />
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

export const handle = {
  i18n: i18nNamespaces,
};

interface LoaderData {
  apiKey: string;
  appId: string;
  serverState: InstantSearchServerState;
}

function readParams(params: URLSearchParams): UiState {
  const searchTerm = params.get("q");
  const tagTerm = params.has("tag") ? params.get("tag") : "";
  const tagArray = tagTerm ? tagTerm.split(",") : [];
  return {
    [indexName]: {
      query: searchTerm || undefined,
      refinementList: {
        "metadata.tags.sys.id": tagArray,
      },
    },
  };
}

function writeParams(uiState: UiState): URLSearchParams {
  const indexUiState = uiState[indexName];
  const params = new URLSearchParams();
  if (indexUiState.query) {
    params.append("q", indexUiState.query);
  }
  const searchStateRefinement =
    indexUiState.refinementList?.["metadata.tags.sys.id"];
  if (searchStateRefinement) {
    params.append("tag", searchStateRefinement.join(","));
  }
  return params;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const appId = getEnv("ALGOLIA_APP_ID");
  const apiKey = getEnv("ALGOLIA_SEARCH_KEY");
  const initialUiState = readParams(new URL(request.url).searchParams);
  const serverState = await getServerState(
    <AlgoliaWrapper
      apiKey={apiKey}
      appId={appId}
      initialUiState={initialUiState}
    />
  );
  return {
    appId,
    apiKey,
    serverState,
  };
};

export const meta: MetaFunction = () => {
  return {
    // TODO
    title: "Search",
    description: "Fill in search description",
  };
};

export default function Search() {
  const { appId, apiKey, serverState } = useLoaderData<LoaderData>();
  const location = useLocation();
  const initialUiState = readParams(new URLSearchParams(location.search));

  return (
    <main>
      <Hero
        background={{
          url: "heroBackground.png",
        }}
        size="small"
        title="Search"
      />
      <Inset>
        <AlgoliaWrapper
          apiKey={apiKey}
          appId={appId}
          initialUiState={initialUiState}
          serverState={serverState}
        />
      </Inset>
    </main>
  );
}
