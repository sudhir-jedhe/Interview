# JS Basics & Data Types — Snippets

```js
// 1. Primitives copy by value, objects copy by reference
let a = 5;
let b = a;
b = 10;
console.log(a, b); // 5 10

const obj = { count: 1 };
const ref = obj;
ref.count = 2;
console.log(obj.count); // 2 — obj and ref point to the same object
```

```js
// 2. typeof quirks in one place
console.log(typeof null);        // 'object'
console.log(typeof undefined);   // 'undefined'
console.log(typeof []);          // 'object'
console.log(typeof {});          // 'object'
console.log(typeof function(){});// 'function'
console.log(typeof Symbol('s')); // 'symbol'
console.log(typeof 42n);         // 'bigint'
```

```js
// 3. NaN is the only value not equal to itself
console.log(NaN === NaN);           // false
console.log(Object.is(NaN, NaN));   // true — Object.is does NOT special-case NaN away
console.log([NaN].includes(NaN));   // true — Array#includes uses SameValueZero
console.log([NaN].indexOf(NaN));    // -1  — indexOf uses strict equality (===)
```

```js
// 4. Number.isNaN vs global isNaN
console.log(isNaN('abc'));          // true  — coerces 'abc' -> NaN first
console.log(Number.isNaN('abc'));   // false — no coercion, 'abc' is not the NaN value
console.log(isNaN(undefined));      // true  — Number(undefined) is NaN
console.log(Number.isNaN(undefined)); // false
```

```js
// 5. null vs undefined equality
console.log(null == undefined);   // true  — loose equality treats them as equal
console.log(null === undefined);  // false — different types
console.log(typeof null);         // 'object'
console.log(typeof undefined);    // 'undefined'
```

```js
// 6. const prevents reassignment, not mutation
const arr = [1, 2, 3];
arr.push(4);          // fine — mutating the array
console.log(arr);     // [1, 2, 3, 4]

try {
  arr = [];            // TypeError: Assignment to constant variable.
} catch (e) {
  console.log(e.message);
}
```

```js
// 7. Template literals evaluate expressions, not just interpolate variables
const price = 19.999;
const qty = 3;
console.log(`Total: $${(price * qty).toFixed(2)}`);
// 'Total: $59.997' -> toFixed(2) rounds -> 'Total: $60.00'
```
