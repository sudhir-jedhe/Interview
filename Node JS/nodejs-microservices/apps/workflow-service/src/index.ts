import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import { startKafka } from "./services/workflow.services";
import workflowRoutes from "./routes/workflow.routes";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.WORKFLOW_PORT || 3004;

const app = express();

app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  successResponse(res, { service: "workflow-service" });
});

// mount routes here

app.use(requireGatewaySecret, workflowRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

async function initStart() {
  try {
    await startKafka();
  } catch (err) {
    logger.error({ err }, "kafka consumer init failed here");
  }

  app.listen(PORT, () => {
    logger.info(`Workflow service is now running on port ${PORT}`);
  });
}

initStart();
