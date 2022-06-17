import type { ComponentMeta } from "@storybook/react";
import { LabelledInput } from "../LabelledInput";
import { makeTemplate } from "./utils";

export default {
  title: "PPRE/LabelledInput",
  component: LabelledInput,
} as ComponentMeta<typeof LabelledInput>;

export const Basic = makeTemplate(LabelledInput);
Basic.args = {
  label: "Email",
  name: "email",
  type: "email",
  placeholder: "eg, john@doe.com",
};

export const Errant = makeTemplate(LabelledInput);
Errant.args = {
  label: "Email",
  name: "email",
  type: "email",
  placeholder: "eg, john@doe.com",
  error: "please enter an email",
};

export const Defaulted = makeTemplate(LabelledInput);
Defaulted.args = {
  label: "Plan name",
  name: "planName",
  type: "text",
  placeholder: "eg, your daily needs",
  defaultValue: "Jim's Daily Needs",
};

export const WithButton = makeTemplate(LabelledInput);
WithButton.args = {
  label: "Add Macronutrient",
  name: "newMacro",
  type: "text",
  placeholder: "eg, Protein",
  button: {
    action: "add-macronutrient",
    text: "Add",
  },
};

export const WithButtonAndError = makeTemplate(LabelledInput);
WithButtonAndError.args = {
  label: "Add Macronutrient",
  name: "newMacro",
  type: "text",
  placeholder: "eg, Protein",
  error: "This plan already has a macronutrient of that name",
  button: {
    action: "add-macronutrient",
    text: "Add",
  },
};
