import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "kafka-crash-course", // name shown in kafka logs
  brokers: ["localhost:9092"], // local kafka broker exposed from docker compose file
});
