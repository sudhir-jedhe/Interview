import { AppError } from "shared";
import * as attachmentRepo from "../repositories/media.repositories";
import { uploadBuffer } from "../utils/stroage";
import { convertToPublicMediaAttachment } from "../utils/media.utils";
import { publishAttachmentEvent } from "../kafka";

async function assertTaskAccess(taskId: string, userId: string, role: string) {
  const task = await attachmentRepo.findTaskAccess(taskId);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  console.log(task.created_by, userId, "created_bycreated_by");

  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(403, "Forbidden");
  }
}

export async function uploadAttachment(input: {
  taskId: string;
  userId: string;
  role: string;
  file?: Express.Multer.File;
}) {
  if (!input.file) {
    throw new AppError(400, "Image file is required");
  }

  await assertTaskAccess(input.taskId, input.taskId, input.role);

  const uploaded = await uploadBuffer(
    input.file.buffer,
    input.file.mimetype || "image/jpeg",
  );

  const attachment = await attachmentRepo.createAttachment({
    taskId: input.taskId,
    imageUrl: uploaded.imageUrl,
    publicId: uploaded.publicId,
    uploadedBy: input.userId,
  });

  // we just have to publish an event here
  // now we have uploaded an attachment
  await publishAttachmentEvent(input.taskId, input.userId);

  return convertToPublicMediaAttachment(attachment);
}

export async function listAttachments(
  taskId: string,
  userId: string,
  role: string,
) {
  await assertTaskAccess(taskId, userId, role);
  const rows = await attachmentRepo.listByTaskId(taskId);

  return rows.map(convertToPublicMediaAttachment);
}
