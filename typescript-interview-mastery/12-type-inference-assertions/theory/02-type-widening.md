# Type Widening: `let` vs `const`

Type widening is the process by which TypeScript takes a specific literal type and generalizes it to its base primitive type, because the compiler assumes a mutable binding might later hold a different value of that same general shape.

## The core rule

```typescript
let a = "hello";  // widened to type: string
const b = "hello"; // stays literal type: "hello"

let x = 5;   // widened to: number
const y = 5; // stays: 5
```

`let` and `var` bindings are widened because they can be reassigned — TypeScript reasons "this variable will hold *some* string over its lifetime, not necessarily `'hello'` forever," so it generalizes to `string`. `const` bindings can never be reassigned, so TS keeps the precise literal type — there's no future value to accommodate.

This matters immediately when you pass a `let`-declared variable somewhere that expects a literal union:

```typescript
type Direction = "left" | "right";

function move(dir: Direction) {}

let d = "left";
move(d); // Error: Argument of type 'string' is not assignable to parameter of type 'Direction'

const d2 = "left";
move(d2); // OK — d2 is type "left", assignable to Direction
```

`d` was widened to `string` the moment it was declared with `let`, so by the time it reaches `move`, TypeScript has already lost the fact that it was ever `"left"`.

## Widening inside object literals

Object literal properties widen too, even when the containing variable is `const` — because object *properties* are mutable by default even if the *binding* isn't:

```typescript
const config = {
  mode: "production", // property type widened to string
  retries: 3,          // widened to number
};

type Mode = "production" | "development";
function setMode(m: Mode) {}

setMode(config.mode); // Error: string is not assignable to Mode
```

Even though `config` itself can't be reassigned, `config.mode` is a mutable property (`config.mode = "development"` is legal), so TS widens it to `string` for the same reason it widens `let` variables.

## Controlling widening

You have three tools to keep literal types:

```typescript
// 1. Explicit annotation
const config1: { mode: "production" | "development" } = { mode: "production" };

// 2. Inline literal cast
setMode("production" as const extends never ? never : "production"); // awkward, avoid

// 3. `as const` (the idiomatic fix — see 04-as-const.md)
const config2 = { mode: "production" } as const;
setMode(config2.mode); // OK, config2.mode is "production"
```

In practice, `as const` (covered in its own file) is the standard fix for object literals; explicit annotations are preferred for standalone primitive variables you know will hold a fixed literal.

## Why interviewers ask this

Widening is the single most common source of "why won't this compile" confusion for developers coming from JS. Understanding that `let`/`var` widen *and* that object literal properties widen independently of the outer binding is what separates "I've read the docs" from "I've been bitten by this in production," which is exactly what interviewers are probing for.
