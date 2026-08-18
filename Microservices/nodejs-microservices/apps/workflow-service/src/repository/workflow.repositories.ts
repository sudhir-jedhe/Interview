import { getPool } from "shared";
import { Workflow } from "../utils/types";

export async function createWorkflow(input: {
  taskId: string;
  eventType: string;
  message: string;
  createdBy: string;
}): Promise<Workflow> {
  const result = await getPool().query<Workflow>(
    `
        INSERT INTO task_workflows (task_id, event_type, message, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING id, task_id, event_type, message, created_by, created_at
        
        `,
    [input.taskId, input.eventType, input.message, input.createdBy],
  );

  return result.rows[0];
}

export async function listWorkflowsByTaskId(
  taskId: string,
): Promise<Workflow[]> {
  const result = await getPool().query<Workflow>(
    `
    SELECT id, task_id, event_type, message, created_by, created_at
    FROM task_workflows
    WHERE task_id = $1
    ORDER BY created_at DESC
    
    `,
    [taskId],
  );

  return result.rows;
}

export async function findTaskOwner(
  taskId: string,
): Promise<{ created_by: string } | null> {
  const result = await getPool().query<{ created_by: string }>(
    `
    SELECT created_by FROM tasks WHERE id = $1
    `,
    [taskId],
  );

  return result.rows[0] ?? null;
}
