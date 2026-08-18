Building a multi-team component library requires treating the library as an **internal open-source product**. Success depends as much on API design, token architecture, and governance as it does on raw UI implementation.

---

### 1. Architecture: Token-Driven & Headless Foundation

Avoid coupling opinionated CSS styles directly to primitive logic. Decouple into distinct architectural tiers:

```
┌─────────────────────────────────────────────────────────────┐
│  Tier 3: Composed Patterns (DatePickers, DataGrids, Shell)  │
├─────────────────────────────────────────────────────────────┤
│  Tier 2: Styled Components (Button, Modal, Input, Badge)    │
├─────────────────────────────────────────────────────────────┤
│  Tier 1: Headless Primitives (Radix UI / React Aria)        │
├─────────────────────────────────────────────────────────────┤
│  Tier 0: Design Tokens (JSON schema via Style Dictionary)   │
└─────────────────────────────────────────────────────────────┘

```

* **Design Tokens as the Ground Truth:** Define colors, typography, spacing, elevations, and animation curves in platform-agnostic JSON (using the W3C Design Tokens Community Group format). Use tools like **Style Dictionary** to transform tokens into CSS Variables, Tailwind themes, and TypeScript constants.
* **Headless Accessibility Foundation:** Build primitives on top of battle-tested headless libraries (e.g., **Radix UI**, **React Aria**, or **Floating UI**). This ensures complex WAI-ARIA compliance, focus trapping, keyboard navigation, and portal management work out of the box without writing error-prone custom listeners.

---

### 2. Component API Design Principles

To serve dozens of teams with divergent product requirements, APIs must be **composable** rather than monolithic.

* **Inversion of Control over Mega-Props:**
* ❌ *Anti-pattern:* `<Modal hasSecondaryAction="{false}" showCloseButton="{true}" title="..."/>`
* ✅ *Composable pattern:*

```tsx
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Terms</Dialog.Title>
      <Dialog.Description>...</Dialog.Description>
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

```

* **Polymorphic Rendering (`asChild` / `as`):** Allow consumers to render custom elements (e.g., Next.js `<Link>`, React Router `<NavLink>`) while preserving the component library’s styles and accessibility attributes.
* **Strict Semantic Variants (CVA / Vanilla Extract):** Use `class-variance-authority` (CVA) or CSS-in-JS build tools for type-safe variants (`intent`, `size`, `variant`).

---

### 3. Repository Architecture & Build Tooling

Use a **Monorepo (Turborepo or Nx)** to keep core packages modular:

```text
my-design-system/
├── packages/
│   ├── tokens/          # Token definitions + Style Dictionary compiler
│   ├── icons/           # SVGs compiled into tree-shakeable React components
│   ├── core/            # Accessible primitive components (Button, Dialog, Select)
│   ├── charts/          # Heavy visualization components (isolated bundle)
│   └── eslint-plugin/   # Custom linter rules for deprecations & best practices
├── apps/
│   ├── storybook/       # Component catalog, interactive sandbox & accessibility audit
│   └── docs/            # Usage guidelines, copy-paste snippets, design specs

```

* **Dual ESM / CJS Output:** Bundle with **tsup** or **Vite/Rollup** with explicit export maps in `package.json` and strict `"sideEffects": false` declarations to enable optimal tree-shaking in consumer apps.
* **Style Delivery:** Ship pure CSS files or precompiled utility classes. Avoid runtime CSS-in-JS (like styled-components/Emotion) to eliminate runtime parsing overhead and ensure compatibility with React Server Components (RSC).

---

### 4. Quality Control, Automated Testing & CI/CD

Multi-team dependencies mean broken releases impact multiple product roadmaps. Automate verification:

* **Automated Visual Regression:** Run tools like **Chromatic** (Storybook) or **Playwright Visual Comparison** on every pull request to catch accidental CSS/layout regressions across browsers and themes.
* **Automated Accessibility Testing:** Integrate `axe-core` and `@storybook/addon-a11y` into CI to enforce zero WCAG 2.1 AA violations.
* **Static Typing & API Surface Testing:** Use `api-extractor` to generate API reports. If an export changes or a prop is removed, CI fails unless an intentional breaking change is declared.
* **Automated Versioning (Changesets):** Require developers to add a changeset file (`npx changeset`) to any PR modifying a package. CI automatically calculates Semantic Versioning (SemVer), writes changelogs, and publishes releases to private registries (npm/Artifactory).

---

### 5. Multi-Theming & White-Labeling

To support distinct brands or sub-teams:

* **CSS Custom Properties (Variables):** Map all component colors and dimensions to semantic CSS variables rather than hardcoded hex values:

```css
/* Brand A Theme */
:root[data-theme="brand-a"] {
  --color-primary: #0284c7;
  --radius-interactive: 4px;
}

/* Brand B Theme */
:root[data-theme="brand-b"] {
  --color-primary: #7c3aed;
  --radius-interactive: 12px;
}

```

* **Semantic Abstraction:** Components reference `--color-action-primary-default` rather than `--color-blue-500`.

---

### 6. Governance, Adoption & Developer Experience (DX)

A library succeeds based on team adoption, not just code quality.

* **Deprecation Strategy & Codemods:** When releasing breaking changes, ship automated codemods using **jscodeshift** so consumer teams can upgrade their codebases with a single CLI command:

```bash
npx @my-org/codemods v2-to-v3 --path src/

```

* **RFC (Request for Comments) Process:** For major new components (like a complex Data Grid), require an RFC proposing the component API before implementation begins, allowing consuming teams to provide feedback early.
* **Component Maturity Model:** Tag components in Storybook with clear stability tiers:
* `Alpha / Experimental`: API may change; opt-in only.
* `Stable / Production`: Full SemVer protection, WCAG tested, design approved.
* `Deprecated`: Scheduled for removal in the next major version with links to replacements.

How do I configure Style Dictionary to transform JSON tokens into CSS variables and TypeScript constants?

Style Dictionary compiles platform-agnostic design tokens defined in JSON/JSON5/JavaScript into target platform formats such as CSS custom properties, SCSS variables, and TypeScript definitions.

---

### 1. Project Setup & Installation

Install **Style Dictionary** (v4+ supports ES modules and modern format hooks):

```bash
npm install -D style-dictionary

```

Add a build script to your `package.json`:

```json
{
  "scripts": {
    "build:tokens": "style-dictionary build --config style-dictionary.config.js"
  }
}

```

---

### 2. Define Token Schema (`tokens/`)

Adopt the [W3C Design Tokens Community Group](https://www.google.com/search?q=https://design-tokens.github.io/community-group/format/) specification using `$value` and `$type`.

**Base Palette (`tokens/color/base.json`):**

```json
{
  "color": {
    "blue": {
      "50": { "$value": "#eff6ff", "$type": "color" },
      "500": { "$value": "#3b82f6", "$type": "color" },
      "600": { "$value": "#2563eb", "$type": "color" }
    },
    "slate": {
      "100": { "$value": "#f1f5f9", "$type": "color" },
      "900": { "$value": "#0f172a", "$type": "color" }
    }
  }
}

```

**Semantic Tokens (`tokens/color/semantic.json`):**

```json
{
  "color": {
    "brand": {
      "primary": { "$value": "{color.blue.600}", "$type": "color" },
      "hover": { "$value": "{color.blue.500}", "$type": "color" }
    },
    "surface": {
      "background": { "$value": "{color.slate.100}", "$type": "color" },
      "foreground": { "$value": "{color.slate.900}", "$type": "color" }
    }
  },
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" }
  },
  "radius": {
    "sm": { "$value": "4px", "$type": "dimension" },
    "md": { "$value": "8px", "$type": "dimension" }
  }
}

```

---

### 3. Style Dictionary Configuration (`style-dictionary.config.js`)

Configure the build outputs for **CSS custom properties**, **flat/nested TypeScript constants**, and **TypeScript type definitions**:

```javascript
import StyleDictionary from 'style-dictionary';

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    // 1. CSS Custom Properties Output
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true, // Preserves var(--color-blue-600) aliases
            selector: ':root',
          },
        },
      ],
    },

    // 2. TypeScript Constants & Types Output
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [
        // Type-safe flat object mapping
        {
          destination: 'tokens.ts',
          format: 'javascript/esm',
        },
        // Complete type definitions for autocompletion
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
        // Flat token keys for CSS variable helper utilities
        {
          destination: 'token-names.ts',
          format: 'typescript/object',
        },
      ],
    },
  },
};

```

---

### 4. Build and Inspect Outputs

Run the compilation script:

```bash
npm run build:tokens

```

#### Generated CSS Output (`dist/css/variables.css`)

```css
/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --color-blue-50: #eff6ff;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-slate-100: #f1f5f9;
  --color-slate-900: #0f172a;
  --color-brand-primary: var(--color-blue-600);
  --color-brand-hover: var(--color-blue-500);
  --color-surface-background: var(--color-slate-100);
  --color-surface-foreground: var(--color-slate-900);
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --radius-sm: 4px;
  --radius-md: 8px;
}

```

#### Generated TypeScript Definitions (`dist/ts/tokens.d.ts`)

```typescript
/**
 * Do not edit directly, this file was auto-generated.
 */

export const ColorBlue50 : string;
export const ColorBlue500 : string;
export const ColorBlue600 : string;
export const ColorBrandPrimary : string;
export const ColorSurfaceBackground : string;
export const SpacingXs : string;
export const SpacingMd : string;
export const RadiusSm : string;
// ...

```

---

### 5. Custom Formats: Type-Safe Token Map

If you want a nested TypeScript object typed with `as const` so consumers get full autocomplete in JS/TS environments:

```javascript
// style-dictionary.config.js
import StyleDictionary from 'style-dictionary';

// Custom format for nested immutable TypeScript tokens
StyleDictionary.registerFormat({
  name: 'typescript/nested-const',
  format: async ({ dictionary }) => {
    const formatObj = (obj) => {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && 'value' in value) {
          result[key] = value.value;
        } else if (typeof value === 'object') {
          result[key] = formatObj(value);
        }
      }
      return result;
    };

    const tokens = formatObj(dictionary.tokens);
    return `/** Auto-generated by Style Dictionary */\nexport const tokens = ${JSON.stringify(
      tokens,
      null,
      2
    )} as const;\n\nexport type DesignTokens = typeof tokens;\n`;
  },
});

```

Add this format to the `ts` platform configuration:

```javascript
{
  destination: 'tokens-nested.ts',
  format: 'typescript/nested-const',
}

```

This yields:

```typescript
export const tokens = {
  color: {
    brand: {
      primary: "#2563eb",
      hover: "#3b82f6"
    },
    surface: {
      background: "#f1f5f9",
      foreground: "#0f172a"
    }
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px"
  }
} as const;

export type DesignTokens = typeof tokens;

```

---

### 6. Integrating with a React Component Library

In your library's entrypoint or CSS root:

```tsx
// packages/core/src/index.ts
import './dist/css/variables.css';
export { tokens } from './dist/ts/tokens-nested';

// Usage in components
import React from 'react';
import { tokens } from '@my-org/tokens';

export const Button = () => {
  return (
    <button
      style={{
        backgroundColor: 'var(--color-brand-primary)', // Uses runtime CSS variable
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`, // Uses typed compile-time token
        borderRadius: 'var(--radius-md)',
      }}
    >
      Click me
    </button>
  );
};

```

How do I configure Style Dictionary to compile separate light and dark mode theme CSS files?

To configure **Style Dictionary** (v4+) for multi-theme compilation (Light and Dark modes), use a layered token architecture where **global/base tokens** are shared, and **semantic tokens** are split into theme-specific files.

---

### 1. Token Directory Structure

Separate shared primitives (colors, spacing, typography) from semantic decisions (surfaces, text, borders) per theme:

```text
tokens/
├── global/                     # Shared primitive palette (scale values)
│   ├── colors.json
│   ├── spacing.json
│   └── radius.json
└── themes/
    ├── light/                  # Light theme semantic mapping
    │   └── semantic.json
    └── dark/                   # Dark theme semantic mapping
        └── semantic.json

```

---

### 2. Define Tokens

**Global Primitives (`tokens/global/colors.json`):**

```json
{
  "color": {
    "slate": {
      "50": { "$value": "#f8fafc", "$type": "color" },
      "100": { "$value": "#f1f5f9", "$type": "color" },
      "800": { "$value": "#1e293b", "$type": "color" },
      "900": { "$value": "#0f172a", "$type": "color" }
    },
    "blue": {
      "500": { "$value": "#3b82f6", "$type": "color" },
      "600": { "$value": "#2563eb", "$type": "color" }
    }
  }
}

```

**Light Theme Semantics (`tokens/themes/light/semantic.json`):**

```json
{
  "color": {
    "surface": {
      "base": { "$value": "{color.slate.50}", "$type": "color" },
      "card": { "$value": "#ffffff", "$type": "color" }
    },
    "text": {
      "primary": { "$value": "{color.slate.900}", "$type": "color" },
      "muted": { "$value": "{color.slate.800}", "$type": "color" }
    },
    "interactive": {
      "primary": { "$value": "{color.blue.600}", "$type": "color" }
    }
  }
}

```

**Dark Theme Semantics (`tokens/themes/dark/semantic.json`):**

```json
{
  "color": {
    "surface": {
      "base": { "$value": "{color.slate.900}", "$type": "color" },
      "card": { "$value": "{color.slate.800}", "$type": "color" }
    },
    "text": {
      "primary": { "$value": "{color.slate.50}", "$type": "color" },
      "muted": { "$value": "{color.slate.100}", "$type": "color" }
    },
    "interactive": {
      "primary": { "$value": "{color.blue.500}", "$type": "color" }
    }
  }
}

```

---

### 3. Style Dictionary Multi-Theme Build Script (`build-tokens.js`)

Instead of a single static config file, instantiate Style Dictionary for each theme programmatically. This ensures the dark theme overrides the light theme semantic keys without naming collisions.

```javascript
// build-tokens.js
import StyleDictionary from 'style-dictionary';

// 1. Build Shared Global Base Tokens (Variables & Dimensions)
const globalSD = new StyleDictionary({
  source: ['tokens/global/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'global.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
      ],
    },
  },
});

// 2. Build Light Theme
const lightSD = new StyleDictionary({
  source: ['tokens/global/**/*.json', 'tokens/themes/light/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'theme-light.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('themes/light'), // Only output semantic overrides
          options: {
            outputReferences: true,
            selector: ':root, [data-theme="light"]',
          },
        },
      ],
    },
  },
});

// 3. Build Dark Theme
const darkSD = new StyleDictionary({
  source: ['tokens/global/**/*.json', 'tokens/themes/dark/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'theme-dark.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('themes/dark'), // Only output semantic overrides
          options: {
            outputReferences: true,
            selector: '[data-theme="dark"]',
          },
        },
      ],
    },
  },
});

// Run all builds
async function runBuild() {
  console.log('Building Global Tokens...');
  await globalSD.buildAllPlatforms();

  console.log('Building Light Theme...');
  await lightSD.buildAllPlatforms();

  console.log('Building Dark Theme...');
  await darkSD.buildAllPlatforms();

  console.log('Tokens compiled successfully!');
}

runBuild();

```

---

### 4. Generated CSS Output

#### `dist/css/theme-light.css`

```css
/**
 * Auto-generated by Style Dictionary
 */
:root, [data-theme="light"] {
  --color-surface-base: var(--color-slate-50);
  --color-surface-card: #ffffff;
  --color-text-primary: var(--color-slate-900);
  --color-text-muted: var(--color-slate-800);
  --color-interactive-primary: var(--color-blue-600);
}

```

#### `dist/css/theme-dark.css`

```css
/**
 * Auto-generated by Style Dictionary
 */
[data-theme="dark"] {
  --color-surface-base: var(--color-slate-900);
  --color-surface-card: var(--color-slate-800);
  --color-text-primary: var(--color-slate-50);
  --color-text-muted: var(--color-slate-100);
  --color-interactive-primary: var(--color-blue-500);
}

```

---

### 5. Media Query Auto-Theme Fallback (Optional)

To bundle both themes into a single self-contained file with automatic OS `prefers-color-scheme` support, configure a single theme file with responsive media queries:

```css
/* dist/css/theme.css */
@import './global.css';
@import './theme-light.css';

/* Automatic OS preference switch if no manual [data-theme] attribute is set */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface-base: var(--color-slate-900);
    --color-surface-card: var(--color-slate-800);
    --color-text-primary: var(--color-slate-50);
    --color-text-muted: var(--color-slate-100);
    --color-interactive-primary: var(--color-blue-500);
  }
}

```

---

### 6. React Theme Switcher Hook

```tsx
import React, { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app-theme') as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('app-theme', theme);

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return { theme, setTheme };
}

```
