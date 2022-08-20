import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const planId = "test";

  // cleanup the existing database
  await prisma.plan.delete({ where: { id: planId } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.plan.delete({ where: { id: "morgan-plan" } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const morganPlan = await prisma.plan.create({
    data: {
      id: "morgan-plan",
      name: "Morgan's Plan",
      macros: {
        createMany: {
          data: [
            {
              name: "Protein",
              guidance: "",
            },
            {
              name: "Starch",
              guidance: "",
            },
            {
              name: "Produce",
              guidance: "",
            },
            {
              name: "Fat",
              guidance: "",
            },
            {
              name: "Dairy",
              guidance: "",
            },
          ],
        },
      },
      meals: {
        createMany: {
          data: [
            {
              name: "Breakfast",
            },
            { name: "Lunch" },
            { name: "Afternoon Snack" },
            { name: "Dinner" },
          ],
        },
      },
    },
  });

  const plan = await prisma.plan.create({
    data: {
      id: planId,
      name: "Testing plan",
      macros: {
        createMany: {
          data: [
            {
              name: "Protein",
              guidance: "can i offer you an egg in this trying time?",
            },
            {
              name: "Carbs",
              guidance: "This is my body",
            },
            {
              name: "Fats",
              guidance: "these tend to be tasty",
            },
          ],
        },
      },
      meals: {
        createMany: {
          data: [
            {
              name: "Breakfast",
            },
            {
              name: "Morning snack",
            },
            {
              name: "Lunch",
            },
            { name: "Afternoon snack" },
            {
              name: "Dinner",
            },
          ],
        },
      },
    },
  });

  await prisma.mealNeed.createMany({
    data: [
      ...(
        [
          ["Protein", 3],
          ["Starch", 2],
          ["Produce", 1],
          ["Dairy", 2],
        ] as const
      ).map(([macroName, num]) => ({
        planId: "morgan-plan",
        mealName: "Breakfast",
        macroName,
        minimum: num,
        maximum: num,
      })),
      ...(
        [
          ["Protein", 3],
          ["Starch", 3],
          ["Produce", 2],
          ["Fat", 2],
          ["Dairy", 1],
        ] as const
      ).map(([macroName, num]) => ({
        planId: "morgan-plan",
        mealName: "Lunch",
        macroName,
        minimum: num,
        maximum: num,
      })),
      ...(
        [
          ["Protein", 1],
          ["Produce", 1],
        ] as const
      ).map(([macroName, num]) => ({
        planId: "morgan-plan",
        mealName: "Afternoon Snack",
        macroName,
        minimum: num,
        maximum: num,
      })),
      ...(
        [
          ["Protein", 3],
          ["Starch", 3],
          ["Produce", 2],
          ["Fat", 1],
          ["Dairy", 1],
        ] as const
      ).map(([macroName, num]) => ({
        planId: "morgan-plan",
        mealName: "Dinner",
        macroName,
        minimum: num,
        maximum: num,
      })),
    ],
  });

  await prisma.mealNeed.createMany({
    data: [
      {
        planId: plan.id,
        mealName: "Breakfast",
        macroName: "Protein",
        minimum: 1,
        maximum: 3,
      },
      {
        planId: plan.id,
        mealName: "Breakfast",
        macroName: "Carbs",
        minimum: 2,
        maximum: 2,
      },
      {
        planId: plan.id,
        mealName: "Breakfast",
        macroName: "Fats",
        minimum: 2,
        maximum: 3,
      },
      {
        planId: plan.id,
        mealName: "Morning snack",
        macroName: "Protein",
        minimum: 0,
        maximum: 1,
      },
      {
        planId: plan.id,
        mealName: "Morning snack",
        macroName: "Carbs",
        minimum: 1,
        maximum: 1,
      },
      {
        planId: plan.id,
        mealName: "Morning snack",
        macroName: "Fats",
        minimum: 0,
        maximum: 1,
      },
    ],
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
