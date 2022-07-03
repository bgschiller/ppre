import type { Plan, Macronutrient, Meal } from "@prisma/client";
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

function WaterDroplets({ total }: { total: number }) {
  return (
    <div className="flex flex-col ml-4">
      {Array(total).fill(null).map((_, ix) => (
        <span key={ix}>💧</span>
      ))}
    </div>
  );
}

function MealButton({ meal }: { meal: Meal }) {
  return <Button className="my-2" to={`/plans/${meal.planId}/${meal.name}`}>{meal.name}</Button>;
}

export default function PlanView() {
  const { plan } = useLoaderData<LoaderData>();
  return (
    <main className="mx-auto">
      <h1 className="text-xl">{plan.name || "(untitled-plan)"}</h1>
      <div className="flex flex-row">
        <div className="flex flex-col">
        {plan.meals.map((m) => (
          <MealButton key={m.name} meal={m} />
        ))}
        </div>
        {plan.waterDrops && <WaterDroplets total={plan.waterDrops} />}
      </div>
    </main>
  );
}
