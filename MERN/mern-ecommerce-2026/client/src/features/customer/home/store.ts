import { create } from "zustand";
import type { CustomerHomeResponse } from "./types";
import { getCustomerHomeDateOverview } from "./api";

const fallbackData: CustomerHomeResponse = {
  banners: [],
  categories: [],
  recentProducts: [],
  coupons: [],
};

type CustomerHomeStore = {
  data: CustomerHomeResponse;
  loading: boolean;
  loadHome: () => Promise<void>;
  clear: () => void;
};

export const useCustomerHomeStore = create<CustomerHomeStore>((set) => ({
  loading: true,
  data: fallbackData,
  loadHome: async () => {
    try {
      set({ loading: true });

      const response = await getCustomerHomeDateOverview();

      set({
        data: response ?? fallbackData,
        loading: false,
      });
    } catch {}
  },
  clear: () => {
    set({ data: fallbackData, loading: true });
  },
}));
