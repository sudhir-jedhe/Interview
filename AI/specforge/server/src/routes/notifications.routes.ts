import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  listNotificationsByUser,
  markAllNotificationsRead,
} from "../repository/notification.repository.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const notifications = await listNotificationsByUser(req.auth!.userId);
    res.json(notifications);
  } catch (error) {
    console.error("List notifications failed:", error);
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

router.patch("/read", requireAuth, async (req, res) => {
  try {
    await markAllNotificationsRead(req.auth!.userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Mark notifications read failed:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

export default router;
