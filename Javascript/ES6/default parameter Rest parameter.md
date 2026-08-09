Both **Default Parameters** and **Rest Parameters** were introduced in ES6 to streamline how JavaScript functions handle input arguments.

* **Default Parameters:** Provide fallback values when arguments are missing or `undefined`.
* **Rest Parameters:** Gather multiple incoming arguments into a single real Array.

---

## 1. Default Parameters

Default parameters allow you to initialize function parameters with default values if no value or `undefined` is passed.

### Basic Syntax

```javascript
function greet(name = 'Guest', role = 'User') {
  console.log(`Hello ${name}, your role is ${role}.`);
}

greet('Sudhir', 'Developer'); // "Hello Sudhir, your role is Developer."
greet('Kishori');            // "Hello Kishori, your role is User."
greet();                     // "Hello Guest, your role is User."

```

### Key Behaviors & Edge Cases

#### 1. `undefined` vs `null`

Default parameters are triggered **only when the argument is `undefined` or omitted**. Passing `null` or `0` counts as a valid value and will **not** trigger the default.

```javascript
function showPrice(price = 100) {
  console.log(price);
}

showPrice(undefined); // 100 (Triggers default)
showPrice(null);      // null (Does NOT trigger default)
showPrice(0);         // 0 (Does NOT trigger default)

```

#### 2. Expressions and Other Parameters as Defaults

Default values can be dynamic expressions, function calls, or can even reference previous parameters declared to their left.

```javascript
function calculateTotal(price, tax = price * 0.18) {
  return price + tax;
}

console.log(calculateTotal(100)); // 118 (100 + 18)

```

---

## 2. Rest Parameters

The Rest parameter syntax (`...`) allows a function to accept an indefinite number of arguments as a real JavaScript Array.

### Basic Syntax

```javascript
function sumAll(...numbers) {
  // 'numbers' is a true Array, so we can use array methods like .reduce()
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sumAll(10, 20, 30, 40)); // 100

```

### Key Rules

1. **Must be the Last Parameter:** You cannot place additional parameters after a rest parameter.

```javascript
// ❌ SyntaxError: Rest parameter must be last formal parameter
// function wrong(a, ...rest, b) {} 

// ✅ Correct
function correct(lead, ...teamMembers) {
  console.log(`Lead: ${lead}, Team: ${teamMembers.join(', ')}`);
}

```

1. **Only One Rest Parameter Allowed:** You cannot have multiple rest parameters in a single function signature.

---

## Combining Default and Rest Parameters

You can combine both in the same function definition. Follow this ordering rule in your parameter list:

1. **Standard parameters**
2. **Default parameters**
3. **Rest parameters (always last)**

```javascript
function processOrder(orderId, status = 'Pending', ...items) {
  console.log(`Order ID: ${orderId}`);
  console.log(`Status: ${status}`);
  console.log(`Items (${items.length}):`, items);
}

processOrder(101, 'Shipped', 'Laptop', 'Mouse', 'Keyboard');
// Output:
// Order ID: 101
// Status: Shipped
// Items (3): ['Laptop', 'Mouse', 'Keyboard']

processOrder(102, undefined, 'Phone');
// Output:
// Order ID: 102
// Status: Pending (Default used)
// Items (1): ['Phone']

```
