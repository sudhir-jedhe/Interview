import type { Producer, RecordMetadata } from "kafkajs";
import { createKafkaClient } from "./client";
import { logger } from "../logger/logger";

export async function createProducer(clientId: string): Promise<Producer> {
  const kafka = createKafkaClient(clientId);

  // responsible for sending records/data to the kafka topics
  const producer = kafka.producer();

  await producer.connect();

  logger.info({ clientId }, "kafka producer connected");

  return producer;
}

export async function publishJson(
  producer: Producer,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<RecordMetadata[]> {
  const result = await producer.send({
    topic,
    messages: [
      {
        key: key ?? null,
        value: JSON.stringify(payload),
      },
    ],
  });

  logger.info({ topic, payload }, "Kafka event publised");

  return result;
}

export async function publishJsonSafe(
  producer: Producer | null,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<void> {
  if (!producer) {
    logger.warn({ topic }, "kafka producer is not ready");
    return;
  }

  try {
    await publishJson(producer, topic, payload, key);
  } catch (err) {
    logger.error({ err, topic }, "kafka publish failed");
  }
}
