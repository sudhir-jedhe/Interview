import { apiGet } from "@/lib/api";
import type { CustomerHomeResponse } from "./types";

export async function getCustomerHomeDateOverview() {
  return apiGet<CustomerHomeResponse>("/customer/home");
}
