# JS Basics & Data Types — Output-Based Questions

```js
console.log(typeof typeof 1);
```
**Answer:** `'string'`

**Why:** `typeof 1` evaluates first and returns the string `'number'`. Then `typeof 'number'` is evaluated, and since it's operating on a string, it returns `'string'`. `typeof` always returns a string, so `typeof typeof anything` is always `'string'`.

---

```js
let x = { val: 10 };
function update(obj) {
  obj = { val: 20 };
}
update(x);
console.log(x.val);
```
**Answer:** `10`

**Why:** `obj` receives a copy of the reference to `x`'s object. Reassigning `obj` inside the function points the local variable at a brand-new object — it does not change what `x` points to. Only mutating a property on the shared object (e.g. `obj.val = 20`) would be visible outside the function.

---

```js
console.log(0.1 + 0.2 === 0.3);
```
**Answer:** `false`

**Why:** Numbers in JS are IEEE-754 doubles, which can't represent 0.1 or 0.2 exactly in binary. `0.1 + 0.2` actually evaluates to `0.30000000000000004`, which is not strictly equal to `0.3`. This is a floating-point limitation shared by nearly every language that uses this standard, not a JS-specific bug.

---

```js
console.log(null == 0);
console.log(null >= 0);
```
**Answer:** `false` then `true`

**Why:** `==` with `null` is special-cased: `null` only loosely equals `undefined` (and itself), never any number, so `null == 0` is `false`. But relational operators (`>=`, `<=`, `<`, `>`) don't use that special case — they coerce `null` to `0` via `ToNumber`, so `null >= 0` becomes `0 >= 0`, which is `true`. This inconsistency between equality and relational coercion trips up a lot of people.

---

```js
console.log(typeof NaN);
console.log(NaN === NaN);
```
**Answer:** `'number'` then `false`

**Why:** `NaN` is, perhaps confusingly, a value of type `number` — it represents "an invalid number result," not "not a number type." Per the IEEE-754 spec, `NaN` is defined to never equal anything, including itself, so `NaN === NaN` is `false`.

---

```js
const a = [1, 2, 3];
const b = a;
b.length = 0;
console.log(a);
```
**Answer:** `[]`

**Why:** `b` is not a copy of `a` — it's another reference to the exact same array in memory. Setting `b.length = 0` truncates that shared array, so `a` reflects the change too.

---

```js
console.log(1 + '1');
console.log(1 - '1');
console.log('5' + 3 - 2);
```
**Answer:** `'11'`, `0`, `51`

**Why:** `+` triggers string concatenation when either operand is a string, so `1 + '1'` becomes `'1' + '1'` = `'11'`. `-` has no string meaning, so it always coerces both operands to numbers: `1 - '1'` becomes `1 - 1` = `0`. In the third line, operators run left-to-right: `'5' + 3` concatenates first (since `'5'` is a string) giving `'53'`, then `'53' - 2` coerces `'53'` to the number `53` and subtracts, giving `51`. This demonstrates why mixing `+` and `-` with strings is error-prone — the result depends entirely on operator order.

---

```js
let count;
console.log(count);
console.log(typeof count);
count = null;
console.log(typeof count);
```
**Answer:** `undefined`, `'undefined'`, `'object'`

**Why:** A declared-but-unassigned variable is `undefined` by default, and `typeof` on it reports `'undefined'`. Once explicitly assigned `null`, `typeof` reports `'object'` — the historical `typeof null` bug — even though semantically `count` still holds "no value."

---

```js
console.log([1, 2] + [3, 4]);
```
**Answer:** `'1,23,4'`

**Why:** `+` on two objects (arrays are objects) triggers `ToPrimitive`, which calls each array's `toString()`. `[1,2].toString()` is `'1,2'` and `[3,4].toString()` is `'3,4'`. Since both operands are now strings, `+` concatenates them: `'1,2' + '3,4'` = `'1,23,4'`.
