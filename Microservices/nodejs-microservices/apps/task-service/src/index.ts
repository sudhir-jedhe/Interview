import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import taskRoutes from "./routes/task.routes";
import { initKafka } from "./kafka";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.TASK_PORT || 3002;

const app = express();

app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  successResponse(res, { service: "task-service" });
});

// mount routes here

app.use("/tasks", requireGatewaySecret, taskRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

async function initStartUp() {
  try {
    await initKafka();
  } catch (err) {
    logger.error({ err }, "kafka producer init failed");
  }

  app.listen(PORT, () => {
    logger.info(`Task service is now running on port ${PORT}`);
  });
}

initStartUp();
