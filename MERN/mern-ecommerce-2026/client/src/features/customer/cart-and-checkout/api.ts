import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  AddCustomerCartItemBody,
  AppliedPromo,
  CheckoutConfirmResponse,
  CheckoutDataResponse,
  CheckoutPayWithPointsResponse,
  CheckoutPointsResponse,
  CheckoutSessionResponse,
  CustomerCartItemIdentifier,
  CustomerCartResponse,
  SyncCustomerCartBody,
} from "./types";
import { getCustomerAddresses } from "../profile/api";

function buildCartItemUrl(
  item: CustomerCartItemIdentifier,
  action?: "increase" | "decrease",
) {
  const searchParams = new URLSearchParams();

  if (item.color) searchParams.set("color", item.color);
  if (item.size) searchParams.set("size", item.size);

  const query = searchParams.toString();
  const actionPath = action ? `/${action}` : "";
  const path = `/customer/cart/items/${item.productId}${actionPath}`;

  return query ? `${path}?${query}` : path;
}

export async function getCustomerCart() {
  return apiGet<CustomerCartResponse>("/customer/cart");
}

export async function addCustomerCartItem(body: AddCustomerCartItemBody) {
  return apiPost<CustomerCartResponse, AddCustomerCartItemBody>(
    "/customer/cart/items",
    body,
  );
}

export async function increaseCustomerCartItem(
  item: CustomerCartItemIdentifier,
) {
  return apiPatch<CustomerCartResponse>(buildCartItemUrl(item, "increase"));
}

export async function decreaseCustomerCartItem(
  item: CustomerCartItemIdentifier,
) {
  return apiPatch<CustomerCartResponse>(buildCartItemUrl(item, "decrease"));
}

export async function removeCustomerCartItem(item: CustomerCartItemIdentifier) {
  return apiDelete<CustomerCartResponse>(buildCartItemUrl(item));
}

export async function syncCustomerCart(body: SyncCustomerCartBody) {
  return apiPost<CustomerCartResponse, SyncCustomerCartBody>(
    "/customer/cart/sync",
    body,
  );
}

// checkout apis

export async function getCheckoutPoints() {
  return apiGet<CheckoutPointsResponse>("/customer/checkout/points");
}

export async function getCheckoutData(): Promise<CheckoutDataResponse> {
  const [cart, addresses, checkoutPoints] = await Promise.all([
    getCustomerCart(),
    getCustomerAddresses(),
    getCheckoutPoints(),
  ]);

  const safeCart = cart ?? { items: [], totalQuantity: 0 };
  const safeAddresseds = addresses ?? { items: [] };

  const subtotal = safeCart.items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  return {
    cart: safeCart,
    addresses: safeAddresseds,
    subtotal,
    points: checkoutPoints.points ?? 0,
  };
}

export async function applyCustomerPromo(body: {
  code: string;
  orderValue: number;
}) {
  return apiPost<AppliedPromo, { code: string; orderValue: number }>(
    "/customer/promos/apply",
    body,
  );
}

export async function createCheckoutSession(body: {
  addressId: string;
  promoCode?: string;
}) {
  return apiPost<CheckoutSessionResponse, typeof body>(
    "/customer/checkout/create-session",
    body,
  );
}

export async function payWithPointsCheckout(body: {
  addressId: string;
  promoCode?: string;
}) {
  return apiPost<CheckoutPayWithPointsResponse, typeof body>(
    "/customer/checkout/pay-with-points",
    body,
  );
}

export async function confirmCheckout(body: {
  orderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  return apiPost<CheckoutConfirmResponse, typeof body>(
    "/customer/checkout/confirm",
    body,
  );
}
