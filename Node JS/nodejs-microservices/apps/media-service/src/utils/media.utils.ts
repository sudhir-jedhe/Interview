import { Attachment } from "./types";

export function convertToPublicMediaAttachment(attachment: Attachment) {
  return {
    id: attachment.id,
    taskId: attachment.task_id,
    imageUrl: attachment.image_url,
    publicId: attachment.public_id,
    uploadedBy: attachment.uploaded_by,
    createdAt: attachment.created_at,
  };
}
