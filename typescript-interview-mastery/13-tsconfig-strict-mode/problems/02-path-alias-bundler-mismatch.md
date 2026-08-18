# Problem 2: Configure Path Aliases and Explain the Bundler Mismatch Risk

## The setup

You want to replace deep relative imports like `import { formatCurrency } from "../../../../utils/format"` with a clean alias `import { formatCurrency } from "@utils/format"` in a Vite-based React app.

## Your task

1. Configure the `tsconfig.json` side of a path alias.
2. Configure the matching Vite side (bundler config) so the alias actually resolves at build/dev time.
3. Explain precisely what breaks, and how, if step 2 is skipped or gets out of sync with step 1.

## Reference solution

**Step 1 — tsconfig.json:**

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@utils/*": ["src/utils/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

**Step 2 — vite.config.ts (must mirror the same aliases):**

```typescript
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@utils": path.resolve(__dirname, "src/utils"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
});
```

**Step 3 — what breaks without the matching Vite config, and why:**

With only the `tsconfig.json` change:
- The TypeScript language service (your editor) resolves `@utils/format` correctly — autocomplete, go-to-definition, and `tsc --noEmit` type-checking all work, because `paths` is read directly by the compiler/language service for *type resolution*.
- Running `vite dev` or `vite build`, however, uses Vite's own module resolution — esbuild/Rollup under the hood — which has no knowledge of `tsconfig.json`'s `paths` field by default. It tries to resolve `@utils/format` as if it were an npm package named `@utils`, fails to find one in `node_modules`, and throws `Failed to resolve import "@utils/format"` at dev-server or build time.
- The failure mode is deceptive: everything looks correct in the editor (no red squiggles, full autocomplete), CI's `tsc --noEmit` step passes, but the actual `vite build`/`vite dev` step fails — meaning the bug isn't caught until a build step distinct from type-checking, and can slip through if type-checking and building are run as separate, independently-"passing" CI jobs that no one cross-references.

**Extra gotcha — partial sync:** if a new alias is added to `tsconfig.json` but the corresponding Vite alias entry is forgotten (common when aliases grow over time and only one config file gets updated), the failure is scoped to just that one alias — most imports work, and the one broken import produces a confusing, isolated build failure that's easy to misattribute to something else, especially if the PR that introduced it also touched unrelated code.

**Mitigation:** some teams use a shared source of truth (a small script or a package like `vite-tsconfig-paths` that reads `tsconfig.json`'s `paths` directly and auto-generates the Vite alias config) specifically to eliminate this synchronization burden — worth mentioning as the more robust long-term fix over manually keeping two config files in lockstep.
