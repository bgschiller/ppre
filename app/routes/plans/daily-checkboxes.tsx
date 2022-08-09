import create, { StateCreator } from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";
import { CookieStorage } from "~/cookie-storage.client";

export interface NotesStore {
  _hasHydrated: boolean;
  lastEditUnixMs: number;
  notes: { [mealName: string]: string };
  exercise: boolean;
  setExercise(b: boolean): void;
  setHasHydrated(b: boolean): void;
  clear(): void;
  setNotes(args: { meal: string; notes: string }): void;
}

const notesStateDefn: StateCreator<NotesStore, [], [], NotesStore> = (set) => ({
  _hasHydrated: false,
  lastEditUnixMs: +new Date(),
  exercise: false,
  notes: {},
  setHasHydrated(b) {
    set(
      produce((store) => {
        store._hasHydrated = b;
      })
    );
  },
  setExercise(b) {
    set(
      produce((store) => {
        store.exercise = b;
      })
    );
  },
  clear() {
    set(
      produce((store) => {
        store.lastEditUnixMs = +new Date();
        store.notes = {};
        store.exercise = false;
      })
    );
  },
  setNotes({ meal, notes }) {
    set(
      produce((store) => {
        store.lastEditUnixMs = +new Date();
        store.notes[meal] = notes;
      })
    );
  },
});
export const useNotesStore = create<NotesStore>(
  // @ts-ignore
  persist(notesStateDefn, {
    name: "meal-notes",
    version: 1,
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
    getStorage: () => CookieStorage,
  })
);

// eg, { Protein: 2, Grains: 3, notes: "..." }
type MealData = { [macro: string]: number };

export interface DailyCheckboxStore {
  _hasHydrated: boolean;
  lastEditUnixMs: number;
  meals: { [mealName: string]: MealData | undefined };
  glassesWater: number;
  clear(): void;
  setGlassesWater(n: number): void;
  setHasHydrated(b: boolean): void;
  setTicks(args: { meal: string; macro: string; ticks: number }): void;
}

const checkboxStateDefn: StateCreator<
  DailyCheckboxStore,
  [],
  [],
  DailyCheckboxStore
> = (set) => ({
  _hasHydrated: false,
  lastEditUnixMs: +new Date(),
  glassesWater: 0,
  meals: {},
  clear() {
    set(
      produce((store) => {
        store.lastEditUnixMs = +new Date();
        store.glassesWater = 0;
        store.meals = {};
      })
    );
  },
  setGlassesWater(n) {
    set(
      produce((store) => {
        store.lastEditUnixMs = +new Date();
        store.glassesWater = n;
      })
    );
  },
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
        if (!store.meals[meal]) store.meals[meal] = {};
        store.meals[meal]![macro] = ticks;
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
