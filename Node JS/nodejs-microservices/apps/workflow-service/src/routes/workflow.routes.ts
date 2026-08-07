import { Router } from "express";
import * as workflowController from "../controllers/workflow.controller";

const router = Router();

router.get("/tasks/:taskId/workflows", workflowController.listWorkflowsByTask);

export default router;
