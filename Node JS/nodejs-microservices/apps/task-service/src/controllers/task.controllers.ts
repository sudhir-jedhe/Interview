import type { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.services";
import { AppError, successResponse } from "shared";

function requireIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!role || !userId) {
    throw new AppError(401, "Missing user identity");
  }

  return { userId, role };
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = requireIdentity(req);
    const task = await taskService.createTask(req.body, userId);
    successResponse(res, { task }, 201);
  } catch (err) {
    next(err);
  }
}

export async function listTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);
    const tasks = await taskService.listTasks(userId, role);

    successResponse(res, { tasks });
  } catch (error) {
    next(error);
  }
}

export async function getSingleTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);
    const id = String(req.params.id);

    const task = await taskService.getSingleTask(id, userId, role);

    successResponse(res, { task });
  } catch (error) {
    next(error);
  }
}

export async function deleteSingleTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { role } = requireIdentity(req);
  const id = String(req.params.id);
  const deletedResult = await taskService.deleteSingleTask(id, role);
  successResponse(res, deletedResult);

  try {
  } catch (error) {
    next(error);
  }
}

// update task will be homework -> vv simple
// user has to be authenticated
// only the user that created that yask can update that task
// user A - task A , only user A can update task A, user B can not update user A tasks
// admin can update anyone's task
