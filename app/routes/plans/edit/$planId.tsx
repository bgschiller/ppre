import type { Macronutrient, Meal, Plan } from "@prisma/client";
import {
  Link,
  useActionData,
  useFetcher,
  useFetchers,
  useLoaderData,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

type CreateMacronutrientReturn =
  | [errors: null, macro: Macronutrient]
  | [errors: Record<string, string>, macro: null];
async function createMacronutrient(
  data: FormData,
  planId: string
): Promise<CreateMacronutrientReturn> {
  const name = data.get("name");
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
          name: `There is already a macronutrient called "${name}" for this plan`,
        },
        null,
      ];
    }
    throw err;
  }
}

type ActionData = {
  _action: "add-macronutrient";
  errors: { name?: string };
  values: { name?: string };
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
    if (errors) return json({ errors, values: Object.fromEntries(body) });
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
  request,
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
    <>
      <fetcher.Form method="post" ref={formRef}>
        <label>
          new macronutrient
          <input
            name="name"
            type="text"
            defaultValue={actionData?.values.name}
          />
        </label>
        <input type="hidden" name="_action" value="add-macronutrient" />
        <input type="submit" value="Add" />
      </fetcher.Form>
      {actionData?.errors.name ? (
        <p style={{ color: "red" }}>{actionData.errors.name}</p>
      ) : null}
    </>
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
    .map((f) => f.submission?.formData.get("name") as string);
  return (
    <>
      <h2>Macronutrients</h2>
      <ul>
        {plan.macros.map((m) => (
          <li key={m.name}>
            <Link to={`/plans/edit/${m.planId}/macros/${m.name}`}>
              {m.name}
            </Link>
          </li>
        ))}
        {inProgressMacros.map((m, ix) => (
          <li key={`in-progress:${m}`}>{m}</li>
        ))}
      </ul>
      <NewMacro />
    </>
  );
}

export default function EditPlan() {
  const { plan } = useLoaderData<LoaderData>();

  return (
    <main className="flex flex-col">
      <h1>Edit your plan</h1>

      <label>
        Plan name
        <input defaultValue={plan.name || ""} />
      </label>

      <EditMacros plan={plan} />
    </main>
  );
}
