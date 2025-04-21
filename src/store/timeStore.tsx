// timeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimeState {
  secondsSpent: number;
  increment: () => void;
  reset: () => void;
}

export const useTimeStore = create<TimeState>()(
  persist(
    (set) => ({
      secondsSpent: 0,
      increment: () => set((state) => ({ secondsSpent: state.secondsSpent + 1 })),
      reset: () => set({ secondsSpent: 0 }),
    }),
    {
      name: "time-spent-storage", // localStorage key
    }
  )
);
