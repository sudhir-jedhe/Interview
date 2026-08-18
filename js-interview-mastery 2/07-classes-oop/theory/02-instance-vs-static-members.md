# Instance vs static members

Instance methods/fields live on `.prototype` (methods) or are set per-instance in the constructor (fields). Static members live on the class function itself and are shared/accessed without an instance — used for factory methods, constants, or utility functions tied conceptually to the class.

```js
class Counter {
  static instancesCreated = 0;
  #count = 0;                         // private instance field (see 04-private-fields-and-getters-setters.md)
  constructor() { Counter.instancesCreated++; }
  increment() { return ++this.#count; }
  static reset() { Counter.instancesCreated = 0; }
}
```

```js
class MathHelper {
  static PI_APPROX = 3.14;
  static double(n) { return n * 2; }
}
console.log(MathHelper.double(5));    // 10
console.log(new MathHelper().double); // undefined — not inherited by instances
```

## Comparison table

| Aspect | Instance methods | Static methods |
|---|---|---|
| Called on | An instance (`obj.method()`) | The class itself (`Class.method()`) |
| Access to instance data | Yes, via `this` | No — no implicit instance context |
| Typical use | Behavior operating on that object's state | Factories, utilities, constants tied to the class conceptually |
| Inherited by subclasses | Yes, via prototype chain | Yes, via the class's own `[[Prototype]]` link to the parent class |

Use instance methods for anything that reads or mutates per-object state; use static methods for class-level utilities like `Array.from` or custom factory constructors (`User.fromJSON(json)` — see `../problems/03-orm-base-class.md` for a hands-on static-factory exercise). The common mistake is calling an instance method as if it were static (`Class.method()` when `method` is only on `.prototype`) — it fails because static and prototype are two entirely separate property sets.

## Static members are inherited too

```js
class A {
  static x = 10;
}
class B extends A {}
console.log(B.x); // 10 — inherited via B's own [[Prototype]] link to A

B.x = 20;
console.log(A.x, B.x); // 10 20 — B.x is now a new *own* static property, A.x untouched
```

Static members are inherited because `extends` links `B`'s own `[[Prototype]]` to `A` itself (not just `B.prototype` to `A.prototype`), so `B.x` resolves through that chain to `A.x` until `B` defines its own. Assigning `B.x = 20` creates a new own static property directly on `B`, shadowing the inherited one — it never mutates `A.x`.
