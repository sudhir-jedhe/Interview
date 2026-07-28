### ES6+ Features with Examples

ES6 (ECMAScript 2015) introduced many new features to JavaScript that made the language more powerful and developer-friendly. Additionally, newer versions of ECMAScript (ES7, ES8, ES9, ES10, ES11, ES12) introduced even more features, further enhancing JavaScript’s capabilities. Here's a comprehensive list of the most important features from ES6 and beyond, with detailed examples.

---

### **1. `let` and `const`**

- **`let`**: A block-scoped variable declaration.
- **`const`**: A block-scoped variable declaration with a constant value.

```javascript
let name = "John"; // Block-scoped variable
name = "Doe"; // Re-assignable

const age = 25; // Cannot be reassigned
// age = 26;  // Error: Assignment to constant variable.
```

---

### **2. Arrow Functions**

- Arrow functions are a more concise syntax for writing functions.
- They also don't have their own `this`, `arguments`, `super`, or `new.target`.

```javascript
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5
```

---

### **3. Template Literals**

- Template literals allow embedded expressions and multi-line strings.

```javascript
const name = "Alice";
const greeting = `Hello, ${name}!`;
console.log(greeting); // Hello, Alice!

const multiline = `This is
a multi-line string`;
console.log(multiline);
```

---

### **4. Destructuring Assignment**

- Destructuring allows you to unpack values from arrays or properties from objects into distinct variables.

**Array Destructuring:**

```javascript
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a, b, c); // 1 2 3
```

**Object Destructuring:**

```javascript
const person = { name: "John", age: 30 };
const { name, age } = person;
console.log(name, age); // John 30
```

---

### **5. Default Parameters**

- You can assign default values to function parameters.

```javascript
const greet = (name = "Guest") => {
  console.log(`Hello, ${name}!`);
};

greet(); // Hello, Guest!
greet("John"); // Hello, John!
```

---

### **6. Rest and Spread Operators**

- **Rest**: Collects multiple values into a single array.
- **Spread**: Expands an array or object into individual elements.

**Rest (for functions):**

```javascript
const sum = (...numbers) => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

console.log(sum(1, 2, 3)); // 6
```

**Spread (for arrays/objects):**

```javascript
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
console.log(arr2); // [1, 2, 3, 4]

const obj1 = { name: "Alice" };
const obj2 = { ...obj1, age: 30 };
console.log(obj2); // { name: 'Alice', age: 30 }
```

---

### **7. Classes**

- ES6 introduced classes, which are syntactical sugar over JavaScript’s existing prototype-based inheritance.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello, I'm ${this.name} and I'm ${this.age} years old.`);
  }
}

const john = new Person("John", 30);
john.greet(); // Hello, I'm John and I'm 30 years old.
```

---

### **8. Modules**

- ES6 modules allow you to export and import code between files.

```javascript
// person.js
export const name = "John";
export const age = 30;

// app.js
import { name, age } from "./person.js";
console.log(name, age); // John 30
```

---

### **9. Promises**

- Promises represent the eventual completion (or failure) of an asynchronous operation.

```javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Success!");
  } else {
    reject("Error!");
  }
});

myPromise.then((response) => console.log(response)); // Success!
myPromise.catch((error) => console.log(error)); // Error!
```

---

### **10. Async/Await**

- `async` functions return a Promise, and `await` makes JavaScript wait until the Promise resolves or rejects.

```javascript
const fetchData = async () => {
  const response = await fetch("https://api.example.com");
  const data = await response.json();
  return data;
};

fetchData().then((data) => console.log(data));
```

---

### **11. Set and Map**

- **Set**: A collection of unique values.
- **Map**: A collection of key-value pairs.

```javascript
const set = new Set([1, 2, 3, 3]);
console.log(set); // Set {1, 2, 3}

const map = new Map();
map.set("name", "Alice");
map.set("age", 25);
console.log(map.get("name")); // Alice
```

---

### **12. Symbol**

- Symbols are a primitive data type used for unique identifiers.

```javascript
const sym1 = Symbol("desc");
const sym2 = Symbol("desc");
console.log(sym1 === sym2); // false
```

---

### **13. Object.assign()**

- Used to copy values from one or more source objects to a target object.

```javascript
const target = { a: 1 };
const source = { b: 2, c: 3 };
const result = Object.assign(target, source);
console.log(result); // { a: 1, b: 2, c: 3 }
```

---

### **14. String Methods: `includes()`, `startsWith()`, `endsWith()`**

- These methods provide ways to check for substrings in a string.

```javascript
const str = "Hello, World!";
console.log(str.includes("World")); // true
console.log(str.startsWith("Hello")); // true
console.log(str.endsWith("!")); // true
```

---

### **15. `Object.entries()` and `Object.values()`**

- `Object.entries()` returns an array of key-value pairs from an object.
- `Object.values()` returns an array of the values of the object.

```javascript
const obj = { a: 1, b: 2 };
console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]
console.log(Object.values(obj)); // [1, 2]
```

---

### **16. `Array.from()` and `Array.of()`**

- **`Array.from()`**: Creates a new array instance from an array-like or iterable object.
- **`Array.of()`**: Creates a new array with a variable number of elements.

```javascript
const str = "123";
const arr = Array.from(str); // ['1', '2', '3']
console.log(arr);

const arr2 = Array.of(1, 2, 3, 4); // [1, 2, 3, 4]
console.log(arr2);
```

---

### **17. `Array.find()` and `Array.findIndex()`**

- **`find()`**: Returns the first element in the array that satisfies the provided condition.
- **`findIndex()`**: Returns the index of the first element that satisfies the condition.

```javascript
const arr = [1, 2, 3, 4];
const found = arr.find((num) => num > 2); // 3
const foundIndex = arr.findIndex((num) => num > 2); // 2
console.log(found, foundIndex);
```

---

### **18. `Array.includes()`**

- Checks if an array contains a certain element.

```javascript
const arr = [1, 2, 3, 4];
console.log(arr.includes(3)); // true
console.log(arr.includes(5)); // false
```

---

### **19. `WeakMap` and `WeakSet`**

- **`WeakMap`**: A collection of key-value pairs where the keys are objects, and values can be any value.
- **`WeakSet`**: A collection of objects, but the objects are weakly referenced.

```javascript
const obj = {};
const weakMap = new WeakMap();
weakMap.set(obj, "value");
console.log(weakMap.get(obj)); // 'value'
```

---

### **20. Proxy**

- A `Proxy` object is used to define custom behavior for fundamental operations (e.g., property lookup, assignment).

```javascript
const person = {
  name: "John",
  age: 30,
};

const handler = {
  get(target, prop) {
    if (prop === "age") {
      return `Age is: ${target[prop]}`;
    }
    return target[prop];
  },
};

const proxyPerson = new Proxy(person, handler);
console.log(proxyPerson.age); // Age is: 30
```

---

### **21. BigInt**

- **BigInt** is a special numeric type that can represent integers larger than the maximum safe integer value (`Number.MAX_SAFE_INTEGER`).

```javascript
const bigNumber = BigInt(123456789012345678901234567890);
console.log(bigNumber); // 123456789012345678901234567890n
```

---

### **22. `null`ish Coalescing (`??`)**

- The `nullish coalescing` operator returns the right-hand side value if the left-hand side is `null` or `undefined`.

```javascript
const name = null;
const greeting = name ?? "Guest";
console.log(greeting); // Guest
```

---

### **23. `Optional Chaining` (`?.`)**

- The `Optional chaining` operator allows you to safely access deeply nested properties.

```javascript
const person = { name: "Alice", address: { city: "Wonderland" } };
console.log(person.address?.city); // Wonderland
console.log(person.contact?.phone); // undefined
```

---

### **24. `Promise.allSettled()`**

- `Promise.allSettled()` waits for all promises to settle (either resolved or rejected), and returns an array of their results.

```javascript
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject("Error");
const promise3 = Promise.resolve(5);

Promise.allSettled([promise1, promise2, promise3]).then((results) =>
  console.log(results),
);
```

---

### **25. `String.prototype.replaceAll()`**

- Replaces all occurrences of a substring within a string.

```javascript
const sentence = "Hello, world! Hello, everyone!";
const updatedSentence = sentence.replaceAll("Hello", "Hi");
console.log(updatedSentence); // Hi, world! Hi, everyone!
```

---

These are just some of the most important features in ES6 and later versions. Each feature helps improve code readability, maintainability, and performance, making JavaScript a more powerful and enjoyable language to work with.

Certainly! Let’s continue by adding more advanced JavaScript (ES6+ to ES2025) features, as new versions of ECMAScript introduce a wide range of enhancements. I'll provide a comprehensive list with explanations and examples for each feature:

---

### **26. Private Fields in Classes (ES2022)**

- **Private fields** allow you to define fields in a class that are not accessible from outside the class.
- They are declared with `#`.

```javascript
class Person {
  #name;

  constructor(name) {
    this.#name = name;
  }

  getName() {
    return this.#name;
  }
}

const person = new Person("Alice");
console.log(person.getName()); // Alice
// console.log(person.#name); // Error: Private field '#name' must be declared in an enclosing class
```

---

### **27. Logical Assignment Operators (ES2021)**

- **`&&=`**, **`||=`**, and **`??=`** are logical assignment operators that combine logical operators with assignment.

```javascript
let a = true;
let b = false;

a &&= b; // a = a && b
console.log(a); // false

let c = null;
c ??= "Default";
console.log(c); // 'Default'
```

---

### **28. `Promise.any()` (ES2021)**

- **`Promise.any()`** takes an iterable of Promise objects and returns a Promise that resolves as soon as any of the promises in the iterable resolves.

```javascript
const p1 = Promise.reject("Error 1");
const p2 = Promise.reject("Error 2");
const p3 = Promise.resolve("Success");

Promise.any([p1, p2, p3]).then((value) => console.log(value)); // Success
```

---

### **29. `WeakRefs` (ES2021)**

- **WeakRef** allows you to hold a weak reference to an object without preventing it from being garbage collected.

```javascript
let obj = { name: "Weak Reference" };
const weakRef = new WeakRef(obj);

console.log(weakRef.deref()); // { name: 'Weak Reference' }
```

---

### **30. Top-Level Await (ES2022)**

- **Top-level `await`** allows you to use `await` at the top level of a module (outside of async functions).
- This enables async operations directly inside modules.

```javascript
// top-level-await.js
const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
const data = await response.json();
console.log(data);
```

---

### **31. `Object.hasOwn()` (ES2022)**

- **`Object.hasOwn()`** is a new method that checks if an object has a direct property (similar to `hasOwnProperty`).

```javascript
const obj = { name: "Alice" };
console.log(Object.hasOwn(obj, "name")); // true
console.log(Object.hasOwn(obj, "age")); // false
```

---

### **32. `Array.at()` (ES2022)**

- The `Array.at()` method allows accessing elements from an array using negative indices, similar to how it works in Python.

```javascript
const arr = [1, 2, 3, 4, 5];
console.log(arr.at(-1)); // 5
console.log(arr.at(-2)); // 4
```

---

### **33. `RegExp Match Indices` (ES2022)**

- **`matchIndices`** provides the start and end indices of matches.

```javascript
const regex = /(\d+)/;
const result = "My number is 12345".matchAll(regex);

for (const match of result) {
  console.log(match.indices); // [[12, 17]]
}
```

---

### **34. `Array.sort()` with Stable Sorting (ES2023)**

- **Stable Sorting** means the relative order of equal elements remains the same after sorting.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.sort((a, b) => b - a);
console.log(arr); // [5, 4, 3, 2, 1]
```

---

### **35. `ArrayGroupBy()` (ES2025)** _(Proposed)_

- The `groupBy()` method would allow you to group elements based on a property.

```javascript
const numbers = [1, 2, 3, 4, 5, 6];
const grouped = numbers.groupBy((num) => (num % 2 === 0 ? "even" : "odd"));
console.log(grouped); // { even: [2, 4, 6], odd: [1, 3, 5] }
```

---

### **36. `Array.prototype.toSorted()` (ES2025)** _(Proposed)_

- **`toSorted()`** would provide a non-mutating version of `sort()`.

```javascript
const arr = [3, 1, 2];
const sortedArr = arr.toSorted();
console.log(sortedArr); // [1, 2, 3]
```

---

### **37. `String.prototype.replaceAll()` (ES2021)**

- **`replaceAll()`** replaces all instances of a substring, without requiring a global regex.

```javascript
const str = "Hello World. Welcome to the World.";
const updatedStr = str.replaceAll("World", "Universe");
console.log(updatedStr); // "Hello Universe. Welcome to the Universe."
```

---

### **38. `Intl.ListFormat` (ES2025)** _(Proposed)_

- **`Intl.ListFormat`** provides a way to format lists in a way that's appropriate for the language of the user.

```javascript
const items = ["apple", "banana", "orange"];
const formattedList = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
}).format(items);
console.log(formattedList); // "apple, banana, and orange"
```

---

### **39. `Array.prototype.sort()` Enhancements (ES2025)** _(Proposed)_

- **`sort()`** might receive a new behavior to handle large arrays more efficiently and consistently with internationalization settings.

---

### **40. `String.prototype.split()` with Support for Regex Flags (ES2025)** _(Proposed)_

- **`split()`** would accept regular expressions with flags such as `g` or `i` to split a string more flexibly.

```javascript
const str = "apple,banana,orange";
const result = str.split(/,/g);
console.log(result); // ['apple', 'banana', 'orange']
```

---

### **41. `Object.hasOwn()` (ES2022)**

- **`Object.hasOwn()`** simplifies property existence checks on objects.
- More reliable than using `Object.prototype.hasOwnProperty` for checking properties.

```javascript
const obj = { name: "Alice" };
console.log(Object.hasOwn(obj, "name")); // true
console.log(Object.hasOwn(obj, "age")); // false
```

---

### **42. `Error Cause Property` (ES2025)** _(Proposed)_

- The `cause` property for `Error` objects would allow you to provide context for errors more easily.

```javascript
try {
  throw new Error("Primary error", { cause: new Error("Underlying cause") });
} catch (e) {
  console.log(e.cause.message); // 'Underlying cause'
}
```

---

### **43. `Function.prototype.toString()` (ES2025)** _(Proposed)_

- **`toString()`** of functions will be able to return a more reliable and consistent string representation.

```javascript
const func = () => {};
console.log(func.toString()); // `() => {}`  (improved consistency)
```

---

### **44. `ArrayBuffer.prototype.transfer()` (ES2025)** _(Proposed)_

- **`ArrayBuffer.prototype.transfer()`** would allow you to easily move data between ArrayBuffers.

```javascript
const buffer = new ArrayBuffer(8);
const transferredBuffer = buffer.transfer(16);
console.log(transferredBuffer.byteLength); // 16
```

---

### **45. `Promise.allSettled()` (ES2020)**

- This method allows you to wait for all promises to settle, without caring about whether they resolve or reject.

```javascript
const p1 = Promise.resolve(3);
const p2 = Promise.reject("Error!");
const p3 = Promise.resolve(7);

Promise.allSettled([p1, p2, p3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Error!' },
  //   { status: 'fulfilled', value: 7 }
  // ]
});
```

---

### **46. `Array.prototype.at()` (ES2022)**

- This method allows for accessing elements from the end of the array, using negative indices.

```javascript
const arr = [1, 2, 3, 4];
console.log(arr.at(-1)); // 4
console.log(arr.at(-2)); // 3
```

---

### **47. `Array.prototype.flatMap()` (ES2022)**

- **`flatMap()`** maps each element using a function and flattens the result into a new array.

```javascript
const arr = [1, 2, 3];
const result = arr.flatMap((x) => [x, x * 2]);
console.log(result); // [1, 2, 2, 4, 3, 6]
```

---

### **48. `String.prototype.matchAll()` (ES2020)**

- Returns an iterator that provides the matches found by a regular expression.

```javascript
const regex = /a/g;
const str = "apple banana";
const matches = str.matchAll(regex);
for (const match of matches) {
  console.log(match);
}
```

---

These are some of the newer features and proposals in JavaScript, covering versions from ES6 to the latest ES2025 proposals. Many of these features aim to enhance the language’s usability, improve performance, and streamline development. JavaScript continues to evolve, making the language more robust and better suited to modern applications.
