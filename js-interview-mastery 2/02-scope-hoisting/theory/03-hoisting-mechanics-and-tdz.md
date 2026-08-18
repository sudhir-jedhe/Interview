# Hoisting Mechanics and the Temporal Dead Zone

JS engines process code in two conceptual passes: a **creation phase** that scans for declarations before running anything, and an **execution phase** that runs the code top to bottom. Hoisting is a name for what happens to declarations during the creation phase — but *how* each declaration type is hoisted differs sharply.

`var` declarations are hoisted **and initialized to `undefined`** immediately. This is why reading a `var` before its declaration line doesn't throw — it just gives you `undefined`:

```js
console.log(x); // undefined — hoisted, not yet assigned
var x = 5;
console.log(x); // 5
```

`let` and `const` are also hoisted (the engine knows about them from the top of the block), but they're **not initialized**. They sit in the **Temporal Dead Zone (TDZ)** — the span from the start of the block to the actual declaration line — during which accessing them throws a `ReferenceError`, not `undefined`:

```js
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

The TDZ exists to catch bugs early: silently getting `undefined` (as `var` does) can mask real logic errors, whereas throwing forces you to notice the ordering problem immediately.

## `var`'s TDZ-less hoisting vs `let`/`const`'s TDZ

| Aspect | `var` | `let` / `const` |
|---|---|---|
| Value before declaration line | `undefined` | Throws `ReferenceError` (TDZ) |
| Purpose of the difference | Legacy behavior, kept for compatibility | Forces early detection of use-before-define bugs |
| Effect on debugging | Can silently produce wrong logic (treats missing value as `undefined`) | Fails loudly and immediately at the exact line |

The TDZ is a deliberate design improvement over `var`'s silent `undefined`. The common mistake is assuming `let`/`const` variables simply "don't exist" before their declaration — they do exist (hoisted), they're just inaccessible, which is a subtly different and important distinction when reasoning about `typeof` on a TDZ variable (it throws too, unlike `typeof` on a truly undeclared variable — see `../problems/01-temporal-dead-zone-demo.md` for a runnable demonstration).
