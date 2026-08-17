# Functions & `this` — Snippets

```js
// 1. Implicit binding vs losing it when extracted
const user = {
  name: 'Ada',
  greet() { return `Hi, ${this.name}`; }
};
console.log(user.greet());        // 'Hi, Ada' — this === user

const detached = user.greet;
console.log(typeof detached());   // this.name is undefined; returns 'Hi, undefined' in non-strict
```

```js
// 2. Arrow function inherits `this` lexically, ignoring call site
const obj = {
  value: 42,
  regular: function() { return this.value; },
  arrow: () => this?.value // `this` here is whatever enclosing scope had (often undefined at top level)
};
console.log(obj.regular()); // 42
console.log(obj.arrow());   // undefined — arrow ignored `obj` entirely
```

```js
// 3. call/apply/bind explicitly set `this`
function introduce() { return `I'm ${this.name}`; }
const person = { name: 'Grace' };

console.log(introduce.call(person));    // "I'm Grace"
console.log(introduce.apply(person));   // "I'm Grace"
const bound = introduce.bind(person);
console.log(bound());                   // "I'm Grace" — permanently bound
```

```js
// 4. `new` binding creates a fresh `this`
function Car(model) {
  this.model = model;
}
const car1 = new Car('Model 3');
const car2 = new Car('Model Y');
console.log(car1.model, car2.model); // 'Model 3' 'Model Y' — independent objects
```

```js
// 5. Precedence: explicit binding beats implicit binding
function show() { return this.label; }
const objA = { label: 'A', show };
const objB = { label: 'B' };
console.log(objA.show.call(objB)); // 'B' — .call() wins over the implicit objA context
```

```js
// 6. setTimeout callback loses method `this` unless arrow or bind is used
const clock = {
  time: '10:00',
  tickRegular() {
    setTimeout(function() {
      console.log(this?.time); // undefined — plain function, no implicit binding from setTimeout
    }, 0);
  },
  tickArrow() {
    setTimeout(() => {
      console.log(this.time); // '10:00' — arrow inherits `this` from tickArrow
    }, 0);
  }
};
clock.tickRegular();
clock.tickArrow();
```

```js
// 7. Named function expression can recurse using its own name without leaking it
const countdown = function run(n) {
  if (n <= 0) return 'done';
  return run(n - 1); // `run` only visible inside this function body
};
console.log(countdown(3));      // 'done'
try {
  console.log(run);
} catch (e) {
  console.log(e.constructor.name); // 'ReferenceError' — `run` never leaked to the outer scope
}
```
