# Problem: Implement `looseEquals(a, b)` replicating `==` coercion rules manually

Implement a function that mimics the Abstract Equality Comparison algorithm (`==`) step by step, documenting each rule as you implement it — without ever using the real `==` operator internally (only `===` and explicit coercion).

## Requirements

Cover, at minimum: same-type fast path, `null`/`undefined` special case, number/string comparison, boolean comparison, and object-to-primitive comparison.

## Solution

```js
function looseEquals(a, b) {
  // Rule 1: same type -> behaves exactly like ===
  if (typeof a === typeof b) {
    return a === b;
  }

  // Rule 2: null and undefined are loosely equal ONLY to each other
  const aNullish = a === null || a === undefined;
  const bNullish = b === null || b === undefined;
  if (aNullish || bNullish) {
    return aNullish && bNullish;
  }

  // Rule 3: number <-> string: convert the string to a number, compare again
  if (typeof a === "number" && typeof b === "string") {
    return looseEquals(a, Number(b));
  }
  if (typeof a === "string" && typeof b === "number") {
    return looseEquals(Number(a), b);
  }

  // Rule 4: boolean <-> anything: convert the boolean to a number, compare again
  if (typeof a === "boolean") {
    return looseEquals(Number(a), b);
  }
  if (typeof b === "boolean") {
    return looseEquals(a, Number(b));
  }

  // Rule 5: object <-> primitive (number/string/bigint/symbol): convert object via ToPrimitive
  const aIsObject = a !== null && typeof a === "object";
  const bIsObject = b !== null && typeof b === "object";
  if (aIsObject && !bIsObject) {
    return looseEquals(toPrimitive(a), b);
  }
  if (bIsObject && !aIsObject) {
    return looseEquals(a, toPrimitive(b));
  }

  // Anything left (e.g. two different-typed objects, symbols vs other types) is not equal
  return false;
}

// Simplified ToPrimitive: try valueOf() first, fall back to toString()
function toPrimitive(obj) {
  if (typeof obj.valueOf === "function") {
    const value = obj.valueOf();
    if (typeof value !== "object") return value;
  }
  if (typeof obj.toString === "function") {
    const str = obj.toString();
    if (typeof str !== "object") return str;
  }
  throw new TypeError("Cannot convert object to primitive value");
}

// --- Verification against real == ---
console.log(looseEquals(1, "1"), 1 == "1");                 // true true
console.log(looseEquals(null, undefined), null == undefined); // true true
console.log(looseEquals(null, 0), null == 0);                 // false false
console.log(looseEquals([], false), [] == false);             // true true
console.log(looseEquals("", 0), "" == 0);                     // true true
console.log(looseEquals(NaN, NaN), NaN == NaN);               // false false
console.log(looseEquals([1, 2], "1,2"), [1, 2] == "1,2");     // true true
```

## Why it works

Each `if` block implements exactly one clause of the real Abstract Equality Comparison algorithm, in the same priority order the spec uses:

1. **Same type** short-circuits to `===` — no coercion needed once types already match.
2. **`null`/`undefined`** are checked before any numeric/string coercion because the spec special-cases them to only equal each other, never `0`/`false`/`""` — this is why `null == 0` is `false` even though `null` numerically "feels like" it should be `0`.
3. **Number/string** mixed pairs convert the string side and recurse — recursion naturally re-runs Rule 1's same-type fast path on the next call.
4. **Boolean** pairs convert the boolean to a number first (`true` → `1`, `false` → `0`) and recurse — this matches the spec's requirement to "re-run" the algorithm rather than doing a direct final comparison.
5. **Object vs primitive** converts the object via `ToPrimitive` (`valueOf` preferred, `toString` fallback) and recurses.

Recursing after each single coercion step (rather than trying to resolve everything in one pass) closely mirrors how the spec itself is written as a sequence of "if this, coerce and re-evaluate" steps — it's also why the real `==` algorithm is often diagrammed as a flowchart with loops back to the top.
