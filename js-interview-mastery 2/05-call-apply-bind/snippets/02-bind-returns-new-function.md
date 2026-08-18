# Snippet: bind returns a new function instead of invoking immediately

```js
function greet() { return `Hello, ${this.name}`; }
const person = { name: 'Nina' };
const boundGreet = greet.bind(person);
console.log(typeof boundGreet); // 'function' — not yet called
console.log(boundGreet());      // 'Hello, Nina' — invoked now, this locked to person
```

`greet.bind(person)` does not run `greet`. It hands back a new function that, whenever it's eventually called, will run `greet` with `this` fixed to `person`.
