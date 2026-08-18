import { kafka } from "../config/kafka";
import {
  ORDER_PLACED_TOPIC,
  OrderPlacedEvent,
} from "../events/order-placed.event";

const consumer = kafka.consumer({ groupId: "analytics-group" });

async function main() {
  await consumer.connect();
  console.log("Analytics consumer connected");

  await consumer.subscribe({
    topic: ORDER_PLACED_TOPIC,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ partition, message }) => {
      const event = JSON.parse(
        message.value?.toString() ?? "{}",
      ) as OrderPlacedEvent;

      console.log(
        `Analytics | partition=${partition} offset=${message.offset}`,
      );
      console.log(
        `Track revenue $$${event.amount} from this order ${event.orderId}`,
      );
    },
  });
}

process.on("SIGINT", async () => {
  await consumer.disconnect();
  process.exit(0);
});

main().catch(async (error) => {
  console.error("Producer error:", error);
  await consumer.disconnect();
  process.exit(1);
});
