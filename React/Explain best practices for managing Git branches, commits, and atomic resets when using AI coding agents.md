Managing Git effectively is the single most critical safety net when working with autonomous AI coding agents (like Claude Code, Aider, Cursor, or Windsurf).

Because AI agents write code faster than humans can read it, traditional Git habits (like making huge, multi-file monolithic commits) break down quickly. Adopting an **agent-native Git workflow** isolates agent experimentation, prevents context window contamination, and makes reverts instant.

---

# AI-Native Git Architecture & Best Practices

```text
 main (Production-Stable)
   │
   └── feature/user-auth (Isolated Feature Branch)
         │
         ├── Commit 1: Pre-agent clean baseline
         ├── Commit 2: Agent: Implement auth schema [WIP]
         ├── Commit 3: Agent: Add JWT middleware [WIP]
         │     └── ❌ Agent hallucinated / added bad dependencies
         │     └── 🔄 Action: `git reset --hard HEAD~1` (Instant Reset)
         └── Commit 4: Squash & Merge into feature/user-auth

```

---

## 1. Branch Strategy: Isolation & Experimentation

### A. Dedicated Agent Feature Branches

Never run an autonomous AI agent directly on `main` or shared development branches. Always instantiate a dedicated feature or spike branch:

```bash
git checkout -b feature/agent-stripe-integration

```

* **Why:** AI agents freely create, modify, and delete files. Working on an isolated branch guarantees that a bad agent run will never pollute main builds or break colleagues' local environments.

### B. "Spike & Throwaway" Pattern for Complex Explorations

When asking an agent to explore a high-risk architectural refactor or prototype:

1. Spin up a temporary spike branch (`git checkout -b spike/agent-orm-migration`).
2. Let the agent explore, plan, and attempt the implementation.
3. If successful, review the diff (`git diff main`), extract the clean commits or squash them into a clean feature branch, and delete the spike branch.

---

## 2. The Power of Atomic Micro-Commits

Humans tend to commit when a feature is complete. With AI agents, **commit continuously after every passing test or verifiable step**.

### A. Commit Early, Commit Often

Every time the agent completes a discrete, working sub-task (e.g., "Created database migration file and tests pass"):

```bash
git add .
git commit -m "feat(auth): create user schema migration"

```

* **Why:** Micro-commits create **checkpoint restore points**. If the agent successfully writes the database schema (Step 1) but completely breaks the API routes during Step 2, you don't have to discard Step 1. You simply reset back to Step 1's commit.

### B. Standardized Commit Prefixes

Distinguish human commits from agent commits to track audit trails in `git log`:

* `feat(agent): ...`
* `refactor(agent): ...`
* `fix(agent): ...`

---

## 3. Atomic Resets: "Rebuild, Don't Patch"

When an agent strays off course or generates buggy, overly complex workarounds, **do not try to prompt your way out of it**. Prompting on top of broken code pollutes the LLM's context window with contradictory history and produces compound technical debt.

### A. The Reset Toolkit

| Command                   | When to Use                                     | Effect                                                                         |
| ------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| `git reset --hard HEAD`   | Agent ruined the current uncommitted work pass. | Wipes all uncommitted changes; restores to last clean commit instantly.        |
| `git clean -fd`           | Agent generated junk untracked files/folders.   | Deletes all new untracked files and directories created by the agent.          |
| `git reset --hard HEAD~1` | Agent's last commit was bad.                    | Drops the last commit completely and restores the previous working checkpoint. |

### B. The 4-Step Reset Workflow

1. **Recognize Context Drift:** The agent starts writing endless defensive overrides or failing the same test 3 times.
2. **Stop the Agent:** Interrupt execution (`Ctrl + C`).
3. **Hard Reset:** Run `git reset --hard HEAD` (or target commit) and `git clean -fd`.
4. **Refine Prompt & Re-run:** Correct the specification/plan in your prompt and re-run against the clean baseline.

---

## 4. Pre-Commit Review & Squashing Strategy

Before merging an agent-generated feature branch into `main` or submitting a Pull Request, perform a strict review and commit cleanup.

```text
 Unsquashed Agent Branch (Noisy)              Squashed PR (Clean & Auditable)
 ├── Commit 1: feat: add schema         ──┐
 ├── Commit 2: fix: typo in model       ├──► feat(auth): add user authentication
 ├── Commit 3: refactor: fix imports    ──┘    (Clean single commit for team review)

```

### A. Reviewing the Agent's Diff

Never merge without manually inspecting the entire cumulative diff:

```bash
git diff main...HEAD

```

Look out for:

* **Unintended side effects:** Did the agent modify config files, formatting rules, or unrelated components?
* **Security leaks:** Did the agent accidentally hardcode API keys or disable security middleware?

### B. Interactive Rebase / Squash Merging

Clean up noisy agent micro-commits into a single, clean logical commit:

```bash
# Option A: Squash via interactive rebase
git rebase -i main

# Option B: Squash merge into target branch
git checkout main
git merge --squash feature/agent-stripe-integration
git commit -m "feat(payments): integrate Stripe Checkout API"

```

---

## Summary Checklist for AI Agent Git Hygiene

| Phase            | Strategy / Command                                 | Core Benefit                                                       |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| **Start**        | `git checkout -b feature/name`                     | Keeps production/dev branches untouched.                           |
| **Checkpoint**   | `git commit -m "feat(agent): step completed"`      | Creates granular restore points after every working unit.          |
| **Fail / Drift** | `git reset --hard HEAD && git clean -fd`           | Clears contaminated workspace and context instantly.               |
| **Finish**       | `git diff main` $\rightarrow$ `git merge --squash` | Guarantees code quality and keeps main git history human-readable. |
