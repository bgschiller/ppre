import type { Plan, Macronutrient, Meal, MealNeed } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { Button } from "~/components/Button";
import { prisma } from "~/db.server";

interface LoaderData {
  plan: Plan & {
    macros: Macronutrient[];
    meals: Meal[];
  };
  mealName: string;
  needs: MealNeed[];
}
export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const planId = params.planId;
  const mealName = params.mealName;
  invariant(planId, "planId is part of route and can never be undefined");
  invariant(mealName, "mealName is part of route and can never be undefined");
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    rejectOnNotFound: true,
    include: {
      macros: true,
      meals: true,
    },
  });
  const needs = await prisma.mealNeed.findMany({
    where: { planId, mealName },
  });
  return {
    plan,
    mealName,
    needs,
  };
};

function MacroRow({
  macroName,
  minimum,
  maximum,
}: Pick<MealNeed, "macroName" | "minimum" | "maximum">) {
  if (maximum === 0) return null;

  return (
    <div className="flex flex-row">
      <span>{macroName}</span>
      <div className="flex flex-row items-center">
        {Array(maximum)
          .fill(null)
          .map((_, ix) => (
            <input className="m-2" key={ix} type="checkbox" />
          ))}
      </div>
    </div>
  );
}
export default function PlanView() {
  const { plan, needs } = useLoaderData<LoaderData>();
  return (
    <main className="mx-auto">
      <h1 className="text-xl">{plan.name || "(untitled-plan)"}</h1>
      <div className="flex flex-col">
        {needs.map((n) => (
          <MacroRow key={n.macroName} {...n} />
        ))}
      </div>
    </main>
  );
}
