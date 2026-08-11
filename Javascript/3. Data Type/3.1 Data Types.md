JavaScript variables can hold 8 standard data types: **7 Primitive types** and **1 Object type**.

Primitive types hold raw, immutable values and are passed by value. The Object type represents complex data structures and is passed by reference.

Here is a complete guide to all 8 JavaScript data types with 3 concrete code examples for each.

---

## 1. String

*Represents a sequence of characters used to store text. Strings can be enclosed in single quotes, double quotes, or backticks (template literals).*

```javascript
// Example 1: Basic string using double or single quotes
const greeting = "Hello, world!";
const character = 'A';

// Example 2: String concatenation
const firstName = "John";
const lastName = "Doe";
const fullName = firstName + " " + lastName; // "John Doe"

// Example 3: Template literals (allows multi-line and interpolation)
const age = 30;
const bio = `I am ${age} years old.
I live in New York.`;

```

---

## 2. Number

*Represents both integer and floating-point numbers. It also includes special numeric values like `Infinity`, `-Infinity`, and `NaN` (Not-a-Number).*

```javascript
// Example 1: Integers and floats
const score = 100;
const price = 99.99;

// Example 2: Exponential notation
const billion = 1e9; // 1,000,000,000
const micro = 1e-6;  // 0.000001

// Example 3: Special number values
console.log(10 / 0); // Output: Infinity
console.log("apple" / 2); // Output: NaN

```

---

## 3. BigInt

*Represents whole numbers larger than the `Number` type's safe integer limit (`2^53 - 1`). Created by appending `n` to the end of an integer or calling `BigInt()`.*

```javascript
// Example 1: Creating a BigInt by appending 'n'
const hugeNumber = 90071992547409912345n;

// Example 2: Creating a BigInt using the constructor function
const anotherHugeNum = BigInt("90071992547409912345");

// Example 3: BigInt math operations (cannot be mixed with standard Numbers)
const bigA = 10n;
const bigB = 20n;
console.log(bigA * bigB); // Output: 200n

```

---

## 4. Boolean

*Represents a logical entity and can have only two values: `true` or `false`.*

```javascript
// Example 1: Explicit boolean values
const isLoggedIn = true;
const isGameOver = false;

// Example 2: Booleans resulting from comparisons
const isAdult = 25 >= 18; 
// Output: true

// Example 3: Booleans resulting from logical operators
const hasAccess = isLoggedIn && isAdult; 
// Output: true

```

---

## 5. Undefined

*A variable that has been declared but has not yet been assigned a value is automatically assigned the value `undefined`.*

```javascript
// Example 1: Uninitialized variable
let userAge;
console.log(userAge); 
// Output: undefined

// Example 2: Accessing a non-existent object property
const user = { name: "Alice" };
console.log(user.email); 
// Output: undefined

// Example 3: Function parameters that are not provided
function greet(name) {
  console.log("Hello " + name);
}
greet(); 
// Output: "Hello undefined"

```

---

## 6. Null

*Represents the intentional absence of any object value. It is explicitly assigned to a variable to indicate it holds "nothing".*

```javascript
// Example 1: Explicitly clearing a variable's value
let currentUser = "Bob";
currentUser = null; // Bob logged out

// Example 2: Returning null from a search/query when no result is found
const missingElement = document.getElementById("non-existent-id");
// missingElement is null

// Example 3: Checking for null vs undefined (strict equality)
console.log(null === undefined); // Output: false
console.log(null == undefined);  // Output: true

```

---

## 7. Symbol

*Introduced in ES6, a Symbol is a unique and immutable primitive value often used as a unique identifier for object properties.*

```javascript
// Example 1: Creating unique symbols
const sym1 = Symbol("id");
const sym2 = Symbol("id");
console.log(sym1 === sym2); 
// Output: false (every Symbol is guaranteed unique)

// Example 2: Using Symbols as hidden object keys
const idKey = Symbol("id");
const user = {
  name: "Charlie",
  [idKey]: 12345
};
console.log(user[idKey]); 
// Output: 12345

// Example 3: Global symbol registry using Symbol.for()
const globalSym1 = Symbol.for("app.config");
const globalSym2 = Symbol.for("app.config");
console.log(globalSym1 === globalSym2); 
// Output: true

```

---

## 8. Object (Non-Primitive)

*Objects are complex data structures used to store collections of data and more complex entities. Unlike primitives, objects are mutable and passed by reference. Arrays, Functions, Dates, and RegExp are all built on top of the Object type.*

```javascript
// Example 1: Plain Object literal (Key-Value store)
const car = {
  make: "Toyota",
  model: "Camry",
  startEngine: function() {
    return "Vroom!";
  }
};
console.log(car.make); // Output: "Toyota"

// Example 2: Arrays (an ordered list, structurally an Object in JS)
const colors = ["red", "green", "blue"];
colors.push("yellow"); // Mutating the array
console.log(typeof colors); // Output: "object"

// Example 3: Reference sharing (modifying copy modifies original)
const person = { name: "Dave" };
const personCopy = person; 
personCopy.name = "David";
console.log(person.name); 
// Output: "David" (both point to the same object in memory)

```
