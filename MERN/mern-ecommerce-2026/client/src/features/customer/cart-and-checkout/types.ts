import type { ProductSize } from "../products/types";
import type { CustomerAddress } from "../profile/types";

export type CustomerCartItemIdentifier = {
  productId: string;
  color?: string;
  size?: ProductSize;
};

export type CustomerCartItem = CustomerCartItemIdentifier & {
  title: string;
  brand: string;
  image: string;
  finalPrice: number;
  quantity: number;
};

export type CustomerCartResponse = {
  items: CustomerCartItem[];
  totalQuantity: number;
};

export type AddCustomerCartItemBody = CustomerCartItemIdentifier & {
  quantity?: number;
};

export type SyncCustomerCartBody = {
  items: Array<
    CustomerCartItemIdentifier & {
      quantity: number;
    }
  >;
};

export type GuestCartItem = CustomerCartItem;

export type AppliedPromo = {
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
};

export type CheckoutSessionResponse = {
  razorpay: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
  };
  order: {
    _id: string;
    totalItems: number;
    discountAmount: number;
    totalAmount: number;
  };
};

export type CheckoutConfirmResponse = {
  _id: string;
};

export type CheckoutPointsResponse = {
  points: number;
};

export type CheckoutPayWithPointsResponse = {
  _id: string;
  totalPoints: number;
};

export type CheckoutAddressOption = CustomerAddress;

export type CheckoutDataResponse = {
  cart: CustomerCartResponse;
  addresses: {
    items: CheckoutAddressOption[];
  };
  subtotal: number;
  points: number;
};
