# Scope & Hoisting — Comparisons

## `var` vs `let` vs `const`

| Aspect | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Redeclaration | Allowed, silently overwrites | `SyntaxError` if redeclared in same scope | `SyntaxError` if redeclared in same scope |
| Reassignment | Allowed | Allowed | Not allowed (`TypeError`) |
| Hoisting behavior | Hoisted, initialized to `undefined` | Hoisted, but in TDZ until declared | Hoisted, but in TDZ until declared |
| Attaches to `window`/global object | Yes (in scripts, not modules) | No | No |

Default to `const` for anything that isn't reassigned, `let` for anything that is, and avoid `var` in new code entirely. The most common mistake is using `var` out of habit in loops and being surprised when closures inside the loop all see the same final value.

## Function Scope vs Block Scope vs Global Scope

| Aspect | Function Scope | Block Scope | Global Scope |
|---|---|---|---|
| Boundary | Function body (`function() {...}`) | Any `{ }` — `if`, `for`, `while`, bare blocks | Outside all functions/blocks |
| Applies to | `var`, function parameters | `let`, `const`, class declarations | `var` (without any wrapper), `let`/`const` at top level |
| Visibility | Anywhere inside the function, even nested blocks | Only within the enclosing `{ }` | Everywhere, including all modules if not scoped |

Prefer the narrowest scope possible for any variable — block scope when you only need it inside an `if`/`for`, function scope only when it truly needs to persist across the whole function body. The common mistake is over-relying on global scope (implicit globals from forgetting a declaration keyword), which creates naming collisions across a large codebase.

## Function Declaration Hoisting vs Function Expression Hoisting

| Aspect | Function Declaration (`function foo() {}`) | Function Expression (`const foo = function() {}` or arrow) |
|---|---|---|
| Hoisting | Entire function (name + body) hoisted | Only the variable declaration is hoisted, following `var`/`let`/`const` rules |
| Callable before definition line? | Yes | No — throws `TypeError` (if `var`, calling `undefined`) or `ReferenceError` (if `let`/`const`, TDZ) |
| Typical use | Utility functions used before their definition, self-documenting top-level functions | Conditional definitions, callbacks, anything assigned dynamically |

Use function declarations when you want a function usable anywhere in its scope regardless of source order (common for top-level helpers). Use function expressions when the function is conditionally created, passed around, or assigned to an object/array. The common mistake is assuming a `const`-assigned arrow function is hoisted like a declaration — it isn't, and calling it early throws.

## `var`'s TDZ-less Hoisting vs `let`/`const`'s Temporal Dead Zone

| Aspect | `var` | `let` / `const` |
|---|---|---|
| Value before declaration line | `undefined` | Throws `ReferenceError` (TDZ) |
| Purpose of the difference | Legacy behavior, kept for compatibility | Forces early detection of use-before-define bugs |
| Effect on debugging | Can silently produce wrong logic (treats missing value as `undefined`) | Fails loudly and immediately at the exact line |

The TDZ is a deliberate design improvement over `var`'s silent `undefined`. The common mistake is assuming `let`/`const` variables simply "don't exist" before their declaration — they do exist (hoisted), they're just inaccessible, which is a subtly different and important distinction when reasoning about `typeof` on a TDZ variable (it throws too, unlike `typeof` on a truly undeclared variable).
