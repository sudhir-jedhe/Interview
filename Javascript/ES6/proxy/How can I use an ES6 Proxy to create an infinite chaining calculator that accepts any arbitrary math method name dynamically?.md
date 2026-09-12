Using an **ES6 `Proxy**` with both a `get` trap (to intercept method names dynamically) and an `apply` trap (to allow direct invocation like a function) lets you build an infinite chaining calculator. It can dynamically map arbitrary method names to custom arithmetic operators or standard `Math.*` functions without explicitly defining every method.

---

### Implementation

```javascript
function createDynamicCalculator(initialValue = 0) {
  // Common math operation aliases
  const operations = {
    add: (a, b) => a + b,
    plus: (a, b) => a + b,
    sub: (a, b) => a - b,
    minus: (a, b) => a - b,
    mul: (a, b) => a * b,
    times: (a, b) => a * b,
    div: (a, b) => a / b,
    divide: (a, b) => a / b,
    mod: (a, b) => a % b,
    pow: (a, b) => Math.pow(a, b),
  };

  function createProxy(currentValue) {
    // The target is a dummy function so the proxy itself can be invoked with ()
    const targetFn = function () {};

    return new Proxy(targetFn, {
      // 1. Direct function call: calc(5)(10) -> adds by default
      apply(target, thisArg, args) {
        if (args.length === 0) return currentValue;
        const nextValue = args.reduce((acc, n) => acc + n, currentValue);
        return createProxy(nextValue);
      },

      // 2. Dynamic property/method access: calc.add(5), calc.sqrt(), calc.value
      get(target, prop, receiver) {
        // Explicit value extraction
        if (prop === 'value') {
          return () => currentValue;
        }

        // Implicit type coercion (e.g. +calc, `${calc}`, calc == 10)
        if (prop === Symbol.toPrimitive) {
          return (hint) => (hint === 'string' ? String(currentValue) : currentValue);
        }
        if (prop === 'valueOf') {
          return () => currentValue;
        }
        if (prop === 'toString') {
          return () => String(currentValue);
        }

        // Intercept any dynamic method call
        return function (...args) {
          // Case A: Custom operation aliases (add, sub, mul, etc.)
          if (operations[prop]) {
            const nextValue = args.reduce(
              (acc, n) => operations[prop](acc, n),
              currentValue
            );
            return createProxy(nextValue);
          }

          // Case B: Standard JavaScript Math methods (sqrt, sin, cos, floor, etc.)
          if (typeof Math[prop] === 'function') {
            // Evaluates Math[prop](currentValue, ...args)
            const nextValue = Math[prop](currentValue, ...args);
            return createProxy(nextValue);
          }

          throw new TypeError(`Unknown operation or Math method: "${String(prop)}"`);
        };
      },
    });
  }

  return createProxy(initialValue);
}

```

---

### How It Works

1. **Dual Traps (`get` and `apply`):**

* The underlying proxy target is an empty function `function () {}`. This enables the **`apply`** trap, allowing direct calls like `calc(5)(10)`.
* The **`get`** trap intercepts *any* property name accessed on the object.

1. **Fallback to native `Math` methods:**

* If a method isn't in the explicit `operations` dictionary, the `get` trap checks `typeof Math[prop] === 'function'`.
* Methods like `.sqrt()`, `.round()`, `.abs()`, or `.pow()` work immediately without extra boilerplate.

1. **Immutability:**

* Every operation invokes `createProxy(nextValue)`. This means each link in the chain creates a new immutable instance, preventing side effects and mutation bugs.

1. **Multiple Resolution Strategies:**

* `.value()` for explicit return.
* `()` with no arguments for functional termination.
* `Symbol.toPrimitive` / `valueOf` for automatic arithmetic/string coercion.

---

### Examples & Test Cases

#### 1. Arbitrary Arithmetic & Math Methods

```javascript
const calc = createDynamicCalculator(10);

const result = calc
  .add(5, 5)     // 10 + 5 + 5 = 20
  .minus(4)      // 20 - 4 = 16
  .sqrt()        // Math.sqrt(16) = 4
  .pow(3)        // Math.pow(4, 3) = 64
  .times(2)      // 64 * 2 = 128
  .value();

console.log(result); // 128

```

#### 2. Hybrid Currying with `()` and Chained Names

```javascript
const c = createDynamicCalculator(2);

// Interleaving parentheses and dynamic properties
const val = c(3)(5).mul(2).sub(4)(10)();
// (((2 + 3 + 5) * 2) - 4) + 10 = 26
console.log(val); // 26

```

#### 3. Automatic Type Coercion

```javascript
const total = createDynamicCalculator(100).div(2).add(25);

console.log(+total);             // 75 (calls Symbol.toPrimitive with 'number')
console.log(total + 5);          // 80
console.log(`Final: ${total}`);  // "Final: 75" (calls Symbol.toPrimitive with 'string')

```

#### 4. Immutability / Branching

```javascript
const base = createDynamicCalculator(10).add(10); // 20

const branchA = base.mul(2).value(); // 40
const branchB = base.sub(5).value(); // 15

console.log(base.value()); // 20 (base remains unchanged)
console.log(branchA);      // 40
console.log(branchB);      // 15

```
