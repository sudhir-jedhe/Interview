A **Technical Debt Matrix & Scoring System** replaces emotional debates with objective, data-driven prioritization. It scores items by **Risk**, **Friction (Interest)**, and **Effort (Principal)** to determine whether to fix immediately, batch with features, or ignore.

---

### 1. The 3-Pillar Scoring Model (1–5 Scale)

Score each proposed technical debt item across three dimensions:

#### A. Risk & Impact ($R$) — *What breaks if we do nothing?*

* **1 (Negligible):** Stylistic inconsistency, cosmetic code cleanup.
* **2 (Minor):** Non-critical edge-case bugs, slight test flakiness.
* **3 (Moderate):** Slower CI builds, minor performance lag under load.
* **4 (High):** Intermittent production errors, critical dependencies nearing end-of-life (EOL).
* **5 (Severe):** Active security vulnerabilities (CVEs), data corruption risk, SLA breach.

#### B. Friction / Contagion ($F$) — *How often does this slow engineers down?*

* **1 (Isolated):** Touched once a year, stable legacy code.
* **2 (Infrequent):** Touched every few months with minimal side effects.
* **3 (Moderate):** Core shared utility; touches 2–3 teams during sprints.
* **4 (High):** High-churn area; causes merge conflicts, double-work, or manual testing overhead.
* **5 (Blocker):** Actively blocks upcoming strategic roadmap initiatives.

#### C. Remediation Effort ($E$) — *What is the principal cost to pay off?*

* **1 (Trivial):** $< 0.5$ engineer days (quick patch/config tweak).
* **2 (Low):** $1–3$ engineer days (single developer task).
* **3 (Medium):** $1$ sprint (1–2 engineers).
* **4 (High):** Multi-sprint project with cross-team dependencies.
* **5 (Architectural):** Multi-month migration or complete subsystem rewrite.

---

### 2. The Debt Prioritization Score Formula

Calculate the **Priority Index (PI)**:

$$\text{Priority Index (PI)} = \frac{(R \times 1.5) + (F \times 1.2)}{E}$$

* **Risk ($R$) is weighted $1.5\times$** to account for security, data loss, and downtime.
* **Friction ($F$) is weighted $1.2\times$** to account for velocity drag across the engineering team.
* **Effort ($E$) is in the denominator:** High-value, low-effort fixes surface to the top immediately (high ROI).

---

### 3. Action Thresholds & Quadrants

| Score Range ($\text{PI}$) | Category                      | Action Directive                                                   |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------ |
| **$\ge 4.0$**             | **P0: Immediate / Quick Win** | Fix in the current or next sprint. High return on minimal effort.  |
| **$2.5 - 3.9$**           | **P1: Roadmap-Linked**        | Batch alongside the next feature touching that domain/module.      |
| **$1.5 - 2.4$**           | **P2: Strategic Investment**  | Schedule for dedicated engineering investment sprint / quarter.    |
| **$< 1.5$**               | **P3: Backlog / Defer**       | Do not prioritize. Cost to fix outweighs current operational drag. |

---

### 4. Structured Technical Debt Register Template

Use this table structure in Jira, Notion, or GitHub Projects:

| ID         | Debt Item / Subsystem                                | Risk ($R$) | Friction ($F$) | Effort ($E$) | Score ($\text{PI}$) | Action Category   | Target Sprint / Milestone   |
| ---------- | ---------------------------------------------------- | ---------- | -------------- | ------------ | ------------------- | ----------------- | --------------------------- |
| **TD-101** | Upgrade Node.js (v18 EOL security patch)             | 5          | 2              | 1            | **9.9**             | **P0: Immediate** | Sprint 42 (Current)         |
| **TD-102** | Refactor checkout state machine (race condition)     | 4          | 4              | 2            | **5.4**             | **P0: Immediate** | Sprint 43                   |
| **TD-103** | Split monolithic `/components` into feature packages | 3          | 4              | 3            | **3.1**             | **P1: Linked**    | Feature: Unified Billing UI |
| **TD-104** | Rewrite legacy PDF export service                    | 2          | 1              | 4            | **1.1**             | **P3: Defer**     | Backlog (No Action)         |

---

### 5. Implementation Process in Sprint Ceremonies

1. **Intake during Retrospectives:** When engineers raise friction points in retrospectives, require them to log a ticket with draft $R$, $F$, and $E$ estimates rather than keeping an unquantified complaint list.
2. **Bi-Weekly Calibration:** Lead Engineer and Product Manager spend 15 minutes reviewing new entries to align on business risk and upcoming roadmap relevance.
3. **Automatic Capacity Draw:** Allocate a standard 15–20% capacity budget every sprint and pull the highest $\text{PI}$ items directly into the sprint plan.
