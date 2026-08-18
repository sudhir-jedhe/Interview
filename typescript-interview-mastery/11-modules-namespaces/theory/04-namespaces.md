# Namespaces

Namespaces (`namespace Foo { ... }`, originally called "internal modules") are a TypeScript-only construct predating ES modules becoming a real, standardized JavaScript feature. They group related code under a shared name and prevent naming collisions in the global scope, which was their entire purpose before ES modules existed.

## Basic syntax

```typescript
namespace Validation {
  export interface Validator {
    isValid(value: string): boolean;
  }

  export class EmailValidator implements Validator {
    isValid(value: string): boolean {
      return value.includes("@");
    }
  }
}

const validator = new Validation.EmailValidator();
console.log(validator.isValid("a@b.com")); // true
```

Only members marked `export` are accessible from outside the namespace (`Validation.EmailValidator`); everything else is private to the namespace block, similar to how only exported members of an ES module are visible to importers.

## Why ES modules replaced namespaces

When TypeScript introduced namespaces, JavaScript had no standardized module system — files just concatenated into the global scope, and namespaces were the pragmatic way to avoid `Validator` in one file colliding with `Validator` in another. Once ES modules (`import`/`export`) became a real, browser- and Node-supported standard, they solved the same problem more completely:

- **File-level scoping is automatic.** Every `.ts`/`.js` file is its own module scope by default (once it has any `import`/`export`), with no wrapping syntax needed.
- **Tooling works better.** Bundlers, tree-shakers, and dependency graphs are built around ES module `import`/`export` syntax, not namespaces — namespaces are largely invisible to that tooling.
- **No proprietary syntax.** ES modules are plain JavaScript/TypeScript that any JS developer already knows; namespaces are a TypeScript-specific concept that doesn't exist in vanilla JS at all.

The official TypeScript documentation itself now recommends ES modules over namespaces for organizing code, explicitly calling namespaces a legacy pattern retained mainly for backward compatibility.

## Where you still see namespaces today

1. **Old codebases** predating widespread ES module adoption (pre-2015-ish TypeScript projects) that haven't been migrated.
2. **Global-script-style `.d.ts` files** for libraries that attach to the global scope (like older jQuery plugins) — namespaces are still a reasonable way to describe a global object's nested structure without implying it's a module.
3. **Merging with functions or classes** for the "static-like nested types" pattern — declaring a namespace with the same name as a function or class to attach related types to it:

```typescript
function createLogger(prefix: string) {
  return (msg: string) => console.log(`[${prefix}] ${msg}`);
}

namespace createLogger {
  export interface Options {
    prefix: string;
  }
}

const opts: createLogger.Options = { prefix: "APP" };
```

This merging trick (declaration merging between a function and a namespace of the same name) is occasionally seen in library `.d.ts` files — e.g., something like `React.FC` conceptually groups a value and related types under one name — but for your own application code, prefer a plain named export of an interface instead of reaching for this pattern.

## Interview takeaway

Know namespaces exist, know what they do, and know why modern TypeScript code doesn't use them for day-to-day organization — reaching for `namespace` in new application code is generally considered an anti-pattern today, and interviewers checking for this awareness often ask "when would you use a namespace over a module?" expecting "almost never, except legacy code or global `.d.ts` files."
