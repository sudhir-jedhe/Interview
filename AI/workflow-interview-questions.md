This is a great idea. Having a dedicated Q&A file for this workflow will prepare you for the behavioral and process-oriented questions that define mid-to-senior level interviews.

> **Repo Organization Tip:** Save this content inside `10-Modern-Dev-Workflows/theory-qa.md` (or a dedicated `workflow-interview-questions.md` file).

---

# Interview Q&A: Agile, Git & AI Workflows

Here are 5 realistic interview questions based on the complete ticket lifecycle, along with the expected "senior-level" answers.

### Question 1: The Traceability Problem

**Q:** *"Imagine a critical bug is found in production today. You trace it back to a line of code written 8 months ago by a developer who has since left the company. How does your ideal Git workflow help you understand **why** that code was written?"*

---

### Question 2: AI vs. Human Review

**Q:** *"You mentioned using AI as a first-pass PR reviewer. If the AI flags a piece of code as a 'Security Vulnerability', but you are 100% sure it is a false positive, how do you handle it in your workflow?"*

---

### Question 3: Redundancy in Validation

**Q:** *"If we already have GitHub Actions running our tests and linters in the cloud when a PR is raised, why do we bother putting Husky pre-commit hooks on the developer's local machine?"*

---

### Question 4: Merge Strategies

**Q:** *"When a Pull Request is approved and ready to be merged into `main`, do you prefer a standard 'Merge Commit', 'Rebase', or 'Squash and Merge'? Why?"*

---

### Question 5: The Feedback Loop

**Q:** *"You submit a PR, and a senior developer leaves 10 comments requesting various changes. Walk me through the exact steps you take to address them without creating a mess."*

---

Here is the answer to the Merge Strategies question, followed by a comprehensive expansion of 20 additional senior-level interview questions covering Git, Agile processes, CI/CD, and AI integration.

> **Repo Organization Tip:** Save this entire block inside your `10-Modern-Dev-Workflows/theory-qa.md` file to serve as your ultimate behavioral and process interview cheat sheet.

---

### Question 4: Merge Strategies (Answered)

**Q:** *"When a Pull Request is approved and ready to be merged into `main`, do you prefer a standard 'Merge Commit', 'Rebase', or 'Squash and Merge'? Why?"*

---

## Part 2: Advanced Git & Version Control

### Question 5: The Hotfix Workflow

**Q:** *"We just deployed to production and a critical payment bug was discovered. Walk me through the exact Git workflow to fix it immediately without deploying the half-finished features currently sitting in `main`."*

### Question 6: The Broken `main` Branch

**Q:** *"A developer merged a PR that completely broke the staging environment. Other developers are now blocked. Do you ask them to write a fix and push a new PR, or do you revert? Explain your process."*

### Question 7: Hunting Obscure Bugs

**Q:** *"A subtle bug was reported, but no one knows when it was introduced. Looking at the code isn't helping. How do you find the exact commit that caused the bug?"*

### Question 8: Accidental Secret Leakage

**Q:** *"A junior developer accidentally committed an AWS API key to their feature branch and pushed it to GitHub. What are your immediate steps?"*

### Question 9: Rescuing Lost Code

**Q:** *"You accidentally ran `git reset --hard` and wiped out two days of uncommitted work. Is it gone forever? How do you recover it?"*

---

## Part 3: AI Workflows & Ethics

### Question 10: AI Security and Privacy Violations

**Q:** *"You notice a team member copying thousands of lines of your company's proprietary billing logic into a public web browser version of ChatGPT to ask for a refactor. How do you handle this?"*

### Question 11: The AI Hallucination Trap

**Q:** *"Your AI assistant generates a complex Regex string or a specialized algorithm that works perfectly in the first test case. It looks highly advanced. What is your process before committing it?"*

### Question 12: AI for Legacy Code

**Q:** *"You are assigned a 5-year-old, undocumented legacy component with zero tests. You need to add a new feature to it safely. How do you use AI to achieve this?"*

### Question 13: Prompt Engineering for Code Reviews

**Q:** *"If you are using an LLM to review a PR, a generic prompt like 'review this code' often yields useless, generic advice. How do you structure a prompt to get senior-level review feedback?"*

---

## Part 4: CI/CD Pipeline Optimization

### Question 14: Flaky Tests

**Q:** *"Your CI pipeline fails 20% of the time because of a 'flaky' end-to-end test. Developers have started ignoring CI failures and force-merging. How do you fix this culture and pipeline issue?"*

### Question 15: Sluggish CI Pipelines

**Q:** *"As the project has grown, the CI pipeline now takes 35 minutes to run on every PR. Developers are context-switching and losing productivity. How do you optimize it?"*

### Question 16: Environment Parity

**Q:** *"A developer closes a bug ticket with the comment 'It works on my machine', but it consistently crashes in production. What pipeline or workflow failures led to this?"*

### Question 17: Blue/Green Deployments

**Q:** *"What is a Blue/Green deployment strategy, and why would a frontend team implement it instead of a standard rolling deployment?"*

---

## Part 5: Agile Methodology & Process

### Question 18: Scope Creep in Sprints

**Q:** *"It is Wednesday of a two-week sprint. The Product Manager approaches you and asks to 'squeeze in' a small new feature. How do you handle this Agile anti-pattern?"*

### Question 19: Definition of Done vs Acceptance Criteria

**Q:** *"Can you explain the difference between 'Acceptance Criteria' and the 'Definition of Done' (DoD) in Agile?"*

### Question 20: Managing Technical Debt

**Q:** *"Your team is moving fast, but technical debt is piling up. The code is getting harder to maintain, but the business only wants new features. How do you negotiate fixing tech debt with stakeholders?"*

### Question 21: Giant Pull Requests

**Q:** *"A developer submits a PR with 85 changed files and 4,000 lines of code. It sits unreviewed for days because everyone is afraid to look at it. How do you solve this systematically?"*

### Question 22: Estimation: Points vs. Hours

**Q:** *"Why do Agile teams estimate tickets in 'Story Points' (like Fibonacci numbers 1, 2, 3, 5, 8) instead of just estimating in hours?"*

### Question 23: The Uncooperative Senior Dev

**Q:** *"You have a brilliant '10x developer' on the team, but they refuse to write tests, skip PR reviews, and push code straight to `main` because processes 'slow them down.' As a lead, how do you handle them?"*
