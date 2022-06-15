import type { Options } from "@contentful/rich-text-react-renderer";
import type {
  Block,
  Document,
  Inline,
  TopLevelBlock,
} from "@contentful/rich-text-types";
import { INLINES } from "@contentful/rich-text-types";
import { BLOCKS } from "@contentful/rich-text-types";
import type { HeroBackground } from "~/components/Hero";
import { Hero } from "~/components/Hero";
import type {
  CONTENT_TYPE,
  IAccordionFields,
  ICardFields,
  IFeatureFields,
  IGridSectionFields,
  IHeroFields,
  IPage,
  IPost,
  SpecificLocale,
  SpecificLocaleFields,
  Asset,
} from "~/@types/generated/contentful";
import { ContentfulAsset } from "./contentful-asset";
import { Feature } from "~/components/Feature";
import type { ImgHTMLAttributes } from "react";
import { Section as SectionComponent } from "~/components/Section";
import { Grid } from "~/components/Grid";
import { Card } from "~/components/Card";
import { Inset } from "~/components/Inset";
import { Accordion } from "~/components/Accordion";
import { Link } from "@remix-run/react";
import { assertUnreachable } from "~/utils";
import type { SupportedLang } from "~/i18n-config";

export function getImageProps(
  asset: SpecificLocale<Asset>
): ImgHTMLAttributes<HTMLImageElement>;
export function getImageProps(
  asset: Asset,
  options: { locale: SupportedLang }
): ImgHTMLAttributes<HTMLImageElement>;
export function getImageProps(
  asset: Asset | SpecificLocale<Asset>,
  options?: { locale: SupportedLang }
): unknown {
  const file = options?.locale
    ? (asset as Asset).fields.file[options.locale]
    : (asset as SpecificLocale<Asset>).fields.file;
  if (!file.details.image) {
    throw new Error(
      "tried to get image props from an asset that's not an image"
    );
  }
  return {
    width: file.details.image!.width,
    height: file.details.image!.height,
    src: file.url,
    srcSet: getSrcSet({
      width: file.details.image!.width,
      url: file.url,
    }),
    alt: options?.locale
      ? (asset as Asset).fields.description[options.locale]
      : (asset as SpecificLocale<Asset>).fields.description,
  };
}

export function getSrcSet({
  width,
  url,
  increment = 500,
  avif = false,
}: {
  width: number;
  url: string;
  increment?: number;
  avif?: boolean;
}) {
  // Generate a srcset entry at each increment
  let srcSetItems = [];
  for (let i = 1; i < width / increment; i++) {
    // Calculate width for this iteration (for example: 500, 1000, 1500, etc.)
    const width = i * increment;
    srcSetItems.push(
      `${url}?w=${width}&q=80${avif ? "&fm=avif" : ""} ${width}w`
    );
  }
  return srcSetItems.join(",");
}

function getButtonProps(
  fields: SpecificLocaleFields<IHeroFields | IFeatureFields | ICardFields>
):
  | {
      label: string;
      to: string;
    }
  | undefined {
  if (fields.buttonLabel && fields.buttonUrl) {
    return {
      label: fields.buttonLabel,
      to: fields.buttonUrl,
    };
  }
}

function getHeroBackground(
  fields: SpecificLocaleFields<IHeroFields>
): HeroBackground | undefined {
  if (fields.backgroundImage) {
    return {
      url: fields.backgroundImage.fields.file.url,
    };
  } else if (fields.backgroundColor) {
    return {
      color: fields.backgroundColor,
    };
  }
}

function getEntryPath(entry: IPage | IPost): string {
  const contentType: CONTENT_TYPE = entry.sys.contentType.sys.id;
  if (contentType === "page") {
    return getPagePath(entry as IPage);
  } else if (contentType === "post") {
    return getPostPath(entry as IPost);
  } else {
    throw new Error("tried to get path to an unhandled entry type");
  }
}

function getPagePath(page: IPage): string {
  return `/${page.fields.slug}`;
}

function getPostPath(post: IPost): string {
  return `/blog/${post.fields.slug}`;
}

export const richTextOptions: Options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <a
          className="text-blue-700 underline hover:text-blue-400"
          target="_blank"
          rel="noreferrer"
          href={node.data.uri}
        >
          {children}
        </a>
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      return (
        <Link
          className="text-blue-700 underline hover:text-blue-400"
          to={getEntryPath(node.data.target)}
        >
          {children}
        </Link>
      );
    },
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="my-4 text-4xl font-bold tracking-tight">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="my-4 text-3xl font-bold tracking-tight">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="my-4 text-2xl font-bold tracking-tight">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="my-2 text-xl font-bold tracking-tight">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
      <h5 className="my-2 text-lg font-bold tracking-tight">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node, children) => (
      <h6 className="my-2 text-base font-bold tracking-tight">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-7">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal pl-7">{children}</ol>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-5">{children}</p>,
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-8 pl-3">{children}</blockquote>
    ),
    [BLOCKS.TABLE]: (node, children) => (
      <table className="mb-5 w-full table-auto border text-sm">
        <tbody>{children}</tbody>
      </table>
    ),
    [BLOCKS.TABLE_HEADER_CELL]: (node, children) => (
      <th className="border-b px-4 pt-4 text-left font-medium">{children}</th>
    ),
    [BLOCKS.TABLE_CELL]: (node, children) => (
      <td className="border-b px-4 pt-4">{children}</td>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
      const asset = node.data.target as SpecificLocale<Asset>;
      return <ContentfulAsset asset={asset} />;
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
      const contentType: CONTENT_TYPE = node.data.target.sys.contentType.sys.id;
      if (contentType === "hero") {
        const fields = node.data.target
          .fields as SpecificLocaleFields<IHeroFields>;
        return (
          <Hero
            title={fields.title}
            size={fields.size}
            pretext={fields.pretext}
            subtext={fields.subtext}
            background={getHeroBackground(fields)}
            button={getButtonProps(fields)}
          />
        );
      } else if (contentType === "feature") {
        const fields = node.data.target
          .fields as SpecificLocaleFields<IFeatureFields>;
        return (
          <Feature
            title={fields.title}
            description={fields.body}
            imageProps={fields.image && getImageProps(fields.image)}
            contentPosition={fields.contentPosition}
            textAlign={fields.textAlign}
            backgroundColor={fields.backgroundColor}
            button={getButtonProps(fields)}
          />
        );
      } else if (contentType === "gridSection") {
        const fields = node.data.target
          .fields as SpecificLocaleFields<IGridSectionFields>;
        return (
          <Inset>
            <SectionComponent title={fields.title} subtext={fields.subtext}>
              <Grid carousel cols={fields.maxColumns}>
                {fields.cards.map((card, index) => {
                  return (
                    <Card
                      key={index}
                      title={card.fields.title}
                      description={card.fields.body}
                      imageProps={
                        card.fields.image && getImageProps(card.fields.image)
                      }
                      button={getButtonProps(card.fields)}
                    />
                  );
                })}
              </Grid>
            </SectionComponent>
          </Inset>
        );
      } else if (contentType === "accordion") {
        const fields = node.data.target
          .fields as SpecificLocaleFields<IAccordionFields>;
        return (
          <Inset>
            <Accordion
              title={fields.title}
              pretext={fields.pretext}
              items={fields.accordionItems.map((item) => ({
                title: item.fields.title,
                body: item.fields.body,
              }))}
              ariaIdPrefix={node.data.target.sys.id}
            />
          </Inset>
        );
      } else if (
        contentType === "accordionItem" ||
        contentType === "card" ||
        contentType === "migration" ||
        contentType === "page" ||
        contentType === "post"
      ) {
        // This is intentionally empty to capture content types that we know exist and are confident will never be embedded in a rich text document
        // It's here to make the assertUnreachable(contentType) below help us catch new content types and either add to this list, or handle appropriately above
      } else {
        assertUnreachable(contentType);
      }
    },
  },
};

type SectionType = "full" | "inset";

export interface Section {
  type: SectionType;
  nodes: TopLevelBlock[];
}

// This is used to separate parts of a rich text field into sections so we can wrap them differently (inset on the page vs. full width, etc.)
export function getSections(document: Document): Section[] {
  const sectionTypes: { [key in BLOCKS]?: SectionType } = {
    [BLOCKS.EMBEDDED_ENTRY]: "full",
  };
  const defaultSectionType: SectionType = "inset";
  return document.content.reduce<Section[]>((sections, node) => {
    // Figure out what section type we're aiming for for this node
    const targetSectionType = sectionTypes[node.nodeType] || defaultSectionType;
    // Get the last element of our sections array for the current section
    const section = sections.at(-1);
    if (section && section.type === targetSectionType) {
      // We have a section and it matches our target type, so add our node
      section.nodes.push(node);
    } else {
      // We either don't have a section at all, or it doesn't match our target type, so create a new one with our node in it
      sections.push({
        type: targetSectionType,
        nodes: [node],
      });
    }
    return sections;
  }, []);
}

export function createDocumentFromSection(section: Section): Document {
  return { content: section.nodes, nodeType: BLOCKS.DOCUMENT, data: {} };
}

// This is used to generate a 155 character description (for the meta description tag) from a Contentful node tree
export function getDescriptionFromNode(
  node: Block | Inline,
  description: string = ""
): string {
  for (const childNode of node.content) {
    if (description.length >= 150) {
      // We need at least 5 free characters (out of 155) to add another word, so if we're at 150 or greater, we're done
      break;
    }
    if (childNode.nodeType === "text") {
      // This is text, so add it one word at a time up to our length limit
      // The trim() is to remove carriage returns
      const words = childNode.value.trim().split(/\s+/);
      for (const word of words) {
        // We're tracking towards a total description length of 155
        // We need 5 characters for ` ${word} ...` (two surrounding spaces and three periods for the ellipsis)
        // That means the max word length we're looking for is the difference between 150 and our current description length
        const maxWordLength = 150 - description.length;
        if (word.length <= maxWordLength) {
          // The word fits
          if (description !== "") {
            // If there's something in the description already, then prepend a space (there's a word before this word)
            description += " ";
          }
          description += word;
        } else {
          // This word doesn't fit, so add an ellipsis then break
          description += " ...";
          break;
        }
      }
    } else {
      // Keep going deeper in the tree to find some text to add to the description
      description = getDescriptionFromNode(childNode, description);
    }
  }
  return description;
}
