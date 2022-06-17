import type { Macronutrient, Meal, Plan } from "@prisma/client";
import { Link, useFetcher, useFetchers, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { LabelledInput } from "~/components/LabelledInput";
import { prisma } from "~/db.server";

type CreateMacronutrientReturn =
  | [errors: null, macro: Macronutrient]
  | [errors: Record<string, string>, macro: null];
async function createMacronutrient(
  data: FormData,
  planId: string
): Promise<CreateMacronutrientReturn> {
  const name = data.get("newMacro");
  console.log("name is", name);
  if (!name || typeof name !== "string")
    return [{ name: "Must pass a name for the macronutrient" }, null];
  try {
    const macro = await prisma.macronutrient.create({
      data: {
        name,
        planId,
        guidance: "",
      },
    });
    return [null, macro];
  } catch (err) {
    if (/Unique constraint failed on the fields/.test(err as string)) {
      return [
        {
          newMacro: `There is already a macronutrient called "${name}" for this plan`,
        },
        null,
      ];
    }
    throw err;
  }
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
  | {
      _action: "add-macronutrient";
      errors: { newMacro?: string };
      values: { newMacro?: string };
    };

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<ActionData | Response> => {
  const planId = params.planId;
  invariant(planId, "planId is part of route and can never be undefined");

  const body = await request.formData();
  const _action = body.get("_action");
  if (_action === "add-macronutrient") {
    const [errors] = await createMacronutrient(body, planId);
    if (errors) return { errors, values: Object.fromEntries(body), _action };
    return redirect(request.url);
  } else if (_action === "del-macronutrient") {
    const error = await delMacronutrient(body, planId);
    if (error) return { error, _action };
    return redirect(request.url);
  } else {
    throw new Error("unknown action: " + _action);
  }
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

function NewMacro() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);
  let actionData: ActionData | null = fetcher.data;
  if (actionData?._action !== "add-macronutrient") {
    actionData = null;
  }
  useEffect(() => {
    if (fetcher.state === "submitting") {
      formRef.current?.reset();
    }
  }, [fetcher.state]);
  return (
    <fetcher.Form method="post" ref={formRef}>
      <LabelledInput
        name="newMacro"
        placeholder="eg, Protein"
        defaultValue={actionData?.values.newMacro}
        label="New macronutrient"
        button={{
          action: "add-macronutrient",
          text: "Add",
        }}
        error={actionData?.errors.newMacro}
      />
    </fetcher.Form>
  );
}

function Macro({ planId, name }: { name: string; planId?: string }) {
  const fetcher = useFetcher();
  if (!planId)
    return (
      <li>
        {name}
        <button>&times;</button>
      </li>
    );
  const isDeleting = fetcher.state !== "idle";
  return (
    <li className={isDeleting ? "hidden" : "flex"} hidden={isDeleting}>
      <Link to={`/plans/edit/${planId}/macros/${name}`}>{name}</Link>
      <fetcher.Form method="post">
        <input type="hidden" name="_action" value="del-macronutrient" />
        <input type="hidden" name="name" value={name} />
        <input type="submit" value="&times;" />
      </fetcher.Form>
    </li>
  );
}

function EditMacros({ plan }: Pick<LoaderData, "plan">) {
  const fetchers = useFetchers();
  const inProgressMacros = fetchers
    .filter(
      (f) =>
        f.submission &&
        f.submission.action === `/plans/edit/${plan.id}` &&
        f.submission.formData.get("_action") === "add-macronutrient"
    )
    .map((f) => f.submission?.formData.get("newMacro") as string);
  return (
    <section className="my-10">
      <h2 className="mb-2 text-lg">Macronutrients</h2>
      <ul>
        {plan.macros.map((m) => (
          <Macro key={m.name} {...m} />
        ))}
        {inProgressMacros.map((m) => (
          <Macro key={`in-progress:${m}`} name={m} />
        ))}
      </ul>
      {plan.macros.length === 0 && inProgressMacros.length === 0 ? (
        <p className="mb-2">(none so far)</p>
      ) : null}
      <NewMacro />
    </section>
  );
}

export default function EditPlan() {
  const { plan } = useLoaderData<LoaderData>();

  return (
    <main className="align-center mx-auto flex flex-col">
      <h1 className="mb-10 text-xl">Edit your plan</h1>

      <section className="my-10">
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
    </main>
  );
}
