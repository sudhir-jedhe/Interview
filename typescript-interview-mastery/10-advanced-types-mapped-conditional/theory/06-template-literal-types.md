# Template Literal Types

Template literal types let you build new string-literal-union types by combining literal text with other types, using the same backtick syntax as JavaScript template literals but at the type level. They were introduced in TypeScript 4.1 and are what makes string-heavy APIs (event names, CSS properties, route paths) type-safe without hand-listing every combination.

## Basic syntax

```typescript
type Greeting = `Hello, ${string}`;

const a: Greeting = "Hello, world"; // valid
const b: Greeting = "Hi there";     // Error: not assignable to `Hello, ${string}`
```

`${string}` inside the backticks accepts any string, similar to a wildcard. This alone is rarely useful — the real power comes from substituting a *union* type instead of the general `string`.

## Building unions from unions

When you interpolate a union type into a template literal type, TypeScript expands it into every combination — a cross-product of literal strings, not a single loose pattern.

```typescript
type Side = "top" | "right" | "bottom" | "left";

type Margin = `margin-${Side}`;
// "margin-top" | "margin-right" | "margin-bottom" | "margin-left"
```

Interpolating two unions multiplies the combinations:

```typescript
type Size = "sm" | "md" | "lg";
type Variant = "primary" | "secondary";

type ButtonClass = `btn-${Variant}-${Size}`;
// "btn-primary-sm" | "btn-primary-md" | "btn-primary-lg" |
// "btn-secondary-sm" | "btn-secondary-md" | "btn-secondary-lg"
// 6 combinations from 2 × 3 input members
```

This cross-product behavior is exactly why template literal types are dangerous to overuse with large unions — combining two 20-member unions produces 400 literal types, which can slow down the compiler noticeably.

## Built-in string manipulation types

TypeScript ships four intrinsic types specifically for use inside template literals: `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`.

```typescript
type EventName = "click" | "hover" | "focus";

type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onHover" | "onFocus"
```

## Combining with key remapping

Template literal types are most commonly paired with the `as` key-remapping clause (covered in `02-key-remapping-with-as.md`) to derive a new object shape whose *keys* follow a naming convention based on another type's keys:

```typescript
interface FormFields {
  email: string;
  password: string;
}

type ChangeHandlers = {
  [K in keyof FormFields as `onChange${Capitalize<string & K>}`]: (value: FormFields[K]) => void;
};
// { onChangeEmail: (value: string) => void; onChangePassword: (value: string) => void }
```

## Pattern matching with `infer` inside template literals

Template literal types can also appear in the `extends` clause of a conditional type with `infer`, letting you parse a string literal type apart:

```typescript
type ExtractRouteParam<S extends string> = S extends `${string}/:${infer Param}/${string}` ? Param : never;

type Param = ExtractRouteParam<"/users/:userId/posts">; // "userId"
```

## Why this matters

Template literal types close the gap between "stringly typed" APIs (event names, CSS classes, route params) and fully type-checked ones, without runtime cost. Interviewers use them to test whether you understand that TypeScript's type system does real string manipulation at compile time — most candidates have seen `Partial` and `Pick` but far fewer have written a template literal type from scratch, so it's a good differentiator question.
