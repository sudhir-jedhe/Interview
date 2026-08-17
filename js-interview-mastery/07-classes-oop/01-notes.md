# Notes: Classes & OOP

## Classes are sugar over prototypes

A `class` declaration creates a function under the hood; instance methods get attached to that function's `.prototype`, exactly like the manual `Function.prototype.method = ...` pattern from before ES6.

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

console.log(typeof Animal);                       // "function"
console.log(Animal.prototype.speak === Animal.prototype.speak); // true, one shared function
console.log(new Animal("Rex").hasOwnProperty("speak")); // false — it's on the prototype
```

Key differences from old-style constructor functions: class bodies are always executed in strict mode, class declarations are not hoisted the way function declarations are (they're hoisted but left in a "temporal dead zone," so referencing before the line throws), and calling a class without `new` throws a `TypeError` instead of silently misbehaving.

## Instance vs static members

Instance methods/fields live on `.prototype` (methods) or are set per-instance in the constructor (fields). Static members live on the class function itself and are shared/accessed without an instance — used for factory methods, constants, or utility functions tied conceptually to the class.

```js
class Counter {
  static instancesCreated = 0;
  #count = 0;                         // private instance field
  constructor() { Counter.instancesCreated++; }
  increment() { return ++this.#count; }
  static reset() { Counter.instancesCreated = 0; }
}
```

## extends, super, and overriding

`extends` sets up the prototype chain automatically: `Sub.prototype`'s `[[Prototype]]` becomes `Super.prototype`, and `Sub`'s own `[[Prototype]]` becomes `Super` itself (so static members are inherited too). Inside a subclass constructor, `super(...)` must be called before `this` is used — it invokes the parent constructor and initializes the `this` binding for the subclass.

```js
class Shape {
  area() { return 0; }
}
class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; } // overrides Shape.prototype.area
}
```

Calling `super.method()` inside an overriding method invokes the parent's version explicitly — that's how you extend rather than fully replace parent behavior.

## Private fields (`#`)

Fields and methods prefixed with `#` are truly private — not just convention-hidden like `_field`, but syntactically inaccessible from outside the class, even via `Object.keys`, bracket access, or reflection. Accessing `obj.#field` outside the class body is a `SyntaxError`, not just `undefined`.

```js
class Account {
  #balance = 0;
  deposit(amount) { this.#balance += amount; return this.#balance; }
}
const a = new Account();
a.deposit(100);
console.log(a.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

## Getters and setters

`get`/`set` define accessor properties that look like plain fields from the outside but run code on access — useful for validation or computed values without changing the calling API.

```js
class Temperature {
  #celsius = 0;
  get fahrenheit() { return this.#celsius * 9 / 5 + 32; }
  set fahrenheit(f) { this.#celsius = (f - 32) * 5 / 9; }
}
const t = new Temperature();
t.fahrenheit = 212;
console.log(t.fahrenheit); // 212, computed via getter each time
```

## OOP pillars in JS

Encapsulation is achieved via `#` private fields/methods (or closures in factory functions). Abstraction means exposing a simple public API while hiding implementation — achieved the same way. Inheritance is `extends`/prototype chains. Polymorphism is method overriding: calling `.area()` on any `Shape` subclass runs the right version because JS resolves methods dynamically at call time based on the actual object's prototype chain, not the declared type (JS has no static typing to begin with, so this is naturally duck-typed).

## Class vs prototype vs factory

Classes and manual prototypes are functionally near-identical (classes just add cleaner syntax, real private fields, and stricter semantics). Factory functions build objects via closures instead of `new`+prototype, trading shared-method memory efficiency for simpler mental model and no `this`-binding footguns.

## instanceof

`obj instanceof Ctor` walks `obj`'s prototype chain checking each link against `Ctor.prototype`. It has nothing to do with which function literally created the object — only whether `Ctor.prototype` is somewhere in the chain — which is why cross-realm objects (e.g., from a different iframe) can fail `instanceof` checks even though they're "the same kind of thing."
