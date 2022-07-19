import { Form, useLoaderData, useLocation } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { LoaderFunction } from "@storybook/csf";
import { Button } from "~/components/Button";
import { planId as planIdCookie } from "~/cookies";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const planId = body.get("planId");
  if (typeof planId === "string") {
    return redirect(`/plans/${planId}`, {
      headers: { "set-cookie": await planIdCookie.serialize(planId) },
    });
  }
  return {};
};

interface LoaderData {
  planId: string | null;
}
export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const url = new URL(request.url);
  const queryPlanId = url.searchParams.get("planId");
  const cookiePlanId = await planIdCookie.parse(request.headers.get("cookie"));
  if (cookiePlanId && queryPlanId === null) {
    return redirect(`/plans/${cookiePlanId}`);
  }
  return { planId: queryPlanId };
};

export default function Index() {
  const { planId } = useLoaderData<LoaderData>();
  return (
    <main className="mx-auto">
      <Form method="post" className="max-w-xl space-y-6">
        <p>If your provider gave you a code to use, enter it here:</p>
        <p className="flex flex-row justify-around">
          <input
            className="border-2 py-2"
            type="text"
            name="planId"
            defaultValue={planId || undefined}
            placeholder="plan id, eg 1x32hy"
          />
          <input
            type="submit"
            className="inline-block border-2 border-2 border-indigo-600 bg-indigo-600 py-2 px-5 text-white hover:bg-indigo-500"
            value="Use plan"
          />
        </p>
      </Form>

      {!planId && (
        <p className="mx-auto mt-8 flex justify-center">
          <Button to="/plans/new">Create a new Plan</Button>
        </p>
      )}
    </main>
  );
}
