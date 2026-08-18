# Output: virtual dispatch when a base constructor calls an overridden method

```js
class Base {
  constructor() { this.greet(); }
  greet() { console.log("base greet"); }
}
class Sub extends Base {
  greet() { console.log("sub greet"); }
}
new Sub();
```

**Answer:** `"sub greet"`

**Why:** `Base`'s constructor calls `this.greet()`, and `this` is always the actual instance being constructed — a `Sub` instance — so method resolution follows `Sub.prototype` first, finding the overridden `greet`, even though the call originates inside `Base`'s constructor. This is the same "virtual dispatch" behavior classical OOP languages call polymorphism.
