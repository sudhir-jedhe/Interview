Here is a clean, structured technical breakdown detailing how the **npm Trust Model** operates, why npm shifts trust away from the registry to `package-lock.json` after the initial resolution, and how supply chain attacks exploit this mechanism.

---

# The Dual-Phase npm Trust Model: Determinism vs. Security

When running `npm install`, the CLI shifts its source of truth depending on whether a lockfile is present. Understanding this mechanics explains why lockfiles are essential for build reproducibility, but fundamentally insufficient for supply chain security.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ PHASE 1: NO LOCKFILE (Trust Shift: REGISTRY AS TRUTH)                  │
 │ Resolves Ranges ──► Fetches Metadata ──► Extracts Hash ──► Writes Lock │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ PHASE 2: LOCKFILE EXISTS (Trust Shift: LOCKFILE AS TRUTH)              │
 │ Bypasses Registry Resolution ──► Fetches Tarball ──► Verifies Hash     │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 1. Phase 1: First Install (No Lockfile)

When `package-lock.json` does not exist, npm treats the **npm Registry (registry.npmjs.org)** as the ultimate source of truth.

1. **Resolution:** Reads semver ranges from `package.json` (e.g., `^18.2.0`).
2. **Metadata Fetch:** Queries the registry API for available versions and selects the highest matching version.
3. **Integrity Capture:** Extracts the tarball URL and its `integrity` SHA-512 hash from the registry metadata payload.
4. **Local Verification:** Downloads the package tarball, computes the local SHA-512 checksum, and verifies it against the registry's reported hash.
5. **Lockfile Generation:** Writes the resolved exact versions, tree resolution structure, and integrity hashes to `package-lock.json`.

---

## 2. Phase 2: Subsequent Installs (Lockfile Exists)

Once `package-lock.json` exists, **npm stops trusting the registry's version resolution metadata entirely** and shifts trust to the local lockfile.

### Why npm Stops Trusting the Registry

1. **Eliminating Non-Determinism:** If npm re-queried the registry on every install, a newly published patch or minor release matching `^18.2.0` (e.g., `18.2.1`) would automatically install. This would lead to *"works on my machine, breaks in CI"* bugs across team members or deployment pipelines.
2. **Preventing Upstream Version Mutation / Deprecation:** If a package maintainer unpublishes or deprecates a version, or if registry metadata changes, the local lockfile guarantees that the exact tree structure tested during development remains identical.
3. **Bandwidth & Speed:** Resolving a complex nested dependency tree across thousands of packages via network calls is slow. Skipping metadata resolution speeds up installs drastically.

---

## 3. The Integrity Hash (`sha512`) Illusion

A common misconception is that the `integrity` field in `package-lock.json` protects against malicious code:

```json
"node_modules/react": {
  "version": "18.3.1",
  "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
  "integrity": "sha512-wS+hAgjA5DC3DUSvO2...=="
}

```

### What Integrity Guarantees vs. What It Doesn't

* **WHAT IT GUARANTEES:** **Transmission & File Integrity.** The downloaded `.tgz` file was not corrupted during transit and has not been altered on disk *after* the initial publication/resolution.
* **WHAT IT DOES NOT GUARANTEE:** **Code Safety.** Cryptographic hashes verify **authenticity of payload content**, not **intent**. If a maintainer's account is compromised and a malicious `18.3.2` update is published to npm, the registry calculates a perfectly valid SHA-512 hash for the malicious payload.

> **Supply Chain Attack Reality:** Most npm supply chain attacks (e.g., account takeovers, typosquatting, malicious `postinstall` scripts) pass every integrity check cleanly because the published package itself matches its registry hash perfectly.

---

## 4. Modern Mitigation & Guardrails

To prevent the trust model from exposing your pipeline to compromised or unverified packages, modern teams enforce strict installation patterns:

### A. Strict CI Installation (`npm ci`)

In continuous integration environments, always use `npm ci` instead of `npm install`:

* `npm ci` **never** updates `package-lock.json`.
* If `package.json` and `package-lock.json` are out of sync, `npm ci` immediately throws an error and exits, preventing unvetted dependency updates.

### B. Lockfile Auditing & Dependency Pinning

* **Disable Scripts by Default:** Use `--ignore-scripts` during installation to block automatic execution of arbitrary `postinstall` shell scripts.
* **Lockfile Integrity Verification:** Run tools like `npm audit` or automated SAST scanners (Semgrep, Snyk) during PR pipelines to evaluate package contents beyond hash matching.

---

## Summary Matrix

| Install Scenario                  | Source of Truth              | Version Resolution                           | Primary Goal                                  |
| --------------------------------- | ---------------------------- | -------------------------------------------- | --------------------------------------------- |
| **First Install (`npm i`)**       | npm Registry Metadata        | Resolves semver ranges from `package.json`   | Freshness & initial dependency graph creation |
| **Subsequent Installs (`npm i`)** | `package-lock.json`          | Uses exact locked versions & tree structure  | **Determinism & Reproducibility**             |
| **CI Builds (`npm ci`)**          | `package-lock.json` strictly | Rejects mismatched `package.json` completely | Guaranteed zero-drift production builds       |
