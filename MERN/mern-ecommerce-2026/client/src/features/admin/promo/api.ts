import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { AdminPromosResponse, PromoFormValues } from "./types";

export async function getAdminPromos() {
  return apiGet<AdminPromosResponse>("/admin/promos");
}

export async function createAdminPromo(body: PromoFormValues) {
  return apiPost<AdminPromosResponse, PromoFormValues>("/admin/promos", body);
}

export async function updateAdminPromo(promoId: string, body: PromoFormValues) {
  return apiPatch<AdminPromosResponse, PromoFormValues>(
    `/admin/promos/${promoId}`,
    body,
  );
}

export async function deleteAdminPromo(promoId: string) {
  return apiDelete<AdminPromosResponse>(`/admin/promos/${promoId}`);
}
