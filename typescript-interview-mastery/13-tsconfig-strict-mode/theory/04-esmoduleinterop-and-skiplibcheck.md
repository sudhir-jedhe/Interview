# `esModuleInterop` and `skipLibCheck`

## `esModuleInterop`

CommonJS and ES modules have historically incompatible default-export semantics. CommonJS has no real concept of a "default export" — `module.exports = fn` just assigns to the whole exports object — while ES modules have a distinct `export default`. Before `esModuleInterop`, importing a CommonJS-only package (like older versions of `lodash` or `moment`) with ES module syntax required awkward workarounds:

```typescript
// Without esModuleInterop:
import * as React from "react"; // had to use namespace import syntax

// With esModuleInterop: true
import React from "react"; // default import works even though React ships CJS
```

`esModuleInterop` does two things: it generates helper functions (`__importDefault`, `__importStar`) that correctly wrap CommonJS modules so `import defaultExport from "cjs-package"` behaves the way developers coming from Babel/webpack already expect, and it implicitly enables `allowSyntheticDefaultImports` so the *type checker* accepts that syntax too (without the flag, the checker would reject the default import even if runtime behavior happened to work under some bundlers).

**Why it's usually needed:** almost every real project depends on at least one CommonJS-only package. Without `esModuleInterop`, you either can't use `import x from "pkg"` syntax for such packages at all, or you get subtle runtime bugs where a bundler's lenient interop doesn't match TypeScript's strict interpretation of the same import. Turning it on is close to universally recommended — the main reason to leave it off is authoring a library that must exactly preserve raw CJS/ESM interop semantics for downstream consumers, which is a narrow, deliberate use case.

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true // implied by esModuleInterop, shown for clarity
  }
}
```

## `skipLibCheck`

By default, TypeScript type-checks every `.d.ts` file it encounters, including ones deep inside `node_modules` that your code never directly touches. `skipLibCheck: true` skips type-checking of all declaration files, only checking the `.ts`/`.tsx` source files that are actually part of your project.

**The trade-off:**
- **Pro — speed:** skipping thousands of third-party `.d.ts` files can meaningfully cut compile time, especially in large projects with many dependencies.
- **Pro — avoiding false failures:** two packages can ship declaration files that are individually valid but conflict with each other when both are present (a common issue with multiple versions of `@types/react` or overlapping global declarations) — `skipLibCheck` prevents your build from breaking over problems in code you don't own and can't fix.
- **Con — reduced safety:** if a dependency's own `.d.ts` file has a genuine error that would cause a real type mismatch in how you use it, `skipLibCheck` hides that from you; you'd only find out at runtime.

**Practical guidance:** `skipLibCheck: true` is the near-universal default in real-world projects (it's even the default in output from `create-vite`, `create-next-app`, etc.) because the speed and conflict-avoidance benefits outweigh the (relatively rare) case of a genuinely broken third-party declaration file causing a silent problem. Turn it off only when actively debugging a suspected type conflict originating in `node_modules`.

```json
{ "compilerOptions": { "skipLibCheck": true } }
```
