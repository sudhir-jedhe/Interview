Here is a clean, structured technical reference guide capturing the core philosophy behind **Plan Mode vs. Agent Mode** in Claude Code (and AI coding agents generally), emphasizing the **"Rebuild, Don't Patch"** principle and mental model alignment.

---

# AI Agent Workflows: Plan Mode vs. Agent Mode Architecture

When interacting with autonomous AI coding CLI tools (like Claude Code), developers often fall into the **patching trap**—trying to iteratively fix flawed implementations through follow-up conversational prompts.

Understanding the underlying mental model of **Plan Mode** shifts the developer's role from a reactive debugger to an intentional architectural reviewer.

---

## 1. The Core Philosophy: "Rebuild, Don't Patch"

```text
 ❌ THE PATCHING TRAP (High Friction & Compound Context Drift)
 [ Flawed Implementation ] ──► [ Patch Prompt 1 ] ──► [ Patch Prompt 2 ] ──► Broken Foundation / Technical Debt
 
 ✅ THE ARCHITECTURAL RE-PLAN (Low Friction & Clean Context)
 [ Flawed Implementation ] ──► [ git reset --hard ] ──► [ Refine Plan ] ──► Clean Execution

```

### Why Patching Fails in Agentic AI Workflows

1. **Context Window Contamination:** Every failed attempt and patch instruction adds noise, stale assumptions, and contradictory reasoning to the LLM's context window.
2. **Compound Technical Debt:** AI agents fixing their own incomplete code tend to add workaround layers (`if` checks, defensive overrides) rather than refactoring the core implementation.
3. **Context Drift:** The further away from the original goal the conversation drifts, the higher the chance of hallucination or regression in previously working files.

---

## 2. Choosing the Right Mode: Plan Mode vs. Agent Mode

```text
                                Is the task complex or multi-file?
                                       /               \
                                 (YES)/                 \(NO)
                                     /                   \
                                    ▼                     ▼
                             PLAN MODE              AGENT MODE
                     (ReadOnly / Architectural)    (Direct Mutation)
                                    │                     │
                             Review & Refine              │
                                    │                     │
                                    ▼                     │
                              Execute Plan ◄──────────────┘

```

| Decision Variable | **Plan Mode**                                             | **Agent Mode**                                      |
| ----------------- | --------------------------------------------------------- | --------------------------------------------------- |
| **System State**  | **Read-Only / Exploratory** (No file mutations)           | **Read-Write / Direct** (Mutates file system)       |
| **Primary Goal**  | Architectural alignment, scope discovery, approach review | Rapid implementation, local fixes, repetitive edits |
| **Ideal Scope**   | Multi-file features, schema changes, refactoring          | Single-file bug fixes, quick syntax adjustments     |
| **Human Role**    | System Architect / Gatekeeper                             | Code Reviewer                                       |

---

## 3. When to Use Plan Mode

1. **Multi-System Dependencies:** Tasks touching multiple services, databases, or cross-cutting concerns (e.g., adding authentication across API routes and client UI).
2. **Ambiguous Requirements:** When there are multiple valid implementation strategies and you want to lock down the exact approach (e.g., choosing between Server Sent Events vs. WebSockets).
3. **Exploratory Refactoring:** When you need the agent to analyze an existing codebase and map out dependencies before touching any code.
4. **Architectural Review:** When you want to inspect the proposed code changes, file creations, and potential edge-case handlers before consenting to file system writes.

---

## 4. The Ideal 4-Step Plan Mode Loop

If an agent's output misses an edge case or fails architectural requirements, follow this deterministic loop:

1. **Revert Changes (`git reset --hard` / `git clean -fd`):** Completely discard the broken or half-implemented state to keep the workspace clean.
2. **Return to Plan Mode:** Switch back to planning mode to re-examine the scope.
3. **Refine the Specification:** Update the plan prompt to explicitly cover the missed edge case, constraint, or invariant.
4. **Re-execute Agent Mode:** Re-run implementation against the refined, clear specification.

---

## Summary Matrix

| Anti-Pattern                                               | Correct Engineering Pattern                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Prompting the agent to "fix" a broken multi-file refactor. | Reverting git status, updating the plan with missing constraints, and re-running.         |
| Using Agent Mode for exploratory codebase questions.       | Using Plan Mode to analyze codebase structure without making file changes.                |
| Accepting the agent's first plan blindly.                  | Reviewing the generated plan, challenging assumptions, and tightening requirements first. |
