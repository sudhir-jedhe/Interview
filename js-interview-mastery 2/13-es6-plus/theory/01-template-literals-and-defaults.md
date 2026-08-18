# Template Literals, Tagged Templates, and Default Parameters

## Template literals

Template literals (backticks) support interpolation and multi-line strings without escape characters:

```js
const name = 'Ada';
console.log(`Hello, ${name}!
Welcome.`);
```

## Tagged templates

A **tagged template** passes the literal's pieces to a function instead of just producing a string — the function receives an array of the literal string chunks plus the interpolated values as separate arguments:

```js
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => `${acc}${str}${values[i] ? `[${values[i]}]` : ''}`, '');
}
console.log(highlight`Score: ${42} out of ${100}`);
// Score: [42] out of [100]
```

This underlies libraries like `styled-components` (CSS-in-JS) and safe SQL-templating utilities. The tag function's first argument (`strings`) is an array of the literal text chunks (with `strings.length === values.length + 1`), and every subsequent argument is one interpolated value, in order.

## Default parameters

```js
function greet(name = 'stranger') {
  return `Hi, ${name}`;
}
greet();          // "Hi, stranger"
greet(undefined); // "Hi, stranger" — same as omitting it
greet(null);      // "Hi, null" — null is a real value, no default applied
```

Only `undefined` (an explicit omission) triggers the default. `null` is a deliberate value and is passed through as-is — a common gotcha when a caller does `greet(maybeNull ?? undefined)` style guarding versus assuming `null` also falls back to the default.

Default parameter expressions are evaluated **at call time**, left to right, and can reference earlier parameters:

```js
function makeRange(start = 0, end = start + 10) {
  return [start, end];
}
console.log(makeRange(5)); // [5, 15]
```

## Related, covered elsewhere

`let`/`const` are block-scoped (unlike `var`'s function scoping) and live in the "temporal dead zone" until their declaration line executes — see the scope & hoisting topic for the full mechanics. Arrow functions have no own `this`/`arguments`/`super` and can't be used as constructors — see the functions & `this` topic. Optional chaining (`?.`) and nullish coalescing (`??`) short-circuit on `null`/`undefined` — see the operators & coercion topic for exact precedence rules and gotchas with `||`.
