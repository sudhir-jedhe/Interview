In JavaScript, **`toString()`** is a built-in method defined on `Object.prototype` (and overridden by most built-in data types) that converts an object or primitive value into its string representation.

---

## 1. Syntax & Overridden Behavior

$$\text{value}\text{.toString([radix])}$$

* **`radix`** *(Optional)*: An integer between `2` and `36` specifying the base to use for representing numeric values (e.g., binary, hexadecimal).

Depending on the data type calling `.toString()`, the output varies:

| Data Type                | `toString()` Output                                     |
| ------------------------ | ------------------------------------------------------- |
| **Number**               | Converts number to string (or radix base)               |
| **Boolean**              | Returns `"true"` or `"false"`                           |
| **Array**                | Joins elements with commas (equivalent to `.join(",")`) |
| **Function**             | Returns the literal source code of the function         |
| **Object (`{}`)**        | Returns `"[object Object]"`                             |
| **Date**                 | Returns human-readable UTC/local date string            |
| **`null` / `undefined**` | **Throws `TypeError**` (they do not have methods)       |

---

## 2. Examples by Data Type

### A. Number `toString()`

Numbers accept an optional **radix** argument to convert values into different base systems (binary, octal, hex).

```javascript
// Example 1: Standard number to string conversion
const num = 255;
console.log(num.toString()); 
// Output: "255"

// Example 2: Convert to Hexadecimal (Base 16)
console.log((255).toString(16)); 
// Output: "ff"

// Example 3: Convert to Binary (Base 2)
console.log((10).toString(2)); 
// Output: "1010"

```

### B. Array `toString()`

Arrays flatten their elements into a comma-separated string.

```javascript
// Example 1: Basic array conversion
const fruits = ["apple", "banana", "cherry"];
console.log(fruits.toString()); 
// Output: "apple,banana,cherry"

// Example 2: Nested arrays are flattened
const nested = [1, [2, 3], 4];
console.log(nested.toString()); 
// Output: "1,2,3,4"

// Example 3: Empty elements/null/undefined inside arrays become empty strings
console.log([1, null, undefined, 4].toString()); 
// Output: "1,,,4"

```

### C. Function `toString()`

Returns the complete function declaration source text as a string.

```javascript
function greet(name) {
  return "Hello " + name;
}

console.log(greet.toString());
/* Output:
"function greet(name) {
  return "Hello " + name;
}"
*/

```

### D. Object `toString()` & Custom Overrides

Plain objects return `"[object Object]"` by default. You can override `toString()` or use `Symbol.toStringTag` to customize this behavior.

```javascript
// Example 1: Default Plain Object
const plainObj = { a: 1 };
console.log(plainObj.toString()); 
// Output: "[object Object]"

// Example 2: Custom toString() method override
const user = {
  name: "Alice",
  toString() {
    return `User: ${this.name}`;
  }
};
console.log(user.toString()); 
// Output: "User: Alice"

// Example 3: Customizing default tag via Symbol.toStringTag
class Vehicle {
  get [Symbol.toStringTag]() {
    return "Car";
  }
}
console.log(Object.prototype.toString.call(new Vehicle())); 
// Output: "[object Car]"

```

---

## 3. Important Differences: `val.toString()` vs `String(val)`

Attempting to call `.toString()` on `null` or `undefined` throws a `TypeError`. Use `String()` when converting variables that might be `null` or `undefined`.

```javascript
// Example 1: Calling .toString() on null/undefined throws an error
try {
  const x = null;
  x.toString();
} catch (e) {
  console.log(e.name); 
  // Output: "TypeError"
}

// Example 2: String() handles null and undefined safely
console.log(String(null));      // Output: "null"
console.log(String(undefined)); // Output: "undefined"

```

---

## 4. Advanced: Checking Accurate Object Types

`Object.prototype.toString.call(val)` is a classic JavaScript technique used to determine the exact internal `[[Class]]` of any value or built-in object type.

```javascript
console.log(Object.prototype.toString.call([]));         // Output: "[object Array]"
console.log(Object.prototype.toString.call(new Date()));  // Output: "[object Date]"
console.log(Object.prototype.toString.call(/regex/));    // Output: "[object RegExp]"
console.log(Object.prototype.toString.call(null));       // Output: "[object Null]"
console.log(Object.prototype.toString.call(undefined));  // Output: "[object Undefined]"

```
