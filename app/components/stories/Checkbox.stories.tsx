import type { ComponentMeta } from "@storybook/react";
import { Checkbox } from "../Checkbox";
import { makeTemplate } from "./utils";

export default {
  title: "PPRE/Checkbox",
  component: Checkbox,
  decorators: [
    (Story) => (
      <div className="mx-auto flex max-w-md justify-center">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Checkbox>;

export const Basic = makeTemplate(Checkbox);
Basic.args = {};

export const Dashed = makeTemplate(Checkbox);
Dashed.args = {
  dashed: true,
};
