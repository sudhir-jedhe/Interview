import { kafka } from "./kafka";
import { ORDER_PLACED_TOPIC } from "../events/order-placed.event";

const admin = kafka.admin();

async function main() {
  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: ORDER_PLACED_TOPIC,
        numPartitions: 3,
        replicationFactor: 1,
      },
    ],
  });

  console.log(`topic created: ${ORDER_PLACED_TOPIC}`);

  await admin.disconnect();
}

main().catch(async (error) => {
  console.log("topic creation error");
  await admin.disconnect();
  process.exit(1);
});
