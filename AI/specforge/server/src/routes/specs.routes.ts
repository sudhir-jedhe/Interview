import { Router } from "express";
import {
  generateTechnicalSpec,
  type GenerateSpecInput,
} from "../lib/openai.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createNotification,
  createSpecFailedNotification,
  createSpecReadyNotification,
} from "../repository/notification.repository.js";
import {
  createSpec,
  findSpecByIdForUser,
  listSpecsByUser,
  markSpecFailed,
  markSpecReady,
} from "../repository/spec.repository.js";

const router = Router();

const validComplexities = ["small", "medium", "large"] as const;

type CreateSpecBody = {
  title?: string;
  problem_description?: string;
  tech_stack?: string;
  complexity?: string;
  notes?: string;
};

async function runSpecGeneration(params: {
  specId: string;
  userId: string;
  title: string;
  input: GenerateSpecInput;
}): Promise<void> {
  const { specId, userId, title, input } = params;

  try {
    const generatedContent = await generateTechnicalSpec(input);

    await markSpecReady({
      specId,
      generated_content: generatedContent,
    });

    await createSpecReadyNotification({
      userId,
      specId,
      title,
    });
  } catch (error) {
    console.error("Spec generation failed:", error);

    await markSpecFailed({ specId });
    await createSpecFailedNotification({ userId, specId, title });
  }
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const specs = await listSpecsByUser(req.auth!.userId);
    res.json(specs);
  } catch (error) {
    console.error("List specs failed:", error);
    res.status(500).json({ message: "Failed to load specs" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const specId = String(req.params.id);
    const spec = await findSpecByIdForUser(specId, req.auth!.userId);

    if (!spec) {
      res.status(404).json({ message: "Spec not found" });
      return;
    }

    res.json(spec);
  } catch (error) {
    console.error("Get spec failed:", error);
    res.status(500).json({ message: "Failed to load spec" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const body = req.body as CreateSpecBody;

    if (!body.title?.trim()) {
      res.status(400).json({ message: "title is required" });
      return;
    }

    if (!body.problem_description?.trim()) {
      res.status(400).json({ message: "problem_description is required" });
      return;
    }

    if (!body.tech_stack?.trim()) {
      res.status(400).json({ message: "tech_stack is required" });
      return;
    }

    if (
      !body.complexity ||
      !validComplexities.includes(
        body.complexity as (typeof validComplexities)[number],
      )
    ) {
      res.status(400).json({
        message: "complexity must be small, medium, or large",
      });
      return;
    }

    const complexity = body.complexity as GenerateSpecInput["complexity"];
    const userId = req.auth!.userId;

    const spec = await createSpec({
      userId,
      title: body.title.trim(),
      problem_description: body.problem_description.trim(),
      tech_stack: body.tech_stack.trim(),
      complexity,
      notes: body.notes?.trim() || undefined,
    });

    await createNotification({
      userId,
      specId: spec.id,
      message: `Generating spec: ${body.title.trim()}`,
    });

    const generationInput: GenerateSpecInput = {
      title: body.title.trim(),
      problem_description: body.problem_description.trim(),
      tech_stack: body.tech_stack.trim(),
      complexity,
      notes: body.notes?.trim() || undefined,
    };

    res.json({ id: spec.id, status: spec.status });

    void runSpecGeneration({
      specId: spec.id,
      userId,
      title: body.title.trim(),
      input: generationInput,
    });
  } catch (error) {
    console.error("Create spec failed:", error);
    res.status(500).json({ message: "Failed to create spec" });
  }
});

export default router;
