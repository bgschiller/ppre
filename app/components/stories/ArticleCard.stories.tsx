import type { ComponentMeta } from "@storybook/react";
import { ArticleCard } from "../ArticleCard";
import { makeTemplate } from "./utils";
import mountainsImage from "./assets/mountains.jpg";

export default {
  title: "DEPT® Dash/Article Card",
  component: ArticleCard,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ArticleCard>;

export const Basic = makeTemplate(ArticleCard);
Basic.args = {
  imageProps: { src: mountainsImage, alt: "test" },
  category: { label: "Blog", to: "/" },
  date: "Dec 2022",
  title:
    "The main component title would sit here and can span across as many lines as you wish.",
  buttonTo: "/",
};
