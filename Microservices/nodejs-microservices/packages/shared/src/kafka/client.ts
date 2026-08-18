import { Kafka, logLevel, type KafkaConfig } from "kafkajs";
import { boolean } from "zod";

export function createKafkaClient(
  clientId: string,
  config: Partial<KafkaConfig> = {},
) {
  const brokers = (process.env.KAFKA_BROKERS || "localhost:9092")
    .split(",")
    .map((broker) => broker.trim())
    .filter(boolean);

  if (brokers.length === 0) {
    throw new Error("KAFKA_BROKERS are empty");
  }

  return new Kafka({
    clientId,
    brokers,
    logLevel: logLevel.ERROR,
    retry: {
      retries: 8,
    },
    ...config,
  });
}
