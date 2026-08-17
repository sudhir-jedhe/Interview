# Functions & `this` — Output-Based Questions

```js
const obj = {
  name: 'Box',
  getName: function() {
    return this.name;
  }
};
const fn = obj.getName;
console.log(obj.getName());
console.log(fn());
```
**Answer:** `'Box'` then (non-strict) `undefined`, or a `TypeError` in strict mode

**Why:** `obj.getName()` is a method call, so implicit binding applies and `this` is `obj`. `fn()` is called as a plain, detached function reference — no object precedes the call — so it falls back to default binding: `this` is the global object in non-strict mode (where `this.name` is `undefined`), or `undefined` itself in strict mode, in which case accessing `this.name` throws `TypeError: Cannot read properties of undefined`.

---

```js
const counter = {
  count: 0,
  increment: () => {
    this.count++;
    console.log(this.count);
  }
};
counter.increment();
```
**Answer:** `NaN` when run in a plain (non-module, non-strict) script such as a browser console or a Node REPL top level; a `TypeError` (`Cannot read properties of undefined`) if run inside strict-mode code or an ES module

**Why:** `increment` is an arrow function, so it has no `this` of its own — it inherits `this` from the surrounding lexical scope, not from `counter`. At a sloppy-mode top level, that lexical `this` is the global object, whose `count` property is `undefined`, so `undefined++` assigns `NaN` back to `this.count`. In strict-mode code (including class bodies and ES modules, which are strict by default), top-level `this` is `undefined` instead, and `this.count++` throws immediately because you can't read a property off `undefined`.

---

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound.`;
};
const dog = new Animal('Rex');
const speak = dog.speak;
console.log(dog.speak());
try {
  console.log(speak());
} catch (e) {
  console.log(e.message);
}
```
**Answer:** `'Rex makes a sound.'` then (in strict mode) `"Cannot read properties of undefined (reading 'name')"`

**Why:** `dog.speak()` is a method call — implicit binding sets `this` to `dog`. `speak()` is called standalone; since class/prototype methods and modules are strict by default in most modern setups, `this` defaults to `undefined`, and accessing `this.name` throws.

---

```js
function Person(name) {
  this.name = name;
  return { name: 'Overridden' };
}
const p = new Person('Alice');
console.log(p.name);
```
**Answer:** `'Overridden'`

**Why:** When a constructor function explicitly returns an **object**, `new` uses that returned object instead of the newly created `this` object. Had the function returned a primitive (string, number, etc.) instead, `new` would ignore it and return the constructed `this` object as usual.

---

```js
const obj = {
  value: 1,
  getValue: function() {
    return (() => this.value)();
  }
};
console.log(obj.getValue());
```
**Answer:** `1`

**Why:** The inner arrow function has no `this` of its own, so it looks up `this` in its enclosing scope — the `getValue` function. Since `getValue` is called as `obj.getValue()`, implicit binding makes `this` equal to `obj` inside `getValue`, and the arrow function inherits that same `this`, correctly resolving `this.value` to `1`.

---

```js
function outer() {
  console.log(this);
  return function inner() {
    console.log(this);
  };
}
const innerFn = outer.call({ id: 'outer-context' });
innerFn();
```
**Answer:** `{ id: 'outer-context' }` then the global object (or `undefined` in strict mode)

**Why:** `outer.call({...})` explicitly sets `this` for `outer`'s execution. But `inner` is a regular function returned and then invoked standalone (`innerFn()`), which is a plain function call — it gets its own independent `this` binding via the default rule, completely unrelated to `outer`'s `this`. Functions don't "inherit" `this` from their enclosing function unless they're arrow functions.

---

```js
function greet() {
  'use strict';
  console.log(this);
}
greet();
```
**Answer:** `undefined`

**Why:** With `'use strict'` active, the default binding rule for a plain function call sets `this` to `undefined` instead of falling back to the global object. This is one of strict mode's deliberate safety improvements — it prevents accidental mutation of global state via an unintended `this`.

---

```js
const bound1 = function() { return this.x; }.bind({ x: 1 });
const bound2 = bound1.bind({ x: 2 });
console.log(bound2());
```
**Answer:** `1`

**Why:** Once a function is bound with `.bind()`, its `this` is permanently locked — calling `.bind()` again on an already-bound function has no effect on `this`; the original binding always wins. `bound2` is effectively just `bound1` with (irrelevantly) another bind wrapper, so it still returns `1`.
