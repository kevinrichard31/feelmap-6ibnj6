// surveyStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SurveyState {
  hasSubmittedSurvey: boolean;
  setHasSubmittedSurvey: (value: boolean) => void;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      hasSubmittedSurvey: false,
      setHasSubmittedSurvey: (value) => set({ hasSubmittedSurvey: value }),
    }),
    {
      name: "survey-storage", // 🔐 Clé dans localStorage
    }
  )
);
