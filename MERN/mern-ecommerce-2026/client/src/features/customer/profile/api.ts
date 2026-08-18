import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  CustomerAddressFormValues,
  CustomerAddressResponse,
} from "./types";

export async function getCustomerAddresses() {
  return apiGet<CustomerAddressResponse>("/customer/addresses");
}

export async function createCustomerAddresses(body: CustomerAddressFormValues) {
  return apiPost<CustomerAddressResponse, CustomerAddressFormValues>(
    "/customer/addresses",
    body,
  );
}

export async function updateCustomerAddresses(
  addressId: string,
  body: CustomerAddressFormValues,
) {
  return apiPatch<CustomerAddressResponse, CustomerAddressFormValues>(
    `/customer/addresses/${addressId}`,
    body,
  );
}

export async function deleteCustomerAddress(addressId: string) {
  return apiDelete<CustomerAddressResponse>(`/customer/addresses/${addressId}`);
}
