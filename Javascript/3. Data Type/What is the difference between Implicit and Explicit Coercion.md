**Implicit Coercion** is a way of converting values to another type without us programmer doing it directly or by hand.

Suppose we have an example below.

```js
console.log(1 + "6");
console.log(false + true);
console.log(6 * "2");
```

The first console.log statement logs 16. In other languages this would throw a compile time error but in JavaScript the 1 is converted to a string then concatenated with the + operator.

We did not do anything, yet it was converted automatically by JavaScript for us.

The second console.log statement logs 1, it converts the false to a boolean which will result to a 0 and the true will be 1 hence the result is 1.

The third console.log statement logs 12, it converts the '2' to a number before multiplying 6 \* 2 hence the result 12.
JavaScript Coercion Rules

While Explicit Coercion is the way of converting values to another type where we (programmers) explicitly do it.

```js
console.log(1 + parseInt("6"));
```

In this example, we use the parseInt function to convert the '6' to a number then adding the 1 and 6 using the + operator.

In JavaScript, **type coercion** is the automatic or manual conversion of a value from one data type to another (such as a string to a number, or a boolean to a string).

The difference between **implicit** and **explicit coercion** comes down to whether the language does it automatically behind the scenes or you intentionally write code to convert it.

---

### 1. Explicit Coercion (Developer-Driven)

**Explicit coercion** happens when you intentionally convert a value from one type to another using built-in functions, constructors, or standard methods. It makes your intent clear to anyone reading the code.

#### Common Examples:

```javascript
// 1. String to Number
const str = "42";
const num = Number(str); // 42 (explicit)
const parsed = parseInt(str); // 42 (explicit)

// 2. Anything to String
const val = 123;
const text = String(val); // "123" (explicit)
const text2 = val.toString(); // "123" (explicit)

// 3. Anything to Boolean
const isTrue = Boolean(1); // true (explicit)
```

---

### 2. Implicit Coercion (Engine-Driven)

**Implicit coercion** happens when JavaScript automatically converts a type under the hood because the operator or statement expects a different type to complete the operation.

#### Common Examples:

- **String Concatenation (`+` with a string):**
  If one operand is a string, the `+` operator coerces the other operand to a string.

```javascript
console.log("5" + 2); // "52" (Number 2 is implicitly coerced to String "2")
```

- **Numeric Operations (`-`, `*`, `/`, `%`):**
  Mathematical operators (other than `+` when strings are present) convert strings or booleans to numbers.

```javascript
console.log("10" - 2); // 8  (String "10" is implicitly coerced to Number 10)
console.log("5" * "2"); // 10 (Both strings coerced to Numbers)
```

- **Loose Equality (`==`):**
  The loose equality operator compares values after implicitly converting them to a common type.

```javascript
console.log("5" == 5); // true (String "5" is coerced to Number 5)
console.log(false == 0); // true (false is coerced to 0)
```

- **Truthy / Falsy Contexts:**
  Conditionals (like `if` statements or logical operators) implicitly convert non-boolean values to booleans.

```javascript
if ("hello") {
  // "hello" is implicitly coerced to true because non-empty strings are truthy
  console.log("Runs!");
}
```

---

### Key Comparison

| Feature              | Explicit Coercion                                  | Implicit Coercion                                                                                |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Triggered By**     | Developer using functions (`Number()`, `String()`) | JS engine during evaluation (`+`, `==`, `if()`)                                                  |
| **Code Readability** | High (Clear intent)                                | Low to Medium (Can cause surprises if misunderstood)                                             |
| **Debugging**        | Easy to trace                                      | Can lead to unexpected bugs (e.g., `"10" + 5 = "105"`)                                           |
| **Best Practice**    | Preferred for clarity                              | Useful for concise code (like truthy checks), but often avoided in comparisons (`===` over `==`) |

---

### Summary Rule of Thumb

- Use **`===` (strict equality)** to avoid implicit coercion surprises.
- Use explicit functions like **`Number()`**, **`String()`**, or **`Boolean()`** when transforming data to keep your intent unambiguous.
