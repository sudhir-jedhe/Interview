In JavaScript, an **infinite currying** function accepts arguments continuously across chained function calls (e.g., `add(1)(2)(3)...(n)`).

Depending on the interview or production requirement, there are **two ways** to terminate the chain:

---

### Pattern 1: Terminating with an Empty Call `()` (Most Common in Interviews)

The function continues returning a new curried function until it is called with **no arguments** (`()`), which returns the accumulated result.

```javascript
function add(a) {
  return function (b) {
    if (b !== undefined) {
      return add(a + b);
    }
    return a;
  };
}

// Usage:
console.log(add(1)(2)());             // 3
console.log(add(1)(2)(3)(4)(5)());     // 15
console.log(add(10)(-2)(5)());         // 13

```

#### Supporting Multiple Arguments Per Call

To allow calls like `add(1, 2)(3)(4, 5)()`:

```javascript
function add(...args) {
  const sum = args.reduce((acc, curr) => acc + curr, 0);

  return function (...nextArgs) {
    if (nextArgs.length > 0) {
      const nextSum = nextArgs.reduce((acc, curr) => acc + curr, 0);
      return add(sum + nextSum);
    }
    return sum;
  };
}

console.log(add(1, 2)(3, 4)());        // 10
console.log(add(5)(10, 20)(1)());      // 36

```

---

### Pattern 2: Overriding `valueOf` / `toString` (No Terminating Call)

If the syntax requires evaluating `add(1)(2)(3)` directly in an expression (without an ending `()`), you return a function whose primitive coercion (`valueOf` / `Symbol.toPrimitive`) returns the current sum.

```javascript
function add(a) {
  let currentSum = a;

  function fn(b) {
    currentSum += b;
    return fn;
  }

  // Called when JS coerces the function to a primitive (number / string)
  fn.valueOf = function () {
    return currentSum;
  };

  fn.toString = function () {
    return String(currentSum);
  };

  return fn;
}

// Usage (coerced in numeric or string contexts):
console.log(+add(1)(2)(3));           // 6 (unary + forces valueOf)
console.log(add(1)(2)(3) == 6);       // true (equality comparison forces valueOf)
console.log(add(1)(2)(3) + 4);        // 10
console.log(`Sum: ${add(1)(2)(3)}`);  // "Sum: 6" (template literal forces toString)

```

---

### Pattern 3: Generalized Infinite Currying for Any Operation

To apply any binary operation (multiplication, string concatenation, custom reducer) instead of just addition:

```javascript
function infiniteCurry(fn, initialValue) {
  return function step(current) {
    return function (next) {
      if (next !== undefined) {
        return step(fn(current, next));
      }
      return current;
    };
  }(initialValue);
}

// Multiply:
const multiply = (x) => infiniteCurry((a, b) => a * b, x);
console.log(multiply(2)(3)(4)()); // 24

// String Join:
const joinWords = (x) => infiniteCurry((a, b) => `${a} -> ${b}`, x);
console.log(joinWords('Start')('Step 1')('Step 2')('Finish')());
// "Start -> Step 1 -> Step 2 -> Finish"

```

---

### Summary: Which Pattern to Use?

| Requirement               | Approach                                | Example Syntax       |
| ------------------------- | --------------------------------------- | -------------------- |
| Explicit end condition    | **Pattern 1** (Check `b !== undefined`) | `add(1)(2)(3)()`     |
| Implicit value extraction | **Pattern 2** (Override `valueOf`)      | `+add(1)(2)(3)`      |
| Flexible operations       | **Pattern 3** (Higher-order currier)    | `calc(op)(val)...()` |
