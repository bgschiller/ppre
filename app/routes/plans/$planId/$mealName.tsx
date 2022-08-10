import type { MealNeed } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { ClientOnly, useHydrated } from "remix-utils";
import invariant from "tiny-invariant";
import { Checkbox, links as checkboxLinks } from "~/components/Checkbox";
import { prisma } from "~/db.server";
import { useMatchesData } from "~/utils";
import { useDailyCheckbox, useNotesStore } from "../daily-checkboxes";
import type { LoaderData as PlanDetailData } from "../$planId";

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
            <Checkbox
              key={ix}
              dashed={ix > minimum}
              checked={ix < value}
              onChange={() =>
                onChange({
                  macroName,
                  count: value + (ix < value ? -1 : 1),
                })
              }
            />
          ))}
      </div>
    </div>
  );
}

function Notes({ mealName }: { mealName: string }) {
  const notesStore = useNotesStore();

  return (
    <ClientOnly
      fallback={
        <textarea
          key="server"
          placeholder="loading..."
          disabled
          rows={3}
          className="mt-4 rounded"
        />
      }
    >
      {() => (
        <textarea
          key="client"
          className="mt-4 rounded"
          value={notesStore.notes[mealName]}
          placeholder={"notes"}
          rows={3}
          onChange={(e) =>
            notesStore.setNotes({ meal: mealName, notes: e.target.value })
          }
        />
      )}
    </ClientOnly>
  );
}

export default function PlanView() {
  const { mealName, needs } = useLoaderData<LoaderData>();
  const { plan, checkboxes } = useMatchesData(
    "routes/plans/$planId"
  ) as unknown as PlanDetailData;

  const hydrated = useHydrated();

  const mealStore = useDailyCheckbox();
  console.log("checkboxes", checkboxes);
  const mealState = hydrated
    ? mealStore.meals[mealName]
    : checkboxes.meals[mealName];
  console.log("mealState", mealState);
  const onTickChange: MacroRowProps["onChange"] = ({ macroName, count }) => {
    mealStore.setTicks({ meal: mealName, macro: macroName, ticks: count });
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
            value={mealState?.[n.macroName] || 0}
            onChange={onTickChange}
          />
        ))}
        <Notes mealName={mealName} />
      </div>
    </main>
  );
}
