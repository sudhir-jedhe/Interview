# Snippets: Classes & OOP

## 1. Methods live on the prototype, not the instance

```js
class Dog {
  bark() { return "woof"; }
}
const d1 = new Dog();
const d2 = new Dog();
console.log(d1.bark === d2.bark);              // true, same function reference
console.log(Object.getPrototypeOf(d1) === Dog.prototype); // true
```

## 2. Static members belong to the class, not instances

```js
class MathHelper {
  static PI_APPROX = 3.14;
  static double(n) { return n * 2; }
}
console.log(MathHelper.double(5));              // 10
console.log(new MathHelper().double);           // undefined, not inherited by instances
```

## 3. super() must run before `this` is used

```js
class Base {}
class Derived extends Base {
  constructor() {
    console.log(this); // ReferenceError: Must call super constructor before accessing 'this'
    super();
  }
}
```

## 4. Private fields are inaccessible outside the class

```js
class Wallet {
  #cents = 0;
  add(n) { this.#cents += n; }
  get dollars() { return this.#cents / 100; }
}
const w = new Wallet();
w.add(150);
console.log(w.dollars);        // 1.5
console.log(w.cents);          // undefined (public "cents" was never defined)
console.log(Object.keys(w));   // [] — private fields never appear here
```

## 5. Getters/setters run code, they aren't plain data

```js
class Box {
  #value = 0;
  get value() { console.log("getter ran"); return this.#value; }
  set value(v) { console.log("setter ran"); this.#value = v < 0 ? 0 : v; }
}
const b = new Box();
b.value = -5;      // "setter ran"
console.log(b.value); // "getter ran"  then  0
```

## 6. Polymorphism via overriding

```js
class Shape { area() { return 0; } }
class Square extends Shape {
  constructor(side) { super(); this.side = side; }
  area() { return this.side ** 2; }
}
const shapes = [new Shape(), new Square(4)];
console.log(shapes.map((s) => s.area())); // [0, 16]
```

## 7. instanceof checks the chain, not the creator

```js
class Animal {}
class Dog extends Animal {}
const d = new Dog();
console.log(d instanceof Dog);      // true
console.log(d instanceof Animal);   // true, Animal.prototype is in the chain
console.log(d instanceof Object);   // true, top of every prototype chain
console.log(Dog.prototype instanceof Animal); // true — statics/prototype chain both link up
```
