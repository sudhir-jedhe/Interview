This infographic by Brij Kishore Pandey outlines a complete, production-grade project structure and implementation guide for **Claude Code**.

Here is a detailed breakdown of the **Claude Code Project Structure** and its core components:

---

### 📂 Directory Tree Architecture

```text
my_project/
├── CLAUDE.md                      # Project memory & core context
├── .claude/                       # Configuration and extensions hub
│   ├── settings.json              # Shared settings
│   ├── settings.local.json        # Local/ignored settings
│   ├── commands/                  # Custom slash commands (.md)
│   │   ├── review.md
│   │   ├── deploy.md
│   │   ├── test-all.md
│   │   └── bootstrap.md
│   ├── skills/                    # Auto-activated workflows
│   │   ├── code-review/ (SKILL.md, scripts/, references/, assets/)
│   │   ├── test-writer/ (SKILL.md)
│   │   ├── security-audit/ (SKILL.md)
│   │   └── refactor/ (SKILL.md)
│   ├── agents/                    # Subagent definitions (.yml)
│   │   ├── code-reviewer.yml
│   │   ├── test-writer.yml
│   │   ├── security-auditor.yml
│   │   └── devops-sre.yml
│   └── plugins/                   # Bundled distributable setups
│       ├── manifest.json
│       └── my-plugin/
├── .mcp.json                      # Model Context Protocol server definitions
├── src/                           # Application source code
│   ├── components/ (auth/, dashboard/, shared/)
│   ├── services/ (api.ts, auth.ts, database.ts)
│   ├── utils/ (logger.ts, validators.ts, helpers.ts)
│   └── types/ (index.ts)
├── tests/                         # Unit, integration, and E2E tests
├── docs/                          # Architecture, API reference, onboarding
├── scripts/                       # Shell scripts (setup.sh, deploy.sh, seed-db.sh)
├── package.json, tsconfig.json, .env.example, .gitignore, Dockerfile, README.md

```

---

### 📑 Key Sections Breakdown

#### 1. Project Overview & Key Components

* **`CLAUDE.md`:** The persistent memory file containing your tech stack, style guide, testing standards, git workflow, and security rules.
* **`.claude/`:** The hub for custom extensions, commands, and skills.
* **`.mcp.json`:** Registers external tool connections (like GitHub, Postgres, or Jira).

#### 2. Extension Types & Structure

* **Skills (`SKILL.md`):** Instructions, executable scripts, and on-demand documentation loaded automatically when tasks match.
* **Hooks:** Lifecycle scripts like `PreToolUse` (block actions), `PostToolUse` (auto-lint), `SessionStart`, and `PreCommit` (secret scanning).
* **Subagents & Agent Teams:** Isolated parallel workers coordinated via patterns like **Orchestrator** (central task dispatcher), **Pipeline** (sequential handoff), **Map-Reduce** (parallel then merge), **Supervisor** (monitor & retry), and **Swarm** (dynamic delegation).

#### 3. Getting Started Workflow

1. Run `npm i -g @anthropic-ai/claude-code`.
2. Navigate to your project directory and run `claude`.
3. Create `CLAUDE.md` to define project conventions.
4. Add custom slash commands in `.claude/commands/`.
5. Configure your MCP servers in `.mcp.json`.
6. Layer in custom skills as your workflows grow.

#### 4. Context Management & Limits

* **0–50% context:** Work freely.
* **50–70% context:** Monitor token usage.
* **70–90% context:** Run `/compact` to free up space.
* **90%+ context:** Running `/clear` is mandatory to reset context bloat.

#### 5. Best Practices & Anti-Patterns

* **Do:** Keep `CLAUDE.md` under 500 lines, use `.env.example` for templates, set minimum permissions for MCP, and use subagents for parallel tasks.
* **Don't (Anti-Patterns):** Avoid 500+ line files that cause context bloat, vague instructions like "Write good code", duplicate documentation, or lacking test guidance which results in skipped tests.

![alt text](<claude project structure.jpeg>)

Here is a detailed, step-by-step explanation for each of the core concepts, components, and workflows required to architect and master a production-grade development workspace using **Claude Code**, **Playwright E2E Testing**, and the **Repository Control Plane** (`AGENTS.md` / `CLAUDE.md`).

---

## Part 1: Establishing the Repository Control Plane (`AGENTS.md` & `CLAUDE.md`)

The foundation of modern AI-assisted engineering relies on giving coding agents a structured "map" and explicit boundaries so they don't guess or wander blindly through your codebase.

### Step 1: Write the Project Map (`AGENTS.md` / `CLAUDE.md`)

* **What it does:** Acts as the persistent memory file that Claude reads at the start of every session. It informs the agent where to start, what files matter, and what architectural patterns to follow.
* **Detailed Breakdown:**
* **Tech Stack Overview:** Explicitly list your frontend framework, backend stack, and database connectors so Claude doesn't waste tokens guessing your dependencies.
* **Working Rules:** Enforce strict instructions (e.g., *"Keep edits narrow, keep root files short, and put long-form documentation in the docs folder"*).
* **Stop Conditions:** Define boundaries telling Claude when to stop and ask for human clarification rather than making risky assumptions.

### Step 2: Implement Permissions & Safeguards

* **What it does:** Controls what the AI can and cannot touch during autonomous execution.
* **Detailed Breakdown:**
* Whitelist or block specific tools per session. For instance, you can grant read/write access to your frontend UI components while blocking raw bash execution or write access to production database migrations.

---

## Part 2: Planning and Executing Code Changes

### Step 3: Use "Plan Mode" Before Coding

* **What it does:** Forces Claude to analyze the request and outline a step-by-step roadmap *before* writing any code.
* **Detailed Breakdown:**
* Instead of instantly modifying files, Claude generates an execution plan (e.g., *1. Update Prisma schema, 2. Create API endpoint, 3. Build React form*).
* You review, edit, or reject individual steps first to guarantee alignment with your system architecture.

### Step 4: Leverage Automated Checkpoints & Version Control

* **What it does:** Takes automatic Git snapshots during your session so you can instantly roll back if an AI refactor goes wrong.
* **Detailed Breakdown:**
* If a complex refactor breaks state management across multiple files, you don't have to manually debug or undo changes line by line. Checkpoints let you revert to the exact pre-refactor state with a single command.

---

## Part 3: Automating Testing with Playwright E2E

### Step 5: Structuring Tests via the Page Object Model (POM)

* **What it does:** Decouples your UI selectors from your test logic to prevent brittle, unmaintainable test suites.
* **Detailed Breakdown:**
* Create dedicated Page Classes (e.g., `LoginPage.ts`, `CheckoutPage.ts`) that encapsulate all DOM locators and user actions.
* Your actual test files remain clean and read like plain English, referencing methods rather than raw CSS selectors or XPaths.

### Step 6: Leveraging Playwright's Auto-Waiting Engine

* **What it does:** Eliminates the need for manual `waitForTimeout` sleeps by waiting for actionable states automatically.
* **Detailed Breakdown:**
* Before interacting with an element (like clicking a button), Playwright checks that the element is attached, visible, stable, enabled, and receiving events. This prevents race conditions and flaky CI pipelines.

### Step 7: Network Interception and Mocking

* **What it does:** Acts as a proxy between the browser and the backend to test edge cases reliably.
* **Detailed Breakdown:**
* Use `page.route()` to intercept specific API calls and fulfill them with custom JSON payloads (such as simulating a 500 server error or an empty shopping cart) without relying on a live backend state.

---

## Part 4: Advanced Context Management & Scaling

### Step 8: Active Context & Compaction Control

* **What it does:** Manages token usage and memory bloat during long development sessions.
* **Detailed Breakdown:**
* **0–50% context:** Work freely.
* **50–70% context:** Monitor token consumption.
* **70–90% context:** Run `/compact` to compress the conversation history and drop noisy intermediate error traces while retaining core decisions.
* **90%+ context:** Run `/clear` to wipe the slate clean and prevent context degradation.

### Step 9: Deploying Subagents and Skills (`SKILL.md`)

* **What it does:** Scales your workspace by delegating repetitive workflows and parallel tasks to specialized AI workers.
* **Detailed Breakdown:**
* **Skills:** Custom markdown files stored in `.claude/skills/` that enforce your team's exact formatting, linting, and error-handling standards automatically when triggered.
* **Subagents:** Spawn parallel agents to divide complex tasks (e.g., Agent 1 updates backend DTOs, Agent 2 updates frontend TypeScript interfaces, and Agent 3 runs the Playwright test suite simultaneously).

As a React Full-Stack Developer, your workflow bridges the database, backend APIs, client-side state, UI components, and end-to-end testing. When combining **Claude Code**, **Playwright E2E testing**, and a **Repository Control Plane** (`CLAUDE.md`), you can establish a robust, structured engineering loop.

Here is how you should approach and use these tools together to build a full-stack React feature from scratch:

---

### Step 1: Initialize Project DNA (`CLAUDE.md`)

Before writing any code, set up your project’s memory file so Claude instantly understands your full-stack architecture.

* **Action:** Run `claude` in your project root and execute `/init` to generate the baseline `CLAUDE.md`.
* **Refinement:** Manually update `CLAUDE.md` to specify your stack and rules:

```markdown
- Frontend: React 19, TypeScript, Tailwind CSS, TanStack Query
- Backend: Node.js, Express, Prisma ORM, PostgreSQL
- Testing: Jest/RTL for components, Playwright for E2E
- Commands: `npm run dev:client`, `npm run dev:server`, `npx playwright test`

```

---

### Step 2: Use Plan Mode for Full-Stack Features

Full-stack changes usually touch multiple layers (Database $\rightarrow$ API $\rightarrow$ UI $\rightarrow$ E2E tests). Never let Claude start coding blindly.

* **Action:** Toggle **Plan Mode** (or use `/plan`) to describe your feature:

> *"We need to add a User Profile page where users can update their bio. This requires a Prisma migration, an Express backend endpoint, a React form component using TanStack Query, and a Playwright test."*

* **Review:** Claude will analyze the codebase and output a structured multi-step roadmap. Review the plan, make adjustments if necessary, and only then approve execution.

---

### Step 3: Implement Sequentially with Explicit File Context

Instead of asking Claude to "build the profile feature," break it down into clean, manageable chunks and use file referencing (`@`) to prevent hallucinations:

1. **Database & Backend:**

* Prompt: `@prisma/schema.prisma add a bio column to the User model and create the migration.`
* Prompt: `@src/server/routes/user.ts create an Express endpoint to update the bio with validation.`

1. **Frontend UI:**

* Prompt: `@src/components/UserProfile.tsx build a responsive form with Tailwind CSS that handles loading and success states via TanStack Query.`

1. **Context Management:**

* During long sessions, monitor your token window. When context exceeds 70%, run `/compact` to keep architectural decisions while dropping noisy terminal logs.

---

### Step 4: Automate Verification with Playwright E2E

Once the full-stack feature is built, ensure it doesn't break by writing a resilient End-to-End test suite.

* **Architecture:** Use the **Page Object Model (POM)** pattern. Create a `UserProfilePage.ts` file containing all your accessible locators (`page.getByRole()`).
* **Execution:** Run your tests through Claude by prompting it to check test coverage or debug failures:

> *"Run `npx playwright test` and fix any failing assertions in the user profile test suite."*

* **CI Integration:** Ensure your `playwright.config.ts` is configured with `trace: 'retain-on-failure'` so that if a test fails in your pipeline, you can inspect the exact DOM state.

---

### Step 5: Review and Ship

* **Code Review:** Before opening a pull request, run Claude’s built-in review tool (`/review`) to catch React performance anti-patterns (like missing memoization or unnecessary re-renders) and security vulnerabilities.
* **Clean Slate:** Run `/clear` between completely unrelated tasks (e.g., switching from fixing a backend database bug to adjusting a frontend CSS layout) to prevent context pollution.
