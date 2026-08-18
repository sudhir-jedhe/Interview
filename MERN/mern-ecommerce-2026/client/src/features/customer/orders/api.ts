import { apiGet, apiPatch } from "@/lib/api";
import type {
  CustomerOrdersResponse,
  CustomerReturnOrderResponse,
} from "./types";

export async function getCustomerOrders() {
  return apiGet<CustomerOrdersResponse>("/customer/orders");
}

export async function returnCustomerOrder(orderId: string) {
  return apiPatch<CustomerReturnOrderResponse>(
    `/customer/orders/${orderId}/return`,
  );
}
