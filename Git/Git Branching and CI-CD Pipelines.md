This is a fantastic addition to your repository. Interviewers for mid-to-senior roles almost always ask about how you manage code once it leaves your local machine. They want to know you can work in a team without breaking production.

> **Repo Organization Tip:** Save this content inside `10-Modern-Dev-Workflows/scenario-problems/ci-cd-git-strategies.md`.

---

# Scenario: Git Branching & CI/CD Pipelines

**The Scenario:** *"You are leading a frontend team of 5 developers working on a React application. Recently, buggy code has been making its way into production, and developers are constantly running into merge conflicts. How do you structure your Git workflow and deployment pipeline to fix this?"*

## 1. The Git Strategy: Feature Branching (GitHub Flow)

For most modern web teams, strict "GitFlow" (with develop, release, and hotfix branches) is too slow. Instead, the industry standard is **GitHub Flow** (a variation of Trunk-Based Development).

1. **The `main` branch is sacred:** The `main` branch must *always* be in a deployable state.
2. **Feature Branches:** Developers branch off `main` for every new feature or bug fix (e.g., `feature/login-form` or `fix/header-alignment`).
3. **Pull Requests (PRs):** Once the work is done, the developer opens a PR against `main`.
4. **Required Reviews:** The PR cannot be merged until at least one other developer reviews and approves the code.

## 2. Local Safeguards: Pre-commit Hooks

Before code even makes it to GitHub, we stop bad code locally using **Husky** and **lint-staged**.

Whenever a developer types `git commit`, a script automatically runs to check the specific files they are trying to commit:

* Runs ESLint (catches syntax errors).
* Runs Prettier (fixes formatting).
* Runs TypeScript compiler (catches type errors).

*If any of these fail, the commit is blocked.*

## 3. Continuous Integration (CI): The PR Pipeline

When a developer opens a Pull Request, our CI server (e.g., GitHub Actions, GitLab CI) takes over. We block the "Merge" button until this automated pipeline passes.

Here is an example of a GitHub Actions CI workflow (`.github/workflows/ci.yml`):

```yaml
name: Frontend CI Pipeline

on:
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci # Faster and stricter than npm install

      - name: Run Linter
        run: npm run lint

      - name: Run Unit Tests
        run: npm run test -- --passWithNoTests

      - name: Verify Build
        run: npm run build

```

## 4. Continuous Deployment (CD): The Release Pipeline

Once the PR is approved and the CI pipeline turns green, the branch is merged into `main`. This triggers the CD pipeline:

1. **Deploy to Staging:** The code is automatically deployed to a staging URL (e.g., `staging.myapp.com`) where QA or product managers can do a final manual check.
2. **Deploy to Production:** If staging looks good, the code is promoted to production (e.g., AWS S3 + CloudFront, Vercel, or Netlify).
3. **Source Maps & Error Tracking:** Source maps are uploaded to a tool like Sentry so that if a production error occurs, we see exactly which line of React code caused it.

---

## 🧠 Key Interview Talking Points

If you explain this pipeline, make sure to highlight these senior-level insights:

* **`npm ci` vs `npm install`:** Mention that you use `npm ci` in your CI/CD pipelines. It is strictly faster and installs exactly what is in the `package-lock.json` without updating any versions, ensuring deterministic builds.
* **The "Shift-Left" Mentality:** Explain that pre-commit hooks and PR pipelines "shift left" on finding bugs. It is much cheaper and faster to catch a bug on a developer's machine or in a PR than it is to catch it in production.
* **Preview Environments:** If asked about modern hosting (like Vercel or Netlify), mention **Preview URLs**. Instead of sharing a single staging environment, every single PR generates its own unique deployed URL so designers can test the branch before it even merges.
