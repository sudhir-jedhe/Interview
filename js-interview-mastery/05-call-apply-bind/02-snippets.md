# call, apply, bind — Snippets

```js
// 1. call vs apply: same result, different argument syntax
function sum3(a, b, c) { return a + b + c; }
console.log(sum3.call(null, 1, 2, 3));    // 6 — args listed individually
console.log(sum3.apply(null, [1, 2, 3])); // 6 — args as an array
```

```js
// 2. bind returns a new function instead of invoking immediately
function greet() { return `Hello, ${this.name}`; }
const person = { name: 'Nina' };
const boundGreet = greet.bind(person);
console.log(typeof boundGreet); // 'function' — not yet called
console.log(boundGreet());      // 'Hello, Nina' — invoked now, this locked to person
```

```js
// 3. Borrowing array methods for array-like objects via call
function listArgs() {
  return Array.prototype.join.call(arguments, ', ');
}
console.log(listArgs('a', 'b', 'c')); // 'a, b, c'

// Modern equivalent, no borrowing needed:
function listArgsModern(...args) { return args.join(', '); }
console.log(listArgsModern('a', 'b', 'c')); // 'a, b, c'
```

```js
// 4. Partial application with bind
function power(exponent, base) { return base ** exponent; }
const square = power.bind(null, 2);
const cube = power.bind(null, 3);
console.log(square(5)); // 25
console.log(cube(5));   // 125
```

```js
// 5. Using apply with Math.max to find the max of an array (pre-spread idiom)
const nums = [3, 7, 2, 9, 4];
console.log(Math.max.apply(null, nums)); // 9
console.log(Math.max(...nums));          // 9 — modern equivalent with spread
```

```js
// 6. bind's this is permanent and can't be overridden by a later call/apply
function whoAmI() { return this.label; }
const boundToA = whoAmI.bind({ label: 'A' });
console.log(boundToA.call({ label: 'B' })); // 'A' — call() cannot override an existing bind
```

```js
// 7. A minimal myBind polyfill in action
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this;
  return function(...callArgs) {
    return fn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};

function add(a, b, c) { return a + b + c + (this.offset || 0); }
const bound = add.myBind({ offset: 100 }, 1, 2);
console.log(bound(3)); // 1 + 2 + 3 + 100 = 106
```
