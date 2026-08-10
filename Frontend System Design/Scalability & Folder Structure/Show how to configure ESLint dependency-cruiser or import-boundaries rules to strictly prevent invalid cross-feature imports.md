In a feature-based architecture, enforcing structural boundaries via code reviews alone fails as team size scales. Developers inevitably reach deep into internal feature implementations (`@/features/billing/components/internal/Modal.tsx`) or create circular dependencies.

To strictly enforce boundaries programmatically, you can use **ESLint** with `eslint-plugin-import-access` or `eslint-plugin-boundaries` (the modern standard), or use **`dependency-cruiser`** for deep AST graph validation.

---

## Strategy A: ESLint (`eslint-plugin-boundaries`)

`eslint-plugin-boundaries` categorizes files based on glob patterns and enforces explicit import directional rules directly inside your existing ESLint configuration.

### 1. Installation

```bash
npm install --save-dev eslint-plugin-boundaries

```

### 2. Configuration (`.eslintrc.js` / `eslint.config.js`)

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['boundaries'],
  settings: {
    'boundaries/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    // Define the taxonomy of your codebase layers
    'boundaries/elements': [
      {
        type: 'app',
        pattern: 'src/app/**',
      },
      {
        type: 'feature',
        pattern: 'src/features/*/**',
        capture: ['featureName'], // Captures feature subfolder name (e.g., 'checkout', 'auth')
      },
      {
        type: 'shared-ui',
        pattern: 'src/components/**',
      },
      {
        type: 'shared-lib',
        pattern: 'src/{hooks,utils,lib,stores,types}/**',
      },
    ],
  },
  rules: {
    // RULE 1: Enforce strict layer hierarchy
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        message: '${file.type} is not allowed to import ${dependency.type}',
        rules: [
          // 'app' can import from anywhere
          {
            from: 'app',
            allow: ['feature', 'shared-ui', 'shared-lib'],
          },
          // 'feature' can import shared items and OTHER features (via public gateway only)
          {
            from: 'feature',
            allow: ['feature', 'shared-ui', 'shared-lib'],
          },
          // 'shared-ui' (Design System) CANNOT import business features or global stores
          {
            from: 'shared-ui',
            allow: ['shared-ui', 'shared-lib'],
          },
          // 'shared-lib' cannot import components or features
          {
            from: 'shared-lib',
            allow: ['shared-lib'],
          },
        ],
      },
    ],

    // RULE 2: Prevent feature internal leaks (Must import from feature root / index.ts)
    'boundaries/entry-point': [
      'error',
      {
        default: 'disallow',
        target: [['feature', { capture: { featureName: 'exact' } }]],
        rules: [
          {
            // Reaching deep into another feature's subfolders is FORBIDDEN
            // Must import strictly via 'src/features/<featureName>/index.ts'
            target: 'index.ts',
            allow: true,
          },
        ],
      },
    ],

    // RULE 3: Prevent direct cross-feature private imports
    'boundaries/no-private': [
      'error',
      {
        allowUncaptured: true,
      },
    ],
  },
};

```

### What this catches at edit time

```typescript
// In /src/features/user-profile/UserProfile.tsx:

// ❌ ESLINT ERROR: Reaching into deep internal files of another feature!
import { PrivateMathHelper } from '@/features/checkout/utils/calculator'; 
// -> Error: Entry point 'utils/calculator' is not allowed for element type 'feature'. Must use index.ts

// ❌ ESLINT ERROR: Design system importing business feature!
// In /src/components/Button.tsx:
import { useAuthStore } from '@/features/auth';
// -> Error: shared-ui is not allowed to import feature.

// ✅ VALID: Importing cleanly through the public feature interface
import { CheckoutButton } from '@/features/checkout';

```

---

## Strategy B: Dependency-Cruiser (`.dependency-cruiser.js`)

While ESLint checks files individually, **dependency-cruiser** builds a complete AST dependency graph of your entire repository. It is particularly effective at detecting **circular feature dependencies** (`Feature A -> Feature B -> Feature A`).

### 1. Installation

```bash
npm install --save-dev dependency-cruiser

```

### 2. Configuration (`.dependency-cruiser.js`)

```javascript
// .dependency-cruiser.js
module.exports = {
  forbidden: [
    /* -----------------------------------------------------------------
     * RULE 1: NO CIRCULAR DEPENDENCIES
     * ----------------------------------------------------------------- */
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies destroy tree-shaking and cause runtime initialization bugs.',
      from: {},
      to: {
        circular: true,
      },
    },

    /* -----------------------------------------------------------------
     * RULE 2: ENFORCE FEATURE PUBLIC GATEWAY (INDEX.TS ONLY)
     * ----------------------------------------------------------------- */
    {
      name: 'feature-public-interface-only',
      severity: 'error',
      comment: 'Do not import internal feature files directly. Use the public API gateway (index.ts).',
      from: {
        path: '^src/features/([^/]+)',
      },
      to: {
        path: '^src/features/([^/]+)/.+$',
        // Disallow importing internal files of ANOTHER feature
        pathNot: [
          '^src/features/$1/.+$', // Allow internal imports within the SAME feature
          '^src/features/[^/]+/index\\.(js|ts|tsx)$', // Allow importing index.ts of other features
        ],
      },
    },

    /* -----------------------------------------------------------------
     * RULE 3: DESIGN SYSTEM ISOLATION
     * ----------------------------------------------------------------- */
    {
      name: 'design-system-no-features',
      severity: 'error',
      comment: 'Shared UI components (/src/components) must be pure and cannot depend on domain features.',
      from: {
        path: '^src/components',
      },
      to: {
        path: '^src/features',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};

```

### 3. Adding CI Enforcement Script

Add the validation check to your `package.json`:

```json
{
  "scripts": {
    "lint:deps": "depcruise --config .dependency-cruiser.js src"
  }
}

```

---

## System Comparison & Recommendation

| Tool                           | Primary Strength                                                                                                               | Best Used For                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **`eslint-plugin-boundaries`** | **Instant Editor Feedback:** Shows red squiggly lines in VS Code/WebStorm in real-time as an engineer types an illegal import. | Developer Experience (DX) & immediate boundary awareness.    |
| **`dependency-cruiser`**       | **Graph Analysis:** Detects multi-file circular dependency loops across the whole repository.                                  | Pre-commit hooks (`husky`) & CI pipeline verification steps. |

### Architectural Best Practice

Combine both in production. Use **`eslint-plugin-boundaries`** for immediate developer feedback in the IDE, and run **`dependency-cruiser`** in your GitHub Actions CI pipeline to guarantee no circular dependencies or leaked feature internals slip into `main`.
