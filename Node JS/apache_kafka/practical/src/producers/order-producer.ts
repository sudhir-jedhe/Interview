import { kafka } from "../config/kafka";
import {
  ORDER_PLACED_TOPIC,
  OrderPlacedEvent,
} from "../events/order-placed.event";

const producer = kafka.producer();

let orderNumber = 1;

function createOrderPlacedEvent(): OrderPlacedEvent {
  const userId = `user-${Math.ceil(Math.random() * 10)}`;

  return {
    eventId: crypto.randomUUID(),
    eventType: "ORDER_PLACED",
    orderId: `order-${orderNumber++}`,
    userId,
    amount: Number((Math.random() * 500 + 500).toFixed(2)),
    createdAt: new Date().toISOString(),
  };
}

async function main() {
  await producer.connect(); // opens connection to kafka broker
  console.log("Order producer connected");

  setInterval(async () => {
    const event = createOrderPlacedEvent();

    await producer.send({
      topic: ORDER_PLACED_TOPIC,
      messages: [
        {
          key: event.userId,
          value: JSON.stringify(event),
        },
      ],
    });

    console.log(
      `procuced ${event.eventType}: ${event.orderId} for ${event.userId}`,
    );
  }, 2000);
}

process.on("SIGINT", async () => {
  await producer.disconnect();

  process.exit(0);
});

main().catch(async (error) => {
  console.error("Producer error:", error);
  await producer.disconnect();
  process.exit(1);
});
