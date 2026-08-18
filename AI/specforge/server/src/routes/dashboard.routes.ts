import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getDashboardStats } from "../repository/dashboard.repository.js";

const router = Router();

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const stats = await getDashboardStats(req.auth!.userId);
    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats failed:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});

export default router;
