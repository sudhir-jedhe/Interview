# Interview Q&A: `dotenv` and Secrets Handling

**Q: What does the `dotenv` package do, and where does it get its data?**

It reads a `.env` file (key=value pairs, one per line) from disk and merges those values into `process.env` when you call `.config()`. It doesn't do anything magical — it's just a convenience for local development so you don't have to `export` environment variables manually in your shell every session; in production, real environment variables are typically injected by the platform (Docker, Kubernetes, PaaS config vars) instead.

**Q: Why should `.env` never be committed to version control?**

Because it typically holds real secrets — API keys, database credentials, signing secrets — and once committed, that data lives in git history permanently (visible to anyone with repo access, and to any bot scraping public repos) even if you delete the file in a later commit. The correct pattern is `.env` in `.gitignore`, with a committed `.env.example` containing placeholder keys only, so teammates know what variables to set without ever seeing real values.

**Q: Are environment variables a secure way to store secrets?**

They're a reasonable baseline but not a complete solution for highly sensitive secrets. Env vars can be exposed via process inspection (`/proc/<pid>/environ`), accidental logging, crash dumps, or misconfigured debug endpoints, and they have no built-in encryption at rest, access control granularity, audit logging, or rotation support. For sensitive secrets at scale, dedicated secret managers (AWS Secrets Manager, HashiCorp Vault) add those capabilities on top.

**Q: How do secrets typically get into a running Node process in production, if not from a `.env` file?**

Most commonly the hosting platform injects them directly into the container/VM's environment — Kubernetes Secrets mounted as env vars, Docker `--env-file` or `-e` flags set by the deploy pipeline, or a cloud provider's config-var system (Heroku, App Runner, etc.). `.env` + `dotenv` is largely a local-development-only pattern; production rarely reads from a literal file.
