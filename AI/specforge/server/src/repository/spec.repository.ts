import { pool } from "../db/pool.js";
import type { GeneratedSpecContent } from "../lib/openai.js";

type CreateSpecRow = {
  id: string;
  status: "generating";
};

export async function createSpec(input: {
  userId: string;
  title: string;
  problem_description: string;
  tech_stack: string;
  complexity: "small" | "medium" | "large";
  notes?: string;
}): Promise<{ id: string; status: "generating" }> {
  const result = await pool.query<CreateSpecRow>(
    `INSERT INTO specs (
       user_id, title, problem_description, tech_stack, complexity, notes, status
     )
     VALUES ($1, $2, $3, $4, $5, $6, 'generating')
     RETURNING id, status`,
    [
      input.userId,
      input.title,
      input.problem_description,
      input.tech_stack,
      input.complexity,
      input.notes ?? null,
    ],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Failed to create spec");
  }

  return { id: row.id, status: row.status };
}

export async function markSpecReady(input: {
  specId: string;
  generated_content: GeneratedSpecContent;
}): Promise<void> {
  await pool.query(
    `UPDATE specs
     SET generated_content = $1, status = 'ready'
     WHERE id = $2`,
    [JSON.stringify(input.generated_content), input.specId],
  );
}

export async function markSpecFailed(input: { specId: string }): Promise<void> {
  await pool.query(
    `UPDATE specs
     SET status = 'failed'
     WHERE id = $1`,
    [input.specId],
  );
}

export type SpecListItem = {
  id: string;
  title: string;
  tech_stack: string;
  complexity: string;
  status: string;
  created_at: string;
};

type SpecListRow = {
  id: string;
  title: string;
  tech_stack: string;
  complexity: string;
  status: string;
  created_at: Date;
};

export type SpecDetail = {
  id: string;
  title: string;
  problem_description: string;
  tech_stack: string;
  complexity: string;
  notes: string | null;
  generated_content: GeneratedSpecContent | null;
  status: string;
  created_at: string;
};

type SpecDetailRow = {
  id: string;
  title: string;
  problem_description: string;
  tech_stack: string;
  complexity: string;
  notes: string | null;
  generated_content: GeneratedSpecContent | null;
  status: string;
  created_at: Date;
};

export async function listSpecsByUser(userId: string): Promise<SpecListItem[]> {
  const result = await pool.query<SpecListRow>(
    `SELECT id, title, tech_stack, complexity, status, created_at
     FROM specs
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    tech_stack: row.tech_stack,
    complexity: row.complexity,
    status: row.status,
    created_at: row.created_at.toISOString(),
  }));
}

export async function findSpecByIdForUser(
  specId: string,
  userId: string,
): Promise<SpecDetail | null> {
  const result = await pool.query<SpecDetailRow>(
    `SELECT id, title, problem_description, tech_stack, complexity, notes,
            generated_content, status, created_at
     FROM specs
     WHERE id = $1 AND user_id = $2`,
    [specId, userId],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    problem_description: row.problem_description,
    tech_stack: row.tech_stack,
    complexity: row.complexity,
    notes: row.notes,
    generated_content: row.generated_content,
    status: row.status,
    created_at: row.created_at.toISOString(),
  };
}
