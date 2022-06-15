import type { ComponentMeta } from "@storybook/react";
import { ContactForm } from "../ContactForm";
import { makeTemplate } from "./utils";

export default {
  title: "DEPT® Dash/Contact Form",
  component: ContactForm,
} as ComponentMeta<typeof ContactForm>;

export const Basic = makeTemplate(ContactForm);
Basic.args = {
  title: "The main component title would sit here",
};
