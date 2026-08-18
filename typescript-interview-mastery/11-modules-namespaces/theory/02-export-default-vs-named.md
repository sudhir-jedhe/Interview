# export default vs. Named Exports

TypeScript (via ES modules) supports both a single `export default` per module and any number of named exports. Which to use is a genuine design decision with real trade-offs, not just a style preference.

## Named exports

```typescript
// userService.ts
export function getUser(id: string) { /* ... */ }
export function updateUser(id: string, changes: object) { /* ... */ }
export interface User { id: string; name: string; }
```

```typescript
import { getUser, updateUser, User } from "./userService";
```

**Advantages:**
- **Refactor-safe renames.** Renaming `getUser` to `fetchUser` at its declaration is a compiler error at every call site until fixed — editors can do this automatically across a whole project.
- **Consistent naming everywhere.** Every importer sees `getUser`, not whatever name they happened to choose, which makes searching a codebase for usages reliable.
- **Better tree-shaking.** Bundlers can statically see exactly which named exports are used and drop the rest; this is generally more reliable than default-export tree-shaking, especially for modules with multiple concerns bundled into one default object.
- **Multiple exports per file** without needing to bundle them into one object or pick an arbitrary "main" export.

## Default exports

```typescript
// UserCard.tsx
export default function UserCard(props: { name: string }) {
  return null; // JSX omitted for brevity
}
```

```typescript
import UserCard from "./UserCard"; // can be imported under any local name
import Whatever from "./UserCard"; // also valid, same binding — no error
```

**Advantages:**
- Slightly less ceremony for modules with one clear primary export (common in component-per-file conventions like React).
- Some frameworks and tools expect a default export by convention (e.g., Next.js page files, some plugin systems).

**Disadvantages:**
- **No enforced naming consistency.** Two different files can import the same default export under two different local names, which makes project-wide search/grep less reliable and can genuinely confuse readers about what's actually being imported.
- **Weaker refactor tooling.** Some editors handle "rename symbol" less reliably across default-export boundaries than named ones, since the imported name isn't tied to a declared identifier the same way.
- **Interop friction.** Default exports interact awkwardly with CommonJS interop (`module.exports = ...` vs. `exports.default = ...`), and `esModuleInterop`/`allowSyntheticDefaultImports` exist specifically to paper over these mismatches — one more setting to get right.

## The practical guideline

Most style guides in professional TypeScript codebases (Airbnb, Google's, and most large open-source projects) now recommend **named exports almost everywhere**, reserving default exports for cases a framework specifically requires (like a Next.js `page.tsx`) or for a module whose entire purpose is exactly one thing with an unambiguous name. The refactor-safety and tree-shaking benefits of named exports tend to outweigh the minor convenience of defaults as a codebase grows past a handful of files.

```typescript
// Preferred in most modern style guides:
export function UserCard(props: { name: string }) { /* ... */ }

// Reserved for framework-mandated cases:
export default function Page() { /* ... */ } // e.g. Next.js app router page.tsx
```
