# The four OOP pillars in JavaScript

JavaScript is prototype-based and dynamically typed, but the four classical OOP pillars still map cleanly onto its features:

- **Encapsulation** — achieved via `#` private fields/methods (or closure variables in factory functions), hiding internal state from outside code.
- **Abstraction** — exposing a simple public API (methods, getters) while hiding implementation details behind it. Achieved the same way as encapsulation, just focused on API design rather than data hiding specifically.
- **Inheritance** — `extends`/`super` and the prototype chain (see `03-extends-super-and-overriding.md`).
- **Polymorphism** — method overriding: calling `.area()` on any `Shape` subclass runs the right version because JS resolves methods dynamically at call time based on the actual object's prototype chain, not a declared/static type. JS has no static typing to begin with, so this is naturally duck-typed.

```js
class Shape {
  area() { return 0; }
}
class Square extends Shape {
  constructor(side) { super(); this.side = side; }
  area() { return this.side ** 2; }
}
const shapes = [new Shape(), new Square(4)];
console.log(shapes.map((s) => s.area())); // [0, 16] — polymorphic dispatch, no type-checking needed
```

## String coercion and toString overriding

Overriding `toString` is a common, concrete example of polymorphism showing up in everyday code — every object-to-string conversion in the language (template literals, string concatenation) consults it automatically:

```js
class Vehicle {
  constructor(type) { this.type = type; }
  toString() { return `Vehicle(${this.type})`; }
}
const v = new Vehicle("car");
console.log(`${v}`);  // "Vehicle(car)"
console.log(v + "");  // "Vehicle(car)"
```

Both template literal interpolation and string concatenation trigger JS's `ToPrimitive`/string-coercion machinery, which calls the object's `toString()` method (found via the prototype chain, since it overrides `Object.prototype.toString`) when no `Symbol.toPrimitive` is defined.

## Enforcing invariants: encapsulation + abstraction together

A concrete example combining private state with a validated public API — the standard pattern for a class whose invariants must never be violated by external code:

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

There's no public `balance` setter — the only ways to change `#balance` are the validated `deposit`/`withdraw` methods, so external code cannot bypass the rules. This is the concrete payoff of encapsulation: correctness that's structurally guaranteed rather than merely documented.
