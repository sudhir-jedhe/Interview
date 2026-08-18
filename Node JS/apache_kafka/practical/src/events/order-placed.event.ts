export type OrderPlacedEvent = {
  eventId: string;
  eventType: "ORDER_PLACED";
  orderId: string;
  userId: string;
  amount: number;
  createdAt: string;
};

export const ORDER_PLACED_TOPIC = "order.placed";
