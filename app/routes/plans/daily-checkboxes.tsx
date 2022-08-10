import create, { StateCreator } from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";
import { CookieStorage } from "~/cookie-storage.client";
import { z } from "zod";

export interface NotesStore {
  _hasHydrated: boolean;
  lastEditUnixMs: number;
  notes: { [mealName: string]: string };
  setHasHydrated(b: boolean): void;
  clear(): void;
  setNotes(args: { meal: string; notes: string }): void;
}

const notesStateDefn: StateCreator<NotesStore, [], [], NotesStore> = (set) => ({
  _hasHydrated: false,
  lastEditUnixMs: +new Date(),
  notes: {},
  setHasHydrated(b) {
    set(
      produce((store) => {
        store._hasHydrated = b;
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
  })
);

export const DailyCheckboxSchema = z.object({
  lastEditUnixMs: z.number(),
  meals: z.record(z.record(z.number().or(z.undefined())).or(z.undefined())),
  glassesWater: z.number(),
  exercise: z.boolean(),
});

export type DailyCheckboxState = z.infer<typeof DailyCheckboxSchema>;

export const DailyCheckboxPersistedSchema = z.object({
  state: DailyCheckboxSchema,
  version: z.literal(1),
});

export type DailyCheckboxStore = DailyCheckboxState & {
  setExercise(b: boolean): void;
  setGlassesWater(n: number): void;
  clear(): void;
  setHasHydrated(b: boolean): void;
  setTicks(args: { meal: string; macro: string; ticks: number }): void;
};

export function emptyDailyCheckboxState(): DailyCheckboxState {
  return {
    lastEditUnixMs: 0,
    glassesWater: 0,
    exercise: false,
    meals: {},
  };
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
  exercise: false,
  meals: {},
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
        store.glassesWater = 0;
        store.meals = {};
        store.exercise = false;
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
    getStorage: () => CookieStorage,
  })
);
