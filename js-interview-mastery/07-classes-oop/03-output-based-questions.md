# Output-Based Questions: Classes & OOP

## 1.

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

## 2.

```js
class Counter {
  count = 0;
  increment = () => { this.count++; };
}
const c = new Counter();
const fn = c.increment;
fn();
console.log(c.count);
```

**Answer:** `1`

**Why:** `increment` is defined as an arrow function class field, which captures `this` lexically at the point of instance creation (bound to the specific `Counter` instance), not dynamically at call time. So even when extracted and called standalone as `fn()`, it still correctly increments `c.count`. A regular method (`increment() {...}`) would have logged `NaN` or thrown, since `this` would be `undefined` in strict mode.

## 3.

```js
class Foo {
  #secret = 42;
  static reveal(instance) { return instance.#secret; }
}
console.log(Foo.reveal(new Foo()));
```

**Answer:** `42`

**Why:** Private field access is scoped to the class body lexically, not to the instance — any code physically written inside the `Foo` class declaration can access `#secret` on any `Foo` instance, including a static method. Privacy in JS classes is about where the code lives, not which object is calling it.

## 4.

```js
class A {
  static x = 10;
}
class B extends A {}
console.log(B.x);
B.x = 20;
console.log(A.x, B.x);
```

**Answer:** `10` then `10 20`

**Why:** Static members are inherited too, because `extends` links `B`'s own `[[Prototype]]` to `A` itself (not just `B.prototype` to `A.prototype`), so `B.x` resolves through that chain to `A.x`. Assigning `B.x = 20` creates a new *own* static property directly on `B`, shadowing the inherited one — it does not mutate `A.x`, which stays `10`.

## 5.

```js
function OldStyle() { this.value = 1; }
class NewStyle {}
console.log(OldStyle() === undefined);
console.log(NewStyle());
```

**Answer:** `true` then throws `TypeError: Class constructor NewStyle cannot be invoked without 'new'`

**Why:** `OldStyle()` called without `new` runs as a plain function and implicitly returns `undefined` (and, in sloppy mode, would leak `value` onto the global object), so the first comparison is `true`. Calling a `class` without `new`, however, is a hard error by design — the spec marks class constructors as non-callable without `new`, unlike old-style constructor functions which happily run as regular functions if you forget `new`.

## 6.

```js
class Vehicle {
  constructor(type) { this.type = type; }
  toString() { return `Vehicle(${this.type})`; }
}
const v = new Vehicle("car");
console.log(`${v}`);
console.log(v + "");
```

**Answer:** `"Vehicle(car)"` then `"Vehicle(car)"`

**Why:** Both template literal interpolation and string concatenation trigger JS's `ToPrimitive`/string-coercion machinery, which calls the object's `toString()` method (found via the prototype chain since it overrides `Object.prototype.toString`) when no `Symbol.toPrimitive` is defined. Overriding `toString` on a class changes how instances behave in any string-context conversion.

## 7.

```js
class Base {
  #id = "base";
  getId() { return this.#id; }
}
class Sub extends Base {
  #id = "sub";
}
const s = new Sub();
console.log(s.getId());
```

**Answer:** `"base"`

**Why:** Private fields are not inherited or overridden the way regular properties are — `#id` in `Base` and `#id` in `Sub` are two entirely separate, independently-scoped fields that happen to share a name. `getId()` is defined in `Base`, so it can only ever see `Base`'s own `#id`, regardless of what `Sub` declares.

## 8.

```js
class Shape {
  area() { return "not implemented"; }
}
class Circle extends Shape {
  area() { return super.area() + " (circle)"; }
}
console.log(new Circle().area());
```

**Answer:** `"not implemented (circle)"`

**Why:** `super.area()` explicitly invokes the parent class's version of the method rather than the overridden one, letting `Circle` extend rather than fully replace `Shape`'s behavior. This is the standard pattern for augmenting inherited logic instead of duplicating it.
