Both code snippets you've provided showcase how **method chaining** can be implemented in JavaScript. Method chaining is the process of calling multiple methods on the same object in a single statement. The key concept here is that each method returns the object itself (using `this`), which allows for the chaining of subsequent method calls.

Let's go over each example in detail and explain how they work:

### Example 1: Using Object Literal Syntax

```javascript
const calculator = {
  total: 0,
  add: function(val) {
    this.total += val;
    return this; // return the calculator object to enable chaining
  },
  subtract: function(val) {
    this.total -= val;
    return this; // return the calculator object to enable chaining
  },
  divide: function(val) {
    this.total /= val;
    return this; // return the calculator object to enable chaining
  },
  multiply: function(val) {
    this.total *= val;
    return this; // return the calculator object to enable chaining
  }
};

calculator.add(10).subtract(2).divide(2).multiply(5);
console.log(calculator.total); // Output: 20
```

### Explanation of the Object Literal Approach:
1. **Object Definition**: The `calculator` is an object with a `total` property and four methods (`add`, `subtract`, `divide`, and `multiply`).
2. **Method Chaining**: Each method modifies the `total` property of the object and returns `this`. Returning `this` allows the object to be used again for the next method call, enabling method chaining.
3. **Execution**: 
   - `add(10)` adds `10` to `total` (making it `10`).
   - `subtract(2)` subtracts `2` from `total` (making it `8`).
   - `divide(2)` divides `total` by `2` (making it `4`).
   - `multiply(5)` multiplies `total` by `5` (making it `20`).
4. **Final Output**: After the chain of operations, the final `total` is `20`, which is printed to the console.

### Example 2: Using a Constructor Function

```javascript
const CALC = function() {
  this.total = 0;

  this.add = (val) => {
    this.total += val;
    return this; // return the current instance of CALC to enable chaining
  }

  this.subtract = (val) => {
    this.total -= val;
    return this; // return the current instance of CALC to enable chaining
  }

  this.multiply = (val) => {
    this.total *= val;
    return this; // return the current instance of CALC to enable chaining
  }

  this.divide = (val) => {
    this.total /= val;
    return this; // return the current instance of CALC to enable chaining
  }

  this.value = () => this.total; // Return the final total
}

const calculator = new CALC();
calculator.add(10).subtract(2).divide(2).multiply(5);
console.log(calculator.total); // Output: 20
```

### Explanation of the Constructor Function Approach:
1. **Constructor Function**: `CALC` is a constructor function, used to create instances of the calculator. It initializes `total` to `0` and provides methods (`add`, `subtract`, `multiply`, `divide`) that modify `total`.
2. **Arrow Functions**: The methods (`add`, `subtract`, etc.) are defined using arrow functions. Arrow functions preserve the `this` value from their surrounding context, which is particularly useful here because `this` refers to the current instance of `CALC`.
3. **Method Chaining**: Each method modifies `this.total` and returns `this` (the current instance of the object). Returning `this` allows us to chain method calls.
4. **Execution**: 
   - `add(10)` adds `10` to `total` (making it `10`).
   - `subtract(2)` subtracts `2` from `total` (making it `8`).
   - `divide(2)` divides `total` by `2` (making it `4`).
   - `multiply(5)` multiplies `total` by `5` (making it `20`).
5. **Final Output**: The final value of `total` is `20`, which is printed to the console.

### Key Differences:
- **Object Literal vs Constructor Function**: 
  - In the first example, the `calculator` object is defined using an object literal.
  - In the second example, the `CALC` function is a constructor that creates instances using the `new` keyword.
- **Arrow Functions**: The second example uses **arrow functions** (`() => {}`) for methods inside the `CALC` constructor, which automatically binds `this` to the instance of the object. This avoids potential issues with the traditional function expressions in the first example (where `this` would need to be bound manually in certain contexts).
  
### Conclusion:
- **Method chaining** in JavaScript is a powerful pattern that allows multiple methods to be invoked sequentially on the same object.
- Both the object literal and constructor function approaches allow method chaining by returning `this` from each method.
- **Arrow functions** are particularly helpful in maintaining the correct `this` binding in methods, as seen in the second example.