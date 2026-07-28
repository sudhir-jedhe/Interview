Certainly! Here's the complete code implementing the `computeAmount` function:

```javascript
function computeAmount() {
  let totalAmount = 0; // To store the accumulated total

  // Function to add lacs
  function lacs(value) {
    totalAmount += value * 100000;
    return this; // Return the object to allow method chaining
  }

  // Function to add crores
  function crore(value) {
    totalAmount += value * 10000000;
    return this;
  }

  // Function to add thousands
  function thousand(value) {
    totalAmount += value * 1000;
    return this;
  }

  // Function to return the computed value
  function value() {
    return totalAmount;
  }

  // Returning an object with the methods
  return {
    lacs,
    crore,
    thousand,
    value,
  };
}

// Example usage:
const result = computeAmount()
  .lacs(15) // 15 lacs
  .crore(5) // 5 crores
  .crore(2) // 2 crores
  .lacs(20) // 20 lacs
  .thousand(45) // 45 thousand
  .crore(7) // 7 crores
  .value(); // Return the final computed value

console.log(result); // Expected output: 143545000
```

### Explanation of the code:

1. **`computeAmount()`**: The main function that initializes a `totalAmount` variable.
2. **`lacs(value)`**: Adds `value * 100000` to the total amount.
3. **`crore(value)`**: Adds `value * 10000000` to the total amount.
4. **`thousand(value)`**: Adds `value * 1000` to the total amount.
5. **`value()`**: Returns the accumulated total amount.

### Example Output:

The expected output after executing the following code:

```javascript
const result = computeAmount()
  .lacs(15)
  .crore(5)
  .crore(2)
  .lacs(20)
  .thousand(45)
  .crore(7)
  .value();

console.log(result); // Expected output: 143545000
```

This will print:

```
143545000
```

### How it works:

The `.lacs()`, `.crore()`, `.thousand()` methods allow you to add the corresponding amounts in lacs, crores, and thousands, respectively. After chaining all the calls, `.value()` returns the final computed total.

Here's my take: This is a classic JavaScript fluent API interview question testing **method chaining**, **closures/classes**, and **Indian Numbering System conversions** (Lacs and Crores).

To build `computeAmount()`, each method (`crore`, `lacs`, `thousand`, etc.) must update an internal running total and **return `this**` so the next call in the chain can be executed.

---

### Method 1: Class-Based Implementation (Cleanest)

```javascript
class AmountCalculator {
  constructor() {
    this.total = 0;
  }

  crore(val) {
    this.total += val * 1_00_00_000; // 1 Crore = 10,000,000
    return this; // Enables method chaining!
  }

  lacs(val) {
    this.total += val * 1_00_000; // 1 Lac = 100,000
    return this;
  }

  thousand(val) {
    this.total += val * 1_000; // 1 Thousand = 1,000
    return this;
  }

  hundred(val) {
    this.total += val * 100;
    return this;
  }

  value() {
    return this.total;
  }
}

// Factory function so we can invoke computeAmount() without the 'new' keyword
function computeAmount() {
  return new AmountCalculator();
}

// Execution
const result = computeAmount()
  .lacs(15) // 15,00,000
  .crore(5) // + 5,00,000,000
  .crore(2) // + 2,00,000,000
  .lacs(20) // + 20,00,000
  .thousand(45) // + 45,000
  .crore(7) // + 7,00,000,000
  .value(); // Returns total

console.log(result);
// Output: 1435045000 (14 Crores, 35 Lacs, 45 Thousand)
```

---

### Method 2: Closure / Object Literal Version (No `class` or `this`)

If an interviewer asks: _"Can you implement this using pure functions and closures without using `this` or ES6 classes?"_

```javascript
function computeAmount() {
  let total = 0; // Private state held inside closure

  const api = {
    crore(val) {
      total += val * 10000000;
      return api; // Returns the closure object instance
    },
    lacs(val) {
      total += val * 100000;
      return api;
    },
    thousand(val) {
      total += val * 1000;
      return api;
    },
    hundred(val) {
      total += val * 100;
      return api;
    },
    value() {
      return total;
    },
  };

  return api;
}
```

---

### Value Breakdown

Here is how the running total accumulates step-by-step for your test case:

| Method Call     | Units Added           | Value Added | Running Total                        |
| --------------- | --------------------- | ----------- | ------------------------------------ |
| `.lacs(15)`     | 15 $\times$ 1,00,000  | 1,500,000   | **1,500,000**                        |
| `.crore(5)`     | 5 $\times$ 10,00,0000 | 50,000,000  | **51,500,000**                       |
| `.crore(2)`     | 2 $\times$ 10,00,0000 | 20,000,000  | **71,500,000**                       |
| `.lacs(20)`     | 20 $\times$ 1,00,000  | 2,000,000   | **73,500,000**                       |
| `.thousand(45)` | 45 $\times$ 1,000     | 45,000      | **73,545,000**                       |
| `.crore(7)`     | 7 $\times$ 10,00,0000 | 70,000,000  | **143,545,000**                      |
| **`.value()`**  | **Final Sum**         | —           | **`143,545,000`** _(143.545 Crores)_ |

Here's my take: To format numbers into the Indian numbering system (with lakhs and crores, e.g., `₹14,35,45,000`), you use `Intl.NumberFormat` with the **`en-IN`** (English - India) or **`hi-IN`** locale.

The Indian numbering system groups the last three digits together, and every preceding group in pairs of two (e.g., `12,34,56,789`), unlike the Western standard which groups every three digits (`123,456,789`).

---

### 1. Basic Currency Formatting (`en-IN`)

Pass `'en-IN'` as the locale and set `style: 'currency'` with `currency: 'INR'`:

```javascript
const amount = 143545000;

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0, // Removes decimal points if not needed
});

console.log(inrFormatter.format(amount));
// Output: "₹14,35,45,000"
```

---

### 2. Compact Notation (Displaying "14.35 Cr" or "14.35 Lakh")

If you want short, readable strings (like **"14.35 Cr"** for dashboard cards or tables), use `notation: 'compact'` combined with the `en-IN` locale:

```javascript
const amount = 143545000;

const compactFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 2,
});

console.log(compactFormatter.format(amount));
// Output: "₹14.35 Cr"

console.log(compactFormatter.format(1500000));
// Output: "₹15 L"
```

---

### 3. Integrating with the `computeAmount()` Chain

You can integrate this directly into your `computeAmount()` calculator by adding a `.format()` method alongside `.value()`:

```javascript
class AmountCalculator {
  constructor() {
    this.total = 0;
  }

  crore(val) {
    this.total += val * 1_00_00_000;
    return this;
  }

  lacs(val) {
    this.total += val * 1_00_000;
    return this;
  }

  thousand(val) {
    this.total += val * 1_000;
    return this;
  }

  value() {
    return this.total;
  }

  // Returns formatted currency string (e.g., "₹14,35,45,000")
  format(compact = false) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: 2,
    }).format(this.total);
  }
}

const computeAmount = () => new AmountCalculator();

// Usage Examples
const calc = computeAmount().crore(14).lacs(35).thousand(45);

console.log(calc.value()); // 143545000
console.log(calc.format()); // "₹14,35,45,000"
console.log(calc.format(true)); // "₹14.35 Cr"
```

---

### Options Reference Summary

| Property                    | Value        | Description                                               |
| --------------------------- | ------------ | --------------------------------------------------------- |
| **Locale**                  | `'en-IN'`    | Specifies the Indian grouping system ($\text{10,00,000}$) |
| **`style`**                 | `'currency'` | Appends the `₹` symbol                                    |
| **`currency`**              | `'INR'`      | Sets the target currency                                  |
| **`notation`**              | `'compact'`  | Formats into **L** (Lakhs) and **Cr** (Crores)            |
| **`maximumFractionDigits`** | `0` or `2`   | Controls decimal precision                                |

Here's my take: Implementing an infinitely curried sum function is a classic JavaScript interview question that tests your understanding of **closures**, **recursion**, and **implicit type coercion**.

Depending on how the function terminates, there are **two distinct interview variants** for this problem:

1. **Terminal Empty Call Variant:** `sum(1)(2)(3)() === 6` (Terminated when called with no arguments)
2. **Implicit Value Variant:** `sum(1)(2)(3) + 0 === 6` (Terminated using `valueOf` / `toString` coercion)

---

### Variant 1: Empty Parentheses Termination (`sum(1)(2)(3)()`)

In this version, the function checks if an argument was passed. If a number is provided, it returns a new closure to accumulate the sum. When called with no arguments (`()`), it returns the accumulated result.

```javascript
function sum(a) {
  // If the function is called initially without arguments, return 0
  if (a === undefined) return 0;

  return function next(b) {
    // Terminal condition: called with no arguments ()
    if (b === undefined) {
      return a;
    }
    // Recursive step: sum the accumulated value and return closure
    return sum(a + b);
  };
}

// Execution
console.log(sum(1)(2)(3)()); // 6
console.log(sum(5)(10)(15)(20)()); // 50
console.log(sum()); // 0
```

---

### Variant 2: Implicit Type Coercion (`sum(1)(2)(3)`)

Interviewer constraint: _"Can you write it so it doesn't need the empty trailing `()` at the end, but still works in math operations like `sum(1)(2)(3) + 10`?"_

To solve this, the function **always returns another function**, but overrides JavaScript's built-in `toString` and `valueOf` methods on that function object so it automatically converts to its numeric total when used in primitive contexts (like addition, comparison, or template literals).

```javascript
function sum(a) {
  let currentSum = a;

  function fn(b) {
    currentSum += b;
    return fn; // Returns the function instance for infinite chaining
  }

  // Override Primitive Type Coercion hooks
  fn.valueOf = () => currentSum;
  fn.toString = () => String(currentSum);

  return fn;
}

// Execution
console.log(sum(1)(2)(3) + 0); // 6
console.log(sum(1)(2)(3)(4) * 2); // 20
console.log(Number(sum(5)(5))); // 10
```

---

### Comparison Matrix

| Variant              | Termination Trigger           | Pros                                                        | Edge Case / Drawback                                                                      |
| -------------------- | ----------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **`sum(1)(2)(3)()`** | Explicit empty `()` call      | Clean, pure function returning a primitive number directly. | Throws TypeError if you forget the trailing `()`.                                         |
| **`sum(1)(2)(3)`**   | Implicit coercion (`valueOf`) | Infinitely chainable without trailing parentheses.          | Returns a function object that relies on coercion (e.g. `typeof sum(1)` is `'function'`). |
