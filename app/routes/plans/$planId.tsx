import type { Macronutrient, Meal, Plan } from "@prisma/client";
import { prisma } from "~/db.server";
import { Outlet } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { dailyCheckboxes } from "~/cookies";
import {
  DailyCheckboxState,
  DailyCheckboxPersistedSchema,
  emptyDailyCheckboxState,
} from "./daily-checkboxes";

export interface LoaderData {
  plan: Plan & {
    macros: Macronutrient[];
    meals: Meal[];
  };
  checkboxes: DailyCheckboxState;
}
export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const planId = params.planId;
  invariant(planId, "planId is part of route and can never be undefined");
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    rejectOnNotFound: true,
    include: {
      macros: true,
      meals: true,
    },
  });
  const checkboxCookie = JSON.parse(
    dailyCheckboxes.parse(request.headers.get("Cookie")) || "null"
  );
  const result = DailyCheckboxPersistedSchema.safeParse(checkboxCookie);
  if (!result.success) {
    console.log("got a misshapen cookie", result.error);
    console.log(checkboxCookie);
  }

  return {
    plan,
    checkboxes: result.success ? result.data.state : emptyDailyCheckboxState(),
  };
};
export default function PlanIdRoot() {
  return <Outlet />;
}
