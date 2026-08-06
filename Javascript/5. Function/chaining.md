To implement custom chaining in JavaScript, the key is to ensure that each method returns the same instance of the object (i.e., `this`). This allows you to chain method calls together, as demonstrated in the calculator example you provided. The structure of your `ComputeAmount` function is already well-suited for chaining, but I can explain and refine it further to ensure clarity and correctness.

Let's break down both examples and the key concepts behind them.

### 1. **Calculator Example**
In the first example, we implement a simple calculator class with methods for adding, subtracting, and returning the value.

#### Key Points:
- **Class-based Approach**: We use a class (`Calculator`) to hold the accumulator (the running total of the calculations).
- **Chaining**: Each method (`add`, `sub`) returns the instance (`this`), so you can call them in a chain like `.add(5).sub(4)`.
- **Final Value**: The `.val()` method returns the final accumulated result.

#### Code:

```javascript
class Calculator {
  constructor(initialValue) {
    this.accumulator = initialValue; // Initialize with the starting value
  }

  add(num) {
    this.accumulator += num; // Add the number to the accumulator
    return this; // Return the current instance to allow chaining
  }

  sub(num) {
    this.accumulator -= num; // Subtract the number from the accumulator
    return this; // Return the current instance to allow chaining
  }

  val() {
    return this.accumulator; // Return the final accumulated value
  }
}

function cal(initialValue) {
  return new Calculator(initialValue); // Start a new Calculator with the initial value
}

var result = cal(2).add(5).sub(4).val(); // Chaining the methods
console.log("Result is : ", result); // Output: 3 (2 + 5 - 4)
```

#### Explanation:
- `cal(2)` creates a new `Calculator` instance with an initial value of `2`.
- `.add(5)` adds 5 to the accumulator (`2 + 5 = 7`).
- `.sub(4)` subtracts 4 from the accumulator (`7 - 4 = 3`).
- `.val()` returns the final value (`3`).

### 2. **ComputeAmount Example**
In the second example, we define an object with methods for adding amounts in different units (crore, lac, thousand, etc.). The design pattern is similar to the calculator but focuses on large number computations (crore, lac, thousand, etc.).

#### Key Points:
- **Method Chaining**: Each method (`crore`, `lacs`, `thousand`, etc.) modifies the `store` and returns the object itself (`this`), allowing chaining.
- **Units Handling**: We multiply the value by powers of 10 (i.e., crore = `10^7`, lac = `10^5`, etc.).
- **Final Value**: The `.value()` method returns the total value after all operations.

#### Code:

```javascript
const ComputeAmount = function () {
  this.store = 0; // Initialize the store with 0

  this.crore = function (val) {
    this.store += val * Math.pow(10, 7); // 1 crore = 10^7
    return this; // Return this instance for chaining
  };

  this.lacs = function (val) {
    this.store += val * Math.pow(10, 5); // 1 lac = 10^5
    return this; // Return this instance for chaining
  };

  this.thousand = function (val) {
    this.store += val * Math.pow(10, 3); // 1 thousand = 10^3
    return this; // Return this instance for chaining
  };

  this.hundred = function (val) {
    this.store += val * Math.pow(10, 2); // 1 hundred = 10^2
    return this; // Return this instance for chaining
  };

  this.ten = function (val) {
    this.store += val * 10; // 1 ten = 10
    return this; // Return this instance for chaining
  };

  this.unit = function (val) {
    this.store += val; // Add the unit value directly
    return this; // Return this instance for chaining
  };

  this.value = function () {
    return this.store; // Return the final accumulated value
  };
};

// Usage Example 1
const amount = new ComputeAmount().lacs(9).lacs(1).thousand(10).ten(1).unit(1).value();
console.log(amount === 1010011); // true

// Usage Example 2
const amount2 = new ComputeAmount()
  .lacs(15)
  .crore(5)
  .crore(2)
  .lacs(20)
  .thousand(45)
  .crore(7)
  .value();
console.log(amount2 === 143545000); // true
```

#### Explanation:
- `ComputeAmount()` initializes `store` to `0`.
- `.crore(5)` adds `5 * 10^7` to `store`.
- `.lacs(15)` adds `15 * 10^5` to `store`.
- `.thousand(45)` adds `45 * 10^3` to `store`.
- The `.value()` method returns the total calculated value.

### Refactoring and Enhancements:

In both examples, the design uses method chaining effectively by returning the object itself (`this`) after each method call. This allows multiple operations to be chained together in a concise manner.

You could make the code more extensible by adding more unit methods, validation, or supporting more complex operations.

For example, adding more units like `million`, `billion`, etc., or even other mathematical operations in the calculator (like `multiply`, `divide`, etc.), could make the system more robust and flexible.

### Conclusion:
Both examples demonstrate how to implement method chaining in JavaScript using object-oriented principles (via classes or functions). The key to achieving chaining is returning the current instance of the object (`this`) after each method call, allowing multiple method calls to be chained together.