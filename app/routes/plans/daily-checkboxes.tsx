import create, { StateCreator } from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";

// eg, { Protein: 2, Grains: 3, notes: "..." }
type MealData = { notes: string; ticks: { [macro: string]: number } };

export interface DailyCheckboxStore {
  _hasHydrated: boolean;
  lastEditUnixMs: number;
  meals: { [mealName: string]: MealData | undefined };
  setHasHydrated(b: boolean): void;
  setTicks(args: { meal: string; macro: string; ticks: number }): void;
  setNotes(args: { meal: string; notes: string }): void;
}

const checkboxStateDefn: StateCreator<
  DailyCheckboxStore,
  [],
  [],
  DailyCheckboxStore
> = (set) => ({
  _hasHydrated: false,
  lastEditUnixMs: +new Date(),
  meals: {},
  setHasHydrated(b) {
    set(
      produce((store) => {
        store._hasHydrated = b;
      })
    );
  },
  setTicks({ meal, macro, ticks }) {
    set(
      produce((store: DailyCheckboxStore) => {
        store.lastEditUnixMs = +new Date();
        if (!store.meals[meal]) store.meals[meal] = { ticks: {}, notes: "" };
        store.meals[meal]!.ticks[macro] = ticks;
      })
    );
  },
  setNotes({ meal, notes }) {
    set(
      produce((store: DailyCheckboxStore) => {
        store.lastEditUnixMs = +new Date();
        if (!store.meals[meal]) store.meals[meal] = { ticks: {}, notes: "" };
        store.meals[meal]!.notes = notes;
      })
    );
  },
});
export const useDailyCheckbox = create<DailyCheckboxStore>(
  // @ts-ignore
  persist(checkboxStateDefn, {
    name: "daily-checkboxes",
    version: 1,
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
  })
);
