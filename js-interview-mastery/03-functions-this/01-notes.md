# Functions & `this` — Notes

## Three ways to write a function

A **function declaration** has a name and stands on its own as a statement; it's fully hoisted (see the scope/hoisting topic).

```js
function add(a, b) { return a + b; }
```

A **function expression** creates a function as part of an expression, usually assigned to a variable. It's only hoisted according to the variable keyword's rules, not the function's.

```js
const add = function(a, b) { return a + b; };
```

An **arrow function** is a more concise expression syntax introduced in ES6, with one critical semantic difference beyond syntax: it does not have its own `this`, `arguments`, or `super`.

```js
const add = (a, b) => a + b;
```

## The four rules for `this`

`this` is not determined by where a function is *defined* — for regular functions it's determined by *how the function is called*. There are four binding rules, and remembering the order of precedence matters when more than one could apply.

**1. Default binding** — a plain function call with no context. In non-strict mode, `this` is the global object (`window` in browsers); in strict mode (or inside modules/classes, which are strict by default), it's `undefined`.

```js
function whoAmI() { console.log(this); }
whoAmI(); // non-strict: Window/globalThis; strict mode: undefined
```

**2. Implicit binding** — calling a function as a method of an object binds `this` to that object.

```js
const user = {
  name: 'Ada',
  greet() { console.log(this.name); }
};
user.greet(); // 'Ada' — this === user
```

This binding is easy to lose. If you extract the method into a standalone reference, it loses its object context and falls back to default binding:

```js
const greetFn = user.greet;
greetFn(); // this.name -> TypeError or undefined, this is no longer `user`
```

**3. Explicit binding** — `call`, `apply`, and `bind` let you set `this` directly (covered in depth in the dedicated call/apply/bind topic).

```js
function greet() { console.log(this.name); }
greet.call({ name: 'Grace' }); // 'Grace'
```

**4. `new` binding** — calling a function with `new` creates a brand-new object, sets `this` to that object inside the function, and (absent an explicit return of another object) returns it.

```js
function Person(name) {
  this.name = name;
}
const p = new Person('Linus');
console.log(p.name); // 'Linus'
```

**Precedence**, highest to lowest: `new` binding > explicit binding (`call`/`apply`/`bind`) > implicit binding (method call) > default binding.

## Arrow functions and lexical `this`

Arrow functions don't create their own `this` binding at all. Instead, `this` inside an arrow function is resolved by looking at the enclosing lexical scope — exactly like a normal variable lookup. This makes arrow functions immune to all four rules above; you cannot change an arrow function's `this` with `call`, `apply`, `bind`, or by calling it as a method.

```js
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++; // `this` here is inherited from `start`'s `this`, i.e. `timer`
      console.log(this.seconds);
    }, 1000);
  }
};
timer.start(); // logs 1, 2, 3... correctly bound to `timer`
```

If `start` had used a regular `function` for the `setInterval` callback instead, `this` inside it would default to the global object (or `undefined` in strict mode), because the callback is invoked by the timer mechanism with no object context — a classic source of `this` bugs in callbacks and event handlers.

## `this` in callbacks and event handlers

DOM event listeners call your handler with `this` bound to the element the listener is attached to, if you use a regular function:

```js
button.addEventListener('click', function() {
  console.log(this); // the button element
});
```

Using an arrow function here would instead inherit `this` from the surrounding scope (often the module or class), *not* the button — a common source of confusion when converting old code to arrow syntax without considering the `this` change.

## IIFEs

An Immediately Invoked Function Expression runs as soon as it's defined, creating an isolated scope:

```js
(function() {
  const privateVar = 'hidden';
  console.log(privateVar);
})();
```

Historically used to avoid polluting the global scope and to create module-like private state before ES modules and block scoping (`let`/`const`) existed. Still used today for one-off setup code or to create a closure around async top-level code.

## Named vs anonymous function expressions

A named function expression keeps its name usable inside its own body (useful for recursion) without adding that name to the enclosing scope:

```js
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // `fact` only resolvable inside here
};
console.log(typeof fact); // 'undefined' — not leaked to outer scope
```

Anonymous function expressions (`const factorial = function(n) {...}`) can't reference themselves by name, and historically produced less helpful stack traces — modern engines infer a display name from the variable it's assigned to, which mitigates this in practice.
