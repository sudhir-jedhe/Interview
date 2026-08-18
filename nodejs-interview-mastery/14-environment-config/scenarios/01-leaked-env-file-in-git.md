# Scenario: A teammate accidentally committed a `.env` file with real API keys to the repo

You're doing a code review and notice `.env` was committed three commits ago with a live Stripe secret key inside. The PR hasn't been merged to main yet, but it's already pushed to the shared remote branch.

**Approach:** Treat the key as compromised the moment it's pushed, regardless of whether it merges — anyone with read access to the remote (and any bot that scrapes public/private repos) may have already seen it. First, rotate the key immediately in the Stripe dashboard — this is non-negotiable and the single most important step, since removing it from git history doesn't undo exposure that already happened. Then clean the branch:

```bash
# Remove the file from tracking and ensure it's ignored going forward
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from version control"

# If it must be purged from history (e.g. before merging to a long-lived branch),
# use git filter-repo or BFG Repo-Cleaner rather than filter-branch
```

Finally, add a pre-commit hook or CI check (e.g. `git-secrets`, `trufflehog`) that scans for committed secrets going forward, and confirm `.env.example` (placeholder-only) is what's actually meant to be tracked.
