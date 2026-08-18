# The `strict` Flag Family

`"strict": true` in `tsconfig.json` is not a single check — it's an umbrella that turns on a family of independent compiler flags, each of which can also be toggled individually. Understanding what each sub-flag actually does (and which one would have caught a given bug) is one of the most common practical interview topics in TypeScript, because it directly maps to "why does this code that looks fine actually have a bug."

## What `strict: true` enables

As of modern TypeScript, `strict: true` turns on:

- `strictNullChecks`
- `noImplicitAny`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`
- `useUnknownInCatchVariables`

You can enable `strict` and then selectively disable one flag (`"strict": true, "strictNullChecks": false`) during a gradual migration — this is the standard way legacy codebases adopt strict mode incrementally rather than all at once.

## `strictNullChecks`

Without this flag, `null` and `undefined` are assignable to *every* type, silently — `let x: string = null` compiles. With it on, `null`/`undefined` are only assignable to types that explicitly include them (`string | null`), so the compiler forces you to handle the "value might be missing" case everywhere. This single flag eliminates the largest class of "cannot read property of undefined" runtime crashes in JS codebases (see `06-strictnullchecks-deep-dive.md` for a full walkthrough).

## `noImplicitAny`

Without it, a parameter or variable TypeScript can't infer a type for silently becomes `any` (e.g. `function f(x) {}` — `x` is `any`). With it on, that's a compile error requiring an explicit annotation. This flag exists because `any` is contagious: once one value is `any`, every operation on it and everything derived from it also becomes untyped, silently defeating the type checker downstream.

## `strictFunctionTypes`

Controls how function *parameter* types are checked for compatibility when comparing function types (not method syntax — a historical quirk). Without it, function parameters are checked bivariantly (unsound: it allows unsafe substitutions in both directions); with it, they're checked contravariantly, which is the mathematically correct and safe way to compare function subtyping. This mostly matters when passing callback functions around with generic or union parameter types.

## `strictPropertyInitialization`

Requires every class property (that isn't optional or explicitly typed to include `undefined`) to be assigned a value either in its declaration or in the constructor. Without it, `class User { name: string; }` compiles even though `name` is never actually set, and accessing `user.name` at runtime silently gives `undefined` despite the type claiming `string`. See `problems/03-async-init-property.md` for the correct pattern when a property genuinely can't be set synchronously in the constructor.

## `noImplicitThis`

Flags any use of `this` whose type can't be determined, catching the classic JS bug of losing `this` context inside a plain function passed as a callback (e.g., an unbound method passed to `setTimeout`).

## `useUnknownInCatchVariables`

Types `catch (e)` as `unknown` instead of `any` by default, forcing you to narrow `e` before accessing any property on it (`e.message` fails to compile until you check `e instanceof Error`). This prevents the common bug of assuming every thrown value is an `Error` instance, when JavaScript actually allows throwing anything (strings, plain objects, etc.).

## Interview framing

The strongest answer to "what does `strict: true` do?" isn't a list — it's naming two or three of these sub-flags, explaining a concrete bug each one catches, and noting that they can be adopted incrementally. That shows you've actually migrated a codebase to strict mode, not just read that the flag exists.
