# Type Assertions: `as Type` and the `<Type>` Syntax

A type assertion tells the compiler "trust me, I know this value's type better than you do." Unlike a type annotation, which TypeScript *checks* against the assigned value, an assertion *overrides* what TypeScript inferred — with no runtime effect whatsoever. Assertions are erased during compilation; they do not convert, validate, or coerce anything.

## The two syntaxes

```typescript
const input = document.getElementById("email") as HTMLInputElement;

const input2 = <HTMLInputElement>document.getElementById("email");
```

Both lines do exactly the same thing. `as Type` is the modern, universally preferred syntax. The angle-bracket `<Type>` form is older (predates `as`) and is now avoided for one hard technical reason: **it's syntactically ambiguous with JSX**. In a `.tsx` file, `<HTMLInputElement>expr` is indistinguishable from opening a JSX element tag, so the TypeScript parser can't use it there — `.tsx` files simply don't support the angle-bracket form. Since most modern TS codebases mix `.ts` and `.tsx` files and teams want one consistent style, `as` won.

```typescript
// This is a compile error in a .tsx file (parsed as JSX):
// const x = <string>someValue;

// This works everywhere:
const x = someValue as string;
```

## What assertions can and can't do

TypeScript only allows an assertion between types that are "sufficiently overlapping" — one must be a subtype of the other, in either direction:

```typescript
const a = "hello" as string;   // OK — same type
const b = "hello" as number;   // Error: Conversion may be a mistake
                                 // because neither type sufficiently overlaps
```

To force a genuinely incompatible conversion, you double-assert through `unknown` (or `any`), which is a deliberate escape hatch:

```typescript
const c = "hello" as unknown as number; // compiles, but is a lie at runtime
```

This double-assertion is a code smell you should be able to spot immediately in review — it disables all safety and is a common source of the "as-abuse" bugs covered in `problems/01-as-abuse-bug.md`.

## When assertions are legitimate

Assertions are appropriate when *you* have information the type checker cannot derive from static analysis:

```typescript
// DOM APIs return a broad type; you know the specific element from context
const canvas = document.querySelector("#board") as HTMLCanvasElement;

// Narrowing a value you've already validated via runtime logic
// that TS's control-flow analysis can't follow (e.g., a validation library)
function parseConfig(raw: unknown): AppConfig {
  if (!isValidConfig(raw)) throw new Error("Invalid config");
  return raw as AppConfig; // safe: isValidConfig already proved this
}
```

Assertions are inappropriate when used to silence a type error you don't understand, or to paper over a genuine mismatch between the data your code produces and the type it claims to have — that's not a static-typing shortcut, it's a runtime bug waiting to happen, since the assertion is invisible at runtime and provides zero protection.

## Assertions vs. annotations vs. `satisfies`

- **Annotation** (`const x: Type = value`): TS checks `value` is assignable to `Type` and widens accordingly.
- **Assertion** (`value as Type`): TS trusts you, performs a lighter compatibility check, no runtime check.
- **`satisfies`** (covered separately): TS checks `value` against `Type` *without* changing the inferred type of `value`. Often the best choice when you want validation without losing literal types or without overriding inference.

Knowing when to reach for each of these three is a frequent interview discriminator between "understands assertions exist" and "understands the type-safety trade-offs of each."
