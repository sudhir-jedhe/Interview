# Problem: implement a partial(fn, ...presetArgs) utility

## Requirements

Write a standalone `partial(fn, ...presetArgs)` function (not a `Function.prototype` method, unlike `bind`) that returns a new function pre-filled with `presetArgs`, leaving the rest to be supplied at call time — essentially a `this`-agnostic, non-mutating version of `bind`'s partial-application behavior that works on plain functions, not just methods.

## Solution

```js
function partial(fn, ...presetArgs) {
  return function (...remainingArgs) {
    return fn.apply(this, [...presetArgs, ...remainingArgs]);
  };
}
```

Using `fn.apply(this, ...)` rather than hardcoding `null`/`undefined` lets the returned function still work correctly if it's later used as a method (its own `this` is forwarded through), while defaulting sensibly for standalone functions that don't care about `this` at all.

## Verifying it works

```js
function add3(a, b, c) { return a + b + c; }
const add10 = partial(add3, 10);
console.log(add10(5, 2)); // 17 — 10 preset, (5, 2) supplied later

function multiply(a, b) { return a * b; }
const double = partial(multiply, 2);
const triple = partial(multiply, 3);
console.log(double(21)); // 42
console.log(triple(7));  // 21
```

### Preserving `this` when partially applying a method

```js
const calculator = {
  factor: 100,
  scaleAndAdd(base, extra) {
    return base * this.factor + extra;
  },
};

const scaleAndAdd10 = partial(calculator.scaleAndAdd, 2); // presets base=2
console.log(scaleAndAdd10.call(calculator, 5)); // (2 * 100) + 5 = 205
```

Because `partial`'s returned function calls `fn.apply(this, ...)`, whatever `this` the returned function is invoked with is forwarded straight through to the original — so it composes correctly with `call`/`apply`/method-call syntax, not just standalone functions.

## partial vs bind — why write this instead of just using bind?

```js
// bind-based partial application, for comparison
const add10Bind = add3.bind(null, 10);
console.log(add10Bind(5, 2)); // 17 — same result

// but bind ALSO permanently locks `this`, which partial deliberately does not do
const boundScaleAndAdd10 = calculator.scaleAndAdd.bind(calculator, 2);
console.log(boundScaleAndAdd10(5));       // 205 — this locked, ignores later call-site
console.log(boundScaleAndAdd10.call({ factor: 1 }, 5)); // still 205 — call() can't override bind
console.log(scaleAndAdd10.call({ factor: 1 }, 5));       // 7 — partial() DOES respect the call-site this
```

`bind` is the right tool when you want both argument pre-filling *and* a permanently fixed `this` (e.g., detaching a method for a callback). `partial` is the right tool when you only want argument pre-filling and want the function to remain flexible about `this` at each call site — a distinction worth calling out explicitly in an interview, since it shows you understand `bind` does two separate jobs at once.
