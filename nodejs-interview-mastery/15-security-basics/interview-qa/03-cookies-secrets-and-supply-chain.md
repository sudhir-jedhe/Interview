# Interview Q&A: Cookies, Secrets, and Supply-Chain Risk

**Q: What does `npm audit` do, and why does the lockfile matter for supply-chain security?**

`npm audit` checks your dependency tree (as actually resolved, including transitive dependencies) against a database of known vulnerabilities and reports affected packages by severity. The lockfile (`package-lock.json`) pins exact resolved versions across the whole dependency graph, making installs reproducible — without it, two installs at different times could resolve different (potentially compromised) versions of a transitive dependency, which is exactly how several real npm supply-chain attacks have propagated.

**Q: What do the `httpOnly`, `secure`, and `sameSite` cookie flags each protect against?**

`httpOnly` prevents JavaScript (`document.cookie`) from reading the cookie, mitigating session theft via XSS. `secure` ensures the cookie is only transmitted over HTTPS, preventing plaintext interception on the network. `sameSite` controls whether the cookie is attached to cross-site requests, mitigating CSRF — `strict` or `lax` are the common secure defaults. All three address different threats and should typically be set together on session cookies.

**Q: Your team wants to store a highly sensitive API key — is an environment variable good enough?**

Plain environment variables are a reasonable baseline but lack encryption at rest, fine-grained access control, audit logging of reads, and automatic rotation. For highly sensitive secrets (root database credentials, payment provider keys), a dedicated secret manager (AWS Secrets Manager, HashiCorp Vault) is the more defensible choice at scale; env vars remain fine for lower-stakes configuration and secrets.

**Q: What's the security risk of accepting a redirect URL from a query parameter, e.g. `/login?redirect=<url>`?**

Without validation, this is an open-redirect vulnerability — an attacker crafts a link to your trusted domain that, after login, redirects the victim to a phishing site, which looks more credible because it originated from your legitimate URL. Mitigate by validating the redirect target against an allowlist of known internal paths (or same-origin check) rather than trusting an arbitrary URL from the query string.
