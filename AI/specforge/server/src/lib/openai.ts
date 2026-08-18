import OpenAI from "openai";

export type GenerateSpecInput = {
  title: string;
  problem_description: string;
  tech_stack: string;
  complexity: "small" | "medium" | "large";
  notes?: string;
};

export type GeneratedSpecContent = {
  overview: string;
  api_endpoints: Array<{
    method: string;
    path: string;
    description: string;
    request_body: unknown;
    response: unknown;
  }>;
  database_schema: Array<{
    table: string;
    columns: Array<{
      name: string;
      type: string;
      notes?: string;
    }>;
  }>;
  frontend_components: string[];
  edge_cases: string[];
  implementation_phases: Array<{
    phase: number;
    title: string;
    tasks: string[];
  }>;
  estimated_effort: string;
};

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({ apiKey });
const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const systemPrompt = `You are a senior software architect. Generate a practical technical specification as JSON only.

Return valid JSON matching this shape:
{
  "overview": string,
  "api_endpoints": [{ "method": string, "path": string, "description": string, "request_body": object|null, "response": object|null }],
  "database_schema": [{ "table": string, "columns": [{ "name": string, "type": string, "notes": string (optional) }] }],
  "frontend_components": string[],
  "edge_cases": string[],
  "implementation_phases": [{ "phase": number, "title": string, "tasks": string[] }],
  "estimated_effort": string
}

Be concise and actionable. Scale detail to the requested complexity.`;

function buildUserPrompt(input: GenerateSpecInput): string {
  const lines = [
    `Title: ${input.title}`,
    `Problem: ${input.problem_description}`,
    `Tech stack: ${input.tech_stack}`,
    `Complexity: ${input.complexity}`,
  ];

  if (input.notes) {
    lines.push(`Notes: ${input.notes}`);
  }

  return lines.join("\n");
}

export async function generateTechnicalSpec(
  input: GenerateSpecInput,
): Promise<GeneratedSpecContent> {
  const response = await openai.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildUserPrompt(input) },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI response did not include message content");
  }

  const parsed = JSON.parse(content) as GeneratedSpecContent;

  if (!parsed.overview || typeof parsed.overview !== "string") {
    throw new Error("Generated spec is missing a valid overview");
  }

  return parsed;
}
