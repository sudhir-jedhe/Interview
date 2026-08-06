 What is the `typeof` operator in JavaScript?

The `typeof` operator returns a string indicating the type of a variable or expression.

Example:

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
```

### 1. What are the different data types in JavaScript?

- **Primitive types**: `undefined`, `null`, `boolean`, `number`, `string`, `symbol`, `bigint`
- **Non-primitive type**: `object` (includes arrays, functions, and other objects)

### 2. What is the difference between `null` and `undefined`?

- **`null`**: Represents the intentional absence of any object value.
- **`undefined`**: Represents a variable that has been declared but not assigned a value.

### 3. What is the output of `3 + 2 + "7"`?

- The output is `"57"` because JavaScript converts the number `2` and `3` to strings when concatenating with the string `"7"`.

### 4. What is the difference between `==` and `===` in JavaScript?

- **`==` (loose equality)**: Compares values after type coercion.
- **`===` (strict equality)**: Compares values without type coercion.

### 5. Is JavaScript a dynamically typed language or a statically typed language?

- JavaScript is **dynamically typed**, meaning variables' types are determined at runtime.

### 6. What is the `typeof` operator?

- The `typeof` operator returns a string indicating the type of a variable or expression.
