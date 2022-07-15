import type { Plan, Macronutrient, Meal, MealNeed } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { ChangeEvent, useMemo } from "react";
import invariant from "tiny-invariant";
import { Checkbox, links as checkboxLinks } from "~/components/Checkbox";
import { prisma } from "~/db.server";
import { useMatchesData } from "~/utils";
import { useDailyCheckbox } from "../daily-checkboxes";
import { LoaderData as PlanDetailData } from "./index";

export function links() {
  return [...checkboxLinks()];
}

interface LoaderData {
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
  const needs = await prisma.mealNeed.findMany({
    where: { planId, mealName },
  });
  return {
    mealName,
    needs,
  };
};

type MacroRowProps = Pick<MealNeed, "macroName" | "minimum" | "maximum"> & {
  onChange(args: { macroName: string; count: number }): void;
  value: number;
};

function MacroRow({
  macroName,
  minimum,
  maximum,
  value,
  onChange,
}: MacroRowProps) {
  if (maximum === 0) return null;

  function tickChange(e: ChangeEvent<HTMLInputElement>) {
    onChange({ macroName, count: value + (e.target.checked ? 1 : -1) });
  }

  return (
    <div className="flex flex-row">
      <span className="w-24">{macroName}</span>
      <div className="flex flex-row items-center">
        {Array(maximum)
          .fill(null)
          .map((_, ix) => (
            <Checkbox
              key={ix}
              dashed={ix > minimum}
              checked={ix < value}
              onChange={tickChange}
            />
          ))}
      </div>
    </div>
  );
}
export default function PlanView() {
  const { mealName, needs } = useLoaderData<LoaderData>();
  const { plan } = useMatchesData(
    "routes/plans/$planId"
  ) as unknown as PlanDetailData;

  const store = useDailyCheckbox();
  const mealState = store.meals[mealName];
  const onTickChange: MacroRowProps["onChange"] = ({ macroName, count }) => {
    store.setTicks({ meal: mealName, macro: macroName, ticks: count });
  };
  return (
    <main className="mx-auto w-64">
      <h1 className="mb-4 text-xl">{mealName}</h1>
      <div className="flex flex-col">
        {needs.map((n) => (
          <MacroRow
            key={n.macroName}
            {...n}
            value={mealState?.ticks?.[n.macroName] || 0}
            onChange={onTickChange}
          />
        ))}
      </div>
    </main>
  );
}
