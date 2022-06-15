import type { LoaderFunction } from "@remix-run/server-runtime";
import * as routeUtils from "~/route-utils";

export const meta = routeUtils.meta;

export const loader: LoaderFunction =
  routeUtils.getContentfulPageLoader("home");

export default routeUtils.ContentfulPageComponent;
