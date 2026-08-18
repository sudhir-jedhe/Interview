# Snippet: instanceof checks the chain, not the creator

```js
class Animal {}
class Dog extends Animal {}
const d = new Dog();
console.log(d instanceof Dog);      // true
console.log(d instanceof Animal);   // true, Animal.prototype is in the chain
console.log(d instanceof Object);   // true, top of every prototype chain
console.log(Dog.prototype instanceof Animal); // true — statics/prototype chain both link up
```

`instanceof` is purely a prototype-chain membership test — it walks `d`'s `[[Prototype]]` links checking each against `Dog.prototype`, `Animal.prototype`, and `Object.prototype` in turn.
