export type AdminOrderStatus = "placed" | "shipped" | "delivered" | "returned";
export type AdminPaymentStatus = "pending" | "paid" | "failed";

export type AdminOrder = {
  _id: string;
  code: string;
  customerName: string;
  customerEmail: string;
  totalItems: number;
  totalAmount: number;
  paymentStatus: AdminPaymentStatus;
  orderStatus: AdminOrderStatus;
  paidAt?: string | null;
  deliveredAt?: string | null;
  returnedAt?: string | null;
  createdAt: string;
};

export type AdminOrdersResponse = {
  items: AdminOrder[];
};

export type AdminUpdateOrderStatusResponse = {
  _id: string;
  orderStatus: AdminOrderStatus;
  deliveredAt?: string | null;
  returnedAt?: string | null;
};
