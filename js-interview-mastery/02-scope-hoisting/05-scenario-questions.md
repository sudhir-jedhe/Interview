# Scope & Hoisting — Scenario Questions

### 1. You inherit a legacy codebase full of `var`. During a refactor, you blindly find-and-replace every `var` with `let`, run the test suite, and two unrelated tests start failing. What likely broke, and how do you investigate?

**Approach:** The most likely culprit is code that relies on `var`'s function-scoping and redeclaration tolerance — behaviors `let` doesn't have. Two common breakages: (1) the same variable name declared with `var` twice in the same function (common in older code, e.g. two separate `for (var i ...)` loops in one function reusing `i`) now throws `SyntaxError: Identifier 'i' has already been declared` because `let` forbids redeclaration in the same scope; (2) code that reads a `var` from outside the block it was "really" declared in (e.g. a `var result` declared inside an `if`, then read after the `if` block) now throws a TDZ `ReferenceError` or `ReferenceError: result is not defined` because `let` is block-scoped.

```js
// Breaks after var -> let:
function process(items) {
  if (items.length > 0) {
    let result = items[0]; // was var
  }
  return result; // ReferenceError: result is not defined
}
```

Investigation approach: run the failing tests individually with the actual error message (don't just see "test failed") — `SyntaxError`/`ReferenceError` messages point directly at the offending line. Then decide per-case: if the variable is genuinely meant to leak across blocks, declare it once at the top of the function scope with `let`; if a variable name was reused as a "scratch" variable, give each usage a distinct name. Doing a blind replace across a whole codebase without running tests incrementally (module by module) makes this much harder to isolate.

---

### 2. You're building a simple event-queue system where you dynamically register N handlers in a loop, each needing to remember its own index for logging. Using `var` in the loop, every handler logs the same final index. Fix it, and explain two different valid fixes.

**Approach:**

```js
// Buggy version
const handlers = [];
for (var i = 0; i < 5; i++) {
  handlers.push(function() {
    console.log('handler', i);
  });
}
handlers.forEach(h => h()); // logs 'handler 5' five times
```

**Fix 1 — switch to `let`:** `let` creates a fresh binding of `i` for each loop iteration, so each closure captures its own copy.

```js
const handlers1 = [];
for (let i = 0; i < 5; i++) {
  handlers1.push(function() {
    console.log('handler', i);
  });
}
handlers1.forEach(h => h()); // 'handler 0' ... 'handler 4'
```

**Fix 2 — IIFE to create a new scope per iteration (the pre-ES6 fix, still relevant when `var` is unavoidable):**

```js
const handlers2 = [];
for (var i = 0; i < 5; i++) {
  (function(capturedI) {
    handlers2.push(function() {
      console.log('handler', capturedI);
    });
  })(i);
}
handlers2.forEach(h => h()); // 'handler 0' ... 'handler 4'
```

The IIFE immediately invokes with the current value of `i`, creating a new function scope per iteration where `capturedI` is a distinct variable each time. `let` is strictly simpler in modern code, but understanding the IIFE fix matters for reading legacy code and for interview questions that specifically ask "how would you fix this without `let`."

---

### 3. A teammate writes a utility module where a helper function is called before it's defined further down the file, and it works. Another teammate does the same thing with an arrow function assigned to a `const`, and it throws. Explain the discrepancy so the team understands it's not a random bug.

**Approach:** This is a direct consequence of how hoisting differs between declaration forms.

```js
// File: utils.js
console.log(square(4)); // works: 16
function square(n) { return n * n; } // function declaration: fully hoisted

console.log(cube(4)); // throws: Cannot access 'cube' before initialization
const cube = (n) => n * n * n; // const arrow function: hoisted into TDZ only
```

`function square(n) {}` is a function declaration — the JS engine hoists the entire function (name and body) to the top of the enclosing scope during the creation phase, so it's fully callable anywhere in that scope, even "before" its source line. `const cube = (n) => ...` is a variable declaration with a function expression as its initializer — only the `const` binding itself is hoisted (into the Temporal Dead Zone), not the function value, so it isn't usable until the actual assignment line executes.

The practical guidance for the team: if a function truly needs to be callable before its definition in source order (e.g. mutual recursion, or a "table of contents" style file with helpers below the main logic), use a function declaration. If you're using `const`/arrow functions for style consistency, always define them before their first use to avoid TDZ errors — don't rely on hoisting order.

---

### 4. You're debugging a production issue where a global variable named `data` is being unexpectedly overwritten by a script loaded on the page, causing another script to break. How does scope explain this, and what are two ways to prevent it?

**Approach:** This is almost always caused by accidental *implicit globals* or `var` declarations at the top level of separate `<script>` tags (non-module scripts), which all share the same global scope/`window` object. If Script A does `var data = fetchStuff()` and Script B independently does `var data = otherStuff()`, they collide on the same global `data` — whichever runs last wins, silently.

```js
// script-a.js
var data = { source: 'A' };

// script-b.js (loaded after script-a.js on the same page)
var data = { source: 'B' }; // overwrites script-a's global data with no warning
```

Fix 1 — wrap each script in an IIFE or module scope so top-level `var`/function declarations don't leak to `window`:

```js
(function() {
  var data = { source: 'A' }; // scoped to this IIFE only
})();
```

Fix 2 (preferred in modern code) — load scripts as ES modules (`<script type="module">`), since each module has its own top-level scope and top-level `let`/`const`/`var`/function declarations never attach to the global object, regardless of keyword. Additionally, switching from `var` to `let`/`const` at the top level of a *non-module* script still helps somewhat (they don't attach to `window` as properties), but the real fix for multi-script collisions is proper scoping via modules or IIFEs, not just the choice of declaration keyword.
