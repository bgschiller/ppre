-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "waterDrops" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "name" TEXT NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("planId","name")
);

-- CreateTable
CREATE TABLE "Macronutrient" (
    "name" TEXT NOT NULL,
    "guidance" TEXT NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "Macronutrient_pkey" PRIMARY KEY ("planId","name")
);

-- CreateTable
CREATE TABLE "MealNeed" (
    "planId" TEXT NOT NULL,
    "mealName" TEXT NOT NULL,
    "macroName" TEXT NOT NULL,
    "minimum" INTEGER NOT NULL,
    "maximum" INTEGER NOT NULL,

    CONSTRAINT "MealNeed_pkey" PRIMARY KEY ("planId","mealName","macroName")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Macronutrient" ADD CONSTRAINT "Macronutrient_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealNeed" ADD CONSTRAINT "MealNeed_planId_mealName_fkey" FOREIGN KEY ("planId", "mealName") REFERENCES "Meal"("planId", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealNeed" ADD CONSTRAINT "MealNeed_planId_macroName_fkey" FOREIGN KEY ("planId", "macroName") REFERENCES "Macronutrient"("planId", "name") ON DELETE CASCADE ON UPDATE CASCADE;
