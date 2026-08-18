# Environment-Based Configuration

Never hardcode connection strings. Load them from environment variables so the same codebase points at different databases per environment without code changes.

```js
// config/database.js
module.exports = {
  development: { url: process.env.DEV_DATABASE_URL || 'postgres://localhost/myapp_dev' },
  test: { url: process.env.TEST_DATABASE_URL },
  production: { url: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } },
}[process.env.NODE_ENV || 'development'];
```

## Why this matters beyond convenience

Hardcoded credentials get committed to version control (and often stay in history even after being "removed"), can't differ between development/test/production without editing code, and are a direct security liability if the repository is ever exposed. Loading them from environment variables (via `process.env`, `.env` files excluded from git, or a secrets manager in production) lets the same codebase run against different databases per environment with zero code changes and keeps credentials out of the codebase entirely.

## Migrations vs auto-sync

An ORM's automatic schema-sync feature (e.g. Sequelize's `sync({ alter: true })`) is convenient in early development — it inspects your models and adjusts the database schema to match — but it's dangerous in production because it can make destructive, non-reversible changes (dropping/recreating columns) based on inferred diffs, with no audit trail or ability to review before applying. Explicit migration files (hand-written or generated, then reviewed) give you a versioned, reviewable, reversible history of schema changes that can be tested in staging and rolled back if something goes wrong — the standard practice for any production database is migrations, not auto-sync.

```js
// example: explicit, reviewable migration file (conceptual shape)
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('users', 'lastLoginAt', { type: 'TIMESTAMP', allowNull: true });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'lastLoginAt');
  },
};
```
