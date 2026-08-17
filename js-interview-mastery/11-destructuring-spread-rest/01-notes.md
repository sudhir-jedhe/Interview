# Notes: Destructuring, Spread & Rest

## Array destructuring

Array destructuring unpacks values by position. You can skip elements by leaving a slot empty, provide defaults for `undefined` values, and even swap two variables without a temp variable:

```js
const [a, , c] = [1, 2, 3];        // a = 1, c = 3 (skip index 1)
const [x = 10, y = 20] = [5];      // x = 5, y = 20 (default only applies to undefined)

let m = 1, n = 2;
[m, n] = [n, m];                   // swap: m = 2, n = 1
```

Defaults only kick in when the value at that position is `undefined` — not `null`, not `0`, not `''`. This trips people up: `const [a = 5] = [null]` gives `a = null`, not `5`.

## Object destructuring

Object destructuring unpacks by property name, not position. You can rename while extracting, supply defaults, and nest arbitrarily deep:

```js
const user = { id: 1, profile: { name: 'Ada', age: 30 } };

const { id: userId, profile: { name, age = 18 } } = user;
// userId = 1, name = 'Ada', age = 30
```

The `key: newName` syntax is a rename, not a type annotation (a common confusion for TypeScript newcomers). If you destructure a property that doesn't exist, you get `undefined` unless a default is provided — it never throws, *unless* the object itself is `null`/`undefined`, in which case destructuring throws a `TypeError` because you can't read properties off `null`.

## Destructuring in function parameters

This is extremely common for options objects:

```js
function createUser({ name, role = 'guest', permissions = [] } = {}) {
  return `${name} (${role})`;
}
createUser({ name: 'Bo' }); // "Bo (guest)"
createUser();               // works only because of `= {}` fallback
```

Without the `= {}` default on the parameter itself, calling `createUser()` with no arguments throws, because you'd be destructuring `undefined`.

## Spread: expanding

Spread takes an iterable (array, string, Map, Set, etc.) or, for objects, an object's own enumerable properties, and expands them in place:

```js
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];      // [1, 2, 3, 4]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, b: 99 };   // { a: 1, b: 99 } — later keys win

function sum(a, b, c) { return a + b + c; }
sum(...[1, 2, 3]);                 // 6
```

Object spread only copies **own enumerable** properties, and it does a **shallow copy**: nested objects/arrays are copied by reference, not cloned.

```js
const original = { a: 1, nested: { x: 1 } };
const copy = { ...original };
copy.nested.x = 99;
console.log(original.nested.x);    // 99 — same nested object!
```

For a real deep copy you need `structuredClone(obj)`, a recursive clone, or a library — spread alone is not enough for nested data.

## Rest: collecting

Rest is the mirror image — it gathers the remaining items into a new array (in destructuring or function params) or a new object (in object destructuring):

```js
function log(first, ...rest) {
  console.log(first, rest); // 1 [2, 3, 4]
}
log(1, 2, 3, 4);

const [head, ...tail] = [1, 2, 3];       // head = 1, tail = [2, 3]
const { a, ...others } = { a: 1, b: 2, c: 3 }; // others = { b: 2, c: 3 }
```

Rest parameters must be the **last** parameter — `function f(...rest, last)` is a syntax error. Rest also always produces a real, independent `Array` (unlike the old `arguments` object, which is array-*like*).

## Spread vs. rest — the mental model

Same three dots, opposite job, disambiguated purely by **position**:
- On the right side of `=` or in a call — it's spread (expanding).
- On the left side of `=` (a pattern) or as the last function parameter — it's rest (collecting).
