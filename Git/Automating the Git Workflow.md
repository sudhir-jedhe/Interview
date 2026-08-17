Automating your Git workflow is a major green flag in senior-level interviews. It shows you care about **Developer Experience (DX)** and know how to prevent human error before it reaches production.

> **Repo Organization Tip:** Save this content inside `10-Modern-Dev-Workflows/scenario-problems/automating-git-workflows.md`.

---

# Scenario: Automating the Git Workflow

**The Scenario:** *"Your team is growing rapidly. Developers keep committing poorly formatted code, PR reviews are bogged down by arguments over syntax, and writing release notes is a tedious manual chore. How do you automate the Git workflow to fix this?"*

## 1. Local Automation: Pre-Commit Hooks (Husky + lint-staged)

The cheapest place to catch an error is on the developer's local machine, *before* it even reaches GitHub. We use **Husky** to hijack Git commands (like `git commit`) and **lint-staged** to run scripts only on the files that were modified.

**Implementation (inside `package.json`):**

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ]
  }
}

```

*How it works:* When a developer types `git commit`, Husky intercepts it. Lint-staged checks only the changed files, formats them with Prettier, lints them with ESLint, and runs tests related to those specific files. If anything fails, the commit is aborted.

## 2. Standardizing History: Commitlint

To automate release notes later, we must force developers to write machine-readable commit messages. We use **Commitlint** alongside Husky's `commit-msg` hook to enforce the **Conventional Commits** standard.

* ❌ Bad: `git commit -m "fixed the weird button bug"`
* ✅ Good: `git commit -m "fix(ui): resolve button alignment issue on mobile"`
* ✅ Good: `git commit -m "feat(auth): add google oauth login"`

If the developer writes a bad commit message, Husky rejects the commit and asks them to rewrite it.

## 3. Cloud Automation: GitHub Actions (The CI Pipeline)

Once the code is pushed and a Pull Request is opened, we automate the review process. We require GitHub Actions to pass before the "Merge" button becomes clickable.

**Example: `.github/workflows/pr-checks.yml**`

```yaml
name: PR Automation
on: [pull_request]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      
      # 1. Check for TypeScript compilation errors
      - run: npm run typecheck 
      
      # 2. Run the full test suite
      - run: npm run test:coverage 
      
      # 3. Prevent merging if bundle size gets too large (performance check)
      - uses: preactjs/compressed-size-action@v2
        with:
          pattern: "./dist/**/*.{js,css}"

```

## 4. Automated Releases & Changelogs (Semantic Release)

Because we forced developers to use Conventional Commits in Step 2, we can now completely automate deployments and versioning using a tool like **Semantic Release**.

When code merges into the `main` branch, Semantic Release reads the commit history:

* If it sees `fix: ...` $\rightarrow$ It automatically bumps the patch version (e.g., 1.0.0 $\rightarrow$ 1.0.1).
* If it sees `feat: ...` $\rightarrow$ It bumps the minor version (e.g., 1.0.0 $\rightarrow$ 1.1.0).
* If it sees `BREAKING CHANGE:` $\rightarrow$ It bumps the major version (e.g., 1.0.0 $\rightarrow$ 2.0.0).

It then automatically generates a beautifully formatted `CHANGELOG.md` file, publishes the new version to NPM (if applicable), and tags the release on GitHub.

---

## 🧠 Key Interview Talking Points

If you are asked about Git workflows or CI/CD, bring up these high-level architectural concepts:

1. **"Failing Fast":** Explain that the goal of Husky and local git hooks is to fail as fast as possible. You don't want a developer waiting 10 minutes for a cloud CI pipeline to fail just because they missed a semicolon.
2. **Enforcing Objectivity:** Automated formatting (Prettier + Husky) eliminates subjective arguments in PR reviews. Reviewers should spend their time looking at business logic and architecture, not complaining about indentation or missing brackets.
3. **Automated Dependency Management:** Mention integrating a bot like **Dependabot** or **Renovate**. These bots automatically create PRs to update your `npm` packages when new versions are released, run the tests, and if everything passes, they can even auto-merge.
