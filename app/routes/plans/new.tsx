// /plans/new should create an empty plan and redirect
// to /plans/edit/$planId

import { redirect } from "@remix-run/server-runtime";
import { createPlan } from "~/models/plan.server";

export async function loader() {
  const plan = await createPlan();
  return redirect(`/plans/edit/${plan.id}`);
}
