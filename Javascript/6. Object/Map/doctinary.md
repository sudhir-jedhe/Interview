**Create a Dictionary of Dates** is a popular DevTools/Frontend interview problem where you typically group dates or create a lookup table for fast access. [\[devtools.tech\]](https://devtools.tech/questions/s/create-a-dictionary-of-dates-or-frontend-interview-questions-or-problem-solving-practice---qid---Vp3l0UdgJIxFtSyF8nBh)

---

# Problem

Given:

```js
["2026-07-01", "2026-07-02", "2026-07-05"];
```

Create:

```js
{
  "2026-07-01": true,
  "2026-07-02": true,
  "2026-07-05": true
}
```

This provides **O(1)** lookup.

---

# Solution 1: Using reduce()

```js
function createDateDictionary(dates) {
  return dates.reduce((dictionary, date) => {
    dictionary[date] = true;

    return dictionary;
  }, {});
}
```

### Usage

```js
const dates = ["2026-07-01", "2026-07-02", "2026-07-05"];

const dictionary = createDateDictionary(dates);

console.log(dictionary);
```

### Output

```js
{
  "2026-07-01": true,
  "2026-07-02": true,
  "2026-07-05": true
}
```

---

# Solution 2: Using Map

Better for large datasets.

```js
function createDateMap(dates) {
  const map = new Map();

  for (const date of dates) {
    map.set(date, true);
  }

  return map;
}
```

Usage:

```js
const map = createDateMap(dates);

console.log(map.has("2026-07-02"));
```

Output:

```js
true;
```

---

# Calendar Interview Variant

Input:

```js
[
  {
    id: 1,
    date: "2026-07-01",
  },
  {
    id: 2,
    date: "2026-07-01",
  },
  {
    id: 3,
    date: "2026-07-02",
  },
];
```

Create:

```js
{
  "2026-07-01": [
    { id: 1 },
    { id: 2 }
  ],

  "2026-07-02": [
    { id: 3 }
  ]
}
```

### Solution

```js
function groupByDate(items) {
  const result = {};

  for (const item of items) {
    const date = item.date;

    if (!result[date]) {
      result[date] = [];
    }

    result[date].push(item);
  }

  return result;
}
```

---

# React Use Case

Useful for:

```text
✅ Date Picker

✅ Calendar

✅ Attendance Systems

✅ Event Schedulers

✅ Booking Systems
```

Example:

```js
const disabledDates = {
  "2026-07-01": true,
  "2026-07-02": true,
};

if (disabledDates[selectedDate]) {
  console.log("Date blocked");
}
```

---

# Time Complexity

### Object Dictionary

```text
Creation : O(n)

Lookup   : O(1)
```

### Map

```text
Creation : O(n)

Lookup   : O(1)
```

---

# Senior Interview Answer

> A date dictionary is typically implemented as an Object or Map where the date string is the key and the value is either a boolean, count, or list of records. This transforms repeated date searches from O(n) scans into O(1) lookups, which is useful in calendars, scheduling systems, and booking applications.

Your breakdown covers the core solutions and performance tradeoffs of the **Create a Dictionary of Dates** problem.

Here are important optimizations, modern JavaScript features, and interview edge cases that will strengthen this solution in a senior frontend technical interview.

---

### Modern Alternative 1: Native `Object.groupBy()` (ES2024+)

JavaScript introduced `Object.groupBy()` to natively handle grouping operations without writing boilerplate loops or accumulator reducers:

```javascript
const items = [
  { id: 1, date: "2026-07-01" },
  { id: 2, date: "2026-07-01" },
  { id: 3, date: "2026-07-02" },
];

// Modern native grouping in 1 line:
const grouped = Object.groupBy(items, (item) => item.date);

console.log(grouped);
/* Output:
{
  "2026-07-01": [{ id: 1, date: "..." }, { id: 2, date: "..." }],
  "2026-07-02": [{ id: 3, date: "..." }]
}
*/

```

---

### Modern Alternative 2: Modern ES6 `Set` for Boolean Existence Checks

If the goal is purely **membership checking** (e.g., checking if a date is blocked or available), a **`Set`** is semantically cleaner than storing `{ [date]: true }` objects or maps. It provides $O(1)$ lookup with a smaller memory footprint:

```javascript
const dates = ["2026-07-01", "2026-07-02", "2026-07-05"];

// Convert array directly into a Set:
const dateSet = new Set(dates);

// O(1) membership check:
console.log(dateSet.has("2026-07-02")); // true
console.log(dateSet.has("2026-07-03")); // false

```

---

### Critical Interview Edge Cases & Refinements

#### 1. Preventing Prototype Pollution Attacks

Using plain object literals (`{}`) as dictionaries exposes your code to prototype key collision risks if keys come from user input (e.g., `"toString"`, `"__proto__"`, or `"constructor"`).

In production, use **`Object.create(null)`** or **`Map`** to create dictionary objects without prototype inheritance:

```javascript
// Safe dictionary creation (no prototype pollution):
function createSafeDateDictionary(dates) {
  const dictionary = Object.create(null);
  for (const date of dates) {
    dictionary[date] = true;
  }
  return dictionary;
}

```

#### 2. Timezone Normalization Issues

Date strings formatted as ISO timestamps (e.g., `"2026-07-01T00:00:00.000Z"`) can break dictionary lookups if client applications operate in different time zones:

* **Interview Trap:** Passing `new Date("2026-07-01").toISOString()` across client timezones shifts dates depending on UTC offset.
* **Senior Answer:** Always standardize keys to **`YYYY-MM-DD` string keys in local or UTC context** before indexing into the dictionary.

---

### Comparison of Lookup Data Structures

| Metric / Feature       | Plain Object `{}`                     | Modern `Set`              | Modern `Map`               |
| ---------------------- | ------------------------------------- | ------------------------- | -------------------------- |
| **Primary Use Case**   | Record grouping (`groupBy`)           | Simple membership check   | Heavy dynamic key addition |
| **Lookup Performance** | $O(1)$                                | $O(1)$                    | $O(1)$                     |
| **Prototype Safety**   | Unsafe (unless `Object.create(null)`) | **Safe**                  | **Safe**                   |
| **Iteration Order**    | Inconsistent across engines           | Insertion order preserved | Insertion order preserved  |

Both **`Object.groupBy`** and **`Map.groupBy`** were introduced in ECMAScript 2024 (ES2024) to standardize data grouping in JavaScript. They eliminate the need for custom `Array.prototype.reduce()` boilerplate or third-party utilities like Lodash’s `_.groupBy`.

While both functions take an iterable collection and a callback function (grouping criteria), they differ in **returned data structures**, **key type support**, and **prototype safety**.

---

### Syntax Comparison

```javascript
// Object.groupBy returns a null-prototype object {}
const objResult = Object.groupBy(iterable, callbackFn);

// Map.groupBy returns a native Map instance
const mapResult = Map.groupBy(iterable, callbackFn);

```

The callback function receives `(element, index)` and must return the grouping key.

---

### Key Differences Summary

| Feature               | `Object.groupBy()`                                                                | `Map.groupBy()`                                                    |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Return Type**       | Plain Object with a `null` prototype (`Object.create(null)`)                      | Native `Map` instance                                              |
| **Allowed Key Types** | **Primitives only** (Strings or Symbols). non-string keys are coerced to strings. | **Any JavaScript Type** (Objects, Functions, Primitives, Symbols). |
| **Key Coercion**      | Coerces grouping keys via `String(key)` or `Symbol`.                              | No coercion (Uses same-value equality via `SameValueZero`).        |
| **Lookup Method**     | Property access (`result['key']`)                                                 | Map API (`result.get(key)`)                                        |
| **Prototype Safety**  | Fully safe (Inherits no properties like `toString` or `__proto__`).               | Fully safe (Standard `Map` isolation).                             |

---

### 1. `Object.groupBy()` — For String/Primitive Keys

`Object.groupBy()` is ideal for traditional grouping scenarios where keys are strings, numbers, or boolean values.

```javascript
const inventory = [
  { name: "Apples", category: "Fruit", quantity: 5 },
  { name: "Bananas", category: "Fruit", quantity: 0 },
  { name: "Carrots", category: "Vegetable", quantity: 10 },
];

// Group by category string
const groupedByCat = Object.groupBy(inventory, (item) => item.category);

console.log(groupedByCat);
/*
Output (null-prototype object):
{
  Fruit: [
    { name: "Apples", category: "Fruit", quantity: 5 },
    { name: "Bananas", category: "Fruit", quantity: 0 }
  ],
  Vegetable: [
    { name: "Carrots", category: "Vegetable", quantity: 10 }
  ]
}
*/

// Group by stock availability (Boolean key coerced to string "inStock" / "outOfStock")
const stockStatus = Object.groupBy(inventory, (item) => 
  item.quantity > 0 ? "inStock" : "outOfStock"
);

console.log(stockStatus.inStock); // Access via standard property lookup

```

#### Important Property: Null Prototype

`Object.groupBy()` returns an object created via `Object.create(null)`. This means it does **not** inherit from `Object.prototype`, protecting your code against prototype pollution or property collisions with methods like `toString` or `hasOwnProperty`:

```javascript
const result = Object.groupBy(["a"], () => "toString");

// Safe! Does not conflict with Object.prototype.toString
console.log(result.toString); // [{ name: ... }] (Array, not a function)

```

---

### 2. `Map.groupBy()` — For Non-String & Complex Object Keys

`Map.groupBy()` shines when you want to group items by **complex references** (objects, DOM nodes, functions) or keep non-coerced primitive types.

```javascript
const rest1 = { name: "Italian Bistro", rating: 4.5 };
const rest2 = { name: "Burger Joint", rating: 3.8 };
const rest3 = { name: "Sushi Bar", rating: 4.8 };

// Define object key groups
const highRatingGroup = { label: "Top Rated (>= 4.0)" };
const averageRatingGroup = { label: "Average (< 4.0)" };

const restaurants = [rest1, rest2, rest3];

// Group using actual Object references as keys!
const groupedByRating = Map.groupBy(restaurants, (restaurant) => {
  return restaurant.rating >= 4.0 ? highRatingGroup : averageRatingGroup;
});

console.log(groupedByRating.get(highRatingGroup));
// Returns: [{ name: "Italian Bistro", ... }, { name: "Sushi Bar", ... }]

```

#### Why `Object.groupBy` Fails in This Case

If you passed objects as keys into `Object.groupBy`, JavaScript would coerce them into strings (`"[object Object]"`), overriding previous groups:

```javascript
// ❌ WRONG TOOL FOR OBJECT KEYS:
const badGroup = Object.groupBy(restaurants, (r) => 
  r.rating >= 4.0 ? highRatingGroup : averageRatingGroup
);

// All groups get coerced to key "[object Object]", losing classification!
console.log(Object.keys(badGroup)); // [" [object Object] "]

```

---

### When to Use Which?

1. **Use `Object.groupBy()` when:**

* You are grouping by strings, numbers, or enum states.
* You want to access results using standard JavaScript object notation (`grouped['Fruit']` or `grouped.Fruit`).
* You plan to serialize the output directly with `JSON.stringify()` (since `Map` requires custom replacers to serialize).

1. **Use `Map.groupBy()` when:**

* Your grouping keys are **objects, instances, functions, or DOM nodes**.
* You need to maintain non-string key types (e.g., keeping numeric keys as numbers rather than strings).
* You want to use standard `Map` iteration methods (`.keys()`, `.values()`, `.entries()`, `.has()`).

A **`WeakMap`** is a specialized, collection-type key-value store in JavaScript designed specifically to attach metadata to objects without interfering with the V8 engine's **Garbage Collection (GC)** lifecycle.

Unlike standard objects or `Map` instances, a `WeakMap` holds **"weak" references** to its keys.

---

### How `WeakMap` Works Under the Hood

To understand why `WeakMap` prevents memory leaks, we first need to look at how JavaScript handles standard "strong" references versus weak references.

#### 1. Strong References (`Map` and Objects)

In a standard `Map` or plain JavaScript object, adding an object as a key creates a **strong reference** to that object in memory.

```javascript
let user = { name: "Alice" };
const userMetadata = new Map();

// Map holds a STRONG reference to { name: "Alice" }
userMetadata.set(user, { role: "admin" });

// Clear our primary reference to the object:
user = null;

// RESULT: The object { name: "Alice" } is STILL in memory!
// The Map still holds a pointer to it, so Garbage Collection CANNOT free it.
console.log(userMetadata.size); // 1

```

Because the `Map` holds a strong reference, the object stays alive in heap memory until you explicitly call `userMetadata.delete(user)` or clear the map. If you forget to clear it, you create a **Memory Leak**.

#### 2. Weak References (`WeakMap`)

In a `WeakMap`, keys **must be non-primitive values** (Objects or Symbols). A `WeakMap` holds a **weak reference** to its key objects.

```javascript
let user = { name: "Alice" };
const userMetadata = new WeakMap();

// WeakMap holds a WEAK reference to { name: "Alice" }
userMetadata.set(user, { role: "admin" });

// Clear our primary reference:
user = null;

// RESULT: { name: "Alice" } has no remaining STRONG references.
// The Garbage Collector will automatically sweep it AND its associated metadata!

```

---

### How `WeakMap` Prevents Memory Leaks

The garbage collector determines whether an object is "reachable" by tracing strong reference paths from the root scope (`window` or `global`).

* **Reachability Rule:** Weak references are **ignored** by the garbage collector when tracing reachable memory.
* **Automatic Cleanup:** As soon as the key object loses all strong references anywhere else in the application, the object becomes eligible for garbage collection.
* **Metadata Removal:** When the garbage collector frees the key object, the corresponding key-value pair inside the `WeakMap` is automatically destroyed at the native engine level—with zero manual intervention required.

---

### Key API Restrictions of `WeakMap`

Because keys can disappear at any moment when garbage collection runs in the background, `WeakMap` enforces strict API limitations:

1. **Keys must be Objects or Symbols:** Primitives (`String`, `Number`, `Boolean`) are value-based and never garbage collected, so they cannot be used as keys.
2. **Not Enumerable:** You **cannot** iterate over a `WeakMap`. Methods like `.keys()`, `.values()`, `.entries()`, or `.forEach()` **do not exist**.
3. **No `.size` Property:** You cannot query the length or size of a `WeakMap` because the count is non-deterministic (depends on when the JS engine's garbage collector sweeps memory).
4. **Supported Methods Only:** Only four methods exist:

* `.set(key, value)`
* `.get(key)`
* `.has(key)`
* `.delete(key)`

---

### Real-World Use Cases

#### 1. Attaching Private Metadata to DOM Elements

If you are building a UI component or library (e.g., custom tooltips or drag-and-drop listeners) and want to associate state with a DOM element:

```javascript
const elementState = new WeakMap();

function initializeWidget(domElement) {
  elementState.set(domElement, { clickCount: 0, isOpen: false });

  domElement.addEventListener("click", () => {
    const state = elementState.get(domElement);
    state.clickCount++;
  });
}

// When the DOM element is removed from the DOM tree (e.g., element.remove()):
// Once the DOM node is garbage collected, elementState automatically frees 
// the associated state object with NO risk of memory leakage!

```

#### 2. Truly Private Instance State in Classes

Before private class fields (`#field`), `WeakMap` was the primary tool for implementing true private properties in ES6 classes:

```javascript
const privateData = new WeakMap();

class User {
  constructor(name, secretToken) {
    // Store private state mapped to 'this' instance
    privateData.set(this, { token: secretToken });
    this.name = name;
  }

  getSecretToken() {
    return privateData.get(this).token;
  }
}

// When a User instance is destroyed, its privateData entry is swept automatically!

```

#### 3. Memoization / Caching Objects

`WeakMap` is ideal for caching computed results derived from objects without preventing those objects from being freed:

```javascript
const cache = new WeakMap();

function processHeavyObject(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  const result = expensiveComputation(obj);
  cache.set(obj, result);
  return result;
}

```

---

### `Map` vs `WeakMap` Feature Comparison

| Metric / Feature       | `Map`                                        | `WeakMap`                         |
| ---------------------- | -------------------------------------------- | --------------------------------- |
| **Key Types**          | Any JS Type (Primitives, Objects, Functions) | **Objects and Symbols only**      |
| **Reference Type**     | Strong                                       | **Weak**                          |
| **Garbage Collection** | Prevents GC of key objects                   | **Allows GC of key objects**      |
| **Iterability**        | Iterable (`for..of`, `.forEach()`)           | **Non-iterable**                  |
| **Size Knowledge**     | Has `.size` property                         | **No `.size` property**           |
| **Memory Leak Risk**   | High (Requires manual cleanup)               | **Zero** (Auto-cleared by engine) |

A **`WeakSet`** is a specialized collection in JavaScript that functions similarly to a standard `Set`, but with two fundamental differences: it **can only store non-primitive objects (or Symbols)**, and it holds **weak references** to those items.

Just like `WeakMap`, `WeakSet` is designed to work in harmony with the JavaScript engine's **Garbage Collector (GC)** to prevent memory leaks.

---

### How `WeakSet` Works

When you add an object to a standard `Set`, the set creates a **strong reference** to that object, preventing the garbage collector from freeing it even if all other variables pointing to that object are cleared:

```javascript
// Standard Set (Strong Reference)
let user = { name: "Alice" };
const activeUsers = new Set();

activeUsers.add(user);
user = null; // We clear our primary reference

// The object { name: "Alice" } CANNOT be garbage collected
// because activeUsers still holds a strong reference to it!
console.log(activeUsers.size); // 1

```

In a **`WeakSet`**, the collection holds only a **weak reference** to its values:

```javascript
// WeakSet (Weak Reference)
let user = { name: "Alice" };
const activeUsers = new WeakSet();

activeUsers.add(user);
user = null; // We clear our primary reference

// The object { name: "Alice" } has NO remaining strong references.
// The Garbage Collector will automatically sweep it from memory!

```

---

### API Restrictions of `WeakSet`

Because elements can be garbage-collected at any non-deterministic moment in the background, `WeakSet` enforces strict limitations:

1. **Values must be Objects or Symbols:** Primitive values (`number`, `string`, `boolean`) are not allowed because they are not garbage-collected entities.
2. **Not Iterable:** You **cannot** use `for...of` loops, `.forEach()`, or spread operators (`[...weakSet]`).
3. **No `.size` Property:** You cannot query how many items are in a `WeakSet`.
4. **Minimal API Surface:** Only three methods exist:

* `.add(value)`
* `.has(value)`
* `.delete(value)`

---

### Key Use Cases for `WeakSet`

Since `WeakSet` only stores presence/membership (a boolean check of whether an object exists in the set or not), its use cases are specific to **tagging or tracking objects without mutating them**.

#### 1. Tracking Processed Objects (Preventing Circular Loops)

When recursing through complex object graphs, you can tag objects you've already visited to avoid infinite recursion loops without preventing those objects from being freed:

```javascript
const visitedObjects = new WeakSet();

function processTree(node) {
  if (visitedObjects.has(node)) {
    return; // Already processed or circular reference detected!
  }

  visitedObjects.add(node);

  // Process child nodes recursively...
  for (const child of node.children || []) {
    processTree(child);
  }
}

```

#### 2. DOM Node Tagging / Flagging

If you need to mark specific DOM elements as having a state (e.g., "initialized", "disabled", or "drag-enabled") without adding custom HTML attributes or mutating the DOM node properties directly:

```javascript
const initializedWidgets = new WeakSet();

function setupWidget(element) {
  if (initializedWidgets.has(element)) {
    console.log("Widget already initialized!");
    return;
  }

  initializedWidgets.add(element);
  // Perform setup (attach event listeners, build UI, etc.)
}

// When element is removed from the DOM and discarded, 
// its entry in initializedWidgets is automatically garbage collected!

```

---

### `WeakSet` vs `WeakMap`: Direct Comparison

While both collections use weak references and prevent memory leaks, they serve fundamentally different purposes:

| Feature              | `WeakSet`                                                 | `WeakMap`                                            |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------------- |
| **Data Model**       | Set of **Values** (Membership tracking)                   | **Key-Value Pairs** (Metadata association)           |
| **Primary Purpose**  | Checking *if an object belongs to a collection* (`has()`) | Associating *extra data with an object* (`get(key)`) |
| **Stored Items**     | Objects / Symbols only                                    | Keys = Objects/Symbols, Values = **Any Type**        |
| **Example Use Case** | Tracking initialized DOM nodes or visited nodes           | Storing private instance fields or component state   |

#### Code Example Contrast

```javascript
// WeakSet: "Is this DOM node marked as selected?"
const selectedNodes = new WeakSet();
selectedNodes.add(domNode);
if (selectedNodes.has(domNode)) { /* ... */ }

// WeakMap: "What extra metadata belongs to this DOM node?"
const nodeMetadata = new WeakMap();
nodeMetadata.set(domNode, { clickCount: 5, lastUpdated: Date.now() });
const data = nodeMetadata.get(domNode);

```

---

### Summary Checklist

* **Use `Set**` when you need a unique list of primitives or need to iterate over all items.
* **Use `WeakSet**` when you want to **tag objects with a boolean flag** without preventing garbage collection.
* **Use `WeakMap**` when you want to **attach extra data or key-value metadata to an object** without modifying the original object.
