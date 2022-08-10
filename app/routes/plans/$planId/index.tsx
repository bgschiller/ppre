import type { Meal } from "@prisma/client";
import { ClientOnly, useHydrated } from "remix-utils";
import { Button } from "~/components/Button";
import { Star } from "~/components/Star";
import { WaterDroplet } from "~/components/WaterDroplet";
import { useMatchesData } from "~/utils";
import { useDailyCheckbox, useNotesStore } from "../daily-checkboxes";
import type { LoaderData as PlanDetailData } from "../$planId";
import { useCallback } from "react";

function Exercise({ checked }: { checked: boolean }) {
  const [exercise, setExercise] = useDailyCheckbox((state) => [
    state.exercise,
    state.setExercise,
  ]);

  return (
    <ClientOnly
      fallback={
        <button className="my-2 flex w-full select-none items-center bg-purple-600 px-4 text-white ">
          <Star className="my-2" filled={checked} />
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

function WaterDroplets({ total, current }: { total: number; current: number }) {
  const [_glassesWater, setGlassesWater] = useDailyCheckbox((state) => [
    state.glassesWater,
    state.setGlassesWater,
  ]);

  const hydrated = useHydrated();
  const glassesWater = hydrated ? _glassesWater : current;
  const fillFraction = glassesWater / (total * 1.0);

  return (
    <div className="flex flex-row items-center">
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
  const { plan, checkboxes } = useMatchesData(
    "routes/plans/$planId"
  ) as unknown as PlanDetailData;
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
      <Exercise checked={checkboxes.exercise} />
      <div className="my-4 flex flex-row justify-between align-middle">
        <button
          className="w-16 select-none rounded bg-orange-500 py-2 text-white hover:bg-orange-600"
          onClick={clear}
        >
          Clear
        </button>

        {plan.waterDrops && (
          <WaterDroplets
            current={checkboxes.glassesWater}
            total={plan.waterDrops}
          />
        )}
      </div>
    </main>
  );
}
