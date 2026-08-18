import { apiGet, apiPost } from "@/lib/api";
import type { MeResponse, SyncResponse } from "./types";

export function syncUser() {
  return apiPost<SyncResponse>("/auth/sync");
}

export function getMe() {
  return apiGet<MeResponse>("/auth/me");
}
