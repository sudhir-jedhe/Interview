import { pool } from "../db/pool.js";

export async function createNotification(input: {
  userId: string;
  specId?: string;
  message: string;
}): Promise<void> {
  await pool.query(
    `INSERT INTO notifications (user_id, spec_id, message)
     VALUES ($1, $2, $3)`,
    [input.userId, input.specId ?? null, input.message],
  );
}

export async function createSpecReadyNotification(input: {
  userId: string;
  specId: string;
  title: string;
}): Promise<void> {
  await createNotification({
    userId: input.userId,
    specId: input.specId,
    message: `Spec ready: ${input.title}`,
  });
}

export async function createSpecFailedNotification(input: {
  userId: string;
  specId: string;
  title: string;
}): Promise<void> {
  await createNotification({
    userId: input.userId,
    specId: input.specId,
    message: `Spec failed: ${input.title}`,
  });
}

export type NotificationItem = {
  id: string;
  spec_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

type NotificationRow = {
  id: string;
  spec_id: string | null;
  message: string;
  is_read: boolean;
  created_at: Date;
};

export async function listNotificationsByUser(
  userId: string,
): Promise<NotificationItem[]> {
  const result = await pool.query<NotificationRow>(
    `SELECT id, spec_id, message, is_read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    spec_id: row.spec_id,
    message: row.message,
    is_read: row.is_read,
    created_at: row.created_at.toISOString(),
  }));
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId],
  );
}
