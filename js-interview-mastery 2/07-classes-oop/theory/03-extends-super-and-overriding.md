# extends, super, and overriding

`extends` sets up the prototype chain automatically: `Sub.prototype`'s `[[Prototype]]` becomes `Super.prototype`, and `Sub`'s own `[[Prototype]]` becomes `Super` itself (so static members are inherited too — see `02-instance-vs-static-members.md`). Inside a subclass constructor, `super(...)` must be called before `this` is used — it invokes the parent constructor and initializes the `this` binding for the subclass.

```js
class Shape {
  area() { return 0; }
}
class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; } // overrides Shape.prototype.area
}
```

## Why super() must come before `this`

In a derived class, `this` isn't initialized until the parent constructor runs — calling `super()` is what actually creates and binds `this`. Referencing `this` before that call throws a `ReferenceError` because there's nothing there yet to reference:

```js
class Base {}
class Derived extends Base {
  constructor() {
    console.log(this); // ReferenceError: Must call super constructor before accessing 'this'
    super();
  }
}
```

Base (non-derived) classes don't have this restriction since they create `this` themselves.

## Method overriding and dynamic dispatch

Calling `super.method()` inside an overriding method invokes the parent's version explicitly — that's how you extend rather than fully replace parent behavior:

```js
class Shape2 {
  area() { return "not implemented"; }
}
class Circle2 extends Shape2 {
  area() { return super.area() + " (circle)"; }
}
console.log(new Circle2().area()); // "not implemented (circle)"
```

A subtler point: method lookup always uses the actual runtime type of `this`, even when the call originates from a base-class method:

```js
class Base {
  constructor() { this.greet(); }
  greet() { console.log("base greet"); }
}
class Sub extends Base {
  greet() { console.log("sub greet"); }
}
new Sub(); // logs "sub greet"
```

`Base`'s constructor calls `this.greet()`, and `this` is always the actual instance being constructed — a `Sub` instance — so method resolution follows `Sub.prototype` first, finding the overridden `greet`, even though the call originates inside `Base`'s constructor. This is "virtual dispatch," the mechanism behind polymorphism (see `05-oop-pillars-in-javascript.md`).

## Implicit default constructors

If a subclass doesn't define a constructor at all, JavaScript implicitly provides one that just calls `super(...args)` and forwards all arguments to the parent constructor. This is only a shorthand for the common case — if you need to do anything extra (initialize new fields, validate arguments) you must write an explicit constructor and call `super()` yourself.
