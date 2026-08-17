# Output-Based Questions: ES6+ Features

```js
const s1 = Symbol('id');
const s2 = Symbol('id');
console.log(s1 === s2);
console.log(s1.toString());
```
**Answer:**
```
false
Symbol(id)
```
**Why:** Every call to `Symbol()` produces a brand-new, completely unique value regardless of the description string passed in — the description is purely for debugging/display purposes and plays no role in equality. `s1` and `s2` are two distinct primitives even though they share the description `'id'`.

```js
const obj = {};
console.log(obj[Symbol.iterator]);
console.log(typeof obj.toString);
```
**Answer:**
```
undefined
function
```
**Why:** Plain objects don't have a `Symbol.iterator` method by default (that's why `for-of` fails on them), but they do inherit ordinary string-keyed methods like `toString` from `Object.prototype`. This contrasts symbol-keyed lookups (opt-in, rare) with the standard prototype chain (always present).

```js
function* gen() {
  const x = yield 1;
  const y = yield x + 1;
  return x + y;
}
const it = gen();
console.log(it.next());
console.log(it.next(10));
console.log(it.next(20));
```
**Answer:**
```
{ value: 1, done: false }
{ value: 11, done: false }
{ value: 30, done: true }
```
**Why:** The value passed into `next(v)` becomes the result of the *previous* `yield` expression when execution resumes, not the value of the yield about to happen. The first `next()` call has nothing to pass in (it just starts the generator, running up to `yield 1`). `next(10)` resumes with `x = 10`, computes `yield x + 1` → `yield 11`. `next(20)` resumes with `y = 20`, and the function returns `x + y = 10 + 20 = 30`, with `done: true`.

```js
const map = new Map();
map.set(NaN, 'a');
console.log(map.get(NaN));
console.log(NaN === NaN);
```
**Answer:**
```
a
false
```
**Why:** `Map` uses the SameValueZero algorithm for key comparison, which — unlike `===` — treats `NaN` as equal to itself. So `NaN` works reliably as a `Map` key even though `NaN === NaN` is famously `false` with strict equality.

```js
// counter.mjs
export let count = 0;
export function inc() { count++; }

// main.mjs
import { count, inc } from './counter.mjs';
console.log(count);
inc();
console.log(count);
count = 5; // attempt to reassign the imported binding
```
**Answer:**
```
0
1
TypeError: Assignment to constant variable. (or "count" is read-only, depending on engine)
```
**Why:** ES module imports are **live, read-only bindings**, not copies. The importing module always sees the current value from the source module (so `count` correctly becomes `1` after `inc()` runs elsewhere), but the importer cannot itself reassign the binding — only the exporting module can change it. Attempting to assign `count = 5` from `main.mjs` throws.

```js
console.log([10, 20, 30].at(-2));
console.log([10, 20, 30][-2]);
```
**Answer:**
```
20
undefined
```
**Why:** `.at()` supports negative indices, counting from the end of the array (`-2` means "second from last" → `20`). Plain bracket indexing `arr[-2]` does not support negative indices at all — it just does a normal property lookup for the string key `"-2"`, which doesn't exist on the array, so it returns `undefined`.

```js
const obj = Object.create(null);
obj.a = 1;
console.log(obj.hasOwnProperty('a'));
```
**Answer:** `TypeError: obj.hasOwnProperty is not a function`
**Why:** `Object.create(null)` creates an object with **no prototype at all** — not even `Object.prototype` — so it has no inherited `hasOwnProperty` method. This is exactly why `Object.hasOwn(obj, 'a')` (a static method, not looked up on the object's own prototype chain) is the safer, modern replacement: `Object.hasOwn(obj, 'a')` would correctly return `true` here.

```js
async function main() {
  console.log('before');
  const result = await Promise.resolve(42);
  console.log(result);
}
main();
console.log('after');
```
**Answer:**
```
before
after
42
```
**Why:** `main()` runs synchronously up to the first `await`, logging `"before"`. The `await` then suspends `main`, returning control to the caller, so the synchronous `console.log('after')` runs next. Only after the current synchronous code finishes does the microtask queue resume `main`, logging the resolved value `42`.
