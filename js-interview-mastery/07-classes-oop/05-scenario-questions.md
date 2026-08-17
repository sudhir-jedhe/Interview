# Scenario Questions: Classes & OOP

## 1. Bank account with enforced invariants

You need an `Account` class where the balance can never go negative and can never be set directly by external code, only changed through `deposit`/`withdraw` methods that validate the amount. How do you design this so external code literally cannot bypass the rules, and what happens on invalid input?

**Approach:** Use a private `#balance` field so there's no public property to assign directly, and validate in every mutating method:

```js
class Account {
  #balance;
  constructor(initial = 0) {
    if (initial < 0) throw new RangeError("Initial balance cannot be negative");
    this.#balance = initial;
  }
  get balance() { return this.#balance; }
  deposit(amount) {
    if (amount <= 0) throw new RangeError("Deposit must be positive");
    this.#balance += amount;
    return this.#balance;
  }
  withdraw(amount) {
    if (amount <= 0) throw new RangeError("Withdrawal must be positive");
    if (amount > this.#balance) throw new RangeError("Insufficient funds");
    this.#balance -= amount;
    return this.#balance;
  }
}
```

Edge cases: floating-point deposits/withdrawals (`0.1 + 0.2` type errors) can drift the balance — for real money you'd store cents as integers rather than floats. Also decide whether `withdraw` should allow exact-balance withdrawals (`amount === balance` should succeed, only `amount > balance` should fail) — the boundary condition is a common off-by-one bug.

## 2. Shape hierarchy for a rendering engine

You're building a simple 2D rendering engine that needs to compute area and perimeter for different shapes (`Circle`, `Rectangle`, `Triangle`) uniformly, and later add new shapes without touching existing code. How do you structure this with classes, and how does polymorphism help?

**Approach:** Define a common base class with methods that subclasses must override, and rely on polymorphic dispatch rather than type-checking:

```js
class Shape {
  area() { throw new Error("area() must be implemented by subclass"); }
  perimeter() { throw new Error("perimeter() must be implemented by subclass"); }
  describe() { return `${this.constructor.name}: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`; }
}
class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
  perimeter() { return 2 * Math.PI * this.r; }
}
class Rectangle extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
  perimeter() { return 2 * (this.w + this.h); }
}

const shapes = [new Circle(3), new Rectangle(4, 5)];
shapes.forEach((s) => console.log(s.describe())); // works uniformly, no type checks needed
```

This satisfies the open/closed principle: adding `Triangle` later means writing one new class, never touching the loop that consumes `shapes`. The base class's `describe()` uses `this.constructor.name` to stay generic across all subclasses without hardcoding names.

## 3. Choosing between class inheritance and composition for a game engine

You're building game entities (`Player`, `Enemy`, `NPC`) that need mixed capabilities — some can fly, some can swim, some can do both, and a straight inheritance tree quickly needs multiple inheritance, which JS classes don't support. How do you solve this?

**Approach:** Use mixin functions (which JS supports via function composition over classes) instead of deep inheritance:

```js
const CanFly = (Base) => class extends Base {
  fly() { return `${this.name} flies`; }
};
const CanSwim = (Base) => class extends Base {
  swim() { return `${this.name} swims`; }
};

class Entity {
  constructor(name) { this.name = name; }
}
class Duck extends CanFly(CanSwim(Entity)) {}

const duck = new Duck("Donald");
console.log(duck.fly());  // "Donald flies"
console.log(duck.swim()); // "Donald swims"
```

This avoids the classic "diamond problem" of true multiple inheritance while still letting you compose independent capabilities. Edge case: mixins stack in a specific prototype chain order, so if two mixins define the same method name, the last one applied (outermost wrap) wins — document mixin order carefully or you'll get silent method shadowing.

## 4. Validating that a plugin object implements a required interface

You're loading third-party plugin objects into a system and need to verify each one implements a `render()` method and an `init()` method before registering it, without requiring plugins to extend a specific base class (since they're loaded dynamically and might come from different sources). How do you check this, and how does it relate to `instanceof`?

**Approach:** `instanceof` won't work here since plugins aren't guaranteed to share a common constructor — this calls for duck typing instead:

```js
function isValidPlugin(obj) {
  return obj !== null &&
    typeof obj === "object" &&
    typeof obj.render === "function" &&
    typeof obj.init === "function";
}

const plugin = { render() { /* ... */ }, init() { /* ... */ } };
console.log(isValidPlugin(plugin)); // true, regardless of what constructed it
```

This is the practical JS answer to "structural typing" — you check for shape (does it quack like a duck) rather than lineage (was it built by a specific class). `instanceof` is the right tool when you control the class hierarchy and want to test lineage; duck typing/interface-checking is right when objects can come from anywhere and only the shape matters.
