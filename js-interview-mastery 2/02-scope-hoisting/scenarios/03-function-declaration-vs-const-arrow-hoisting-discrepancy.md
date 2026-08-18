# Why a Function Declaration Works Before Its Definition but a `const` Arrow Function Doesn't

**Scenario:** A teammate writes a utility module where a helper function is called before it's defined further down the file, and it works. Another teammate does the same thing with an arrow function assigned to a `const`, and it throws. Explain the discrepancy so the team understands it's not a random bug.

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
