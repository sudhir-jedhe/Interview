This comprehensive reference guide, **"12 Claude Code Features Every Engineer Should Know"** by ByteByteGo, highlights the core tools and workflows designed to supercharge developer productivity.

Below is a detailed breakdown of how a **Full-Stack Developer** can leverage each of these 12 features across frontend, backend, database, and CI/CD workflows:

---

### 1. `CLAUDE.md` (Project Memory File)

* **What it is:** A project-level configuration file containing custom rules, tech stack info, and terminal commands that Claude automatically reads at the start of every session.
* **Full-Stack Use Case:** You write a single `CLAUDE.md` at your repository root informing Claude of your entire architecture:

```markdown
- Frontend: Next.js 15, Tailwind CSS, TypeScript
- Backend: Node.js, Express, Prisma ORM, PostgreSQL
- Commands: `npm run dev` (client), `npm run server` (api), `npx prisma migrate`

```

*Benefit:* Claude instantly knows your stack and directory layout without you having to re-explain it in every prompt.

### 2. Permissions

* **What it is:** Fine-grained control over what Claude can and cannot touch, allowing you to whitelist or block specific tool actions (like restricting Bash command execution) per session.
* **Full-Stack Use Case:** When running Claude on a production repo, you can block write permissions to migrations or security configs (`/permissions block bash`) while granting full read/write access to your frontend UI components.

### 3. Plan Mode

* **What it is:** A dedicated mode where Claude analyzes your request and generates a step-by-step execution roadmap before writing code, allowing you to review, edit, or reject each step first.
* **Full-Stack Use Case:** When adding a new full-stack feature (e.g., "Add a stripe checkout page"), Claude will output a plan: *1. Create backend webhook route, 2. Update Prisma user schema, 3. Build React checkout form*. You can approve the plan or modify step 2 before letting it write code.

### 4. Checkpoints

* **What it is:** Automatic Git snapshots taken during your session that allow you to revert to any point in time if an AI refactor goes wrong.
* **Full-Stack Use Case:** You ask Claude to refactor your global Redux state to Zustand. Halfway through, it breaks across 30 files. Instead of manually debugging, you use checkpoints to instantly roll back to the exact pre-refactor state.

### 5. Skills (`SKILL.md`)

* **What it is:** Reusable instructions and routines that Claude follows automatically, stored locally in `.claude/skills/`.
* **Full-Stack Use Case:** You create a custom skill for writing API endpoints (`.claude/skills/api-generator.md`) that enforces your team's exact error-handling, validation (Zod), and response formatting standards every time you ask it to build a new backend route.

### 6. Hooks

* **What it is:** Custom shell scripts triggered at key lifecycle moments like `PreToolUse`, `PostToolUse`, or `Notification`.
* **Full-Stack Use Case:** You set up a `PostToolUse` hook that automatically runs your project linter (`npm run lint --fix`) and formatter (`prettier`) every single time Claude modifies a file, ensuring pristine code hygiene without manual intervention.

### 7. MCP (Model Context Protocol)

* **What it is:** An open protocol allowing Claude to connect directly to external tools, databases, APIs, and services.
* **Full-Stack Use Case:** You connect Claude to your local PostgreSQL database via the Postgres MCP server. You can then prompt: *"Inspect our database schema for users and write a Prisma migration to add a billing_tier column."* Claude reads the live schema directly from your DB.

### 8. Plugins

* **What it is:** Third-party integrations that extend Claude's capabilities (e.g., Docker, Pytest, custom skills) without requiring custom code.
* **Full-Stack Use Case:** Plugging in Docker and testing integrations allows Claude to spin up local containerized environments, run end-to-end integration tests, and debug container networking issues inside your terminal.

### 9. Context Management

* **What it is:** The active workspace window containing the files, history, tools, and rules loaded into Claude's memory.
* **Full-Stack Use Case:** Managing context carefully when working across a massive repo. Instead of feeding it the whole codebase, you explicitly feed it the exact files needed (e.g., `schema.prisma`, `auth.middleware.ts`, `Login.tsx`) to keep responses sharp and relevant.

### 10. Slash Commands

* **What it is:** Pre-built or custom command shortcuts (stored in `.claude/commands/`) that trigger complex actions with a single keystroke (e.g., `/review`).
* **Full-Stack Use Case:** You create a custom `/db-check` command that triggers a sequence checking for unapplied migrations, validating database types, and generating Prisma types.

### 11. Compaction

* **What it is:** Automatically compressing long conversations (e.g., shrinking 100k tokens down to 10k) to save token limits and keep context fresh without losing core architectural decisions.
* **Full-Stack Use Case:** After a 3-hour debugging session involving frontend state loops and backend proxy configurations, you run compaction so Claude retains the final solution while dropping the noisy intermediate error traces.

### 12. Subagents

* **What it is:** Spawning parallel sub-agents to divide and conquer complex, multi-step workflows.
* **Full-Stack Use Case:** Tackling a massive refactor. You instruct Claude to spawn sub-agents: Agent 1 updates all backend REST endpoints and DTOs, Agent 2 updates the frontend TypeScript interfaces, and Agent 3 updates the Playwright E2E test suite simultaneously.

![alt text](1786364359276.gif)
