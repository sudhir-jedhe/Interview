Type coercion is the automatic or implicit conversion of values from one data type to another (such as converting a string to a number, a object to a boolean, etc.).

JavaScript handles this in two distinct ways:

1. **Explicit Coercion**: When you manually convert a value using built-in constructors or functions (`String()`, `Number()`, `Boolean()`).
2. **Implicit Coercion**: When JavaScript automatically converts types behind the scenes as a side effect of an operation or operator (`+`, `==`, `if()`).

---

## 1. Explicit Type Coercion

Explicit coercion (also called type casting) happens when you write code to intentionally convert a value from one type to another.

### A. To String

Use `String(val)` or `.toString()` to convert values into strings.

```javascript
// Example 1: Numbers to String
console.log(String(123)); // Output: "123"

// Example 2: Booleans to String
console.log(String(true)); // Output: "true"

// Example 3: Null & Undefined to String
console.log(String(null));      // Output: "null"
console.log(String(undefined)); // Output: "undefined"

```

### B. To Number

Use `Number(val)`, `parseInt()`, or `parseFloat()` to convert values into numbers.

```javascript
// Example 1: Numeric strings to Number
console.log(Number("42")); // Output: 42

// Example 2: Non-numeric strings result in NaN
console.log(Number("hello")); // Output: NaN

// Example 3: Booleans and Null to Number
console.log(Number(true));  // Output: 1
console.log(Number(false)); // Output: 0
console.log(Number(null));  // Output: 0

```

### C. To Boolean

Use `Boolean(val)` or the double-NOT operator (`!!`) to convert values into booleans.

```javascript
// Example 1: Falsy values evaluate to false
console.log(Boolean(0));        // Output: false
console.log(Boolean(""));       // Output: false
console.log(Boolean(null));     // Output: false
console.log(Boolean(undefined));// Output: false

// Example 2: Truthy values evaluate to true
console.log(Boolean("hello"));  // Output: true
console.log(Boolean([]));       // Output: true (empty arrays are truthy!)
console.log(Boolean({}));       // Output: true (empty objects are truthy!)

// Example 3: Using double-negation (!!) shortcut
console.log(!!"JS"); // Output: true

```

---

## 2. Implicit Type Coercion

Implicit coercion happens when JavaScript expects one data type, but you provide another, prompting the JS engine to silently convert the value for you.

### A. String Coercion with `+` Operator

When the `+` operator is used with a string, JavaScript converts all other operands into strings and performs concatenation instead of addition.

```javascript
// Example 1: Number + String = String
console.log(5 + "5"); // Output: "55"

// Example 2: Expression order matters (left-to-right)
console.log(5 + 5 + "5"); // Output: "105" (5+5 = 10, then 10 + "5" = "105")

// Example 3: Boolean + String
console.log(true + " is boolean"); // Output: "true is boolean"

```

### B. Numeric Coercion with Mathematical Operators

Arithmetic operators (`-`, `*`, `/`, `%`, `+` unary) convert non-numeric values into numbers.

```javascript
// Example 1: Subtraction converts strings to numbers
console.log("10" - "5"); // Output: 5

// Example 2: Unary plus operator (+) converts string/boolean to number
console.log(+"42"); // Output: 42
console.log(+true); // Output: 1

// Example 3: Multiplication with booleans and null
console.log("6" * "2"); // Output: 12
console.log(true * 5);  // Output: 5 (true becomes 1)
console.log(null * 5);  // Output: 0 (null becomes 0)

```

### C. Boolean Coercion in Logical Contexts

In conditional statements (`if`, `while`, `? :`) or logical operators (`&&`, `||`, `!`), JavaScript converts values into booleans based on whether they are **truthy** or **falsy**.

* **The 8 Falsy values in JS**: `false`, `0`, `-0`, `0n` (BigInt), `""`, `null`, `undefined`, `NaN`.
* Everything else is **Truthy**.

```javascript
// Example 1: Empty string in an if-statement
if ("") {
  console.log("Won't run");
} else {
  console.log("Empty string is falsy!"); // Output: "Empty string is falsy!"
}

// Example 2: Arrays and Objects are ALWAYS truthy
if ([]) {
  console.log("Arrays are truthy!"); // Output: "Arrays are truthy!"
}

// Example 3: Logical OR (||) returning first truthy value
const username = "" || "Guest";
console.log(username); // Output: "Guest"

```

---

## 3. The Loose Equality Operator (`==`) vs Strict Equality (`===`)

The loose equality operator (`==`) applies complex implicit coercion rules if the two operands are of different types. The strict equality operator (`===`) disables coercion and checks both type and value.

```javascript
// Example 1: String vs Number
console.log(5 == "5");  // Output: true (string "5" coerced to number 5)
console.log(5 === "5"); // Output: false (different types)

// Example 2: Boolean vs Number
console.log(1 == true);  // Output: true (true coerced to 1)
console.log(0 == false); // Output: true (false coerced to 0)

// Example 3: Weird Edge Cases with Loose Equality
console.log(null == undefined); // Output: true
console.log("" == 0);            // Output: true
console.log([] == false);        // Output: true ([] -> "" -> 0, false -> 0)

```

---

## Summary Comparison Table

| Scenario                 | Input          | Operation              | Output   | Type of Coercion |
| ------------------------ | -------------- | ---------------------- | -------- | ---------------- |
| **String Concatenation** | `10 + "20"`    | `+` with string        | `"1020"` | Implicit         |
| **Arithmetic**           | `"10" - 5`     | `-` operator           | `5`      | Implicit         |
| **Condition Check**      | `if ("text")`  | Condition context      | `true`   | Implicit         |
| **Loose Equality**       | `0 == ""`      | `==` comparison        | `true`   | Implicit         |
| **Manual Cast**          | `String(10)`   | `String()` constructor | `"10"`   | Explicit         |
| **Manual Number Cast**   | `Number("10")` | `Number()` constructor | `10`     | Explicit         |
| **Double Negation**      | `!!"text"`     | `!!` operator          | `true`   | Explicit         |

Explain how object to primitive coercion works in JavaScript including valueOf, toString, and Symbol.toPrimitive

When JavaScript needs to convert an **Object** into a **Primitive** value (for instance, during string concatenation `obj + ""`, arithmetic `obj - 5`, or logical checks), it follows an algorithm called **ToPrimitive**.

Unlike primitive-to-primitive conversions, objects use internal algorithms (`valueOf`, `toString`, and `Symbol.toPrimitive`) to resolve down to a primitive representation.

---

## The "Hint" Concept

JavaScript determines how to convert an object based on the context, which provides a **hint** about what primitive type is expected:

1. `"string"`: Context expects a string (e.g., `alert(obj)`, `String(obj)`, string template `${obj}`).
2. `"number"`: Context expects a number (e.g., explicit mathematical operations like `obj * 2`, `obj - 1`, `Math.sin(obj)`, or `+obj`).
3. `"default"`: Occurs when the operator is uncertain about the required type (e.g., binary addition `obj1 + obj2`, loose equality `obj == 2`).

---

## 1. The Modern Approach: `Symbol.toPrimitive`

Introduced in ES6, `Symbol.toPrimitive` is a well-known symbol method that overrides all default conversion logic. If present on an object, JavaScript calls this method directly and **bypasses** both `valueOf` and `toString`.

It receives the `hint` ("string", "number", or "default") as an argument.

```javascript
// Example 1: Custom conversion handling for all hints
const user = {
  name: "Alice",
  score: 100,

  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.score;
    if (hint === "string") return `User: ${this.name}`;
    // hint === "default"
    return this.score;
  }
};

console.log(+user);        // Output: 100 (hint: "number")
console.log(`${user}`);    // Output: "User: Alice" (hint: "string")
console.log(user + 50);    // Output: 150 (hint: "default")

```

```javascript
// Example 2: Date object default behavior
const today = new Date();
// Date objects treat the "default" hint as "string"
console.log(today + ""); // Output: Current date as String

```

```javascript
// Example 3: Must return a primitive (throwing error if non-primitive returned)
const badObj = {
  [Symbol.toPrimitive]() {
    return {}; // Throws TypeError because it returned an object, not a primitive!
  }
};

try {
  console.log(+badObj);
} catch (e) {
  console.log(e.name); // Output: "TypeError"
}

```

---

## 2. The Legacy Algorithm: `valueOf` and `toString`

If an object **does NOT** have a `Symbol.toPrimitive` method, JavaScript falls back to calling `valueOf()` and `toString()` in a specific order depending on the hint.

### Algorithm Execution Order

* **For Hint `"string"`:**

1. Call `obj.toString()`. If it returns a primitive, return it.
2. Otherwise, call `obj.valueOf()`. If it returns a primitive, return it.
3. Otherwise, throw a `TypeError`.

* **For Hint `"number"` or `"default"`:**

1. Call `obj.valueOf()`. If it returns a primitive, return it.
2. Otherwise, call `obj.toString()`. If it returns a primitive, return it.
3. Otherwise, throw a `TypeError`.

---

### A. Default Object Methods Behavior

By default, plain JavaScript objects (`{}`) inherit their `toString` and `valueOf` methods from `Object.prototype`:

* `Object.prototype.toString()` returns `"[object Object]"`.
* `Object.prototype.valueOf()` returns the **object itself** (which is non-primitive).

```javascript
// Example 1: Default conversion behavior of plain objects
const plainObj = {};

console.log(plainObj + 5); 
// 1. Hint: "default" -> calls valueOf() -> returns object itself (ignored)
// 2. Fallback to toString() -> returns "[object Object]" (primitive!)
// 3. String concatenation: "[object Object]" + 5
// Output: "[object Object]5"

console.log(+plainObj); 
// 1. Hint: "number" -> calls valueOf() -> returns object (ignored)
// 2. Fallback to toString() -> returns "[object Object]"
// 3. Number("[object Object]") -> Output: NaN

```

---

### B. Customizing `valueOf()` and `toString()`

You can override these methods to customize how older code or plain objects handle coercion.

```javascript
// Example 1: Custom valueOf() for numeric calculations
const wallet = {
  balance: 50,
  valueOf() {
    return this.balance;
  }
};

console.log(wallet * 2); // Output: 100 (Hint "number" calls valueOf())
console.log(wallet + 10); // Output: 60  (Hint "default" calls valueOf())

```

```javascript
// Example 2: Custom toString() for string representation
const person = {
  name: "Bob",
  toString() {
    return this.name;
  }
};

console.log(String(person)); // Output: "Bob" (Hint "string" calls toString())

```

```javascript
// Example 3: Combining valueOf() and toString()
const product = {
  title: "Laptop",
  price: 999,

  toString() {
    return this.title;
  },
  valueOf() {
    return this.price;
  }
};

console.log(`${product}`); // Output: "Laptop" (Hint: "string" -> calls toString())
console.log(product - 100); // Output: 899      (Hint: "number" -> calls valueOf())
console.log(product + "!"); // Output: "999!"   (Hint: "default" -> calls valueOf() first!)

```

---

## Summary Comparison Table

| Mechanism                      | Trigger / Scope                           | Priority          | Recovers From Object Output?                      |
| ------------------------------ | ----------------------------------------- | ----------------- | ------------------------------------------------- |
| **`Symbol.toPrimitive(hint)`** | All hints (`string`, `number`, `default`) | **1st (Highest)** | No (Throws `TypeError` if non-primitive returned) |
| **`valueOf()`**                | Hint `"number"` or `"default"`            | **2nd**           | Yes (Falls back to `toString()`)                  |
| **`toString()`**               | Hint `"string"`                           | **2nd**           | Yes (Falls back to `valueOf()`)                   |
