import { create } from "zustand";
import type { AppUser } from "@/lib/types";

type AuthStatus = "idle" | "loading" | "ready" | "error";

type AuthStore = {
  status: AuthStatus;
  isBootstrapped: boolean;
  user: AppUser | null;
  error: string | null;

  setLoading: () => void;
  setUser: (user: AppUser | null) => void;
  setError: (message: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  status: "idle",
  isBootstrapped: false,
  user: null,
  error: null,
  setLoading: () =>
    set({
      status: "loading",
      error: null,
    }),
  setUser: (user) =>
    set({
      status: "ready",
      isBootstrapped: true,
      user,
      error: null,
    }),
  setError: (message) =>
    set({
      status: "error",
      isBootstrapped: true,
      error: message,
    }),
  clearAuth: () =>
    set({
      status: "ready",
      isBootstrapped: true,
      user: null,
      error: null,
    }),
}));
