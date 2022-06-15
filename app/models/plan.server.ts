import type { Plan } from "@prisma/client";
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
