import { createCookie } from "@remix-run/node";
import { getEnv } from "./utils";

const ORIGIN = getEnv("PUBLICLY_AVAILABLE_ORIGIN", { default: null });
const HOST =
  (ORIGIN && !ORIGIN.includes("localhost") && new URL(ORIGIN).host) ||
  undefined;
export const planId = createCookie("plan-id", {
  domain: HOST,
  secrets: ["s3cret1"],
});

export const dailyCheckboxes = createCookie("daily-checkboxes", {
  domain: HOST,
});
