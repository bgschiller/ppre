import type { MealNeed } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { ClientOnly } from "remix-utils";
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

  return (
    <div className="flex flex-row">
      <span className="mt-2 w-24 text-xl">{macroName}</span>
      <div className="flex flex-row items-center">
        {Array(maximum)
          .fill(null)
          .map((_, ix) => (
            <ClientOnly
              key={ix}
              fallback={
                <Checkbox dashed={ix > minimum} disabled checked={false} />
              }
            >
              {() => (
                <Checkbox
                  dashed={ix > minimum}
                  checked={ix < value}
                  onChange={() =>
                    onChange({
                      macroName,
                      count: value + (ix < value ? -1 : 1),
                    })
                  }
                />
              )}
            </ClientOnly>
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
      <Link
        to={`/plans/${plan.id}`}
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
      >
        back
      </Link>
      <h1 className="mb-8 text-4xl">{mealName}</h1>
      <div className={`flex flex-col`}>
        {needs.map((n) => (
          <MacroRow
            key={n.macroName}
            {...n}
            value={mealState?.ticks?.[n.macroName] || 0}
            onChange={onTickChange}
          />
        ))}
        <ClientOnly
          fallback={
            <textarea
              value="loading..."
              disabled
              rows={3}
              className="mt-4 rounded"
            />
          }
        >
          {() => (
            <textarea
              className="mt-4 rounded"
              value={mealState?.notes}
              placeholder={"notes"}
              rows={3}
              onChange={(e) =>
                store.setNotes({ meal: mealName, notes: e.target.value })
              }
            />
          )}
        </ClientOnly>
      </div>
    </main>
  );
}
