import type { ComponentMeta } from "@storybook/react";
import { Card } from "../Card";
import { GalleryCard } from "../GalleryCard";
import { Grid } from "../Grid";
import { GalleryGrid } from "../GalleryGrid";
import { Section } from "../Section";
import { makeTemplate } from "./utils";
import { ArticleCard } from "../ArticleCard";
import logoImage from "./assets/logo.svg";
import chatBubbleImage from "./assets/chat-bubble.jpg";
import paintImage from "./assets/paint.jpg";
import mountainsImage from "./assets/mountains.jpg";

export default {
  title: "DEPT® Dash/Section",
  component: Section,
} as ComponentMeta<typeof Section>;

export const Basic = makeTemplate(Section);
Basic.args = {
  title: "Section title",
  subtext: "Section subtext",
  children: (
    <>
      <Grid cols={3}>
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
      </Grid>
    </>
  ),
};

export const Gallery = makeTemplate(Section);
Gallery.args = {
  imageProps: { src: paintImage, alt: "test" },
  children: (
    <>
      <GalleryGrid>
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
      </GalleryGrid>
    </>
  ),
};

export const Logos = makeTemplate(Section);
Logos.args = {
  title: "Section title",
  children: (
    <>
      <Grid cols={8}>
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
      </Grid>
    </>
  ),
};

export const Articles = makeTemplate(Section);
Articles.args = {
  title: "Section title",
  children: (
    <>
      <Grid cols={3}>
        <ArticleCard
          imageProps={{ src: mountainsImage, alt: "test" }}
          category={{ label: "Blog", to: "/" }}
          date="Dec 2022"
          title="The main component title would sit here and can span across as many lines as you wish."
          buttonTo="/"
        />
        <ArticleCard
          imageProps={{ src: mountainsImage, alt: "test" }}
          category={{ label: "Blog", to: "/" }}
          date="Dec 2022"
          title="The main component title would sit here and can span across as many lines as you wish."
          buttonTo="/"
        />
        <ArticleCard
          imageProps={{ src: mountainsImage, alt: "test" }}
          category={{ label: "Blog", to: "/" }}
          date="Dec 2022"
          title="The main component title would sit here and can span across as many lines as you wish."
          buttonTo="/"
        />
      </Grid>
    </>
  ),
};
