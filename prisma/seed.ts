import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const planId = "test";

  // cleanup the existing database
  await prisma.plan.delete({ where: { id: planId } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  prisma.plan.create({
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
    },
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
