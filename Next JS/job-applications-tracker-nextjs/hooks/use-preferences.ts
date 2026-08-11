"use client";

import { DEFAULT_CURRENCY, DEFAULT_MONTHLY_GOAL, STORAGE_KEYS } from "@/constants";
import { useLocalStorage } from "@/hooks/use-local-storage";

/** Default currency used by new application forms. */
export function useDefaultCurrency() {
  return useLocalStorage<string>(STORAGE_KEYS.currency, DEFAULT_CURRENCY);
}

/** Target number of applications per month, shown on the dashboard goal card. */
export function useMonthlyGoal() {
  return useLocalStorage<number>(STORAGE_KEYS.monthlyGoal, DEFAULT_MONTHLY_GOAL);
}

