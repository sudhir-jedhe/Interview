import { CreateTaskInput } from "../schemas/task.schemas";
import * as taskRepo from "../repositories/task.repository";
import { convertToPublicTask } from "../utils/task.utils";
import { AppError } from "shared";
import { publishTaskEvent } from "../kafka";

export async function createTask(input: CreateTaskInput, userId: string) {
  const newlyCreatedTask = await taskRepo.createTask({
    title: input.title,
    createdBy: userId,
  });

  // publish one event here saying ok now we just created one task
  await publishTaskEvent(newlyCreatedTask.id, userId);

  return convertToPublicTask(newlyCreatedTask);
}

export async function listTasks(userId: string, role: string) {
  if (!userId || !role) {
    throw new AppError(401, "Missing user identity");
  }

  const tasks = await taskRepo.listTasks({ userId, role });

  return tasks.map(convertToPublicTask);
}

export async function getSingleTask(id: string, userId: string, role: string) {
  const task = await taskRepo.findSingleTaskById(id);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(403, "forbidden");
  }

  return convertToPublicTask(task);
}

export async function deleteSingleTask(id: string, role: string) {
  if (role !== "ADMIN") {
    throw new AppError(403, "Forbidden");
  }

  const task = await taskRepo.findSingleTaskById(id);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  await taskRepo.deleteSingleTaskById(id);

  return { id };
}
