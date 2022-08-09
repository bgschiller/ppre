import type { Plan, Macronutrient, Meal } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useCallback } from "react";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { Button } from "~/components/Button";
import { Star } from "~/components/Star";
import { WaterDroplet } from "~/components/WaterDroplet";
import { prisma } from "~/db.server";
import { useDailyCheckbox, useNotesStore } from "../daily-checkboxes";

export interface LoaderData {
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

function Exercise() {
  const [exercise, setExercise] = useDailyCheckbox((state) => [
    state.exercise,
    state.setExercise,
  ]);

  return (
    <ClientOnly
      fallback={
        <button className="my-2 flex w-full select-none items-center bg-purple-600 px-4 text-white ">
          <Star className="my-2" />
          <span className="pl-2">Exercise</span>
        </button>
      }
    >
      {() => (
        <button
          className="my-2 flex w-full select-none items-center bg-purple-600 px-4 text-white hover:bg-purple-700"
          onClick={() => setExercise(!exercise)}
        >
          <Star className="my-2" filled={exercise} />
          <span className="pl-2">Exercise</span>
        </button>
      )}
    </ClientOnly>
  );
}

function WaterDroplets({ total }: { total: number }) {
  const [glassesWater, setGlassesWater] = useDailyCheckbox((state) => [
    state.glassesWater,
    state.setGlassesWater,
  ]);

  const fillFraction = glassesWater / (total * 1.0);

  return (
    <div className="flex flex-row items-center">
      <ClientOnly
        fallback={
          <>
            <div className="select-none text-center">
              <span>?</span>
              <span>/</span>
              <span>{total}</span>
            </div>
            <WaterDroplet fillFraction={0} className="my-1" />
          </>
        }
      >
        {() => (
          <>
            <div className="select-none text-center">
              <span>{glassesWater}</span>
              <span>/</span>
              <span>{total}</span>
            </div>
            <WaterDroplet
              fillFraction={fillFraction}
              className="my-1"
              onClick={() => setGlassesWater((glassesWater + 1) % (total + 1))}
            />
          </>
        )}
      </ClientOnly>
    </div>
  );
}

function MealButton({ meal }: { meal: Meal }) {
  return (
    <Button
      className="my-2 select-none"
      to={`/plans/${meal.planId}/${meal.name}`}
    >
      {meal.name}
    </Button>
  );
}

export default function PlanView() {
  const { plan } = useLoaderData<LoaderData>();
  const clearChecks = useDailyCheckbox((state) => state.clear);
  const clearNotes = useNotesStore((state) => state.clear);
  const clear = useCallback(() => {
    clearChecks();
    clearNotes();
  }, [clearChecks, clearNotes]);
  return (
    <main className="mx-auto">
      <h1 className="mb-4 select-none text-center text-xl">
        {plan.name || "(untitled-plan)"}
      </h1>
      <div className="flex flex-row">
        <div className="flex flex-col">
          {plan.meals.map((m) => (
            <MealButton key={m.name} meal={m} />
          ))}
        </div>
      </div>
      <Exercise />
      <div className="my-4 flex flex-row justify-between align-middle">
        <button
          className="w-16 select-none rounded bg-orange-500 py-2 text-white hover:bg-orange-600"
          onClick={clear}
        >
          Clear
        </button>

        {plan.waterDrops && <WaterDroplets total={plan.waterDrops} />}
      </div>
    </main>
  );
}
