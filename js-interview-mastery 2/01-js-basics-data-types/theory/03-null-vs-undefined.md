# `null` vs `undefined`

Both represent "no value," but with different intent. `undefined` means a variable has been declared but not assigned, a function parameter wasn't passed, or an object property doesn't exist. It's the *default* absence of a value, set by the engine. `null` is an *intentional* absence — you assign it explicitly to say "this is empty on purpose."

```js
let x;
console.log(x); // undefined — declared, never assigned

function f(a) { console.log(a); }
f(); // undefined — parameter not supplied

let y = null; // explicitly "nothing here"
```

Loose equality treats them as equal (`null == undefined` is `true`), but strict equality does not (`null === undefined` is `false`). Prefer `===` in almost all cases; reserve `== null` as a deliberate idiom for "is this either null or undefined" (see `05-equality-loose-vs-strict.md`).

## Comparison table

| Aspect | `null` | `undefined` |
|---|---|---|
| Set by | Developer, explicitly | JavaScript engine, by default |
| Meaning | "Intentionally empty" | "Not yet assigned / doesn't exist" |
| `typeof` | `'object'` | `'undefined'` |
| Common source | Explicit assignment, e.g. resetting a selected user to `null` | Uninitialized variables, missing function args, missing object properties |

Use `null` when you want to explicitly signal "this value is empty on purpose." Let `undefined` occur naturally rather than assigning it yourself. The common mistake is using them interchangeably in equality checks — prefer `=== null` or `=== undefined` for precision, or `value == null` as a deliberate shorthand for "either."
