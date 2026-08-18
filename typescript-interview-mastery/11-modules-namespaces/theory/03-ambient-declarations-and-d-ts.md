# Ambient Declarations and .d.ts Files

Not every JavaScript library ships with TypeScript types. Ambient declarations let you describe the shape of code that TypeScript can't see the implementation of — a `.js` file with no types, a global variable injected by a `<script>` tag, or a CSS/JSON file imported via a bundler.

## What "ambient" means

An ambient declaration describes a type without providing an implementation — it tells the compiler "trust me, this exists and has this shape," without generating any JavaScript output itself. Ambient declarations live in `.d.ts` files, or inside a `declare` block within a regular `.ts` file.

## `declare module` for an untyped package

If you `npm install` a package with no types and no `@types/` package available, TypeScript treats every import from it as `any` (or errors, depending on `noImplicitAny`). You fix this by writing a `.d.ts` file that declares the module's shape:

```typescript
// types/simple-markdown.d.ts
declare module "simple-markdown" {
  export function toHtml(markdown: string): string;
  export function toPlainText(markdown: string): string;

  export interface ParseOptions {
    breaks: boolean;
  }

  export function parse(markdown: string, options?: ParseOptions): unknown;
}
```

Once this file is included in your program (TypeScript picks up `.d.ts` files automatically if they're within `rootDir`/`include`, or explicitly via `typeRoots`), you get full type checking and autocomplete importing from `"simple-markdown"` even though the package itself ships no types:

```typescript
import { toHtml } from "simple-markdown";

const html: string = toHtml("# Hello"); // fully typed
```

## Wildcard module declarations

For asset imports (CSS Modules, images, etc.) that a bundler handles but TypeScript has no native understanding of, a wildcard pattern is common:

```typescript
// types/assets.d.ts
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.module.css" {
  const classes: { [className: string]: string };
  export default classes;
}
```

## Global ambient declarations

Sometimes you need to describe a variable injected globally, outside any module system — e.g. a value set by a `<script>` tag before your bundle loads:

```typescript
// types/global.d.ts
declare global {
  interface Window {
    __APP_CONFIG__: { apiUrl: string; version: string };
  }
}

export {}; // required to make this file a module, so `declare global` is scoped correctly
```

```typescript
console.log(window.__APP_CONFIG__.apiUrl); // now type-checked
```

The trailing `export {}` matters: without at least one top-level `import`/`export`, TypeScript treats the file as a script (global scope) rather than a module, and `declare global` specifically requires being inside a module for its augmentation semantics to apply correctly.

## When you actually need this

- A JS-only dependency has no `@types/` package on DefinitelyTyped and no bundled types.
- You're importing non-JS assets through a bundler loader (SVGs, CSS, JSON with a custom loader, etc.).
- You need to describe a global injected outside the module graph (analytics snippets, feature-flag objects set by a `<script>` tag, test-runner globals).

For anything with published types (most popular npm packages) or a `@types/*` package on npm, you don't need to write your own ambient declarations — only reach for `declare module` when nothing else provides the types.
