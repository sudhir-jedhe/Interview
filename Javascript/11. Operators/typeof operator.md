Here is a comprehensive breakdown of the JavaScript `typeof` operator, primitive vs. complex data types, type checking techniques, special values (`undefined`, `null`, empty values), and related operators (`instanceof`, `constructor`, `void`).

---

## 1. The `typeof` Operator

The `typeof` operator evaluates an expression and returns a string indicating its data type.

```javascript
// Example 1: Basic primitive checks
console.log(typeof "Hello");  // Output: "string"
console.log(typeof 42);       // Output: "number"
console.log(typeof true);     // Output: "boolean"

// Example 2: ES6+ primitive types
console.log(typeof Symbol("id")); // Output: "symbol"
console.log(typeof 100n);         // Output: "bigint"

// Example 3: Functions and Objects
console.log(typeof function() {}); // Output: "function"
console.log(typeof { a: 1 });      // Output: "object"

```

---

## 2. Primitive Data Types

Primitives are immutable values stored directly by value in memory. JavaScript has **7 primitive types**: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`.

```javascript
// Example 1: Primitives are immutable
let str = "hello";
str.toUpperCase();
console.log(str); 
// Output: "hello" (Original string remains unchanged)

// Example 2: Passed by value
let x = 10;
let y = x;
y = 20;
console.log(x, y); 
// Output: 10 20

// Example 3: Primitive type checking using typeof
console.log(typeof "text" === "string"); // Output: true
console.log(typeof 123 === "number");    // Output: true
console.log(typeof true === "boolean");  // Output: true

```

---

## 3. Complex Data Types

Complex data types (Objects, Arrays, Dates, Maps, Sets, functions) are collections of properties passed by reference. `typeof` returns `"object"` for all non-primitive objects (except functions, which return `"function"`).

```javascript
// Example 1: Objects are passed by reference
const obj1 = { name: "Alice" };
const obj2 = obj1;
obj2.name = "Bob";
console.log(obj1.name); 
// Output: "Bob" (Both variables point to the same memory location)

// Example 2: typeof behavior on complex objects
console.log(typeof [1, 2, 3]);    // Output: "object"
console.log(typeof new Date());   // Output: "object"
console.log(typeof new Map());    // Output: "object"

// Example 3: Functions are callable objects
function greet() {}
console.log(typeof greet); // Output: "function"
console.log(greet instanceof Object); // Output: true

```

---

## 4. How to Recognize an Array

Because `typeof []` returns `"object"`, specialized methods are required to accurately check for Arrays.

```javascript
// Example 1: Array.isArray() (Recommended)
console.log(Array.isArray([1, 2, 3])); // Output: true
console.log(Array.isArray({}));        // Output: false

// Example 2: Object.prototype.toString.call() (Universal type detection)
console.log(Object.prototype.toString.call([1, 2, 3])); 
// Output: "[object Array]"

// Example 3: Checking constructor reference
const arr = ["a", "b"];
console.log(arr.constructor === Array); 
// Output: true

```

---

## 5. The `instanceof` Operator

The `instanceof` operator tests whether an object's prototype chain contains the `prototype` property of a given constructor function.

```javascript
// Example 1: Checking custom object instances
class User {}
const user = new User();
console.log(user instanceof User); 
// Output: true

// Example 2: Checking standard built-in object instances
console.log([] instanceof Array);    // Output: true
console.log(/abc/ instanceof RegExp); // Output: true

// Example 3: Primitives are NOT instances of built-in constructors
console.log("hello" instanceof String);             // Output: false
console.log(new String("hello") instanceof String); // Output: true

```

---

## 6. Undefined Variables

A variable that has been declared but has not yet been assigned a value automatically holds the value `undefined`.

```javascript
// Example 1: Uninitialized declared variable
let unassignedVar;
console.log(unassignedVar); 
// Output: undefined

// Example 2: typeof safely checks undeclared variables without throwing ReferenceError
console.log(typeof undeclaredVar); 
// Output: "undefined"

// Example 3: Function missing return statement returns undefined
function doNothing() {}
console.log(doNothing()); 
// Output: undefined

```

---

## 7. Empty Values

An empty value is a valid string or object structure that holds no contents (e.g., `""`, `[]`, `{}`). An empty value is **not** `null` or `undefined`.

```javascript
// Example 1: Empty string
const emptyStr = "";
console.log(typeof emptyStr); // Output: "string"
console.log(emptyStr.length); // Output: 0

// Example 2: Empty array vs empty object
const emptyArr = [];
const emptyObj = {};
console.log(emptyArr.length);               // Output: 0
console.log(Object.keys(emptyObj).length); // Output: 0

// Example 3: Truthy/Falsy evaluation of empty values
console.log(Boolean("")); // Output: false (Falsy)
console.log(Boolean([])); // Output: true  (Truthy)
console.log(Boolean({})); // Output: true  (Truthy)

```

---

## 8. Null

`null` represents the deliberate, intentional absence of any object value.

```javascript
// Example 1: Explicitly clearing object references
let currentUser = { name: "Bob" };
currentUser = null; // Cleared from memory

// Example 2: The historical bug in typeof null
console.log(typeof null); 
// Output: "object" (Legacy bug preserved for backward compatibility)

// Example 3: Reliable null checking using strict equality
const data = null;
console.log(data === null); 
// Output: true

```

---

## 9. Difference Between `Undefined` and `Null`

* **`undefined`**: Value auto-assigned by JavaScript when a variable is declared but not initialized.
* **`null`**: Explicit assignment representing "no value" or an empty object reference.

```javascript
// Example 1: Loose vs Strict equality comparison
console.log(null == undefined);  // Output: true (Both mean "falsy / no value")
console.log(null === undefined); // Output: false (Different types)

// Example 2: Arithmetic behavior
console.log(10 + undefined); // Output: NaN
console.log(10 + null);      // Output: 10 (null coerces to 0)

// Example 3: Function default argument fallback
function greet(name = "Guest") {
  return `Hello, ${name}`;
}
console.log(greet(undefined)); // Output: "Hello, Guest" (triggers default)
console.log(greet(null));      // Output: "Hello, null" (does NOT trigger default)

```

---

## 10. The `constructor` Property

Returns a reference to the Object constructor function that created the instance object.

```javascript
// Example 1: Checking constructors of primitive wrappers
console.log((123).constructor === Number);       // Output: true
console.log("hello".constructor === String);     // Output: true
console.log((true).constructor === Boolean);     // Output: true

// Example 2: Checking constructors of complex object types
console.log([].constructor === Array);           // Output: true
console.log(({}).constructor === Object);        // Output: true
console.log((function(){}).constructor === Function); // Output: true

// Example 3: Safe type checking function using constructor name
function getType(val) {
  return val === null || val === undefined 
    ? String(val) 
    : val.constructor.name;
}
console.log(getType([]), getType(42), getType(null)); 
// Output: "Array" "Number" "null"

```

---

## 11. The `void` Operator

Evaluates an expression and returns `undefined`. It is frequently used to execute side effects without returning a value or to explicitly generate a pure `undefined` value (`void 0`).

```javascript
// Example 1: Generating pure undefined (void 0)
console.log(void 0 === undefined); 
// Output: true

// Example 2: Immediately Executed Functions returning undefined
const result = void (function() {
  console.log("Executed!");
})();
// Output: "Executed!"
console.log(result); 
// Output: undefined

// Example 3: Preventing page navigation in HTML inline links
// <a href="javascript:void(0);" onclick="handleClick()">Click Me</a>
function handleClick() {
  console.log("Link clicked without page redirect");
}
handleClick();

```
