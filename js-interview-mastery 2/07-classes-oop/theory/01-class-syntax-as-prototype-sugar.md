# Classes are sugar over prototypes

A `class` declaration creates a function under the hood; instance methods get attached to that function's `.prototype`, exactly like the manual `Function.prototype.method = ...` pattern from the objects/prototypes topic.

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

console.log(typeof Animal);                                     // "function"
console.log(Animal.prototype.speak === Animal.prototype.speak); // true, one shared function
console.log(new Animal("Rex").hasOwnProperty("speak"));          // false — it's on the prototype
```

## Key differences from old-style constructor functions

- Class bodies are always executed in **strict mode**, regardless of the surrounding code.
- Class declarations are hoisted, but left in a **temporal dead zone** — referencing the class before its declaration line throws a `ReferenceError`, unlike function declarations which are fully hoisted and callable before their definition.
- Calling a class without `new` throws a `TypeError` instead of silently misbehaving:

```js
function OldStyle() { this.value = 1; }
class NewStyle {}

console.log(OldStyle() === undefined); // true — runs as a plain function, returns undefined
console.log(NewStyle());               // TypeError: Class constructor NewStyle cannot be invoked without 'new'
```

`OldStyle()` called without `new` runs as a plain function and implicitly returns `undefined` (and, in sloppy mode, would leak `value` onto the global object). Calling a `class` without `new`, however, is a hard error by design — the spec marks class constructors as non-callable without `new`.

## instanceof and the prototype chain

`obj instanceof Ctor` walks `obj`'s prototype chain, checking each link against `Ctor.prototype`. It has nothing to do with which function literally created the object — only whether `Ctor.prototype` is somewhere in the chain — which is why cross-realm objects (e.g., from a different iframe) can fail `instanceof` checks even though they're "the same kind of thing," and why manually reassigning an object's prototype with `Object.setPrototypeOf` can change what it's an `instanceof`.

```js
class Animal {}
class Dog extends Animal {}
const d = new Dog();
console.log(d instanceof Dog);                 // true
console.log(d instanceof Animal);              // true, Animal.prototype is in the chain
console.log(d instanceof Object);              // true, top of every prototype chain
console.log(Dog.prototype instanceof Animal);  // true — statics/prototype chain both link up
```
