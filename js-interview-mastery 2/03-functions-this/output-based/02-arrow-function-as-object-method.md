# An Arrow Function Used as an Object Method

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
