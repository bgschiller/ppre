import type { ComponentMeta } from "@storybook/react";
import { WaterDroplet } from "../WaterDroplet";
import { makeTemplate } from "./utils";

export default {
  title: "PPRE/WaterDroplet",
  component: WaterDroplet,
} as ComponentMeta<typeof WaterDroplet>;

export const Basic = makeTemplate(WaterDroplet);
Basic.args = {
  fillFraction: 0.2,
};
