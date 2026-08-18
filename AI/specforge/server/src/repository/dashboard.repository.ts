import { pool } from "../db/pool.js";

export type DashboardStats = {
  total_specs: number;
  specs_this_week: number;
  most_used_complexity: string | null;
  most_used_tech_stack: string | null;
  last_generated_at: string | null;
};

export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const totalResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM specs WHERE user_id = $1`,
    [userId],
  );

  const weekResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM specs
     WHERE user_id = $1
       AND created_at >= NOW() - INTERVAL '7 days'`,
    [userId],
  );

  const complexityResult = await pool.query<{ complexity: string }>(
    `SELECT complexity
     FROM specs
     WHERE user_id = $1
     GROUP BY complexity
     ORDER BY COUNT(*) DESC
     LIMIT 1`,
    [userId],
  );

  const techStackResult = await pool.query<{ tech_stack: string }>(
    `SELECT tech_stack
     FROM specs
     WHERE user_id = $1
     GROUP BY tech_stack
     ORDER BY COUNT(*) DESC
     LIMIT 1`,
    [userId],
  );

  const lastGeneratedResult = await pool.query<{ last_generated_at: Date }>(
    `SELECT MAX(created_at) AS last_generated_at
     FROM specs
     WHERE user_id = $1 AND status = 'ready'`,
    [userId],
  );

  const lastGenerated = lastGeneratedResult.rows[0]?.last_generated_at;

  return {
    total_specs: Number(totalResult.rows[0]?.count ?? 0),
    specs_this_week: Number(weekResult.rows[0]?.count ?? 0),
    most_used_complexity: complexityResult.rows[0]?.complexity ?? null,
    most_used_tech_stack: techStackResult.rows[0]?.tech_stack ?? null,
    last_generated_at: lastGenerated ? lastGenerated.toISOString() : null,
  };
}
