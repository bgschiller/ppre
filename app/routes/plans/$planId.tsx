import { Plan, Macronutrient, Meal } from "@prisma/client";
import { prisma } from "~/db.server";
import { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { Outlet } from "@remix-run/react";

interface LoaderData {
  plan: Plan & {
    macros: Macronutrient[];
    meals: Meal[];
  };
}

export const loader: LoaderFunction = async ({
  params,
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
  return {
    plan,
  };
};

export default function PlanIdRoot() {
  return <Outlet />;
}
