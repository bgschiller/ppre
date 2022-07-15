import create from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";

// eg, { Protein: 2, Grains: 3, notes: "..." }
type MealData = { notes: string; ticks: { [macro: string]: number } };

export interface DailyCheckboxStore {
  lastEditUnixMs: number;
  meals: { [mealName: string]: MealData | undefined };
  setTicks(args: { meal: string; macro: string; ticks: number }): void;
  setNotes(args: { meal: string; notes: string }): void;
}

export const useDailyCheckbox = create<DailyCheckboxStore>(
  // persist(
  (set) => ({
    lastEditUnixMs: +new Date(),
    meals: {},
    setTicks({
      meal,
      macro,
      ticks,
    }: {
      meal: string;
      macro: string;
      ticks: number;
    }) {
      set(
        produce((store: DailyCheckboxStore) => {
          store.lastEditUnixMs = +new Date();
          if (!store.meals[meal]) store.meals[meal] = { ticks: {}, notes: "" };
          store.meals[meal]!.ticks[macro] = ticks;
        })
      );
    },
    setNotes({ meal, notes }: { meal: string; notes: string }): void {
      set(
        produce((store: DailyCheckboxStore) => {
          store.lastEditUnixMs = +new Date();
          if (!store.meals[meal]) store.meals[meal] = { ticks: {}, notes: "" };
          store.meals[meal]!.notes = notes;
        })
      );
    },
  })
  //  , {
  //     name: "daily-checkboxes",
  //     version: 1,
  //   }
  // )
);
