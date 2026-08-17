# Snippets: ES6+ Features

```js
// 1. Tagged template receives string chunks + interpolated values separately
function shout(strings, ...values) {
  return strings.join('').toUpperCase() + ' ' + values.join(',');
}
console.log(shout`hi ${1} there ${2}`);
// HI  THERE  1,2
```

```js
// 2. Symbol as a collision-proof object key, invisible to normal enumeration
const secret = Symbol('secret');
const config = { host: 'localhost', [secret]: 'do-not-log-me' };
console.log(JSON.stringify(config));
// {"host":"localhost"}
```

```js
// 3. Map accepts object keys; plain objects cannot
const objKey = { id: 1 };
const map = new Map();
map.set(objKey, 'metadata');
console.log(map.get(objKey));
console.log(map.get({ id: 1 })); // different object reference
// metadata
// undefined
```

```js
// 4. Set for instant de-duplication with insertion order preserved
const nums = [3, 1, 2, 3, 1];
console.log([...new Set(nums)]);
// [ 3, 1, 2 ]
```

```js
// 5. yield* delegates to a nested generator, flattening the sequence
function* letters() { yield 'a'; yield 'b'; }
function* combined() {
  yield 1;
  yield* letters();
  yield 2;
}
console.log([...combined()]);
// [ 1, 'a', 'b', 2 ]
```

```js
// 6. Array.prototype.at with negative indices
const list = [10, 20, 30];
console.log(list.at(-1), list[list.length - 1]);
// 30 30
```

```js
// 7. structuredClone performs a true deep clone (unlike spread)
const original = { nested: { value: 1 } };
const clone = structuredClone(original);
clone.nested.value = 99;
console.log(original.nested.value, clone.nested.value);
// 1 99
```
