This is the ultimate end-to-end lifecycle of a modern, AI-augmented development task. Explaining this flow in an interview proves you understand how business requirements (Jira) translate into code, how that code is strictly validated (AI + CI/CD), and how it safely reaches production.

> **Repo Organization Tip:** Save this content inside `10-Modern-Dev-Workflows/scenario-problems/end-to-end-ticket-lifecycle.md`.

---

# Scenario: The In-Depth Ticket Lifecycle (Agile + AI + Git)

**The Scenario:** Walk me through the exact, step-by-step process of how a feature goes from a Jira ticket to merged code, including how you handle PR updates, human reviews, and AI code reviews in a continuous loop.

## Phase 1: The Blueprint (Jira & Branch Creation)

Every piece of code must have **traceability**. We need to know *why* a code change was made, six months after it was merged.

1. **The Jira Ticket:** The Product Manager creates a Jira ticket (e.g., `FRONT-404: Add password strength meter`). It includes the user story, design links (Figma), and strict **Acceptance Criteria**.
2. **Ticket Transition:** The developer drags the ticket from "To Do" to "In Progress".
3. **Branching Strategy:** The developer pulls the latest `main` branch locally and creates a new branch that strictly includes the Jira ticket ID. This automatically links the branch to the Jira dashboard.

```bash
git checkout -b feature/FRONT-404-password-meter

```

## Phase 2: Local Development & Smart Commits

1. **Coding & Local Testing:** The developer writes the code, ensuring it meets all Acceptance Criteria.
2. **Pre-Commit Hooks (Husky):** When the developer attempts to commit, local hooks run Prettier and ESLint.
3. **Smart Commits:** The commit message must include the Jira ID. Many teams use tools that automatically prepend the ticket number.

```bash
git commit -m "feat(auth): [FRONT-404] implement zxcvbn password strength scoring"

```

*Pro-Tip:* Including `[FRONT-404]` in the commit automatically updates the Jira ticket's "Development" panel, showing the PM that work is happening.

## Phase 3: Raising the PR & The AI First-Pass

1. **Pushing and PR Creation:** The developer pushes the branch and opens a Pull Request on GitHub/GitLab. The PR template requires them to link the Jira ticket, attach screenshots, and list what was tested.
2. **The AI Gatekeeper (Continuous Process Start):** Instantly, a GitHub Action triggers an AI reviewer (like Copilot Workspace, Gemini, or Claude).

* **What AI Does:** It scans the `git diff` for security vulnerabilities, edge cases, and performance anti-patterns.
* **The Output:** The AI leaves inline comments directly on the PR. For example: *"Warning: You imported the entire `lodash` library on line 12. Consider importing only `lodash/debounce` to reduce bundle size."*

## Phase 4: Human Review & The Update Loop

1. **Human Context Review:** A senior developer reviews the PR. Because the AI already caught syntax/bundle issues, the human focuses purely on **business logic and architecture**. Does this meet the Jira Acceptance Criteria? Is the component reusable?
2. **Requesting Changes:** The human reviewer agrees with the AI about `lodash` and also requests that the password meter colors be updated to match the company's new design tokens. They mark the PR as "Changes Requested".
3. **The Update Loop:**

* The original developer pulls the feedback, updates the code locally, and pushes a new commit: `git commit -m "fix(auth): [FRONT-404] optimize lodash import and update token colors"`.
* Pushing to the same branch automatically updates the PR.

1. **AI Re-Review:** The CI pipeline runs again. The AI strictly checks the *new* diff to ensure the requested changes didn't introduce new bugs.

## Phase 5: CI Validation & The Merge

1. **The Green Pipeline:** Once both the human reviewer approves and the AI finds no critical issues, the final CI/CD pipeline runs:

* **Unit Tests:** Jest runs `npm run test` (Passes ✅)
* **Type Checking:** TypeScript compiler runs (Passes ✅)
* **E2E Tests:** Cypress/Playwright runs critical user flows (Passes ✅)

1. **Squash and Merge:** The PR is merged into the `main` branch. We use "Squash and Merge" to combine all the back-and-forth commits into one clean, single commit on the `main` branch history.
2. **Automated Jira Transition:** Because the PR contained `[FRONT-404]`, GitHub automatically moves the Jira ticket from "In Review" to "Done" (or "Ready for QA").

---

## 🧠 Key Interview Talking Points

If you explain this workflow, emphasize these senior-level concepts:

* **Separation of Concerns in Review:** "I use AI to catch objective errors (syntax, bundle size, security flaws) so that human reviewers can focus 100% on subjective requirements (business logic, architecture, and user experience)."
* **Traceability:** "By strictly tying the Jira ticket ID to the branch name, the commit message, and the PR, we ensure that if a bug appears in production 6 months later, we can trace it back to the exact Jira ticket and understand *why* that decision was made."
* **The Continuous Loop:** "Development isn't linear; it's a loop. Every time a PR is updated, the CI/CD pipeline and the AI reviewer must re-evaluate the code to ensure fixes didn't cause regressions."
