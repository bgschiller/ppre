import type { Macronutrient, Meal, Plan } from "@prisma/client";
import { prisma } from "~/db.server";

function randomShortId(): string {
  return Math.random().toString(36).slice(-6);
}

export function createPlan(): Promise<Plan> {
  return prisma.plan.create({
    data: {
      id: randomShortId(),
    },
  });
}

type CreateMacronutrientReturn =
  | [errors: null, macro: Macronutrient]
  | [errors: Record<string, string>, macro: null];
export async function createMacronutrient(
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

type CreateMealReturn =
  | [errors: null, meal: Meal]
  | [errors: Record<string, string>, meal: null];
export async function createMeal(
  data: FormData,
  planId: string
): Promise<CreateMealReturn> {
  const name = data.get("newMeal");
  console.log("name is", name);
  if (!name || typeof name !== "string")
    return [{ name: "Must pass a name for the meal" }, null];
  try {
    const meal = await prisma.meal.create({
      data: {
        name,
        planId,
      },
    });
    return [null, meal];
  } catch (err) {
    if (/Unique constraint failed on the fields/.test(err as string)) {
      return [
        {
          newMeal: `There is already a meal called "${name}" for this plan`,
        },
        null,
      ];
    }
    throw err;
  }
}
