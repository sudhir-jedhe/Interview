**JavaScript Type Coercion** is the automatic or implicit conversion of a value from one data type to another (for example, converting a string to a number, or an object to a boolean).

JavaScript supports two forms of type conversion:

1. **Explicit Coercion (Type Casting):** You manually convert types using standard functions like `Number()`, `String()`, or `Boolean()`.
2. **Implicit Coercion:** JavaScript automatically converts types behind the scenes as a side effect of operators (`+`, `-`, `==`) or evaluation contexts (`if(...)`).

---

## 1. Implicit Type Coercion Rules

Implicit coercion occurs when an operator or context expects one data type, but receives another.

### A. String Coercion with `+`

If any operand of the `+` operator is a string, JavaScript converts all other operands to strings and performs string concatenation.

```javascript
// Example 1: Number + String
console.log(10 + "20"); // Output: "1020"

// Example 2: Left-to-right evaluation order
console.log(5 + 5 + "5"); // Output: "105" (5 + 5 = 10, then 10 + "5" = "105")

// Example 3: Boolean + String
console.log(true + " is boolean"); // Output: "true is boolean"

```

### B. Numeric Coercion with Arithmetic Operators

Mathematical operators (`-`, `*`, `/`, `%`, unary `+`) attempt to convert non-numeric operands into numbers.

```javascript
// Example 1: Subtraction converts strings to numbers
console.log("20" - "10"); // Output: 10

// Example 2: Unary plus (+) converts strings/booleans to numbers
console.log(+"42"); // Output: 42
console.log(+true); // Output: 1

// Example 3: Arithmetic with null and undefined
console.log(10 + null);      // Output: 10  (null coerces to 0)
console.log(10 + undefined); // Output: NaN (undefined coerces to NaN)

```

### C. Boolean Coercion in Logical Contexts

In conditional statements (`if`, `while`) or logical operators (`&&`, `||`, `!`), values are converted into booleans depending on whether they are **truthy** or **falsy**.

* **The 8 Falsy values in JS:** `false`, `0`, `-0`, `0n` (BigInt), `""` (empty string), `null`, `undefined`, and `NaN`.
* **Everything else is Truthy** (including empty arrays `[]` and empty objects `{}`).

```javascript
// Example 1: Falsy empty string in an if statement
if ("") {
  console.log("Won't run");
} else {
  console.log("Empty string is falsy!"); // Output: "Empty string is falsy!"
}

// Example 2: Arrays are ALWAYS truthy
if ([]) {
  console.log("Empty array is truthy!"); // Output: "Empty array is truthy!"
}

// Example 3: Double negation (!!) forces explicit boolean coercion
console.log(!!"hello"); // Output: true

```

---

## 2. Loose Equality (`==`) vs Strict Equality (`===`)

The **loose equality operator (`==`)** performs implicit type coercion if two operands have different types. The **strict equality operator (`===`)** skips coercion and checks both type and value.

```javascript
// Example 1: String vs Number
console.log(10 == "10");  // Output: true  (string "10" coerced to number 10)
console.log(10 === "10"); // Output: false (different types)

// Example 2: Boolean vs Number
console.log(1 == true);  // Output: true  (true coerced to 1)
console.log(0 == false); // Output: true  (false coerced to 0)

// Example 3: Edge Cases with Loose Equality
console.log(null == undefined); // Output: true
console.log("" == 0);            // Output: true
console.log([] == false);        // Output: true  ([] -> "" -> 0, false -> 0)

```

---

## 3. Object-to-Primitive Coercion

When an Object is used in a numeric or string context, JavaScript runs an internal algorithm called **ToPrimitive** to reduce the object to a primitive value.

It checks these methods in the following order:

1. **`Symbol.toPrimitive(hint)`** (if implemented)
2. **`valueOf()`**
3. **`toString()`**

```javascript
// Example 1: Overriding Symbol.toPrimitive
const wallet = {
  balance: 100,
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.balance;
    if (hint === "string") return `$${this.balance}`;
    return this.balance; // default hint
  }
};

console.log(+wallet);       // Output: 100 (hint: "number")
console.log(`${wallet}`);   // Output: "$100" (hint: "string")
console.log(wallet + 20);   // Output: 120 (hint: "default")

// Example 2: Default plain object conversion
console.log({} + ""); 
// 1. Hint: "default" calls toString() -> "[object Object]"
// Output: "[object Object]"

```

---

## Quick Reference Table

| Expression      | Coerced Result | Rule Applied                                               |
| --------------- | -------------- | ---------------------------------------------------------- |
| `"5" + 2`       | `"52"`         | String concatenation (string takes priority with `+`)      |
| `"5" - 2`       | `3`            | Numeric coercion (`-` converts string to number)           |
| `+"100"`        | `100`          | Unary plus converts string to number                       |
| `1 + true`      | `2`            | `true` coerces to `1`                                      |
| `1 + null`      | `1`            | `null` coerces to `0`                                      |
| `1 + undefined` | `NaN`          | `undefined` coerces to `NaN`                               |
| `!!"text"`      | `true`         | Non-empty string is truthy                                 |
| `[] == false`   | `true`         | Array coerced to `""`, then to `0`; `false` coerced to `0` |
