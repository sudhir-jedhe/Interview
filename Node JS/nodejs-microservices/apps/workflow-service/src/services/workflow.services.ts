import { AppError, createConsumer, logger, runConsumer, TOPICS } from "shared";
import { DomainEvent } from "../utils/types";
import * as worflowRepo from "../repository/workflow.repositories";
import { convertToPublicWorkflow } from "../utils/workflow.utils";

async function handleDomainEvent(rawData: DomainEvent) {
  if (!rawData.eventType || !rawData.taskId || !rawData.userId) {
    logger.warn({ rawData }, "invalid domain event");
    return;
  }

  const workflow = await worflowRepo.createWorkflow({
    taskId: rawData.taskId,
    eventType: rawData.eventType,
    message: rawData.message || rawData.eventType,
    createdBy: rawData.userId,
  });

  logger.info(
    {
      workflowId: workflow.id,
      eventType: workflow.event_type,
    },
    "workflow row created",
  );
}

export async function startKafka() {
  const consumer = await createConsumer(
    "workflow-service",
    "workflow-service-group",
  );

  // run consumer
  void runConsumer(
    consumer,
    [TOPICS.TASK_EVENTS, TOPICS.MEDIA_EVENTS],
    async ({ message }) => {
      const value = message.value?.toString();
      if (!value) return;

      try {
        await handleDomainEvent(JSON.parse(value) as DomainEvent);
      } catch (err) {
        logger.error({ err }, "workflow consumer failed");
      }
    },
  );
}

export async function listWorkflowsByTask(
  taskId: string,
  userId: string,
  role: string,
) {
  const task = await worflowRepo.findTaskOwner(taskId);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  console.log(role, task.created_by, userId, "task.created_by");

  if (role !== "ADMIN" && task.created_by !== userId) {
    console.log("logging here....");

    throw new AppError(403, "forbidden");
  }

  const rows = await worflowRepo.listWorkflowsByTaskId(taskId);

  return rows.map(convertToPublicWorkflow);
}
