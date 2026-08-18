# `var` vs `let` vs `const`

`var` can be redeclared and reassigned freely within the same scope — no error, just silently overwritten:

```js
var a = 1;
var a = 2; // fine
```

`let` can be reassigned but not redeclared in the same scope:

```js
let b = 1;
b = 2;      // fine
let b = 3;  // SyntaxError: Identifier 'b' has already been declared
```

`const` can be neither reassigned nor redeclared — but as covered in the JS basics topic, it only locks the *binding*, not the contents of an object it points to:

```js
const c = 1;
c = 2; // TypeError: Assignment to constant variable.
```

## Comparison table

| Aspect | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Redeclaration | Allowed, silently overwrites | `SyntaxError` if redeclared in same scope | `SyntaxError` if redeclared in same scope |
| Reassignment | Allowed | Allowed | Not allowed (`TypeError`) |
| Hoisting behavior | Hoisted, initialized to `undefined` | Hoisted, but in TDZ until declared | Hoisted, but in TDZ until declared |
| Attaches to `window`/global object | Yes (in scripts, not modules) | No | No |

Default to `const` for anything that isn't reassigned, `let` for anything that is, and avoid `var` in new code entirely. The most common mistake is using `var` out of habit in loops and being surprised when closures inside the loop all see the same final value (see `06-the-classic-var-loop-bug.md`).
