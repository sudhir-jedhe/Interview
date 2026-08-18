# Problem: Demonstrate the Temporal Dead Zone and Catch the `ReferenceError`

## Problem Statement

Write code that deliberately triggers the Temporal Dead Zone for a `let` variable, catches the resulting `ReferenceError` gracefully (rather than crashing the whole script), and logs a clear explanation of what happened. Also show that `typeof` on a TDZ variable throws too, unlike `typeof` on a variable that was never declared at all.

## Requirements

- Access a `let` variable before its declaration line, inside a `try/catch`, and confirm the error is a `ReferenceError`.
- Show the difference between `typeof` on an undeclared identifier (`'undefined'`, no throw) and `typeof` on a TDZ identifier (throws).
- Demonstrate that the TDZ is per-block: shadowing an outer variable with `let` inside a nested block puts *that* block in the TDZ for the shadowed name, even though an outer variable with the same name already exists and is initialized.

## Approach

Wrap each early access in its own `try/catch` so one failure doesn't stop the rest of the demonstration from running, and inspect `e.constructor.name` / `e.message` to confirm exactly which error was thrown.

## Solution

```js
function demonstrateTDZ() {
  // 1. Basic TDZ: accessing `x` before its `let` declaration line.
  try {
    console.log(x); // never reached — throws first
    let x = 10;
  } catch (e) {
    console.log('1:', e.constructor.name, '-', e.message);
    // 1: ReferenceError - Cannot access 'x' before initialization
  }

  // 2. typeof on a genuinely undeclared variable does NOT throw.
  console.log('2:', typeof completelyUndeclaredVar); // '2: undefined' — no error

  // 3. typeof on a TDZ variable DOES throw, unlike #2 above.
  try {
    console.log(typeof y);
    let y = 20;
  } catch (e) {
    console.log('3:', e.constructor.name, '-', e.message);
    // 3: ReferenceError - Cannot access 'y' before initialization
  }

  // 4. Shadowing: an outer `z` exists and is initialized, but the inner block's
  // OWN `let z` puts that entire block in the TDZ for the name `z` from the
  // block's start — the outer `z` is not "seen through" to.
  let z = 'outer z';
  try {
    {
      console.log(z); // still throws — the inner `let z` shadows for the whole block
      let z = 'inner z';
    }
  } catch (e) {
    console.log('4:', e.constructor.name, '-', e.message);
    // 4: ReferenceError - Cannot access 'z' before initialization
  }
  console.log('4b (outer z, unaffected):', z); // 'outer z'
}

demonstrateTDZ();
```

**Why this works:** each demonstration is isolated in its own `try/catch` so the script keeps running and prints all four results instead of stopping at the first throw. Case 2 vs case 3 is the key distinguishing insight for interviews: `typeof` has a special carve-out for *truly undeclared* identifiers (returns `'undefined'`, never throws) but no such carve-out for identifiers that are known to the current scope but still uninitialized (TDZ) — those throw just like any other TDZ access. Case 4 demonstrates that the TDZ is a property of the *block* and the *specific declaration*, not a simple "is there a variable with this name anywhere in scope" check — shadowing creates a fresh TDZ for the inner name from the top of its own block.
