# Snippets: Operators & Coercion

## 1. == vs === on mixed types

```js
console.log(1 == "1");    // true — string coerced to number
console.log(1 === "1");   // false — different types, no coercion
console.log(null == undefined); // true — special-cased pair
console.log(null === undefined); // false
```

## 2. The complete falsy list, verified

```js
const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];
console.log(falsyValues.every((v) => !v)); // true — all eight are falsy
console.log(!!"0", !!"false", !![], !!{}); // true true true true — all truthy!
```

## 3. + concatenates, other operators coerce to number

```js
console.log(1 + "1");   // "11"
console.log(1 - "1");   // 0
console.log("3" * "3"); // 9
console.log("10" / "2"); // 5
```

## 4. || vs ?? with a legitimately falsy value

```js
function getCount(count) { return count || 10; }
function getCountFixed(count) { return count ?? 10; }
console.log(getCount(0));        // 10 — bug, 0 was treated as "missing"
console.log(getCountFixed(0));   // 0  — correct, 0 is a valid value
```

## 5. Optional chaining short-circuits function calls too

```js
let called = false;
function sideEffect() { called = true; return "result"; }
const obj = { fn: null };
const result = obj.fn?.();
console.log(result, called); // undefined false — sideEffect-style call never happens
```

## 6. Object-to-primitive coercion in == comparisons

```js
console.log([1, 2] == "1,2");   // true — array's toString() joins with commas
console.log([] == "");           // true — [] -> "" via toString
console.log({} == "[object Object]"); // true — default Object toString
```

## 7. NaN is never equal to anything, even itself

```js
console.log(NaN == NaN);              // false
console.log(NaN === NaN);             // false
console.log(Number.isNaN(NaN));       // true — the only reliable direct check
console.log([NaN].includes(NaN));     // true — includes uses SameValueZero, not ===
```
