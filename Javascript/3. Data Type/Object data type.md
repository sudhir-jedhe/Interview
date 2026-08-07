In JavaScript, the **Object** data type is a fundamental master type. Practically everything in JavaScript that is not a primitive is an Object.

Because objects are reference types and can be extended, JavaScript includes built-in specialized **object types** (structural instances, standard built-in constructors, and collections) that all inherit from `Object.prototype`.

Here are 3 concrete code examples for each primary built-in object type in JavaScript.

---

## 1. Plain Object (`Object`)

*A basic collection of key-value pairs used to store structured data.*

```javascript
// Example 1: Object literal syntax
const user = { name: "Alice", role: "Admin" };
console.log(user.name); 
// Output: "Alice"

// Example 2: Dynamic property access and assignment
const settings = {};
settings["theme"] = "dark";
console.log(settings.theme); 
// Output: "dark"

// Example 3: Creating objects with Object.create()
const proto = { greet() { return "Hello"; } };
const obj = Object.create(proto);
console.log(obj.greet()); 
// Output: "Hello"

```

---
Here is a complete guide to **Built-In JavaScript Object Types** matching your table reference, complete with 3 concrete code examples for each object type.

---

## 1. Array

*An ordered collection of values accessed by a numerical index.*

```javascript
// Example 1: Basic array creation and indexing
const fruits = ["apple", "banana", "cherry"];
console.log(fruits[1]); 
// Output: "banana"

// Example 2: Array mutation using push and pop
const stack = [1, 2];
stack.push(3);
console.log(stack.pop()); 
// Output: 3

// Example 3: Higher-order array operations
const doubled = [1, 2, 3].map(num => num * 2);
console.log(doubled); 
// Output: [2, 4, 6]

```

---

## 2. Map

*An ordered collection of key-value pairs where the keys can be of any data type (including objects or functions).*

```javascript
// Example 1: Basic key-value operations
const map = new Map();
map.set("status", 200);
console.log(map.get("status")); 
// Output: 200

// Example 2: Using an object as a Map key
const userKey = { id: 42 };
const userMap = new Map();
userMap.set(userKey, "Alice");
console.log(userMap.get(userKey)); 
// Output: "Alice"

// Example 3: Checking size and entry existence
const roles = new Map([["admin", true]]);
console.log(roles.has("admin"), roles.size); 
// Output: true 1

```

---

## 3. Set

*A collection of unique values where duplicate entries are automatically discarded.*

```javascript
// Example 1: Eliminating duplicates from an array
const numbers = new Set([1, 2, 2, 3, 3, 4]);
console.log([...numbers]); 
// Output: [1, 2, 3, 4]

// Example 2: Adding and deleting items
const tags = new Set();
tags.add("js").add("web").add("js");
console.log(tags.size); 
// Output: 2

// Example 3: Fast value lookup using has()
const allowed = new Set(["read", "write"]);
console.log(allowed.has("execute")); 
// Output: false

```

---

## 4. WeakMap

*A collection of key-value pairs where keys **must be objects or non-registered symbols**, holding weak references so keys can be garbage collected when no longer used elsewhere.*

```javascript
// Example 1: Associating private metadata with DOM elements or objects
let element = { id: "button1" };
const metaData = new WeakMap();
metaData.set(element, { clicks: 10 });
console.log(metaData.get(element)); 
// Output: { clicks: 10 }

// Example 2: Automatic cleanup on garbage collection
let user = { name: "Bob" };
const activeSessions = new WeakMap();
activeSessions.set(user, "Session_123");
user = null; // 'user' object is now eligible for garbage collection

// Example 3: Checking membership with has()
const tracker = new WeakMap();
const obj = {};
tracker.set(obj, true);
console.log(tracker.has(obj)); 
// Output: true

```

---

## 5. WeakSet

*A collection of unique **objects or non-registered symbols** held weakly, preventing memory leaks if the stored references are removed elsewhere.*

```javascript
// Example 1: Tracking object states without preventing garbage collection
let visitedObj = { path: "/home" };
const visited = new WeakSet();
visited.add(visitedObj);
console.log(visited.has(visitedObj)); 
// Output: true

// Example 2: Preventing duplicate execution or infinite cycles
const processed = new WeakSet();
function process(item) {
  if (processed.has(item)) return "Already processed";
  processed.add(item);
  return "Processing item";
}
const data = {};
process(data);
console.log(process(data)); 
// Output: "Already processed"

// Example 3: Attempting to add primitives throws a TypeError
try {
  new WeakSet().add(123);
} catch (e) {
  console.log(e.name); 
  // Output: "TypeError"
}

```

---

## 6. Math

*A built-in namespace object that provides mathematical constants and functions (cannot be instantiated with `new`).*

```javascript
// Example 1: Math constants
console.log(Math.PI); 
// Output: 3.141592653589793

// Example 2: Generating random numbers within a range
const randomNum = Math.floor(Math.random() * 10) + 1;
console.log(randomNum >= 1 && randomNum <= 10); 
// Output: true

// Example 3: Rounding and finding minimum/maximum values
console.log(Math.max(5, 10, 15), Math.round(4.7)); 
// Output: 15 5

```

---

## 7. Date

*An object for working with dates, times, and timestamps.*

```javascript
// Example 1: Getting current year and month
const now = new Date();
console.log(now.getFullYear()); 
// Output: 2026

// Example 2: Formatting date strings
const eventDate = new Date("2026-12-31T00:00:00");
console.log(eventDate.toISOString()); 
// Output: "2026-12-31T00:00:00.000Z"

// Example 3: Measuring execution time in milliseconds
const start = Date.now();
// ... computation ...
const elapsed = Date.now() - start;
console.log(typeof elapsed); 
// Output: "number"

```

---

## 8. RegExp

*An object that holds pattern rules for searching and replacing text.*

```javascript
// Example 1: Matching patterns with literal syntax
const isDigit = /^\d+$/.test("12345");
console.log(isDigit); 
// Output: true

// Example 2: Constructing dynamic expressions
const keyword = "cat";
const pattern = new RegExp(`\\b${keyword}\\b`, "i");
console.log(pattern.test("The Cat in the hat")); 
// Output: true

// Example 3: Executing pattern matches with groups
const match = /(\w+)-(\d+)/.exec("Code-2026");
console.log(match[1], match[2]); 
// Output: "Code" "2026"

```

---

## 9. Error

*Represents runtime or standard error conditions during program execution.*

```javascript
// Example 1: Throwing and catching custom errors
try {
  throw new Error("Connection failed");
} catch (err) {
  console.log(err.message); 
  // Output: "Connection failed"
}

// Example 2: Specific error types (e.g., TypeError)
const err = new TypeError("Expected an array");
console.log(err.name); 
// Output: "TypeError"

// Example 3: Inspecting error stack trace
const runtimeErr = new Error("Data parsing error");
console.log(typeof runtimeErr.stack); 
// Output: "string"

```

---

## 10. JSON

*A static built-in object providing methods to parse and convert data between JSON strings and JavaScript values.*

```javascript
// Example 1: Converting JS object to JSON string
const user = { id: 1, name: "Alice" };
const jsonString = JSON.stringify(user);
console.log(jsonString); 
// Output: '{"id":1,"name":"Alice"}'

// Example 2: Parsing JSON string into a JS object
const data = JSON.parse('{"status": "ok", "code": 200}');
console.log(data.status); 
// Output: "ok"

// Example 3: Formatting JSON string with indentation
const formatted = JSON.stringify({ a: 1 }, null, 2);
console.log(formatted.includes("\n")); 
// Output: true

```

---

## 11. Promise

*An object representing the eventual completion or failure of an asynchronous operation.*

```javascript
// Example 1: Creating a basic resolved promise
const asyncTask = new Promise((resolve) => resolve("Task complete"));
asyncTask.then((res) => console.log(res)); 
// Output: "Task complete"

// Example 2: Using Promise.all() for concurrent tasks
const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
Promise.all([p1, p2]).then((values) => console.log(values)); 
// Output: [10, 20]

// Example 3: Handling promise rejections
Promise.reject(new Error("Operation failed"))
  .catch((err) => console.log(err.message)); 
// Output: "Operation failed"

```

---

## 12. Int8Array

*A typed array storing fixed-size 8-bit signed integer values (-128 to 127).*

```javascript
// Example 1: Initializing and assigning values
const int8 = new Int8Array(2);
int8[0] = 100;
console.log(int8[0]); 
// Output: 100

// Example 2: Integer overflow behavior (wraps around)
const int8Wrap = new Int8Array([127]);
int8Wrap[0] += 1;
console.log(int8Wrap[0]); 
// Output: -128

// Example 3: Reading bytes length
const arr = new Int8Array([1, 2, 3]);
console.log(arr.byteLength); 
// Output: 3

```

---

## 13. Int16Array

*A typed array storing fixed-size 16-bit signed integer values (-32,768 to 32,767).*

```javascript
// Example 1: Creating Int16Array from standard array
const int16 = new Int16Array([1000, 2000, 3000]);
console.log(int16[1]); 
// Output: 2000

// Example 2: Measuring byte allocation
const buffer = new Int16Array(4);
console.log(buffer.byteLength); 
// Output: 8 (4 elements * 2 bytes each)

// Example 3: Setting element value
const numbers = new Int16Array(2);
numbers.set([32000, -32000]);
console.log(numbers[0]); 
// Output: 32000

```

---

## 14. Int32Array

*A typed array storing fixed-size 32-bit signed integer values (-2,147,483,648 to 2,147,483,647).*

```javascript
// Example 1: Storing large 32-bit integers
const int32 = new Int32Array([100000, 200000]);
console.log(int32[0]); 
// Output: 100000

// Example 2: Array length vs byte length
const data = new Int32Array(5);
console.log(data.length, data.byteLength); 
// Output: 5 20

// Example 3: Iterating with map
const tripled = new Int32Array([1, 2, 3]).map((v) => v * 3);
console.log(tripled[2]); 
// Output: 9

```

---

## 15. Float16Array

*A typed array storing fixed-size 16-bit half-precision floating-point numbers.*

```javascript
// Example 1: Storing 16-bit float values
const float16 = new Float16Array([1.5, 2.25, 3.125]);
console.log(float16[0]); 
// Output: 1.5

// Example 2: Memory footprint checking
const buffer = new Float16Array(10);
console.log(buffer.byteLength); 
// Output: 20 (10 elements * 2 bytes each)

// Example 3: Precision limitation handling
const f16 = new Float16Array([3.1415926535]);
console.log(f16[0].toFixed(3)); 
// Output: "3.141"

```

---

## 16. Float32Array

*A typed array storing fixed-size 32-bit single-precision floating-point numbers.*

```javascript
// Example 1: Creating a Float32Array for WebGL or vector data
const vectors = new Float32Array([0.5, -0.25, 1.0]);
console.log(vectors[1]); 
// Output: -0.25

// Example 2: Single-precision float truncation
const f32 = new Float32Array([0.123456789012345]);
console.log(f32[0]); 
// Output: 0.12345679104328155 (truncated to 32-bit precision)

// Example 3: Byte length calculation
const positions = new Float32Array(3);
console.log(positions.byteLength); 
// Output: 12 (3 elements * 4 bytes each)

```

---

## 17. Float64Array

*A typed array storing fixed-size 64-bit double-precision floating-point numbers (equivalent to standard JS numbers).*

```javascript
// Example 1: Storing high-precision numbers
const float64 = new Float64Array([Math.PI, Math.E]);
console.log(float64[0]); 
// Output: 3.141592653589793

// Example 2: Memory allocation per item
const matrix = new Float64Array(2);
console.log(matrix.byteLength); 
// Output: 16 (2 elements * 8 bytes each)

// Example 3: Modifying float elements
const values = new Float64Array([10.5]);
values[0] *= 2;
console.log(values[0]); 
// Output: 21

```

---

## 18. BigInt64Array

*A typed array storing fixed-size 64-bit signed BigInt values.*

```javascript
// Example 1: Storing BigInt primitives
const big64 = new BigInt64Array([9007199254740995n, 100n]);
console.log(big64[0]); 
// Output: 9007199254740995n

// Example 2: Memory footprint verification
const bigArray = new BigInt64Array(5);
console.log(bigArray.byteLength); 
// Output: 40 (5 elements * 8 bytes each)

// Example 3: Performing BigInt operations within the array
const bigInts = new BigInt64Array([10n, 20n]);
console.log(bigInts[0] + bigInts[1]); 
// Output: 30n

```
