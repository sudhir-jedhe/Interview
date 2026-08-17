# Snippets: Strings, Numbers & Math

## 1. Strings never mutate in place

```js
const name = "alice";
name.toUpperCase();
console.log(name);              // "alice" — return value ignored, original untouched
console.log(name.toUpperCase()); // "ALICE" — new string returned
```

## 2. slice vs substring on out-of-order arguments

```js
console.log("hello world".slice(6, 2));     // "" — start after end = empty
console.log("hello world".substring(6, 2)); // "wo" — args silently swapped
```

## 3. Floating point addition is not exact

```js
console.log(0.1 + 0.2);                 // 0.30000000000000004
console.log((0.1 + 0.2).toFixed(2));    // "0.30" (string!)
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true
```

## 4. parseInt stops at the first invalid character; Number does not

```js
console.log(parseInt("100px"));   // 100
console.log(Number("100px"));     // NaN
console.log(parseInt("  42  ")); // 42 — leading whitespace ignored
console.log(parseInt("0x1F"));    // 31 — auto-detects hex prefix
```

## 5. Math.max/min need spread to work on arrays

```js
const nums = [4, 1, 9, 2];
console.log(Math.max(nums));       // NaN — array isn't a valid single argument
console.log(Math.max(...nums));    // 9
console.log(Math.min(...nums));    // 1
```

## 6. Random integer in an inclusive range

```js
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const value = randomInt(1, 6); // simulates a die roll, always an integer 1-6
console.log(Number.isInteger(value)); // true
```

## 7. Math.round ties always go toward positive infinity

```js
console.log(Math.round(2.5));   // 3
console.log(Math.round(-2.5));  // -2, not -3
console.log(Math.round(-2.6));  // -3
```
