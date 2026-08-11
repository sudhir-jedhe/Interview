In JavaScript, **`NaN`** stands for **"Not-a-Number"**. It is a special numeric value that represents an unrepresentable, invalid, or undefined mathematical result.

Despite its name ("Not-a-Number"), the `typeof` `NaN` is actually `"number"`:

```javascript
console.log(typeof NaN); // Output: "number"

```

---

## 1. What Produces `NaN`?

`NaN` occurs when a mathematical operation fails or when type conversion to a number yields an invalid result.

### A. Invalid Math Operations

```javascript
// Example 1: 0 divided by 0
console.log(0 / 0); // Output: NaN

// Example 2: Square root of a negative number
console.log(Math.sqrt(-1)); // Output: NaN

// Example 3: Subtracting non-numeric strings
console.log("hello" - "world"); // Output: NaN

```

### B. Failed Type Conversions

```javascript
// Example 1: Parsing non-numeric strings
console.log(Number("abc"));      // Output: NaN
console.log(parseInt("hello"));  // Output: NaN

// Example 2: Math operations with undefined
console.log(5 + undefined);      // Output: NaN

```

---

## 2. The Golden Rule of `NaN`: It Is Never Equal to Anything

`NaN` is the **only value in JavaScript that is not equal to itself**. Neither loose equality (`==`) nor strict equality (`===`) will evaluate to `true` when comparing `NaN` to anything, including another `NaN`.

```javascript
console.log(NaN === NaN);        // Output: false
console.log(NaN == NaN);         // Output: false
console.log(Number.NaN === NaN); // Output: false

```

---

## 3. How to Properly Check for `NaN`

Because equality comparisons (`===`) fail, checking for `NaN` requires specific methods:

### A. `Number.isNaN()` (Recommended)

`Number.isNaN()` checks whether a value is **strictly `NaN**` without converting types.

```javascript
console.log(Number.isNaN(NaN));         // Output: true
console.log(Number.isNaN(0 / 0));       // Output: true

// Non-NaN values return false (even invalid numeric strings)
console.log(Number.isNaN("hello"));     // Output: false
console.log(Number.isNaN(undefined));   // Output: false

```

### B. The Global `isNaN()` (Legacy / Coercive)

The global `isNaN()` function converts the argument to a number **first** before checking. This causes unexpected false positives.

```javascript
console.log(isNaN(NaN));        // Output: true
console.log(isNaN("hello"));    // Output: true  (Coerces "hello" to NaN first!)
console.log(isNaN(undefined));  // Output: true  (Coerces undefined to NaN first!)

```

### C. Self-Comparison Trick (`x !== x`)

Since `NaN` is the only value in JavaScript that does not equal itself, you can write a self-comparison test:

```javascript
function isItNaN(val) {
  return val !== val;
}

console.log(isItNaN(NaN));     // Output: true
console.log(isItNaN(123));     // Output: false
console.log(isItNaN("hello")); // Output: false

```

---

## 4. `NaN` Propagation and Exceptions

When `NaN` is used in any arithmetic operation, the result will almost always propagate to `NaN`:

```javascript
console.log(5 + NaN);      // Output: NaN
console.log(10 * NaN);     // Output: NaN
console.log("hello" / 2);  // Output: NaN

```

**The One Exception (Exponentiation with 0):**
In IEEE 754 arithmetic standards, raising any base to the power of `0` returns `1`, even if the base is `NaN`:

```javascript
console.log(NaN ** 0); // Output: 1

```

---

## Quick Reference Summary

| Feature              | Detail                                         |
| -------------------- | ---------------------------------------------- |
| **`typeof NaN`**     | `"number"`                                     |
| **Equality Check**   | `NaN === NaN` is `false`                       |
| **Best Way to Test** | `Number.isNaN(val)`                            |
| **Falsy Value?**     | Yes, `NaN` is falsy (`Boolean(NaN) === false`) |
