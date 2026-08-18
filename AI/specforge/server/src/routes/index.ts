import { Router } from "express";
import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import specsRoutes from "./specs.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/specs", specsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notifications", notificationsRoutes);

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "specforge-api",
  });
});

export default router;
