A **Monorepo (Monolithic Repository)** is a single Git repository that contains multiple applications, libraries, services, and shared code. Instead of having separate repositories for frontend, backend, UI components, and utilities, everything lives in one repository. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[datacamp.com]](https://www.datacamp.com/tutorial/monorepo)

### Why do we need a Monorepo?

#### 1\. Code Sharing & Reuse

Shared libraries can be reused directly without publishing packages or managing multiple repository versions.

**Example**

repo/

├── apps/

│   ├── web

│   └── admin

├── libs/

│   ├── ui-components

│   └── api-client

Both `web` and `admin` can use the same UI library.

**Benefit:** No duplicated code. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[medium.com]](https://medium.com/@alessandro.traversi/monorepos-advantages-and-disadvantages-233c1b7146c2)

---

#### 2\. Consistent Dependency Management

All projects use the same versions of React, TypeScript, ESLint, etc.

**Without Monorepo**

frontend -> React 18.2

admin    -> React 17

mobile   -> React 18.1

**With Monorepo**

All apps -> React 18.2

This reduces dependency conflicts. [[medium.com]](https://medium.com/@alessandro.traversi/monorepos-advantages-and-disadvantages-233c1b7146c2), [[datacamp.com]](https://www.datacamp.com/tutorial/monorepo)

---

#### 3\. Atomic Changes

A single commit can update multiple projects together.

**Example**

- Update API contract
- Update backend implementation
- Update frontend consumers

All in one pull request.

This ensures everything stays compatible. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[medium.com]](https://medium.com/@alessandro.traversi/monorepos-advantages-and-disadvantages-233c1b7146c2)

---

#### 4\. Better Developer Experience

Developers can:

- Search the entire codebase
- Understand dependencies
- Reuse existing implementations
- Refactor confidently

This improves collaboration across teams. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[circleci.com]](https://circleci.com/blog/monorepo-dev-practices/)

---

#### 5\. Easier CI/CD Standardisation

All projects follow the same:

- Build process
- Linting rules
- Testing standards
- Code quality gates

Tools like:

- Nx
- Turborepo
- Bazel
- Rush

help run builds only for affected projects. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy), [[Claude Code | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1)

---

### Real-World Example (React Teams)

Imagine you have:

Customer Portal

Admin Portal

Mobile Web

Design System

Shared API SDK

With separate repos:

- Version mismatch issues
- Duplicate components
- Difficult cross-app refactoring

With Monorepo:

- Shared design system
- Shared hooks
- Shared API clients
- Shared TypeScript types

Much easier to maintain.

Interestingly, an internal resume example references using **Nx Monorepo architecture** to create reusable feature libraries and improve maintainability and scalability. [[Nirdosh-cv...Feb_2026 2 | PDF]](https://persistentsystems.sharepoint.com/sites/BCPHelpdesk-Gurugram/Shared%20Documents/General/Nirdosh-cv_11_Feb_2026%202.pdf?web=1)

---

### Drawbacks of Monorepo

Monorepos are not perfect.

| Challenge          | Description                               |
| ------------------ | ----------------------------------------- |
| Large repository   | Clone/pull operations become bigger       |
| Longer builds      | Without proper tooling builds can be slow |
| Merge conflicts    | Many teams working in same repo           |
| Access control     | Harder to restrict code visibility        |
| Tooling complexity | Requires Nx, TurboRepo, Bazel, etc.       |

These challenges are typically mitigated with modern tooling. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy), [[circleci.com]](https://circleci.com/blog/monorepo-dev-practices/)

---

### When Should You Use a Monorepo?

✅ Use Monorepo when:

- Multiple applications share code.
- You own frontend + backend + libraries.
- Micro-frontends share a design system.
- You want consistent tooling and dependency management.

❌ Avoid Monorepo when:

- Projects are completely unrelated.
- Different teams need strict repository isolation.
- Independent release cycles are more important than collaboration.

---

### Interview Answer (Senior React Lead)

> "We use a Monorepo to manage multiple applications and shared libraries in a single repository. It improves code reuse, dependency consistency, atomic cross-project changes, and developer productivity. Tools such as Nx or Turborepo allow affected-only builds and caching, making Monorepos scalable even for large React and micro-frontend ecosystems. The trade-off is increased repository size and CI/CD complexity, which must be handled through proper tooling and repository governance."

## Common Monorepo Challenges and Solutions

| Challenge                            | Problem                                                                 | Solution                                                                                                                                                                                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slow Builds**                      | Building all applications can take a long time as the repository grows. | Use **Nx**, **Turborepo**, or **Bazel** for affected-only builds, caching, and parallel execution. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy), [[Claude Code           | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1)                                                                                                                                            |
| **Large Repository Size**            | Clone, checkout, and CI operations become slower.                       | Use shallow clones, remote caching, and optimise CI pipelines. [[medium.com]](https://medium.com/@alessandro.traversi/monorepos-advantages-and-disadvantages-233c1b7146c2), [[circleci.com]](https://circleci.com/blog/monorepo-dev-practices/) |
| **Dependency Management Complexity** | Shared dependencies can introduce breaking changes across projects.     | Use workspace tooling (npm/pnpm/yarn workspaces) and dependency boundaries. [[datacamp.com]](https://www.datacamp.com/tutorial/monorepo), [[18 MM Mono...os 06 Sept                                                                             | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1) |
| **Merge Conflicts**                  | Many teams modifying shared code simultaneously.                        | Establish code ownership, branching strategies, and review processes. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)                                                       |
| **CI/CD Complexity**                 | Not every change should trigger all deployments.                        | Configure selective builds and deployments based on affected projects. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy), [[Claude Code                                       | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1)                                                                                                                                            |
| **Access Control Limitations**       | All developers may see all source code.                                 | Use repository policies and split highly sensitive code into separate repositories if required. [[18 MM Mono...os 06 Sept                                                                                                                       | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1) |
| **Onboarding Difficulty**            | New developers may be overwhelmed by the repository structure.          | Maintain clear documentation, architecture diagrams, and project boundaries. [[medium.com]](https://medium.com/@alessandro.traversi/monorepos-advantages-and-disadvantages-233c1b7146c2)                                                        |
| **Unclear Project Boundaries**       | Teams may create tight coupling between modules.                        | Enforce module boundaries and architectural rules using tools such as Nx. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)                                                   |

---

## Benefits of Monorepos for Frontend Teams

### 1\. Shared UI Component Libraries

A single Design System can be reused across:

- Customer Portal
- Admin Portal
- Mobile Web
- Micro Frontends

Result:

- Consistent UX
- Faster development
- Less duplicate code

[[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[Nirdosh-cv...Feb_2026 2 | PDF]](https://persistentsystems.sharepoint.com/sites/BCPHelpdesk-Gurugram/Shared%20Documents/General/Nirdosh-cv_11_Feb_2026%202.pdf?web=1)

---

### 2\. Shared TypeScript Types

Frontend applications can consume the same:

- API contracts
- DTOs
- Validation schemas

Result:

- Fewer integration bugs
- Better type safety

[[datacamp.com]](https://www.datacamp.com/tutorial/monorepo), [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

### 3\. Easier Code Reuse

Common assets can live in shared libraries:

libs/

├── ui

├── auth

├── api-client

├── hooks

└── utils

All applications consume the same implementation. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[medium.com]](https://medium.com/@alessandro.traversi/monorepos-advantages-and-disadvantages-233c1b7146c2)

---

### 4\. Atomic Frontend Changes

A single PR can update:

- Design System component
- Shared hooks
- Multiple consuming applications

Everything is verified together before merge. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[medium.com]](https://medium.com/@alessandro.traversi/monorepos-advantages-and-disadvantages-233c1b7146c2)

---

### 5\. Consistent Tooling

One configuration for:

- ESLint
- Prettier
- TypeScript
- Jest
- Playwright

Result:

- Consistent coding standards
- Simpler maintenance

[[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[circleci.com]](https://circleci.com/blog/monorepo-dev-practices/)

---

### 6\. Faster Migration Efforts

Examples:

- React 18 → React 19
- MUI v5 → v6
- Node 18 → Node 22

Updates can be executed and validated across all applications from the same repository. [[Claude Code | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1)

---

### 7\. Better Micro-Frontend Architecture

For React micro-frontends, a monorepo simplifies:

- Shared design system
- Shared authentication libraries
- Shared utility packages
- Cross-team collaboration

While deployments remain independent, development becomes more streamlined. [[datacamp.com]](https://www.datacamp.com/tutorial/monorepo), [[circleci.com]](https://circleci.com/blog/monorepo-dev-practices/)

---

## Senior React Interview Summary (30-second answer)

> "Monorepos help frontend teams share UI components, hooks, TypeScript types, API clients, and build configurations from a single repository. This improves consistency, code reuse, and developer productivity. Common challenges include large repository size, slow builds, merge conflicts, and CI/CD complexity, which are typically addressed using tools like Nx, Turborepo, or Bazel with caching and affected-only builds." [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy), [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[Claude Code | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1)

## Best Practices for Managing Dependencies in a Monorepo

### 1\. Maintain a Single Source of Truth

- Keep shared dependencies (React, TypeScript, ESLint, Jest, etc.) aligned across all applications.
- Use workspace-based package management (pnpm, Yarn Workspaces, npm Workspaces) to avoid version drift. [[datacamp.com]](https://www.datacamp.com/tutorial/monorepo), [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

### 2\. Create Shared Libraries

Organise reusable code into dedicated libraries:

apps/

  customer-portal

  admin-portal

libs/

  ui

  auth

  api-client

  utils

This reduces duplication and promotes consistency across teams. [[18 MM Mono...os 06 Sept | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B95878B35-C329-4061-9527-979A63B7E45E%7D&file=18%20MM%20MonoRepos%2006%20Sept.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[Nirdosh-cv...Feb_2026 2 | PDF]](https://persistentsystems.sharepoint.com/sites/BCPHelpdesk-Gurugram/Shared%20Documents/General/Nirdosh-cv_11_Feb_2026%202.pdf?web=1)

### 3\. Enforce Dependency Direction

A common rule:

Apps

  ↓

Features

  ↓

Shared Libraries

Avoid:

- Circular dependencies
- App-to-app imports
- Deep imports into internal implementation details

This prevents a "big ball of mud" architecture. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)

### 4\. Version Internal Packages Carefully

- Use clear ownership for shared libraries.
- Review breaking changes carefully.
- Automate dependency graph analysis where possible. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy), [[circleci.com]](https://circleci.com/blog/monorepo-dev-practices/)

### 5\. Use Affected-Only Builds

Instead of rebuilding everything:

nx affected:test

nx affected:build

or TurboRepo's incremental builds.

This dramatically reduces CI/CD execution time. [[Claude Code | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1), [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)

### 6\. Establish Code Ownership

Use:

- CODEOWNERS
- Required reviewers
- Team ownership of libraries

This reduces accidental breaking changes to commonly used packages. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)

### 7\. Monitor Dependency Graphs

Regularly inspect:

- Circular dependencies
- Unused libraries
- Cross-domain coupling

Strong dependency governance becomes increasingly important as the monorepo grows. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)

---

# Tools for Enforcing Module Boundaries

## 1\. Nx (Most Popular for React/Angular Monorepos)

Nx provides:

- Dependency graph visualisation
- Tags and constraints
- Import rules
- Affected builds
- Circular dependency detection

Example:

{

  "sourceTag": "scope:customer",

  "onlyDependOnLibsWithTags": ["scope:shared"]

}

This prevents invalid imports between domains. [[Nirdosh-cv...Feb_2026 2 | PDF]](https://persistentsystems.sharepoint.com/sites/BCPHelpdesk-Gurugram/Shared%20Documents/General/Nirdosh-cv_11_Feb_2026%202.pdf?web=1), [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)

---

## 2\. ESLint Import Rules

Useful plugins:

eslint-plugin-import

Example:

"import/no-cycle": "error",

"import/no-restricted-paths": "error"

Prevents:

- Circular dependencies
- Illegal cross-module imports

---

## 3\. Dependency Cruiser

Popular for large TypeScript repositories.

Features:

- Visual dependency graphs
- Circular dependency detection
- Architectural rule enforcement

Example rules:

{

  "forbidden": [

    {

      "from": { "path": "^apps" },

      "to": { "path": "^apps" }

    }

  ]

}

``

---

## 4\. Bazel

Often used in very large repositories.

Benefits:

- Strict dependency declarations
- Build isolation
- Incremental builds

Large organisations use Bazel to keep monorepos scalable. [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy)

---

## 5\. Turborepo

Provides:

- Workspace orchestration
- Build caching
- Task dependency management

Frequently used with React and Next.js applications. [[Claude Code | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1)

---

## 6\. Rush

Microsoft's monorepo management solution.

Features:

- Dependency version policies
- Change management
- Large-scale package governance

Useful for enterprise-scale repositories.

---

## Senior React Interview Answer

> "The biggest risk in a monorepo is uncontrolled dependencies between applications and libraries. I typically enforce module boundaries using Nx tags, ESLint import restrictions, and dependency graph analysis. For dependency management, I centralise versions using workspace tools, maintain shared libraries, use affected-only builds, and establish code ownership through CODEOWNERS. This keeps the monorepo scalable while preventing architectural erosion." [[thenote.app]](https://thenote.app/post/en/monorepos-explained-benefits-drawbacks-and-when-to-use-them-dh86zyinwy), [[Claude Code | PDF]](https://persistentsystems.sharepoint.com/sites/VivaDev/HuddleDocs/CaseStudy/Claude%20Code.pdf?web=1), [[Nirdosh-cv...Feb_2026 2 | PDF]](https://persistentsystems.sharepoint.com/sites/BCPHelpdesk-Gurugram/Shared%20Documents/General/Nirdosh-cv_11_Feb_2026%202.pdf?web=1)

A **monorepo** (monolithic repository) is an architectural strategy where code for **multiple projects, services, or packages lives inside a single Git repository**.

Instead of splitting a frontend, backend, shared utilities, and design system into separate Git repositories, a monorepo holds them together under a unified project root.

---

### Monorepo vs. Multi-Repo (Polyrepo)

```
Multi-Repo Setup:             Monorepo Setup:
├── repo-frontend/            my-org-monorepo/
├── repo-backend/             ├── apps/
├── repo-shared-ui/           │   ├── web/        (Frontend React app)
└── repo-api-client/          │   └── docs/       (Documentation site)
                              ├── packages/
                              │   ├── ui/         (Shared UI component library)
                              │   └── api-types/  (Shared TypeScript interfaces)
                              ├── package.json
                              └── turbo.json

```

---

### Key Advantages of a Monorepo

1. **Shared Code & Types:** You can export shared TypeScript types, validation schemas (e.g., Zod), or UI components from a local package and import them directly into your frontend and backend without publishing to npm.
2. **Atomic Commits & Refactoring:** Rename a backend API endpoint and update all affected frontend applications in a single Git commit and Pull Request.
3. **Single Source of Truth:** One set of tooling, CI/CD setup, ESLint, Prettier, and TypeScript configurations across the entire organization.
4. **Simplified Dependency Management:** Manage shared third-party dependencies in one location, avoiding version mismatches across teams.

---

### Common Monorepo Tools & Frameworks

Modern monorepos rely on workspace managers and build systems to keep build times fast and prevent dependency conflicts:

| Tool                      | Ecosystem      | Primary Purpose / Specialty                                        |
| ------------------------- | -------------- | ------------------------------------------------------------------ |
| **Turborepo**             | JS/TS          | Blazing-fast build system with caching (popular with Next.js/Vite) |
| **Nx**                    | JS/TS/Polyglot | Powerful task runner with dependency graph visualization           |
| **pnpm Workspaces**       | JS/TS          | Efficient package manager for linking local packages via symlinks  |
| **npm / Yarn Workspaces** | JS/TS          | Built-in workspace support for node package managers               |
| **Bazel / Buck**          | Polyglot       | Multi-language build systems used at massive scale (Google/Meta)   |

---

### Standard Monorepo Folder Structure (JS/TS)

Here is how a typical modern full-stack monorepo looks using **pnpm workspaces** or **Turborepo**:

```
my-monorepo/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── package.json     # Imports "@repo/ui" and "@repo/api-types"
│   │   └── src/
│   └── api/                 # Node.js / Express backend
│       ├── package.json
│       └── src/
├── packages/
│   ├── ui/                  # Shared React design system
│   │   ├── package.json
│   │   └── src/
│   ├── api-types/           # Shared API type definitions
│   │   ├── package.json
│   │   └── src/
│   └── tsconfig/            # Shared base tsconfig files
├── pnpm-workspace.yaml      # Defines "apps/*" and "packages/*"
├── package.json
└── turbo.json               # Pipeline caching rules

```

---

### Potential Trade-offs & Challenges

- **Build Scaling:** Without smart task runners and remote caching (like Turborepo or Nx), running tests or builds across every project on every PR can become very slow.
- **Access Control:** All developers with repo access can see all projects (unless restricted at the branch level).
- **Git Repository Size:** As assets and history grow, cloning the repository can take longer if not managed with Git LFS or sparse checkouts.

Setting up a **Turborepo** with **pnpm Workspaces** is one of the fastest, cleanest ways to run a JavaScript/TypeScript monorepo.

Here is the step-by-step guide to building one from scratch, structured with an app and a shared UI component package.

---

### Step 1: Initialize the Project & pnpm Workspace

First, create a project directory and initialize `package.json` and `pnpm-workspace.yaml`.

```bash
mkdir my-monorepo
cd my-monorepo
pnpm init

```

Create a `pnpm-workspace.yaml` file in the root directory. This tells `pnpm` where your applications and shared packages live:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

### Step 2: Install Turborepo & Configure Pipelines

Install `turbo` as a root development dependency:

```bash
pnpm add -D -w turbo typescript

```

Next, create a `turbo.json` file in the root to define your build pipeline and task caching rules:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!-next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

> **Note:** `"dependsOn": ["^build"]` tells Turborepo to build a project's dependencies _before_ building the project itself.

Add root execution scripts to your root `package.json`:

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  }
}
```

---

### Step 3: Create a Shared UI Package (`packages/ui`)

Create the directory structure for your shared package:

```bash
mkdir -p packages/ui/src

```

Inside `packages/ui/package.json`, set the package name to a scoped workspace name (e.g., `@repo/ui`):

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "sideEffects": false,
  "exports": {
    "./button": "./src/button.tsx"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.4.0"
  }
}
```

Create a sample React component at `packages/ui/src/button.tsx`:

```tsx
import * as React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        backgroundColor: "#0070f3",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
```

---

### Step 4: Create a Next.js App (`apps/web`)

Generate a Next.js application inside the `apps/` directory:

```bash
cd apps
pnpm create next-app web --typescript --eslint --no-tail --src-dir --app --import-alias "@/*"
cd ..

```

Now, link the shared `@repo/ui` package to `apps/web/package.json`:

```bash
pnpm --filter web add @repo/ui@workspace:*

```

This adds the local package dependency using `pnpm`'s `workspace:*` syntax:

```json
// apps/web/package.json
"dependencies": {
  "@repo/ui": "workspace:*",
  "next": "latest",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}

```

---

### Step 5: Consume the Shared Package in the App

In `apps/web/src/app/page.tsx`, import and use the `<Button/>` component from `@repo/ui/button`:

```tsx
import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Monorepo App</h1>
      <Button onClick={() => console.log("Clicked!")}>Shared Button</Button>
    </main>
  );
}
```

---

### Step 6: Install Dependencies & Run

From the **root directory**, install all workspace dependencies and launch the Turborepo dev pipeline:

```bash
pnpm install
pnpm dev

```

Turborepo will automatically run the `dev` command across all apps simultaneously in parallel.

---

### Verification Checklist

- [x] `pnpm-workspace.yaml` maps `apps/*` and `packages/*`.
- [x] Local dependencies use the `"workspace:*"` protocol in `package.json`.
- [x] Root `turbo.json` configures build, dev, and lint pipelines.
- [x] Running `pnpm build` triggers cached, incremental builds across packages.

  How do I set up shared tsconfig and ESLint packages in a Turborepo monorepo?
  How do I set up shared tsconfig and ESLint packages in a Turborepo monorepo?
  Sharing configuration packages across a Turborepo is a fantastic practice. Instead of copying and pasting `tsconfig.json` or ESLint configurations into every single app and library, you create dedicated packages inside your `packages/` directory (e.g., `@repo/tsconfig` and `@repo/eslint-config`) and extend them.

Here is a step-by-step walkthrough to set up shared TypeScript and ESLint configurations (using modern ESLint Flat Config).

---

## Architecture Overview

Your file structure will look like this:

```
my-monorepo/
├── packages/
│   ├── tsconfig/           # Shared TypeScript configs
│   │   ├── package.json
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   └── react-library.json
│   └── eslint-config/      # Shared ESLint Flat Configs
│       ├── package.json
│       ├── base.js
│       └── nextjs.js
└── apps/
    └── web/                # Extends @repo/tsconfig & @repo/eslint-config

```

---

## Step 1: Create the Shared `@repo/tsconfig` Package

Create a folder named `packages/tsconfig`.

### 1. `packages/tsconfig/package.json`

```json
{
  "name": "@repo/tsconfig",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./base.json": "./base.json",
    "./nextjs.json": "./nextjs.json",
    "./react-library.json": "./react-library.json"
  }
}
```

### 2. Base Configuration (`packages/tsconfig/base.json`)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  }
}
```

### 3. Next.js Config (`packages/tsconfig/nextjs.json`)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "noEmit": true
  }
}
```

---

## Step 2: Create the Shared `@repo/eslint-config` Package

Create a folder named `packages/eslint-config`. Modern ESLint uses **Flat Config** (`eslint.config.js`).

### 1. `packages/eslint-config/package.json`

```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./base": "./base.js",
    "./nextjs": "./nextjs.js"
  },
  "dependencies": {
    "@eslint/js": "^9.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.34.0",
    "typescript-eslint": "^8.0.0"
  }
}
```

### 2. Base Flat Config (`packages/eslint-config/base.js`)

```javascript
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "no-console": "warn",
    },
  },
];
```

### 3. Next.js Flat Config (`packages/eslint-config/nextjs.js`)

```javascript
import { baseConfig } from "./base.js";
import reactPlugin from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export const nextJsConfig = [
  ...baseConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
];
```

---

## Step 3: Consume Configs in an App (`apps/web`)

### 1. Link Config Dependencies in `apps/web/package.json`

Run this from your root workspace:

```bash
pnpm --filter web add -D @repo/tsconfig@workspace:* @repo/eslint-config@workspace:* eslint typescript

```

### 2. Extend TypeScript Config in `apps/web/tsconfig.json`

```json
{
  "extends": "@repo/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "next-env.d.ts"]
}
```

### 3. Extend ESLint Config in `apps/web/eslint.config.js`

```javascript
import { nextJsConfig } from "@repo/eslint-config/nextjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    // App-specific rule overrides if needed
    rules: {
      "no-console": "off",
    },
  },
];
```

---

## Step 4: Configure Turborepo for ESLint Caching

Update your root `turbo.json` so Turborepo can track and cache lint outputs:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "lint": {
      "outputs": []
    }
  }
}
```

Now, when you run `pnpm run lint` from the workspace root, Turborepo will lint all apps and packages in parallel while caching the results.

Adding shared Prettier and Tailwind CSS configurations follows the exact same pattern as ESLint and TypeScript: dedicated packages in `packages/` that expose configuration files for apps to extend.

Here is a complete setup for **Shared Prettier** and **Shared Tailwind CSS v4** in a Turborepo monorepo.

---

## 1. Shared Prettier Configuration (`packages/prettier-config`)

### Step A: Create `packages/prettier-config/package.json`

```json
{
  "name": "@repo/prettier-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js"
  },
  "devDependencies": {
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

### Step B: Create `packages/prettier-config/index.js`

This file defines your formatting rules and includes the Tailwind plugin to automatically sort class names:

```javascript
/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  trailingComma: "all",
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"],
};
```

### Step C: Use in Root or Individual Apps (`apps/web`)

Prettier can run globally from the root. Add a `.prettierrc.js` in your monorepo root (or inside `apps/web/.prettierrc.js`):

```javascript
import prettierConfig from "@repo/prettier-config";

export default prettierConfig;
```

---

## 2. Shared Tailwind CSS Configuration (`packages/tailwind-config`)

For modern Tailwind CSS setups (Tailwind v4), styles are configured using CSS variables and standard CSS imports, while Tailwind v3 uses JavaScript configs. Below is the clean **v4 CSS preset structure**.

### Step A: Create `packages/tailwind-config/package.json`

```json
{
  "name": "@repo/tailwind-config",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./base.css": "./base.css"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### Step B: Create `packages/tailwind-config/base.css`

Define your shared design tokens, custom utility classes, and theme colors here:

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #0070f3;
  --color-brand-secondary: #7928ca;
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Custom global styles or reset rules across all apps */
body {
  background-color: #f8fafc;
  color: #0f172a;
}
```

### Step C: Consume in an App (`apps/web`)

1. **Add Dependency:** Add `@repo/tailwind-config` to `apps/web/package.json`:

```bash
pnpm --filter web add -D @repo/tailwind-config@workspace:* @tailwindcss/vite tailwindcss

```

2. **Import in App Styles:** In `apps/web/src/app/globals.css`:

```css
@import "@repo/tailwind-config/base.css";

/* App-specific style overrides can go below */
```

---

## 3. Update `turbo.json` Task Pipeline

To leverage Turborepo caching for formatting and styling checks, update your root `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "format": {
      "outputs": []
    },
    "format:check": {
      "outputs": []
    }
  }
}
```

Add these corresponding root scripts in `package.json`:

```json
"scripts": {
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}

```

How do I set up a GitHub Actions CI pipeline for Turborepo with remote caching?
Here's how remote caching works: instead of running tasks like `build`, `lint`, or `test` from scratch on every GitHub runner, Turborepo uploads build artifacts and task outputs to a central cache server (Vercel or self-hosted). When a CI runner executes a task, Turborepo checks for an existing hash match and restores the output in milliseconds.

---

## Step 1: Obtain Remote Cache Credentials

You can use **Vercel's free Remote Cache** or a self-hosted solution (like `duo-remote-cache`).

1. Log into Vercel via CLI: `npx turbo login`
2. Link your monorepo workspace: `npx turbo link`
3. Retrieve your **Team/Owner Slug** and **Team ID** from `.turbo/config.json` inside your root directory.
4. Create a **Vercel Access Token**:

- Navigate to Vercel Dashboard $\rightarrow$ Settings $\rightarrow$ Tokens.
- Generate a token with access to your team.

---

## Step 2: Store Secrets in GitHub Secrets

Go to your GitHub repository: **Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions $\rightarrow$ New repository secret**.

Add the following environment variables:

| Secret Name   | Value Example   | Description                       |
| ------------- | --------------- | --------------------------------- |
| `TURBO_TOKEN` | `vck_abc123...` | Your Vercel Personal Access Token |
| `TURBO_TEAM`  | `my-team-slug`  | Your Vercel Team / Scope Slug     |

---

## Step 3: Create the GitHub Actions Workflow

Create `.github/workflows/ci.yml` in your repository root.

This workflow handles dependency caching with `pnpm`, sets up Turborepo remote caching, and runs PR checks in parallel.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize]

jobs:
  build:
    name: Lint, Test & Build
    runs-on: ubuntu-latest

    env:
      TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
      TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          # Fetch full history so Turborepo can determine affected files
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint workspace
        run: pnpm run lint

      - name: Run tests
        run: pnpm run test

      - name: Build workspace
        run: pnpm run build
```

---

## Step 4: Optimize PR Builds with `affected` (`--filter`)

For large monorepos with dozens of apps, you don't need to rebuild untouched projects. You can leverage Turborepo's git comparison filter so pull requests only build packages changed against `main`:

```yaml
- name: Build affected projects
  run: pnpm exec turbo run build --filter=...[origin/main]
```

> **What `--filter=...[origin/main]` does:** It tells Turborepo to run `build` only on packages changed relative to `origin/main`, plus all local packages depending on them.

---

## Verification & Caching Metrics

When your workflow runs on GitHub Actions, look for the following output in the logs:

```bash
• Remote computation caching enabled (Vercel)
• Task apps/web:build SUCCESS
• 2 successful, 2 total
• 1 cached, 1 total (80ms) >>> FULL TURBO

```

When you see **`>>> FULL TURBO`**, your remote cache worked as intended and skipped rebuilding identical outputs!

How do I configure continuous deployment for individual apps in a Turborepo monorepo?

How do I configure continuous deployment for individual apps in a Turborepo monorepo?

Deploying individual applications from a monorepo independently requires ensuring two things: **preventing unnecessary deployments** when unrelated apps or packages change, and **isolating build scopes** so image/bundle sizes remain minimal.

Here are the standard approaches for deploying individual apps to **Vercel/Netlify** and containerized environments like **Docker / AWS / Render**.

---

## Strategy 1: Serverless / Managed Platforms (Vercel, Netlify)

Managed platforms native to frontend frameworks handle monorepos out of the box by setting up individual projects connected to the same Git repository.

### Step 1: Create Separate Projects Per App

For each application inside `apps/` (e.g., `apps/web` and `apps/admin`), create a distinct project in your hosting platform dashboard pointing to your monorepo repository.

### Step 2: Configure Project Settings

In the project configuration settings for `apps/web`:

- **Root Directory:** Set to `apps/web`.
- **Build Command:** `cd ../.. && pnpm turbo run build --filter=web...`
- **Install Command:** `pnpm install`

### Step 3: Configure Ignored Build Step (Prevents Unnecessary Deployments)

To prevent `apps/web` from triggering a deployment build when changes only affect `apps/docs` or `apps/api`, configure an **Ignored Build Step** using Turborepo's `dry-run` comparison:

Add this bash command in your Vercel/Netlify project settings under **Ignored Build Step**:

```bash
npx turbo run build --filter=web...[HEAD^1]

```

> **How it works:** Turborepo checks if `apps/web` or any of its local `@repo/*` dependencies changed in the latest commit. If nothing changed for `web`, the command exits with `0` and cancels the deployment build automatically.

---

## Strategy 2: Containerized Deployments (Docker + Turbo Prune)

For server backends or custom container infrastructure, sending an entire monorepo into a Docker build context leads to massive image sizes and slow builds.

Turborepo solves this using **`turbo prune`**, which extracts _only_ the specific app and its dependent internal packages into a clean output folder (`out/`).

### Dockerfile for an Individual App (`apps/web/Dockerfile`)

Place this `Dockerfile` in your root or app directory to build a lightweight, production-ready image:

```dockerfile
# 1. Prune Stage: Extract only the needed app & workspace dependencies
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
# Isolates apps/web and its dependencies into /app/out
RUN turbo prune --scope=web --docker

# 2. Installer Stage: Install dependencies & build the app
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# First copy pruned package.json and lockfile to leverage layer caching
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy pruned full source code and build
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=web...

# 3. Runner Stage: Minimal production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/public ./apps/web/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["node", "apps/web/server.js"]

```

---

## Strategy 3: GitHub Actions Continuous Deployment Workflow

To trigger deployments dynamically when relevant apps change, use GitHub Actions with path filtering:

```yaml
name: Deploy Web App

on:
  push:
    branches: [main]
    paths:
      - "apps/web/**"
      - "packages/**" # Re-deploy if shared packages change

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Build Web App
        run: pnpm exec turbo run build --filter=web...

      # Insert deployment step (e.g., AWS ECR push, Fly.io, or SSH deploy)
```

---

### Key Takeaways

1. **Use `turbo prune**` for Docker to isolate dependency graphs and prevent bloated image contexts.
2. **Use `--filter=appname...**` to build an app and all of its local workspace dependencies.
3. **Set up Ignored Build Steps** on hosting platforms so commits affecting one app don't waste build minutes on others.

How do I set up an open-source self-hosted remote cache for Turborepo instead of Vercel?

To set up an open-source self-hosted remote cache for Turborepo, the most widely used and reliable open-source implementation is **`duo-remote-cache`** (or **`turborepo-remote-cache`**). It mimics Vercel's HTTP API, storing build artifacts in AWS S3, MinIO, Google Cloud Storage, Azure Blob, or local disk storage.

Here is the complete step-by-step setup using **Docker** and **`duo-remote-cache`** backed by S3 (or MinIO/Local Disk).

---

## Step 1: Deploy the Remote Cache Server (Docker / Compose)

Create a `docker-compose.yml` file to spin up the cache server.

```yaml
version: "3.8"

services:
  turbo-cache:
    image: foxis/duo-remote-cache:latest
    container_name: turbo-remote-cache
    ports:
      - "8080:8080"
    environment:
      # Secret token your CI and developers will use to authenticate
      - TURBO_TOKEN=my-secret-team-token
      # Storage Provider: s3, gcs, azure, or local
      - STORAGE_PROVIDER=s3
      - STORAGE_PATH=my-turborepo-cache-bucket
      # AWS S3 / MinIO Configuration
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=your-access-key
      - AWS_SECRET_ACCESS_KEY=your-secret-key
      # Optional: Add custom S3 endpoint if using MinIO
      # - AWS_ENDPOINT=http://minio:9000
      # - S3_FORCE_PATH_STYLE=true
    restart: unless-stopped
```

Run the server:

```bash
docker compose up -d

```

---

## Step 2: Configure Turborepo in Your Workspace

In your monorepo, update `.turbo/config.json` (or create it in the root directory) to specify your custom API endpoint:

```json
{
  "apiUrl": "https://cache.yourdomain.com",
  "signature": false
}
```

> **Note:** If you are testing locally over HTTP (e.g., `http://localhost:8080`), Turborepo accepts unencrypted HTTP for local IP addresses. For production servers, make sure your server is behind an HTTPS reverse proxy (like Nginx, Traefik, or Caddy).

---

## Step 3: Authenticate Developers & CI Runners

Instead of logging into Vercel via `npx turbo login`, configure Turborepo using environment variables.

### A. Local Development

Set these environment variables in your local shell or `.env.local` file:

```bash
export TURBO_API="https://cache.yourdomain.com"
export TURBO_TOKEN="my-secret-team-token"
export TURBO_TEAM="my-team"

```

Then run builds as normal:

```bash
pnpm turbo run build

```

### B. GitHub Actions CI Pipeline

Update your `.github/workflows/ci.yml` file to point to your self-hosted instance:

```yaml
- name: Build workspace with self-hosted cache
  env:
    TURBO_API: https://cache.yourdomain.com
    TURBO_TOKEN: ${{ secrets.SELF_HOSTED_TURBO_TOKEN }}
    TURBO_TEAM: my-team
  run: pnpm run build
```

---

## Step 4: Verify Cache Hits

When your CI pipeline or local machine runs a task, inspect the terminal output. You will see Turborepo upload and fetch artifacts from your self-hosted server:

```bash
• Remote computation caching enabled (Custom API)
• Task apps/web:build SUCCESS
• 1 cached, 1 total (120ms) >>> FULL TURBO

```

---

## Storage Provider Options Summary

| Provider                   | `STORAGE_PROVIDER` Value | Required Env Variables                                     |
| -------------------------- | ------------------------ | ---------------------------------------------------------- |
| **AWS S3 / MinIO**         | `s3`                     | `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |
| **Google Cloud Storage**   | `gcs`                    | `GCP_PROJECT_ID`, `GCS_CREDENTIALS`                        |
| **Azure Blob Storage**     | `azure`                  | `AZURE_STORAGE_ACCOUNT`, `AZURE_STORAGE_KEY`               |
| **Local Disk File System** | `local`                  | `STORAGE_PATH=/path/to/cache/folder`                       |

How do I set up Caddy or Nginx with SSL as a reverse proxy for my Turborepo remote cache?

Placing a reverse proxy in front of your self-hosted Turborepo cache gives you automatic SSL/TLS termination, custom domain routing, and essential performance tweaks (like handling large payload uploads for cached build artifacts).

**Caddy** is the easiest option because it provisions and renews Let's Encrypt SSL certificates automatically with zero configuration. **Nginx** is great if you prefer fine-grained control or already have Certbot running in your stack.

---

## Option 1: Caddy (Recommended — Easiest Setup)

Caddy automatically handles HTTPS provisioning and HTTP-to-HTTPS redirects out of the box.

### Step 1: Create a `Caddyfile`

Create a file named `Caddyfile` next to your `docker-compose.yml`:

```caddy
turbo-cache.yourdomain.com {
    # Forward requests to your duo-remote-cache container
    reverse_proxy turbo-cache:8080

    # Ensure proxy headers are correctly set
    header_up X-Forwarded-Proto https
}

```

### Step 2: Add Caddy to `docker-compose.yml`

Update your Docker Compose configuration so Caddy sits in the same network as your remote cache container:

```yaml
version: "3.8"

services:
  turbo-cache:
    image: foxis/duo-remote-cache:latest
    container_name: turbo-remote-cache
    environment:
      - TURBO_TOKEN=my-secret-team-token
      - STORAGE_PROVIDER=s3
      - STORAGE_PATH=my-turborepo-cache-bucket
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=your-access-key
      - AWS_SECRET_ACCESS_KEY=your-secret-key
    restart: unless-stopped

  caddy:
    image: caddy:2-alpine
    container_name: caddy-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
```

---

## Option 2: Nginx + Certbot

If you prefer Nginx, make sure to set `client_max_body_size` high enough (e.g., `500M` or `1G`). Turborepo uploads large compiled build artifacts, and Nginx's default `1MB` upload limit will cause `413 Request Entity Too Large` errors.

### Step 1: Create Nginx Configuration (`nginx.conf`)

```nginx
server {
    listen 80;
    server_name turbo-cache.yourdomain.com;

    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name turbo-cache.yourdomain.com;

    # Path to your SSL certificates (e.g., generated by Certbot)
    ssl_certificate /etc/letsencrypt/live/turbo-cache.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/turbo-cache.yourdomain.com/privkey.pem;

    # CRITICAL: Allow large uploads for build artifacts
    client_max_body_size 500M;

    location / {
        proxy_pass http://turbo-cache:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Disable buffering for streaming response performance
        proxy_buffering off;
    }
}

```

---

## Step 3: Update Turborepo Configuration

Once your SSL certificate is active and your proxy is running, point `.turbo/config.json` in your monorepo root to your HTTPS endpoint:

```json
{
  "apiUrl": "https://turbo-cache.yourdomain.com",
  "signature": false
}
```

Test the connection from your terminal or CI environment:

```bash
export TURBO_API="https://turbo-cache.yourdomain.com"
export TURBO_TOKEN="my-secret-team-token"
export TURBO_TEAM="my-team"

pnpm run build

```

How do I set up Husky and lint-staged in a pnpm Turborepo monorepo?

Setting up **Husky** and **lint-staged** in a pnpm Turborepo monorepo keeps your codebase clean by running linters and formatters _only_ on staged Git files before a commit goes through.

Because it's a monorepo, the best practice is to **run Husky and lint-staged at the root level**, letting `lint-staged` delegate tasks to individual workspace apps and packages.

Here is the step-by-step walkthrough.

---

## Step 1: Install Husky and lint-staged at the Root

From your workspace root, install `husky` and `lint-staged` into your root `devDependencies`:

```bash
pnpm add -D -w husky lint-staged

```

---

## Step 2: Initialize Husky

Run the Husky initialization command to create the `.husky/` directory and configure the `prepare` lifecycle script in your root `package.json`:

```bash
pnpm exec husky init

```

This updates your root `package.json` with a `prepare` script:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

> **Why this matters:** When team members clone the monorepo and run `pnpm install`, pnpm automatically runs `prepare`, installing Git hooks on their local machines.

---

## Step 3: Configure `.lintstagedrc.json` at the Root

Create a `.lintstagedrc.json` file in the root directory. This configures `lint-staged` to match changed files by extension and run Prettier and ESLint across your workspace apps.

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml,css}": ["prettier --write"]
}
```

---

## Step 4: Configure the `pre-commit` Hook

When you ran `pnpm exec husky init`, Husky created a `.husky/pre-commit` file with a default `pnpm test` command.

Open `.husky/pre-commit` and replace its content with:

```bash
pnpm exec lint-staged

```

Now, every time someone runs `git commit`, Husky intercepts the commit and executes `lint-staged` on the staged files.

---

## Step 5: (Optional) Type-Checking Staged Files with Turborepo

While `eslint` and `prettier` work great on individual staged files, **TypeScript (`tsc`) requires full project context** and cannot run on isolated individual files.

If you want type-checking during commits, leverage Turborepo's caching to run type checks across affected packages by adding `turbo` to your `pre-commit` hook:

### `.husky/pre-commit`

```bash
# 1. Format & lint only staged files
pnpm exec lint-staged

# 2. Run fast type-checking across workspace packages via Turborepo
pnpm exec turbo run check-types

```

Make sure your root `turbo.json` includes the `check-types` task:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "check-types": {
      "dependsOn": ["^check-types"],
      "outputs": []
    }
  }
}
```

---

## Testing Your Pre-commit Hook

To test the setup:

1. Make a small code change in any app or package.
2. Stage the file: `git add .`
3. Commit the changes: `git commit -m "test: verify pre-commit hook"`

You will see `lint-staged` run in the terminal, fixing formatting issues and formatting staged files automatically before finalizing the commit!

How do I set up Commitlint with Husky in a pnpm Turborepo monorepo?

Setting up **Commitlint** with **Husky** ensures that every commit message across your entire team strictly follows conventions like **Conventional Commits** (`feat: ...`, `fix: ...`, `docs: ...`).

In a monorepo, Commitlint also makes it easy to enforce **scopes** matching your workspace package and app names (for example, `feat(web): ...` or `fix(ui): ...`).

Here is how to configure Commitlint using a `commit-msg` Husky hook in your pnpm Turborepo setup.

---

## Step 1: Install Commitlint Dependencies

From your monorepo root directory, install `@commitlint/cli` and the conventional commits config (`@commitlint/config-conventional`):

```bash
pnpm add -D -w @commitlint/cli @commitlint/config-conventional

```

---

## Step 2: Create the Commitlint Configuration

Create a `.commitlintrc.js` (or `commitlint.config.js`) file in your monorepo root.

### Basic Setup (Conventional Commits)

```javascript
// .commitlintrc.js
export default {
  extends: ["@commitlint/config-conventional"],
};
```

---

### Advanced Setup: Auto-Detect Monorepo Scopes

To enforce scopes that automatically match your `apps/` and `packages/` names (so developers can use `feat(web): add login` or `fix(ui): fix button styling`), install `@commitlint/config-nx-scopes` or use a dynamic rule:

```javascript
// .commitlintrc.js
import { readdirSync } from "fs";

// Dynamically read app and package directory names for commit scopes
const getScopes = () => {
  const apps = readdirSync("./apps");
  const packages = readdirSync("./packages");
  return [...apps, ...packages];
};

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", [...getScopes(), "repo", "deps"]],
  },
};
```

> **Allowed examples:** `feat(web): ...`, `fix(ui): ...`, `chore(repo): ...`

---

## Step 3: Add the `commit-msg` Husky Hook

Use Husky to create the `commit-msg` hook file in `.husky/`:

```bash
echo "pnpm exec commitlint --edit \$1" > .husky/commit-msg

```

Ensure the file is created with execution permissions. Your `.husky/commit-msg` file should look like this:

```bash
#!/bin/sh
pnpm exec commitlint --edit "$1"

```

---

## Step 4: Verify the Setup

Try making a commit with an invalid message to test the hook:

### ❌ Invalid Commit Test

```bash
git add .
git commit -m "fixed stuff"

```

**Terminal Output:**

```text
⧗  input: fixed stuff
✖  subject may not be empty [subject-empty]
✖  type may not be empty [type-empty]

✖  found 2 errors, 0 warnings
husky - commit-msg script failed (code 1)

```

### ✅ Valid Commit Test

```bash
git commit -m "fix(web): correct button alignment on landing page"

```

**Terminal Output:**

```text
[main a1b2c3d] fix(web): correct button alignment on landing page
 1 file changed, 2 insertions(+)

```

---

## Summary Checklist

- [x] `@commitlint/cli` and `@commitlint/config-conventional` installed at root (`-w`).
- [x] `.commitlintrc.js` configured with Conventional Commits rules and optional dynamic scopes.
- [x] `.husky/commit-msg` hook created with `pnpm exec commitlint --edit "$1"`.

How do I set up Changesets to automatically manage package versions and releases in a Turborepo monorepo?

**Changesets** is the industry standard for managing versions, changelogs, and releases in a Turborepo monorepo.

The Changesets workflow operates in two main phases:

1. **Developer Phase:** Developers create small markdown files ("changesets") describing what changed and which packages need a `patch`, `minor`, or `major` version bump.
2. **CI Release Phase:** A GitHub Action detects these changesets on the main branch, automatically opens a **"Version Packages" Pull Request** that bumps versions and updates `CHANGELOG.md` files. When you merge that PR, it automatically publishes the updated packages to npm.

Here is the step-by-step setup guide for a pnpm Turborepo monorepo.

---

## Step 1: Install & Initialize Changesets

From your monorepo root, install `@changesets/cli`:

```bash
pnpm add -D -w @changesets/cli

```

Initialize Changesets to generate the `.changeset/config.json` configuration file:

```bash
pnpm exec changeset init

```

---

## Step 2: Configure `.changeset/config.json`

Open `.changeset/config.json` and update it for your monorepo setup:

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["web", "docs"]
}
```

### Key Configuration Options

- **`access`**: Set to `"public"` if publishing public npm packages, or `"restricted"` for private packages.
- **`baseBranch`**: Point to your default branch (`main` or `master`).
- **`ignore`**: List application names (e.g., `web`, `docs`) that should **not** be published to the npm registry.
- **`updateInternalDependencies`**: Set to `"patch"` so when `@repo/ui` bumps, any internal app or package depending on it gets automatically updated.

---

## Step 3: Add Scripts to `package.json` & `turbo.json`

Add the following release scripts to your root `package.json`:

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  }
}
```

Update your root `turbo.json` to configure the build task so that publishing always builds fresh assets first:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```

---

## Step 4: The Developer Workflow (Creating a Changeset)

When a developer makes a feature or bug fix in a package (e.g., `@repo/ui`):

1. Run the interactive CLI:

```bash
pnpm changeset

```

2. Select which packages changed using arrow/space keys.
3. Select the SemVer bump type (`patch`, `minor`, or `major`).
4. Type a summary of the changes.

This generates a temporary `.changeset/pink-dogs-dance.md` file. The developer commits this file alongside their feature code in the Pull Request.

---

## Step 5: Automate Releases via GitHub Actions

Create `.github/workflows/release.yml` in your repository root.

### Required Secrets

Add an `NPM_TOKEN` to your repository: **Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions $\rightarrow$ New repository secret**.

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release & Version Packages
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Create Version PR or Publish
        uses: changesets/action@v1
        with:
          # Command used to bump versions & update CHANGELOGs
          version: pnpm run version-packages
          # Command used to publish updated packages to npm
          publish: pnpm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## How the Automated CI Cycle Works

```
Developer pushes PR with .changeset/xyz.md
                │
                ▼
Merge PR into 'main' branch
                │
                ▼
GitHub Action detects changesets
                │
                ├──► If changesets exist:
                │    Opens/updates a "Version Packages" PR with bumped package.json & CHANGELOG.md files
                │
                └──► When you merge the "Version Packages" PR:
                     Runs `pnpm run release` -> builds workspace & publishes packages to npm

```

---

## Pro Tip: Install the Changeset Bot

To prevent developers from forgetting to run `pnpm changeset`, install the **[Changeset Bot](https://github.com/apps/changeset-bot)** on your GitHub repository. It posts a friendly comment on every pull request reminding contributors to add a changeset if any workspace package was modified.

How do I enforce conventional commit PR titles in GitHub Actions for my monorepo?

Enforcing Conventional Commits on **Pull Request titles** in GitHub Actions is a great practice, especially when using GitHub's **"Squash and merge"** option. When squashing, GitHub defaults to using the PR title as the main commit message on your `main` branch.

Using the official **`amannn/action-semantic-pull-request`** action, you can validate PR titles against Conventional Commits and automatically limit allowable scopes to your monorepo's `apps/` and `packages/` directory names.

---

## Step 1: Create the GitHub Actions Workflow

Create a new file named `.github/workflows/lint-pr-title.yml` in your monorepo root:

```yaml
name: "Lint PR Title"

on:
  pull_request_target:
    types:
      - opened
      - edited
      - synchronize
      - labeled
      - unlabeled

permissions:
  pull-requests: read
  statuses: write

jobs:
  main:
    name: Validate PR Title
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository (to inspect monorepo scopes)
        uses: actions/checkout@v4

      - name: Get monorepo scopes
        id: scopes
        run: |
          # Dynamically list directory names in apps/ and packages/
          APPS=$(ls -d apps/*/ 2>/dev/null | xargs -n1 basename | tr '\n' '\n')
          PACKAGES=$(ls -d packages/*/ 2>/dev/null | xargs -n1 basename | tr '\n' '\n')

          # Combine into a multiline string for the action
          SCOPES=$(printf "%s\n%s\nrepo\ndeps\nci" "$APPS" "$PACKAGES" | grep -v '^$' | sort -u)

          echo "scopes<<EOF" >> $GITHUB_OUTPUT
          echo "$SCOPES" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Validate PR title against Conventional Commits
        uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          # Define allowable types (e.g., feat, fix, docs, chore, etc.)
          types: |
            feat
            fix
            docs
            style
            refactor
            perf
            test
            build
            ci
            chore
            revert
          # Restrict scopes to your monorepo package & app names
          scopes: ${{ steps.scopes.outputs.scopes }}
          # Require a scope (e.g., "feat(web): ..." instead of "feat: ...")
          requireScope: false
```

> **Why `pull_request_target`?** Using `pull_request_target` instead of `pull_request` allows this workflow to run safely on PRs originating from forks while giving the status check write access to mark the PR check as passed/failed.

---

## Step 2: Configure GitHub Repository Branch Protection Rules

To prevent merging PRs with invalid titles:

1. Go to your GitHub repository: **Settings $\rightarrow$ Branches** (or **Rulesets**).
2. Edit or add a protection rule for your primary branch (`main`).
3. Enable **Require status checks to pass before merging**.
4. Search for and add **`Validate PR Title`** as a required status check.

---

## Step 3: Configure GitHub Squash Merge Settings

Ensure squashed PRs use the PR title as the final commit message:

1. Go to **Settings $\rightarrow$ General $\rightarrow$ Pull Requests**.
2. Check **Allow squash merging**.
3. Set **Default commit message for squash merges** to:

- **Pull request title** (or **Pull request title and description**).

---

## Verification & Examples

When a developer opens or updates a Pull Request, the action runs instantly:

### ❌ Rejected PR Titles

| PR Title                        | Reason for Failure                                               |
| ------------------------------- | ---------------------------------------------------------------- |
| `added new feature`             | Missing conventional type (`feat`, `fix`, etc.)                  |
| `feat: added auth`              | Capitalized subject (conventional commit rules expect lowercase) |
| `fix(unknown-app): broken link` | `unknown-app` does not exist inside `apps/` or `packages/`       |

### ✅ Valid PR Titles

- `feat(web): add dark mode toggle`
- `fix(ui): adjust button padding in design system`
- `chore(repo): update pnpm dependencies`
- `docs: update setup instructions in README`
