This infographic, titled **"How to Use Codex"** by Rathnakumar Udayakumar, presents a comprehensive mind map of best practices, pro tips, and common mistakes for leveraging Codex effectively in software engineering.

---

### 1. `AGENTS.md` (Project Rules File)

* **What it is:** Your project rules file that Codex reads before starting work.
* **Pro Tip:** Keep it short, clear, and repo-specific.
* **Common Mistake:** Writing long, generic instructions that Codex won't follow well.

### 2. Codex CLI

* **What it is:** Run Codex directly from your terminal for coding tasks.
* **Pro Tip:** Use it inside the repo you want Codex to understand.
* **Common Mistake:** Giving tasks without letting Codex inspect the project first.

### 3. Codex Web

* **What it is:** Delegate coding tasks to Codex in the cloud.
* **Pro Tip:** Use it for background tasks, bug fixes, and repo exploration.
* **Common Mistake:** Expecting perfect results without reviewing the final diff.

### 4. Planning First

* **What it is:** Ask Codex to explain its plan before editing files.
* **Pro Tip:** Review the plan, correct it, then ask it to implement.
* **Common Mistake:** Letting Codex code immediately with unclear requirements.

### 5. Isolated Worktrees

* **What it is:** Let Codex work in separate environments for separate tasks.
* **Pro Tip:** Run multiple tasks in parallel without breaking your main branch.
* **Common Mistake:** Mixing unrelated changes in one working branch.

### 6. Code Review

* **What it is:** Use Codex to review pull requests, diffs, and risky changes.
* **Pro Tip:** Ask it to check logic, edge cases, tests, and security.
* **Common Mistake:** Only asking for "bugs" and missing architecture issues.

### 7. Test-Driven Tasks

* **What it is:** Give Codex failing tests before asking for implementation.
* **Pro Tip:** Tests act like clear specs for what Codex should build.
* **Common Mistake:** No tests, then confusion when output doesn't match expectations.

### 8. Subagents

* **What it is:** Use specialized agents for parallel research, coding, and review.
* **Pro Tip:** Assign separate agents to separate parts of a complex task.
* **Common Mistake:** Doing everything sequentially when tasks can run in parallel.

### 9. Skills

* **What it is:** Reusable workflows for tasks your team repeats often.
* **Pro Tip:** Create skills for reviews, migrations, debugging, and release checks.
* **Common Mistake:** Every developer prompting differently for the same workflow.

### 10. MCP (Model Context Protocol)

* **What it is:** Connect Codex to external tools, data, and developer systems.
* **Pro Tip:** Use MCP when Codex needs controlled access to your stack.
* **Common Mistake:** Giving broad tool access without clear permission boundaries.

### 11. Config Files

* **What it is:** Control model behavior, permissions, environments, and defaults.
* **Pro Tip:** Standardize config for teams so Codex behaves consistently.
* **Common Mistake:** Relying only on prompts for repeatable workflows.

![alt text](1786378451906.gif)
