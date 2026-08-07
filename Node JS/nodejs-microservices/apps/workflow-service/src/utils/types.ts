export type Workflow = {
  id: string;
  task_id: string;
  event_type: string;
  message: string;
  created_by: string;
  created_at: Date;
};

export type DomainEvent = {
  eventType?: string;
  taskId?: string;
  userId?: string;
  message?: string;
};
