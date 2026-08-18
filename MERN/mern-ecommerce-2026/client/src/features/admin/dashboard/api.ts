import { apiGet } from "@/lib/api";
import type { AdminDashboardLite } from "./types";

export async function getAdminDashboardLite() {
  return apiGet<AdminDashboardLite>("/admin/dashboard/lite");
}
