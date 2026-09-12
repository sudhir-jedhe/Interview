To combine **infinite currying** (calling a function repeatedly with parentheses like `calc(2)(3)`) with **method chaining** (calling named methods like `.add()`, `.sub()`, `.mul()`), you create an object or function that exposes chainable methods and continuously returns itself or a clone of itself until an extraction trigger (like `.value()` or `valueOf`) is called.

Here are the two best ways to implement this pattern:

---

### Approach 1: Callable Function with Method Properties (Hybrid Currying + Chaining)

This pattern allows you to **mix arbitrary calls**: you can invoke it directly via parentheses `calc(2)(3)` or via explicit methods `.add(4).sub(1).mul(2)` in any order.

```javascript
function compute(initialValue = 0) {
  let currentVal = initialValue;

  // The callable function for parenthetical currying: compute(1)(2)(3)
  function inner(...args) {
    if (args.length > 0) {
      currentVal += args.reduce((acc, n) => acc + n, 0);
    }
    return inner;
  }

  // Method chaining attachments
  inner.add = function (...args) {
    currentVal += args.reduce((acc, n) => acc + n, 0);
    return inner;
  };

  inner.sub = function (...args) {
    currentVal -= args.reduce((acc, n) => acc + n, 0);
    return inner;
  };

  inner.mul = function (...args) {
    currentVal *= args.reduce((acc, n) => acc * n, 1);
    return inner;
  };

  inner.div = function (...args) {
    for (const n of args) {
      currentVal /= n;
    }
    return inner;
  };

  // Explicit value extraction
  inner.value = function () {
    return currentVal;
  };

  // Implicit value conversion (for string/math coercion)
  inner.valueOf = function () {
    return currentVal;
  };

  inner.toString = function () {
    return String(currentVal);
  };

  return inner;
}

// 1. Pure Parenthetical Currying
console.log(compute(10)(5)(2).value()); // 17

// 2. Pure Method Chaining
console.log(compute(10).add(5).sub(3).mul(2).value()); // 24

// 3. Mixed Invocation (Infinite currying interspersed with methods)
console.log(compute(5)(5).mul(2).sub(4)(10).value()); // ( (5 + 5) * 2 - 4 ) + 10 = 26

// 4. Automatic Value Coercion via valueOf
console.log(+compute(2).add(8).mul(4)); // 40
console.log(compute(10)(5) == 15);      // true

```

---

### Approach 2: Immutable / Pure Object-Oriented Builder

If you want **immutability** (so each chain step returns a *new* instance without mutating the parent step), use a class-based or closure-based builder:

```javascript
class Calculator {
  constructor(val = 0) {
    this._val = val;
  }

  add(...nums) {
    const sum = nums.reduce((acc, n) => acc + n, 0);
    return new Calculator(this._val + sum);
  }

  sub(...nums) {
    const sum = nums.reduce((acc, n) => acc + n, 0);
    return new Calculator(this._val - sum);
  }

  mul(...nums) {
    const prod = nums.reduce((acc, n) => acc * n, 1);
    return new Calculator(this._val * prod);
  }

  div(...nums) {
    const res = nums.reduce((acc, n) => acc / n, this._val);
    return new Calculator(res);
  }

  value() {
    return this._val;
  }

  valueOf() {
    return this._val;
  }
}

const calc = (init = 0) => new Calculator(init);

// Intermediate states are reusable without side effects
const base = calc(10).add(5); // 15

console.log(base.mul(2).value()); // 30
console.log(base.sub(5).value()); // 10
console.log(base.value());        // 15 (base remains unmutated)

```

---

### Key Interview Takeaways

1. **Returning `this` vs Returning `inner`:** In JavaScript, functions are first-class objects. Attaching properties/methods directly to a function reference (`inner.add = ...`) allows the returned reference to be **both callable with `()` and indexable with `.**`.
2. **Termination:** Infinite currying has no fixed arity (`fn.length`), so it requires an explicit termination mechanism:

* **Explicit method:** `.value()` or `()` with no arguments.
* **Implicit coercion:** Overriding `valueOf` or `Symbol.toPrimitive` so JavaScript converts it to a primitive when used with `+`, `==`, or template strings.

1. **Variadic Inputs:** Using `...args` and `reduce` inside each chained method ensures operations can accept any number of arguments per call (e.g., `.add(1, 2, 3)`).
