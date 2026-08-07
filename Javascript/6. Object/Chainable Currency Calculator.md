A **Chainable Currency Calculator** is a popular JavaScript interview question that tests:

- Closures
- Method chaining
- Fluent API design
- Object-oriented JavaScript
- Function currying (advanced version)

---

# Expected Usage

```js
const result = Currency(100).add(50).subtract(20).multiply(2).divide(5).value();

console.log(result); // 52
```

---

# Solution 1: Closure-Based Implementation

```js
function Currency(initialAmount = 0) {
  let amount = initialAmount;

  return {
    add(value) {
      amount += value;
      return this;
    },

    subtract(value) {
      amount -= value;
      return this;
    },

    multiply(value) {
      amount *= value;
      return this;
    },

    divide(value) {
      if (value === 0) {
        throw new Error("Cannot divide by zero");
      }

      amount /= value;
      return this;
    },

    value() {
      return amount;
    },
  };
}
```

### Usage

```js
const total = Currency(100).add(50).subtract(10).multiply(2).divide(4).value();

console.log(total);
```

Output:

```js
70;
```

Calculation:

```text
100 + 50 = 150
150 - 10 = 140
140 * 2 = 280
280 / 4 = 70
```

---

# Solution 2: Class-Based Implementation

This is often preferred in enterprise applications.

```js
class CurrencyCalculator {
  constructor(amount = 0) {
    this.amount = amount;
  }

  add(value) {
    this.amount += value;
    return this;
  }

  subtract(value) {
    this.amount -= value;
    return this;
  }

  multiply(value) {
    this.amount *= value;
    return this;
  }

  divide(value) {
    if (value === 0) {
      throw new Error("Division by zero");
    }

    this.amount /= value;
    return this;
  }

  value() {
    return this.amount;
  }
}
```

### Usage

```js
const result = new CurrencyCalculator(100)
  .add(50)
  .subtract(20)
  .multiply(2)
  .divide(5)
  .value();

console.log(result); // 52
```

---

# Advanced Currency Support

Interviewers often extend the question:

```js
Currency(100, "USD").add(50).convert("INR").value();
```

---

### Example

```js
const rates = {
  USD: 1,
  INR: 83,
  EUR: 0.92,
};

class CurrencyCalculator {
  constructor(amount, currency = "USD") {
    this.amount = amount;
    this.currency = currency;
  }

  add(value) {
    this.amount += value;
    return this;
  }

  subtract(value) {
    this.amount -= value;
    return this;
  }

  convert(toCurrency) {
    const usdAmount = this.amount / rates[this.currency];

    this.amount = usdAmount * rates[toCurrency];

    this.currency = toCurrency;

    return this;
  }

  value() {
    return {
      amount: Number(this.amount.toFixed(2)),
      currency: this.currency,
    };
  }
}
```

### Usage

```js
const result = new CurrencyCalculator(100, "USD")
  .add(50)
  .convert("INR")
  .value();

console.log(result);
```

Output:

```js
{
  amount: 12450,
  currency: "INR"
}
```

---

# TypeScript Version

```ts
class CurrencyCalculator {
  private amount: number;

  constructor(amount = 0) {
    this.amount = amount;
  }

  add(value: number): this {
    this.amount += value;
    return this;
  }

  subtract(value: number): this {
    this.amount -= value;
    return this;
  }

  multiply(value: number): this {
    this.amount *= value;
    return this;
  }

  divide(value: number): this {
    if (value === 0) {
      throw new Error("Division by zero");
    }

    this.amount /= value;
    return this;
  }

  value(): number {
    return this.amount;
  }
}
```

---

# Interview Follow-Up: Immutable Version

Instead of mutating state:

```js
Currency(100).add(20).add(30);
```

each operation returns a new instance.

```js
class Currency {
  constructor(amount) {
    this.amount = amount;
  }

  add(value) {
    return new Currency(this.amount + value);
  }

  subtract(value) {
    return new Currency(this.amount - value);
  }

  value() {
    return this.amount;
  }
}
```

This follows the same principle as:

- Redux reducers
- Functional programming
- React state immutability

---

# Senior Frontend Interview Talking Points

Explain that the chainable API works because:

```js
return this;
```

returns the current instance, allowing the next method in the chain to execute.

```js
calculator.add(10).subtract(5).multiply(2);
```

is internally equivalent to:

```js
calculator.add(10);
calculator.subtract(5);
calculator.multiply(2);
```

but provides a more readable **fluent interface**, similar to:

- Jest (`expect().toBe()`)
- Cypress (`cy.get().click()`)
- Lodash (`_.chain()`)
- Playwright (`page.locator().click()`)

This is usually the level of explanation expected in a Senior React/JavaScript interview.

Here's my take: A **Chainable Currency Calculator** is a classic senior JavaScript interview problem because it forces you to design a **Fluent API** while maintaining clean state encapsulated inside closures or object instances.

Below is a complete guide covering the standard implementation, rate conversion, step-by-step method chaining, and the advanced curried version.

---

### 1. Standard Implementation (Fluent API Pattern)

The key to method chaining in JavaScript is that **every method must return `this**` (or return the wrapper object) so the next method call can be executed on the result.

```javascript
class CurrencyCalculator {
  constructor(initialAmount = 0, currency = "USD") {
    this.amount = initialAmount;
    this.currency = currency;
  }

  // Method to add money
  add(val) {
    this.amount += val;
    return this; // Enables chaining!
  }

  // Method to subtract money
  subtract(val) {
    this.amount -= val;
    return this;
  }

  // Method to multiply money
  multiply(factor) {
    this.amount *= factor;
    return this;
  }

  // Method to format as human-readable string
  format(locale = "en-US") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this.currency,
    }).format(this.amount);
  }

  // Value getter / Terminal call
  valueOf() {
    return this.amount;
  }
}

// Factory helper function for concise syntax
const calc = (amount, currency) => new CurrencyCalculator(amount, currency);

// Usage
const result = calc(100, "USD").add(50).subtract(20).multiply(2).format();

console.log(result); // "$260.00"
```

---

### 2. Functional / Closure-Based Version (Without `this` or `class`)

Interviewer constraint: _"Can you implement this using pure functions and closures without using the `class` or `this` keywords?"_

```javascript
function createCurrencyCalculator(initialAmount = 0, currency = "USD") {
  let amount = initialAmount; // Private state held in closure

  const api = {
    add(val) {
      amount += val;
      return api; // Return the closure object
    },
    subtract(val) {
      amount -= val;
      return api;
    },
    multiply(factor) {
      amount *= factor;
      return api;
    },
    format(locale = "en-US") {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(amount);
    },
    value() {
      return amount;
    },
  };

  return api;
}

// Usage
const total = createCurrencyCalculator(50, "EUR")
  .add(100)
  .multiply(1.5)
  .format("de-DE");

console.log(total); // "225,00 €"
```

---

### 3. Advanced Level: Rate Conversion + Multi-Currency Chaining

Senior-level extension: _"How would you handle converting currencies mid-chain?"_

```javascript
class MultiCurrencyCalculator {
  constructor(amount = 0, currency = "USD") {
    this.amount = amount;
    this.currency = currency;

    // Fixed exchange rates relative to USD (1 USD = X)
    this.rates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.78,
      INR: 83.5,
    };
  }

  // Add an amount in a different currency!
  add(val, valCurrency = this.currency) {
    const valInUSD = val / this.rates[valCurrency];
    const valInTarget = valInUSD * this.rates[this.currency];
    this.amount += valInTarget;
    return this;
  }

  // Convert the whole running balance to a new currency
  convertTo(targetCurrency) {
    if (!this.rates[targetCurrency]) {
      throw new Error(`Unsupported currency: ${targetCurrency}`);
    }
    // Convert current amount to USD, then to target currency
    const amountInUSD = this.amount / this.rates[this.currency];
    this.amount = amountInUSD * this.rates[targetCurrency];
    this.currency = targetCurrency;
    return this;
  }

  format() {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this.currency,
    }).format(this.amount);
  }
}

// Usage: Start with $100 USD, add €50 EUR, then convert the whole sum to GBP
const formattedTotal = new MultiCurrencyCalculator(100, "USD")
  .add(50, "EUR") // Adds €50 converted to USD ($54.34)
  .convertTo("GBP") // Converts total ($154.34) into GBP
  .format();

console.log(formattedTotal); // "£120.38"
```

---

### 4. Hard Mode: Curried Infinite Chaining with `valueOf()`

Advanced interview question: _"Write a function `calc(10)(20)(30)` that can be invoked indefinitely and automatically evaluates to its numeric value when used in math expressions."_

```javascript
function curriedCalc(initialVal = 0) {
  let sum = initialVal;

  function fn(nextVal) {
    if (nextVal !== undefined) {
      sum += nextVal;
      return fn; // Return function itself for infinite invocation
    }
    return sum;
  }

  // Override valueOf / toString for implicit type coercion
  fn.valueOf = () => sum;
  fn.toString = () => String(sum);

  return fn;
}

// Invocation
console.log(curriedCalc(10)(20)(30) + 0); // 60
console.log(curriedCalc(5)(15) * 2); // 40
```

---

### Key Interview Evaluation Criteria

| Concept Evaluated                    | Why It Matters                                                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **`return this` / Returning Object** | Demonstrates understanding of how fluent interfaces and method chaining operate under the hood.                   |
| **Closure State Retention**          | Shows how to maintain state privately without global namespace pollution.                                         |
| **`Intl.NumberFormat`**              | Demonstrates knowledge of native JS browser APIs for currency/locale formatting over crude string concatenations. |
| **Implicit Coercion (`valueOf`)**    | Tests deep understanding of JavaScript's prototype chain and primitive type conversion algorithms.                |

Here's my take: Method chaining and fluent APIs aren't just interview puzzles—they are the architectural backbone of almost every popular testing framework, utility library, and automation tool developers use every day.

Looking at your list, each tool uses chaining to solve a specific problem in a distinct way:

---

### 1. **Jest / Testing Frameworks (`expect().toBe()`)**

- **Pattern:** Assertion Builder
- **Why it uses chaining:** Readability. Tests are meant to read like natural English sentences (`expect(user).toBeDefined()`).
- **Under the Hood:** Calling `expect(actualValue)` returns an **Assertion Object** populated with matcher methods (`toBe`, `toEqual`, `toContain`). Each matcher performs an evaluation and throws an error if the assertion fails.

```javascript
// How Jest's expect() works under the hood
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but received ${actual}`);
      }
      return true;
    },
    not: {
      toBe(expected) {
        if (actual === expected) {
          throw new Error(`Expected not ${expected}`);
        }
        return true;
      },
    },
  };
}

// Usage
expect(5).toBe(5); // Passes
```

---

### 2. **Cypress (`cy.get().click()`)**

- **Pattern:** Async Command Queue (Chained Promises)
- **Why it uses chaining:** E2E testing involves sequential browser actions (`Find element` $\rightarrow$ `Type text` $\rightarrow$ `Click button` $\rightarrow$ `Assert URL`).
- **Under the Hood:** Cypress commands are **not synchronous**. When you chain `cy.get().click().should()`, Cypress isn't running them immediately; it is pushing commands into a managed execution queue. Each command passes its subject (e.g., the DOM element found by `get`) to the next chained command in the queue.

```javascript
// Simplified Cypress Command Queue model
class CypressRunner {
  constructor() {
    this.queue = [];
    this.subject = null;
  }

  get(selector) {
    this.queue.push(() => {
      this.subject = document.querySelector(selector);
      return this.subject;
    });
    return this; // Enables chaining
  }

  click() {
    this.queue.push(() => {
      if (this.subject) this.subject.click();
      return this.subject;
    });
    return this;
  }

  // Executes the chained queue sequentially
  run() {
    return this.queue.reduce((promise, task) => {
      return promise.then(task);
    }, Promise.resolve());
  }
}
```

---

### 3. **Lodash (`_.chain()`)**

- **Pattern:** Lazy Evaluation Wrapper / Collection Transformer
- **Why it uses chaining:** To allow multiple array/object transformations (filtering, mapping, sorting) in a single pipeline without needing temporary variables.
- **Under the Hood:** Calling `_.chain(data)` wraps your raw array inside a `LodashWrapper` object. Each method call updates the wrapped value and returns the wrapper. The chain **only resolves when you explicitly call `.value()**` (terminal method).

```javascript
// Simplified Lodash _.chain implementation
function chain(value) {
  const wrapper = {
    _value: value,
    map(fn) {
      this._value = this._value.map(fn);
      return this; // Return wrapper for chaining
    },
    filter(fn) {
      this._value = this._value.filter(fn);
      return this;
    },
    value() {
      return this._value; // Terminal call to unwrap final data
    },
  };
  return wrapper;
}

// Usage
const result = chain([1, 2, 3, 4, 5])
  .filter((x) => x % 2 === 0)
  .map((x) => x * 10)
  .value(); // [20, 40]
```

---

### 4. **Playwright (`page.locator().click()`)**

- **Pattern:** Deferred Selector & Auto-Waiting Proxy
- **Why it uses chaining:** To make locators reusable and lazily evaluated.
- **Under the Hood:** Unlike older tools like Selenium, `page.locator('.btn')` in Playwright doesn't search the DOM immediately. It creates a **Locator object** that stores the selector criteria. Calling `.click()` executes auto-waiting (checking if the element is visible, enabled, and stable) right before executing the action.

```javascript
// Conceptual Playwright Locator structure
class Locator {
  constructor(page, selector) {
    this.page = page;
    this.selector = selector;
  }

  // Sub-locator chaining: page.locator('form').locator('button')
  locator(subSelector) {
    return new Locator(this.page, `${this.selector} ${subSelector}`);
  }

  async click() {
    // 1. Auto-wait for element to exist & be actionable
    const element = await this.page.waitForElement(this.selector);
    // 2. Perform click
    await element.click();
  }
}
```

---

### Comparison of Chaining Architectural Goals

| Library        | Primary Architectural Goal              | How Chain Terminates                         |
| -------------- | --------------------------------------- | -------------------------------------------- |
| **Jest**       | Human-readable assertions               | Throws error or passes implicitly            |
| **Cypress**    | Managed async command queueing          | Internal runner processes queue              |
| **Lodash**     | Data transformation pipeline            | Explicit `.value()` call                     |
| **Playwright** | Lazy element locating with auto-waiting | Async action promise (e.g. `await .click()`) |

Using a JavaScript **`Proxy`** allows you to intercept property lookups and dynamically return functions on the fly, entirely bypassing the need to predefine methods.

This technique is frequently used for building query builders, styling wrappers, or mock utility APIs where method names aren't known ahead of time.

---

### Dynamic Method Chaining Implementation

The core trick relies on the **`get` trap** of a `Proxy`. Whenever any method (like `.anything()`) is accessed, the proxy intercepts the call, returns an executable function that mutates state, and then returns **itself** (wrapped in the proxy again) to maintain the chain.

```javascript
function createDynamicCalculator(initialValue = 0) {
  const state = {
    value: initialValue,
    operations: []
  };

  const handler = {
    get(target, prop) {
      // 1. If the user calls .value(), exit the chain and return the final result
      if (prop === "valueOf" || prop === "getValue") {
        return () => target.value;
      }

      // 2. Dynamically return a function for ANY method name called
      return function (...args) {
        // Record or execute the operation dynamically based on the method name (`prop`)
        target.operations.push({ method: prop, args });

        // Perform basic mock math operations based on the method name dynamically
        if (prop === "add") target.value += args[0];
        if (prop === "subtract") target.value -= args[0];
        if (prop === "multiply") target.value *= args[0];
        if (prop === "divide") target.value /= args[0];

        // 3. Return the proxy object itself to keep the method chain alive
        return new Proxy(target, handler);
      };
    }
  };

  return new Proxy(state, handler);
}

```

---

### Usage Example

Notice that methods like `.add()`, `.multiply()`, or even completely custom methods like `.customOperation()` can be chained seamlessly without writing explicit class definitions for them:

```javascript
const calc = createDynamicCalculator(10);

const result = calc
  .add(30)       // 10 + 30 = 40
  .multiply(3)   // 40 * 3 = 120
  .subtract(20)  // 120 - 20 = 100
  .divide(4)     // 100 / 4 = 25
  .getValue();   // Terminal method to unwrap

console.log(result); // 25

```

---

### How It Works Under the Hood

1. **Trap Interception (`get`)**: When you invoke `.add(30)` on the proxy, JavaScript triggers the `get` trap where `prop` equals `"add"`.
2. **Dynamic Function Generation**: Instead of checking if an `add` method exists on an object, the trap dynamically returns a wrapper function that accepts arguments (`...args`).
3. **Maintaining the Chain**: That wrapper function executes the logic and returns `new Proxy(target, handler)` (the proxy instance), allowing the next dot-notation call to execute immediately.

[Learn JS METHOD CHAINING in 5 minutes!](https://www.youtube.com/watch?v=J4YhlDsNqeE)

This video provides a quick foundational look at how standard method chaining works sequentially in JavaScript code.
