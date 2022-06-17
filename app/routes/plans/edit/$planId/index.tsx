import type { Macronutrient, Meal, Plan } from "@prisma/client";
import { Link, useFetcher, useFetchers, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { LabelledInput } from "~/components/LabelledInput";
import { prisma } from "~/db.server";
import { createMacronutrient, createMeal } from "~/models/plan.server";
import { assertUnreachable } from "~/utils";

async function delMeal(data: FormData, planId: string): Promise<string | null> {
  const name = data.get("name") as string;

  return prisma.meal
    .delete({
      where: { planId_name: { planId, name } },
    })
    .then(() => null)
    .catch((err) => err.toString());
}

async function delMacronutrient(
  data: FormData,
  planId: string
): Promise<string | null> {
  const name = data.get("name") as string;

  return prisma.macronutrient
    .delete({
      where: { planId_name: { planId, name } },
    })
    .then(() => null)
    .catch((err) => err.toString());
}

type ActionData =
  | { _action: "del-macronutrient"; error: string }
  | { _action: "del-meal"; error: string }
  | {
      _action: "add-macronutrient";
      errors: { newMacro?: string };
      values: { newMacro?: string };
    }
  | {
      _action: "add-meal";
      errors: { newMeal?: string };
      values: { newMeal?: string };
    };

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<ActionData | Response> => {
  const planId = params.planId;
  invariant(planId, "planId is part of route and can never be undefined");

  const body = await request.formData();
  const _action = body.get("_action") as ActionData["_action"];
  if (_action === "add-macronutrient") {
    const [errors] = await createMacronutrient(body, planId);
    if (errors) return { errors, values: Object.fromEntries(body), _action };
    return redirect(request.url);
  } else if (_action === "add-meal") {
    const [errors] = await createMeal(body, planId);
    if (errors) return { errors, values: Object.fromEntries(body), _action };
    return redirect(request.url);
  } else if (_action === "del-macronutrient") {
    const error = await delMacronutrient(body, planId);
    if (error) return { error, _action };
    return redirect(request.url);
  } else if (_action === "del-meal") {
    const error = await delMeal(body, planId);
    if (error) return { error, _action };
    return redirect(request.url);
  }
  assertUnreachable(_action);
};

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

function mkNewItem({
  addAction,
  name,
  placeholder,
  label,
}: {
  addAction: "add-meal" | "add-macronutrient";
  name: string;
  placeholder: string;
  label: string;
}) {
  return function NewItem() {
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement | null>(null);
    let actionData_: ActionData | null = fetcher.data;
    let actionData = actionData_?._action === addAction ? actionData_ : null;
    useEffect(() => {
      if (fetcher.state === "submitting") {
        formRef.current?.reset();
      }
    }, [fetcher.state]);
    return (
      <fetcher.Form method="post" ref={formRef}>
        <LabelledInput
          name={name}
          placeholder={placeholder}
          defaultValue={(actionData?.values as any)?.[name]}
          label={label}
          button={{
            action: addAction,
            text: "Add",
          }}
          error={(actionData?.errors as any)?.[name]}
        />
      </fetcher.Form>
    );
  };
}

function mkItem({
  urlPart,
  delAction,
}: {
  urlPart: string;
  delAction: string;
}) {
  return function Item({ planId, name }: { name: string; planId?: string }) {
    const fetcher = useFetcher();
    if (!planId)
      return (
        <li className="py-1">
          {name}
          <div className="ml-4 inline-block">
            <button>&times;</button>
          </div>
        </li>
      );
    const isDeleting = fetcher.state !== "idle";
    return (
      <li className={`py-1 ${isDeleting ? "text-slate-500" : ""}`}>
        <Link to={`/plans/edit/${planId}/${urlPart}/${name}`}>{name}</Link>
        <fetcher.Form method="post" className="ml-4 inline-block">
          <input type="hidden" name="_action" value={delAction} />
          <input type="hidden" name="name" value={name} />
          <input
            type="submit"
            className="cursor-pointer"
            aria-label={`remove ${name}`}
            value="&times;"
          />
        </fetcher.Form>
      </li>
    );
  };
}
const NewMeal = mkNewItem({
  addAction: "add-meal",
  placeholder: "eg, Breakfast",
  label: "New meal",
  name: "newMeal",
});
const NewMacro = mkNewItem({
  addAction: "add-macronutrient",
  placeholder: "eg, Protein",
  label: "New macronutrient",
  name: "newMacro",
});
const MealItem = mkItem({ urlPart: "meal", delAction: "del-meal" });
const MacroItem = mkItem({ urlPart: "macros", delAction: "del-macronutrient" });

function mkEditItems({
  Item,
  NewItem,
  addAction,
  name,
  key,
  label,
}: {
  Item: typeof MealItem;
  NewItem: typeof NewMeal;
  addAction: string;
  name: string;
  label: string;
  key: "macros" | "meals";
}) {
  return function EditItems({ plan }: Pick<LoaderData, "plan">) {
    const fetchers = useFetchers();
    const inProgressItems = fetchers
      .filter(
        (f) =>
          f.submission &&
          f.submission.action === `/plans/edit/${plan.id}` &&
          f.submission.formData.get("_action") === addAction
      )
      .map((f) => f.submission?.formData.get(name) as string);
    return (
      <section className="my-5">
        <h2 className="mb-2 text-lg">{label}</h2>
        <ul className="ml-4 list-disc pb-2">
          {plan[key].map((m) => (
            <Item key={m.name} {...m} />
          ))}
          {inProgressItems.map((m) => (
            <Item key={`in-progress:${m}`} name={m} />
          ))}
        </ul>
        {plan[key].length === 0 && inProgressItems.length === 0 ? (
          <p className="mb-2">(none so far)</p>
        ) : null}
        <NewItem />
      </section>
    );
  };
}

const EditMacros = mkEditItems({
  key: "macros",
  Item: MacroItem,
  NewItem: NewMacro,
  addAction: "add-macronutrient",
  label: "Macronutrients",
  name: "newMacro",
});
const EditMeals = mkEditItems({
  key: "meals",
  Item: MealItem,
  NewItem: NewMeal,
  addAction: "add-meal",
  label: "Meals",
  name: "newMeal",
});

export default function EditPlan() {
  const { plan } = useLoaderData<LoaderData>();

  return (
    <main className="align-center mx-auto flex flex-col">
      <h1 className="mb-5 text-xl">Edit your plan</h1>

      <section className="my-5">
        <label
          htmlFor="plan-name"
          className="block text-sm font-medium text-gray-700"
        >
          Plan name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="plan-name"
            id="plan-name"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="eg, your daily needs"
          />
        </div>
      </section>

      <EditMacros plan={plan} />
      <EditMeals plan={plan} />
    </main>
  );
}
