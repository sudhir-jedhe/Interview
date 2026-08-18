import { create } from "zustand";
import type { AdminDashboardLite } from "./types";
import { getAdminDashboardLite } from "./api";

const fallbackStats: AdminDashboardLite = {
  totalProducts: 0,
  totalCategories: 0,
  totalSales: 0,
  totalOrders: 0,
  totalReturnedOrders: 0,
};

type AdminDashboardStore = {
  stats: AdminDashboardLite;
  loading: boolean;
  hasLoaded: boolean;
  fetchDashboard: () => Promise<void>;
};

export const useAdminDashboardLiteStore = create<AdminDashboardStore>(
  (set) => ({
    stats: fallbackStats,
    loading: true,
    hasLoaded: false,
    fetchDashboard: async () => {
      try {
        set({ loading: true });

        const response = await getAdminDashboardLite();

        set({
          stats: response ?? fallbackStats,
          loading: false,
          hasLoaded: true,
        });
      } catch {
        set({
          stats: fallbackStats,
          loading: false,
          hasLoaded: true,
        });
      }
    },
  }),
);
