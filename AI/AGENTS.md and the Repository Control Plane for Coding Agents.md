Based on the provided image, here is an elaboration and breakdown of **AGENTS.md and the Repository Control Plane for Coding Agents**:

---

## 1. Core Concept & Purpose

* **The Shift:** More teams now work in repositories touched by multiple coding agents across terminals, IDEs, pull requests, and cloud task runners.
* **The Problem:** The repository itself must explain how it should be read, changed, tested, and constrained.
* **The Solution (`AGENTS.md`):** A durable instruction layer that makes any codebase legible, constrained, and ready for AI-powered engineering. It acts as a **Repository Instruction Layer** that is persistent across sessions, shared across tools, and model/tool agnostic.

---

## 2. Recommended Repository Structure

The infographic outlines a clean, standardized layout for managing agent instructions alongside your project documentation:

* **Root Instructions:** `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
* **GitHub Integration:** `.github/copilot-instructions.md`
* **Instructions Folder:** `instructions/backend.instructions.md`, `instructions/docs.instructions.md`
* **Cursor Rules:** `.cursor/rules/backend.mdc`, `docs.mdc`
* **Documentation Folder:** `docs/architecture/index.md`, `docs/product/index.md`, `docs/reference/tool-loading-notes.md`, `docs/runbooks/testing.md`
* **Plans & Specs Folder:** `plans/checkout-validation.md`, `plans/repository-control-plane-rollout.md`

---

## 3. What Goes in `AGENTS.md`?

An `AGENTS.md` file serves five primary purposes:

1. **Project Map:** Where to start, what matters.
2. **Working Rules:** How to work in this repository.
3. **Boundaries:** What to avoid, what to respect.
4. **References:** Where deep knowledge lives.
5. **Stop Conditions:** When to stop and ask.

*Example excerpt shown in the visual:*

```markdown
## Start Here
- Read README.md
- Read docs/architecture/index.md
- Read docs/runbooks/testing.md
- Check plans/ for task scope

## Working Rules
- Keep edits narrow
- Keep root files short
- Put long-form knowledge in docs/
- Use plans for bounded changes

```

---

## 4. Works Across Tools

Different coding tools look for specific configuration files. The control plane pattern unifies them:

* **OpenAI Codex:** `AGENTS.md`, `PLANS.md`
* **Claude Code:** `CLAUDE.md`
* **GitHub Copilot:** `copilot-instructions.md`
* **Cursor:** `.cursor/rules/`
* **Gemini CLI:** `GEMINI.md`

---

## 5. Key Benefits

* **Consistent behavior** across tools and sessions.
* **Clear boundaries** and constraints.
* **Right context:** right amount, less noise, more signal.
* **Smaller diffs:** better quality, focused changes, fewer surprises.
* **Scalable** for teams and codebases.
* **Durable over time:** survives tools, models, and prompts.

---

## 6. The Core Takeaway Mantra

> *"The next level of AI-assisted coding is repository design for agents. Write the task **spec**. But also write the **map**."*

![alt text](image.png)
