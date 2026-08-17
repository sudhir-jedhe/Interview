# Output-Based Questions: Destructuring, Spread & Rest

```js
const [a = 1, b = 2] = [undefined, null];
console.log(a, b);
```
**Answer:** `1 null`
**Why:** Default values only apply when the destructured value is exactly `undefined`. Position 0 is `undefined`, so `a` gets its default `1`. Position 1 is `null`, which is a real value (not `undefined`), so `b` stays `null` and the default `2` is never used.

```js
const obj = { a: 1, b: 2, c: 3 };
const { a, ...rest } = obj;
rest.a = 99;
console.log(obj.a, rest);
```
**Answer:** `1 { b: 2, c: 3, a: 99 }`
**Why:** `rest` is a brand-new plain object built from the leftover own enumerable properties (`b`, `c`) — `a` was excluded. Mutating `rest` never touches `obj`, and you can freely add new keys like `a` back onto `rest` without affecting the original.

```js
function f({ x, y = x }) {
  console.log(x, y);
}
f({ x: 5 });
```
**Answer:** `5 5`
**Why:** Default values in destructuring can reference earlier-bound variables from the same pattern. Since `y` is missing (`undefined`), its default expression `x` is evaluated, and `x` is already bound to `5` at that point.

```js
const a = [1, 2, 3];
const b = [...a];
b.push(4);
console.log(a, b);
```
**Answer:** `[ 1, 2, 3 ] [ 1, 2, 3, 4 ]`
**Why:** Array spread creates a new top-level array. Since the elements are primitives, this is a true independent copy — pushing onto `b` cannot affect `a`. (This would differ if the elements were objects being mutated in place.)

```js
const nested = { info: { score: 10 } };
const copy = { ...nested };
copy.info.score = 99;
console.log(nested.info.score);
```
**Answer:** `99`
**Why:** Object spread only performs a shallow copy — it copies the top-level `info` key's *value*, which is a reference to the same inner object. Both `nested.info` and `copy.info` point to the same object in memory, so mutating one is visible through the other.

```js
function sum(...nums) {
  console.log(nums.length);
}
sum(1, 2, ...[3, 4], 5);
```
**Answer:** `5`
**Why:** The spread `...[3, 4]` expands to `3, 4` at the call site before the function is invoked, so `sum` actually receives the arguments `1, 2, 3, 4, 5`. The rest parameter `...nums` then collects all five into one array.

```js
const [x, y, z] = 'hi';
console.log(x, y, z);
```
**Answer:** `h i undefined`
**Why:** Strings are iterable (iterating yields each character), so array destructuring works on them directly. `'hi'` only has two characters, so the third binding `z` has nothing to pull and becomes `undefined` — destructuring never throws for "missing" positions, it just yields `undefined`.

```js
let { length } = [1, 2, 3];
console.log(length);
```
**Answer:** `3`
**Why:** Object destructuring reads properties by name, and arrays are objects with a `length` property. `{ length }` is shorthand for `{ length: length }`, pulling the array's own `length` property — this works even though `[1, 2, 3]` is being destructured with object syntax, not array syntax.

```js
function log(a, ...rest) {
  rest.push('added');
  console.log(a, rest);
}
const arr = ['x', 'y'];
log(...arr);
```
**Answer:** `x [ 'y', 'added' ]`
**Why:** `...arr` spreads the array into two positional arguments (`'x'`, `'y'`). Inside `log`, `a` binds `'x'` and the rest parameter collects everything else into a *fresh* array `['y']`, independent of `arr`. Pushing to `rest` never mutates the original `arr`.
