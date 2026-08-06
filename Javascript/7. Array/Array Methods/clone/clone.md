# 1. Shallow Copy vs Deep Copy

## Shallow Copy

A shallow copy creates a **new array**, but the nested objects/arrays inside it still reference the **same memory location**.

```javascript
const original = [
  { name: "John" },
  { name: "Jane" }
];

const shallowCopy = [...original];

shallowCopy[0].name = "Mike";

console.log(original);
// [{ name: 'Mike' }, { name: 'Jane' }]
```

### Memory  2

```text
original --------┐
                 ├──► { name: "John" }
shallowCopy -----┘

original --------┐
                 ├──► { name: "Jane" }
shallowCopy -----┘
```

Both arrays point to the same objects.

***

## Deep Copy

A deep copy creates:

* New array
* New nested objects
* New nested arrays

Everything is copied recursively.

```javascript
const original = [
  { name: "John" },
  { name: "Jane" }
];

const deepCopy = structuredClone(original);

deepCopy[0].name = "Mike";

console.log(original);
// [{ name: 'John' }, { name: 'Jane' }]

console.log(deepCopy);
// [{ name: 'Mike' }, { name: 'Jane' }]
```

## Memory Representation 1

```text
original  ---> { name: "John" }
deepCopy  ---> { name: "John" }

Different memory references
```

***

## 2. Cloning Arrays with Nested Objects 1

## Problem with Array.from()

```javascript
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" }
];

const cloned = Array.from(users);

cloned[0].name = "Mike";

console.log(users[0].name);
// Mike ❌
```

Because:

```javascript
Array.from()
Spread (...)
slice()
concat()
```

all create only a **shallow copy**.

***

## Solution 1: Map + Object Spread

For one level of nesting:

```javascript
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" }
];

const cloned = users.map(user => ({
  ...user
}));

cloned[0].name = "Mike";

console.log(users[0].name);
// John ✅
```

***

## Problem with Deeply Nested Objects

```javascript
const users = [
  {
    id: 1,
    profile: {
      city: "London"
    }
  }
];

const cloned = users.map(user => ({
  ...user
}));

cloned[0].profile.city = "Paris";

console.log(users[0].profile.city);
// Paris ❌
```

Because only the first level was copied.

***

## Solution 2: structuredClone()

Modern JavaScript:

```javascript
const users = [
  {
    id: 1,
    profile: {
      city: "London"
    }
  }
];

const cloned = structuredClone(users);

cloned[0].profile.city = "Paris";

console.log(users[0].profile.city);
// London ✅
```

Recommended approach for deep cloning.

***

## Solution 3: JSON Trick

Older approach:

```javascript
const cloned = JSON.parse(
  JSON.stringify(users)
);
```

Works for:

```javascript
Objects
Arrays
Strings
Numbers
Booleans
```

Doesn't work correctly with:

```javascript
Date
Map
Set
Function
undefined
BigInt
```

***

## 3. Array.from() vs Spread Operator

## Example

### Array.from()

```javascript
const arr = [1, 2, 3];

const copy = Array.from(arr);

console.log(copy);
```

### Spread

```javascript
const arr = [1, 2, 3];

const copy = [...arr];

console.log(copy);
```

Same output:

```javascript
[1, 2, 3]
```

***

## Key Differences

| Feature                       | Array.from() | Spread (...) |
| ----------------------------- | ------------ | ------------ |
| Clone array                   | ✅            | ✅            |
| Convert iterable to array     | ✅            | ✅            |
| Map while copying             | ✅            | ❌            |
| Works with array-like objects | ✅            | ❌            |
| More readable for cloning     | ❌            | ✅            |
| Shallow copy only             | ✅            | ✅            |

***

## Mapping Capability

### Array.from()

```javascript
const arr = [1, 2, 3];

const doubled = Array.from(
  arr,
  item => item * 2
);

console.log(doubled);
```

Output:

```javascript
[2, 4, 6]
```

***

### Spread Needs map()

```javascript
const doubled = [...arr].map(
  item => item * 2
);
```

Two operations instead of one.

***

## Array-Like Objects

Works with:

```javascript
function demo() {
  const args = Array.from(arguments);

  console.log(args);
}

demo(1, 2, 3);
```

Output:

```javascript
[1, 2, 3]
```

Spread fails:

```javascript
const args = [...arguments];
```

❌ `arguments is not iterable` (in many environments)

***

## Generate Arrays

### Array.from()

```javascript
const numbers = Array.from(
  { length: 5 },
  (_, index) => index + 1
);

console.log(numbers);
```

Output:

```javascript
[1, 2, 3, 4, 5]
```

Very useful in React:

```javascript
Array.from(
  { length: totalPages },
  (_, i) => i + 1
);
```

Pagination buttons.

***

# React Interview Takeaway

```javascript
Spread (...)       → Best for cloning simple arrays
Array.from()       → Clone + transform + array-like conversion
structuredClone()  → Best deep clone solution
JSON.stringify()   → Legacy deep clone solution
```

### Common Interview Question

What is the output?

```javascript
const arr = [{ count: 1 }];

const cloned = [...arr];

cloned[0].count++;

console.log(arr[0].count);
```

✅ Output:

```javascript
2
```

Reason: Spread performs a **shallow copy**, so both arrays reference the same object.

# Deep Cloning Nested Arrays

## Problem: Shallow Copy

```javascript
const original = [
  [1, 2],
  [3, 4]
];

const cloned = [...original];

cloned[0][0] = 999;

console.log(original);
```

### Output

```javascript
[
  [999, 2],
  [3, 4]
]
```

❌ Original array changed because spread only copies the first level.

***

## Example 1: Manually Deep Clone Nested Arrays

```javascript
const original = [
  [1, 2],
  [3, 4]
];

const deepClone = original.map(inner => [...inner]);

deepClone[0][0] = 999;

console.log(original);
console.log(deepClone);
```

### Output

```javascript
original:
[
  [1, 2],
  [3, 4]
]

deepClone:
[
  [999, 2],
  [3, 4]
]
```

✅ Original remains unchanged.

***

## Example 2: Nested Objects Inside Arrays

```javascript
const users = [
  {
    id: 1,
    address: {
      city: "Pune"
    }
  }
];

const clonedUsers = structuredClone(users);

clonedUsers[0].address.city = "Mumbai";

console.log(users);
console.log(clonedUsers);
```

### Output

```javascript
users:

[
  {
    id: 1,
    address: {
      city: "Pune"
    }
  }
]

clonedUsers:

[
  {
    id: 1,
    address: {
      city: "Mumbai"
    }
  }
]
```

✅ Completely independent copies.

***

# Best Deep Cloning Methods

## Modern Approach

```javascript
const clone = structuredClone(original);
```

Handles:

```text
✅ Objects
✅ Arrays
✅ Nested Objects
✅ Nested Arrays
✅ Date
✅ Map
✅ Set
✅ Circular References
```

***

## Old Approach

```javascript
const clone = JSON.parse(
  JSON.stringify(original)
);
```

Limitations:

```text
❌ Date
❌ Functions
❌ Map
❌ Set
❌ undefined
❌ BigInt
```

***

# Array.from() vs Spread Operator Performance

## Clone Array

### Using Spread

```javascript
const clone = [...arr];
```

### Using Array.from

```javascript
const clone = Array.from(arr);
```

***

## Performance Benchmark

```javascript
const arr =
  Array.from({ length: 100000 }, (_, i) => i);

console.time("Spread");

const spreadCopy = [...arr];

console.timeEnd("Spread");

console.time("Array.from");

const fromCopy = Array.from(arr);

console.timeEnd("Array.from");
```

Example results (vary by engine):

```text
Spread: 2ms
Array.from: 3ms
```

Generally:

```text
Spread      → Slightly Faster
Array.from  → Slightly Slower
```

Reason:

`Array.from()` performs additional checks and supports mapping.

***

# Transformation Benchmark

### Array.from

```javascript
const doubled =
  Array.from(arr, x => x * 2);
```

### Spread + map

```javascript
const doubled =
  [...arr].map(x => x * 2);
```

### Performance

```text
Array.from()      → Single pass
Spread + map()    → Two passes
```

Therefore:

```text
Array.from(arr, mapper)
```

is often more memory-efficient.

***

## Memory Comparison

### Spread

```javascript
const result = [...arr];
```

Memory:

```text
Original Array
      ↓
New Array
```

***

### Array.from

```javascript
const result = Array.from(arr);
```

Memory:

```text
Original Array
      ↓
New Array
```

Almost identical.

***

# Interview Comparison Table

| Feature                    | Spread (...) | Array.from()    |
| -------------------------- | ------------ | --------------- |
| Clone Array                | ✅            | ✅               |
| Shallow Copy               | ✅            | ✅               |
| Deep Copy                  | ❌            | ❌               |
| Convert String to Array    | ✅            | ✅               |
| Convert Set to Array       | ✅            | ✅               |
| Convert Array-Like Objects | ❌ Limited    | ✅               |
| Mapping During Copy        | ❌            | ✅               |
| Performance for Cloning    | ✅ Faster     | Slightly Slower |
| Single-pass Transformation | ❌            | ✅               |
| Readability                | ✅ Best       | Good            |

***

# React Interview Answer (1-Minute Version)

```text
Spread (...) and Array.from() both create shallow copies.

For simple array cloning, spread is shorter and slightly faster:

const clone = [...arr];

Array.from() is useful when:
1. Converting array-like objects.
2. Converting iterables.
3. Applying a mapping function during cloning.

Neither performs a deep copy.

For deep cloning nested arrays/objects:
const clone = structuredClone(data);

This creates completely independent copies of nested structures.
```

### Common Interview Question

```javascript
const arr = [
  [1, 2],
  [3, 4]
];

const copy = [...arr];

copy[0][0] = 100;

console.log(arr[0][0]);
```

✅ **Output:**

```javascript
100
```

**Reason:** Spread creates a shallow copy, so the inner arrays are still shared references.

# 1. Deep Clone with Circular References

A circular reference occurs when an object references itself.

```javascript
const person = {
  name: "John"
};

person.self = person;

console.log(person.self === person);
// true
```

### JSON Method Fails

```javascript
JSON.parse(JSON.stringify(person));
```

❌ Error:

```text
TypeError: Converting circular structure to JSON
```

***

## Using `structuredClone()`

```javascript
const person = {
  name: "John"
};

person.self = person;

const cloned = structuredClone(person);

console.log(cloned.name);
console.log(cloned.self === cloned);
```

### Output

```javascript
John
true
```

Memory diagram:

```text
Original
 └── self ──► Original

Clone
 └── self ──► Clone
```

✅ Circular references preserved correctly.

***

## Circular References in Nested Arrays

```javascript
const arr = [1, 2, 3];

arr.push(arr);

console.log(arr);
```

Structure:

```text
[
  1,
  2,
  3,
  arr
]
```

Deep clone:

```javascript
const cloned = structuredClone(arr);

console.log(cloned[3] === cloned);
```

Output:

```javascript
true
```

✅ The clone points to itself, not the original.

***

# 2. When to Prefer Spread Over Array.from()

## Prefer Spread for Simple Cloning

```javascript
const arr = [1, 2, 3];

const copy = [...arr];
```

Advantages:

✅ Shorter syntax

✅ Easier to read

✅ Slightly faster in most engines

✅ Most common in React codebases

***

### React Example

```javascript
setUsers(prev => [...prev, newUser]);
```

Very common pattern.

***

## Prefer Array.from() When Converting Array-Like Objects

### `arguments`

```javascript
function demo() {
  const args = Array.from(arguments);

  console.log(args);
}

demo(1, 2, 3);
```

Output:

```javascript
[1, 2, 3]
```

***

## Prefer Array.from() When Transforming During Copy

### Single Pass

```javascript
const arr = [1, 2, 3];

const doubled = Array.from(
  arr,
  x => x * 2
);
```

Output:

```javascript
[2, 4, 6]
```

Equivalent spread version:

```javascript
const doubled =
  [...arr].map(x => x * 2);
```

Array.from does cloning + transformation together.

***

## Generating Arrays

```javascript
const pages =
  Array.from(
    { length: 5 },
    (_, i) => i + 1
  );

console.log(pages);
```

Output:

```javascript
[1, 2, 3, 4, 5]
```

Perfect for pagination components in React.

***

# Quick Rule

### Use Spread When

```javascript
const copy = [...arr];
```

* Simple clone
* React state updates
* Merging arrays
* Readability matters

***

### Use Array.from When

```javascript
Array.from(data, mapper)
```

* Converting array-like objects
* Generating arrays
* Cloning + mapping in one operation

***

# 3. Summary of Deep Cloning Methods for Nested Arrays

## Method 1: Spread

```javascript
const clone = [...arr];
```

### Result

```text
✅ New outer array
❌ Nested arrays shared
❌ Nested objects shared
```

Example:

```javascript
const arr = [[1, 2]];

const clone = [...arr];

clone[0][0] = 100;

console.log(arr[0][0]);
// 100
```

***

## Method 2: One-Level Deep Clone

```javascript
const clone =
  arr.map(inner => [...inner]);
```

### Result

```text
✅ Copies nested arrays
❌ Fails for nested objects
❌ Fails for deeply nested structures
```

***

## Method 3: Object Spread

```javascript
const clone =
  users.map(user => ({
    ...user
  }));
```

### Result

```text
✅ Copies first level
❌ Nested objects shared
```

***

## Method 4: JSON Trick

```javascript
const clone =
  JSON.parse(
    JSON.stringify(data)
  );
```

### Result

```text
✅ Deep clone arrays
✅ Deep clone objects
❌ No Date
❌ No Map
❌ No Set
❌ No Functions
❌ No Circular References
```

***

## Method 5: structuredClone (Recommended)

```javascript
const clone =
  structuredClone(data);
```

### Result

```text
✅ Nested arrays
✅ Nested objects
✅ Date
✅ Map
✅ Set
✅ TypedArrays
✅ Circular References
✅ Production-ready
```

Example:

```javascript
const data = [
  {
    user: {
      address: {
        city: "Pune"
      }
    }
  }
];

const clone = structuredClone(data);

clone[0].user.address.city = "Mumbai";

console.log(data[0].user.address.city);
```

Output:

```javascript
Pune
```

✅ Original remains untouched.

***

# Interview Cheat Sheet

```javascript
// Shallow copy
const copy1 = [...arr];
const copy2 = Array.from(arr);

// Deep copy (modern)
const copy3 = structuredClone(arr);

// Deep copy (legacy)
const copy4 =
  JSON.parse(JSON.stringify(arr));
```

**Best Practice (2026):**

```javascript
structuredClone()
```

Use it whenever you need a true deep clone of nested arrays, objects, Maps, Sets, Dates, or circular references.

# 1. Limitations of `structuredClone()`

`structuredClone()` is the modern, recommended deep-cloning API, but it has some limitations.

***

## ✅ What It Supports

```javascript
const data = {
  arr: [1, 2, 3],
  date: new Date(),
  map: new Map(),
  set: new Set(),
  nested: {
    city: "Pune"
  }
};

const clone = structuredClone(data);
```

Supports:

* Arrays
* Objects
* Nested structures
* Date
* Map
* Set
* RegExp
* ArrayBuffer
* TypedArrays
* Circular references

***

## ❌ Cannot Clone Functions

```javascript
const user = {
  name: "John",
  greet() {
    console.log("Hello");
  }
};

structuredClone(user);
```

Output:

```text
DataCloneError:
function could not be cloned
```

***

## ❌ Cannot Clone DOM Elements

```javascript
const div = document.createElement("div");

structuredClone(div);
```

Throws:

```text
DataCloneError
```

***

## ❌ Prototype Chain Is Not Preserved

### Original

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}

const person = new Person("John");
```

### Clone

```javascript
const cloned = structuredClone(person);

console.log(cloned instanceof Person);
```

Output:

```javascript
false
```

Methods are lost.

```javascript
console.log(cloned.greet);
```

Output:

```javascript
undefined
```

Because only data is cloned.

***

## ❌ WeakMap / WeakSet

```javascript
const data = {
  cache: new WeakMap()
};

structuredClone(data);
```

Throws:

```text
DataCloneError
```

***

# 2. Deep Clone Example with Map

## Original

```javascript
const users = new Map();

users.set(1, {
  name: "John",
  address: {
    city: "Pune"
  }
});
```

Deep clone:

```javascript
const clonedUsers =
  structuredClone(users);

clonedUsers.get(1)
  .address.city = "Mumbai";

console.log(
  users.get(1).address.city
);

console.log(
  clonedUsers.get(1).address.city
);
```

### Output

```javascript
Pune
Mumbai
```

✅ Nested objects inside Map are cloned.

***

# 3. Deep Clone Example with Set

## Original

```javascript
const skills = new Set([
  {
    name: "React"
  },
  {
    name: "TypeScript"
  }
]);
```

Deep clone:

```javascript
const clonedSkills =
  structuredClone(skills);

const firstSkill =
  [...clonedSkills][0];

firstSkill.name = "Angular";

console.log(
  [...skills][0].name
);

console.log(
  [...clonedSkills][0].name
);
```

### Output

```javascript
React
Angular
```

✅ Objects inside Set are cloned.

***

# 4. Map + Set Together

```javascript
const company = {
  employees: new Map([
    [
      1,
      {
        name: "John"
      }
    ]
  ]),
  technologies: new Set([
    "React",
    "Node"
  ])
};

const clone =
  structuredClone(company);

clone.employees
  .get(1).name = "Mike";

clone.technologies
  .add("TypeScript");

console.log(
  company.employees.get(1).name
);

console.log(
  company.technologies
);
```

Output:

```javascript
John

Set {
  "React",
  "Node"
}
```

✅ Completely independent clone.

***

# JSON vs structuredClone()

## JSON Method

```javascript
const clone =
  JSON.parse(
    JSON.stringify(data)
  );
```

### Advantages

✅ Works everywhere

✅ Easy to understand

✅ Good for API payloads

✅ Good for plain objects

***

### Limitations

```javascript
const data = {
  date: new Date(),
  map: new Map(),
  set: new Set(),
  value: undefined
};
```

After cloning:

```javascript
{
  date: "2026-07-03T10:00:00Z",
  map: {},
  set: {},
}
```

Problems:

```text
❌ Date becomes string
❌ Map lost
❌ Set lost
❌ Functions lost
❌ undefined lost
❌ Circular references fail
```

***

## structuredClone()

```javascript
const clone =
  structuredClone(data);
```

Advantages:

```text
✅ Arrays
✅ Objects
✅ Nested structures
✅ Date
✅ Map
✅ Set
✅ Circular references
✅ TypedArrays
✅ RegExp
```

***

# Quick Comparison

| Feature                | JSON | structuredClone |
| ---------------------- | ---- | --------------- |
| Nested Arrays          | ✅    | ✅               |
| Nested Objects         | ✅    | ✅               |
| Date                   | ❌    | ✅               |
| Map                    | ❌    | ✅               |
| Set                    | ❌    | ✅               |
| Circular References    | ❌    | ✅               |
| TypedArrays            | ❌    | ✅               |
| Functions              | ❌    | ❌               |
| WeakMap                | ❌    | ❌               |
| Prototype Preservation | ❌    | ❌               |

***

# React Interview Cheat Sheet

### Use Spread

```javascript
const clone = [...arr];
```

When:

* Simple array clone
* State updates
* No nested mutations

***

### Use JSON

```javascript
JSON.parse(
  JSON.stringify(data)
);
```

When:

* Data contains only:
  * Strings
  * Numbers
  * Booleans
  * Arrays
  * Plain Objects

***

### Use structuredClone ⭐

```javascript
const clone =
  structuredClone(data);
```

When:

* Nested arrays
* Nested objects
* Date
* Map
* Set
* Circular references
* Production-grade deep cloning

This is the answer most interviewers expect for modern JavaScript (ES2022+) deep cloning.

# 1. Cloning Objects with Functions and Prototypes

One of the biggest limitations of `structuredClone()` is that it only clones **data**, not **behaviour**.

***

## Example: Class Instance

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}

const user = new User("Sudhir");

const cloned = structuredClone(user);

console.log(cloned);
console.log(cloned instanceof User);
console.log(cloned.greet);
```

### Output

```javascript
{ name: 'Sudhir' }

false
undefined
```

### Why?

`structuredClone()` copies:

```javascript
{
  name: 'Sudhir'
}
```

But does NOT preserve:

```javascript
User.prototype.greet
```

***

## Preserving Prototypes

When cloning class instances:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}

const user = new User("Sudhir");

const clone = Object.create(
  Object.getPrototypeOf(user)
);

Object.assign(clone, structuredClone(user));

console.log(clone instanceof User);
console.log(clone.greet());
```

### Output

```javascript
true
Hello Sudhir
```

✅ Data copied

✅ Prototype restored

✅ Methods work

***

# Functions Cannot Be Cloned

```javascript
const obj = {
  name: "John",
  greet() {
    return "Hello";
  }
};

structuredClone(obj);
```

### Error

```text
DataCloneError
```

***

## Workaround

Reattach functions after cloning.

```javascript
const original = {
  name: "John",
  greet() {
    return `Hello ${this.name}`;
  }
};

const clone = {
  ...structuredClone({
    name: original.name
  }),
  greet: original.greet
};

console.log(clone.greet());
```

Output:

```javascript
Hello John
```

***

# 2. Handling WeakMap and WeakSet

***

## Why They Cannot Be Cloned

```javascript
const wm = new WeakMap();

const key = {};

wm.set(key, "secret");

structuredClone(wm);
```

Throws:

```text
DataCloneError
```

***

### Reason

WeakMap and WeakSet contain weak references managed internally by the garbage collector.

JavaScript deliberately prevents cloning them.

***

# Strategy 1: Convert to Map Before Cloning

Only possible when keys are known.

```javascript
const key1 = {};
const key2 = {};

const weakMap = new WeakMap();

weakMap.set(key1, "Admin");
weakMap.set(key2, "User");

const normalMap = new Map([
  [key1, "Admin"],
  [key2, "User"]
]);

const clonedMap =
  structuredClone(normalMap);
```

✅ Clone succeeds.

***

# Strategy 2: Rebuild WeakMap

Common production approach.

```javascript
class Cache {
  constructor() {
    this.data = new WeakMap();
  }

  clone() {
    const newCache = new Cache();

    // Rehydrate manually
    return newCache;
  }
}
```

WeakMap contents usually represent runtime cache data and are recreated rather than cloned.

***

# WeakSet Example

```javascript
const weakSet = new WeakSet();

const obj = {};

weakSet.add(obj);

structuredClone(weakSet);
```

Output:

```text
DataCloneError
```

***

## Production Practice

Instead of cloning:

```javascript
const ids = new Set();
```

Use:

```javascript
Set
```

rather than:

```javascript
WeakSet
```

if persistence or cloning is required.

***

# 3. Deep-Cloning Best Practices (Production)

## ✅ 1. Use Spread for Shallow Copies

```javascript
const users = [...oldUsers];
```

Perfect for:

* React state updates
* Redux reducers
* Immutable updates
* Flat arrays

***

## ✅ 2. Use structuredClone for General Deep Copies

```javascript
const clone =
  structuredClone(data);
```

Works with:

```javascript
✅ Nested Objects
✅ Arrays
✅ Dates
✅ Maps
✅ Sets
✅ RegExp
✅ Circular References
```

Example:

```javascript
const state = {
  users: [
    {
      profile: {
        city: "Pune"
      }
    }
  ]
};

const copy =
  structuredClone(state);
```

***

## ✅ 3. Avoid JSON for Complex Data

Bad:

```javascript
JSON.parse(
  JSON.stringify(data)
);
```

Problems:

```javascript
❌ Date becomes String
❌ Map lost
❌ Set lost
❌ Binary data lost
❌ Circular references fail
```

Use only for:

```javascript
Plain JSON payloads
```

***

## ✅ 4. Preserve Class Instances Manually

When cloning models:

```javascript
class User {}
class Product {}
class TaxForm {}
```

Use:

```javascript
Object.create()
Object.assign()
```

or implement custom clone methods.

```javascript
class User {
  clone() {
    return new User(this.name);
  }
}
```

***

## ✅ 5. Be Careful with Large Objects

Deep cloning:

```javascript
const copy = structuredClone(bigData);
```

copies everything.

For large React applications:

Prefer:

```javascript
Immutable updates
Normalisation
Selective cloning
```

instead of cloning entire stores.

Example:

```javascript
setUsers(users =>
  users.map(user =>
    user.id === id
      ? { ...user, active: true }
      : user
  )
);
```

***

## ✅ 6. Never Clone Functions

Instead:

```javascript
const config = {
  endpoint: "/api",
  timeout: 5000
};
```

Keep functions separate:

```javascript
function fetchData() {}
```

This avoids serialization and cloning issues.

***

# Interview Cheat Sheet

```javascript
// Shallow copy
const copy = [...arr];

// Deep clone (recommended)
const copy = structuredClone(data);

// Legacy deep clone
const copy =
  JSON.parse(JSON.stringify(data));

// Class instance clone
const clone = Object.assign(
  Object.create(
    Object.getPrototypeOf(obj)
  ),
  structuredClone(obj)
);
```

## What should you use?

| Scenario                  | Best Choice         |
| ------------------------- | ------------------- |
| React state update        | `...spread`         |
| Nested objects/arrays     | `structuredClone()` |
| Date, Map, Set            | `structuredClone()` |
| Circular references       | `structuredClone()` |
| API payload serialisation | `JSON.stringify()`  |
| Class instances           | Custom clone method |
| Functions                 | Reattach manually   |
| WeakMap / WeakSet         | Recreate manually   |

### Senior Frontend Interview Answer

> "For production applications, I prefer immutable updates with spread for state changes and `structuredClone()` for true deep cloning of nested structures. I avoid JSON-based cloning except for pure serialisable payloads, and I use custom clone methods when dealing with class instances, prototypes, or runtime constructs such as WeakMaps and functions."

# 1. Custom Clone Method for Classes

For class instances, the best approach is often to implement a `clone()` method yourself.

## Basic Example

```javascript
class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  clone() {
    return new User(this.id, this.name);
  }
}

const user1 = new User(1, "Sudhir");
const user2 = user1.clone();

user2.name = "John";

console.log(user1.name); // Sudhir
console.log(user2.name); // John
```

***

## Deep Clone Class with Nested Objects

```javascript
class User {
  constructor(id, name, address) {
    this.id = id;
    this.name = name;
    this.address = address;
  }

  clone() {
    return new User(
      this.id,
      this.name,
      structuredClone(this.address)
    );
  }
}

const user1 = new User(
  1,
  "Sudhir",
  {
    city: "Pune",
    country: "India"
  }
);

const user2 = user1.clone();

user2.address.city = "Mumbai";

console.log(user1.address.city); // Pune
console.log(user2.address.city); // Mumbai
```

✅ Prototype preserved

✅ Methods preserved

✅ Deep copy of nested properties

***

## Generic Base Clone Pattern

```javascript
class BaseModel {
  clone() {
    return Object.assign(
      Object.create(
        Object.getPrototypeOf(this)
      ),
      structuredClone(this)
    );
  }
}

class Employee extends BaseModel {
  constructor(name) {
    super();
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}

const emp = new Employee("Sudhir");

const cloned = emp.clone();

console.log(cloned instanceof Employee);
console.log(cloned.greet());
```

Output:

```javascript
true
Hello Sudhir
```

***

# 2. How to Reattach Functions After Cloning

Functions cannot be cloned.

## Problem

```javascript
const config = {
  timeout: 5000,
  retry: true,
  onSuccess() {
    console.log("Success");
  }
};

const cloned = structuredClone(config);
```

Throws:

```text
DataCloneError
```

***

## Approach 1: Separate Data and Behaviour

Recommended.

```javascript
const data = {
  timeout: 5000,
  retry: true
};

const clone = structuredClone(data);

const service = {
  ...clone,

  onSuccess() {
    console.log("Success");
  }
};
```

***

## Approach 2: Reattach Function References

```javascript
const original = {
  name: "Sudhir",

  greet() {
    return `Hello ${this.name}`;
  }
};

const clone = {
  ...structuredClone({
    name: original.name
  }),

  greet: original.greet
};

console.log(clone.greet());
```

Output:

```javascript
Hello Sudhir
```

***

## Approach 3: Factory Function

Very common in production.

```javascript
function createUser(name) {
  return {
    name,

    greet() {
      return `Hello ${name}`;
    }
  };
}

const user1 = createUser("Sudhir");

const clone =
  createUser(
    structuredClone(user1.name)
  );
```

***

# 3. Best Ways to Clone Complex State in React

As a React Lead interview candidate, this is the answer interviewers often expect.

***

# Scenario 1: Flat State

```javascript
const [users, setUsers] = useState([]);
```

Use spread.

```javascript
setUsers(prev => [
  ...prev,
  newUser
]);
```

✅ Fast

✅ Readable

✅ No deep clone required

***

# Scenario 2: Nested State

```javascript
const state = {
  users: [
    {
      id: 1,
      profile: {
        city: "Pune"
      }
    }
  ]
};
```

Bad:

```javascript
const copy = structuredClone(state);

copy.users[0].profile.city =
  "Mumbai";

setState(copy);
```

Works but clones everything.

***

## Better Immutable Update

```javascript
setState(prev => ({
  ...prev,

  users: prev.users.map(user =>
    user.id === 1
      ? {
          ...user,
          profile: {
            ...user.profile,
            city: "Mumbai"
          }
        }
      : user
  )
}));
```

✅ Updates only changed parts

✅ Better React performance

✅ Preserves referential equality

***

# Scenario 3: Deeply Nested State

Instead of:

```javascript
structuredClone(bigState);
```

Use Immer.

```javascript
import { produce } from "immer";

setState(
  produce(draft => {
    draft.users[0]
      .profile.city = "Mumbai";
  })
);
```

***

## Why Immer?

```javascript
✅ Cleaner syntax
✅ Immutable updates
✅ Structural sharing
✅ Redux Toolkit uses it internally
✅ Excellent for enterprise React apps
```

***

# Scenario 4: Redux Toolkit

```javascript
const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    updateCity(state) {
      state.profile.city = "Mumbai";
    }
  }
});
```

Looks mutable:

```javascript
state.profile.city = "Mumbai";
```

Internally:

```javascript
Immer → immutable update
```

***

# Production Recommendation Matrix

| Situation                  | Recommended Approach        |
| -------------------------- | --------------------------- |
| Clone flat array           | `[...]`                     |
| Clone flat object          | `{...obj}`                  |
| Deep clone temporary data  | `structuredClone()`         |
| React component state      | Immutable updates           |
| Complex nested React state | Immer                       |
| Redux Toolkit              | Built-in Immer              |
| Class instances            | Custom `clone()`            |
| Functions                  | Reattach or factory pattern |
| Maps/Sets                  | `structuredClone()`         |
| Large application state    | Avoid full deep clone       |

***

# Senior React Interview Answer

> "In React, I avoid deep-cloning entire state trees because it is expensive and breaks referential equality. For normal updates I use immutable patterns with spread operators. For complex nested state I prefer Immer because it provides structural sharing and cleaner code. `structuredClone()` is useful for deep-cloning transient data, but not as the primary strategy for large application state management."
>
# 1. Factory Function Cloning

Factory functions are often a better alternative to classes because cloning becomes straightforward.

## Basic Factory Function

```javascript
function createUser(id, name) {
  return {
    id,
    name,

    greet() {
      return `Hello ${this.name}`;
    }
  };
}

const user1 = createUser(1, "Sudhir");
const user2 = createUser(user1.id, user1.name);

user2.name = "John";

console.log(user1.greet()); // Hello Sudhir
console.log(user2.greet()); // Hello John
```

***

## Factory Function with Clone Method

```javascript
function createUser(id, name, address) {
  return {
    id,
    name,
    address,

    greet() {
      return `Hello ${this.name}`;
    },

    clone() {
      return createUser(
        this.id,
        this.name,
        structuredClone(this.address)
      );
    }
  };
}

const user1 = createUser(
  1,
  "Sudhir",
  {
    city: "Pune",
    country: "India"
  }
);

const user2 = user1.clone();

user2.address.city = "Mumbai";

console.log(user1.address.city);
console.log(user2.address.city);
```

Output:

```javascript
Pune
Mumbai
```

✅ Behaviour preserved

✅ Deep cloned data

✅ Easy to maintain

***

## Enterprise React Example

```javascript
function createEmployee(data) {
  return {
    ...data,

    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    },

    clone() {
      return createEmployee(
        structuredClone(data)
      );
    }
  };
}
```

This pattern is common in large applications where objects contain both data and helper methods.

***

# 2. Immutable Update Patterns in React

React relies heavily on **referential equality**.

Never mutate state directly.

***

## ❌ Wrong

```javascript
const [user, setUser] = useState({
  name: "Sudhir"
});

user.name = "John";

setUser(user);
```

Problem:

```text
Same object reference
React may not re-render
```

***

## ✅ Object Update Pattern

```javascript
setUser(prev => ({
  ...prev,
  name: "John"
}));
```

***

## ✅ Array Update Pattern

```javascript
setUsers(prev => [
  ...prev,
  newUser
]);
```

***

## ✅ Update Array Item

```javascript
setUsers(prev =>
  prev.map(user =>
    user.id === 1
      ? { ...user, active: true }
      : user
  )
);
```

***

## ✅ Nested Object Update

```javascript
setUser(prev => ({
  ...prev,

  address: {
    ...prev.address,
    city: "Mumbai"
  }
}));
```

***

## ✅ Nested Array Update

```javascript
setState(prev => ({
  ...prev,

  projects: prev.projects.map(project =>
    project.id === 5
      ? {
          ...project,
          status: "Completed"
        }
      : project
  )
}));
```

***

# Why This Pattern Matters

React compares:

```javascript
oldState === newState
```

If references change:

```javascript
React re-renders
```

If references stay same:

```javascript
React may skip updates
```

***

# Structural Sharing

When using immutable updates:

```javascript
{
  users: SAME_REFERENCE,
  settings: NEW_REFERENCE
}
```

Only changed parts get new references.

This is extremely efficient.

***

# 3. Immer vs structuredClone()

This is a common React Lead interview question.

***

## Using structuredClone()

```javascript
const copy =
  structuredClone(state);

copy.user.address.city =
  "Mumbai";

setState(copy);
```

Works but:

```text
✅ Simple
✅ Deep clone

❌ Copies entire state tree
❌ Higher memory usage
❌ Less performant for large states
```

***

## Using Immer

```javascript
import { produce } from "immer";

setState(prev =>
  produce(prev, draft => {
    draft.user.address.city =
      "Mumbai";
  })
);
```

Looks mutable:

```javascript
draft.user.address.city =
  "Mumbai";
```

But Immer creates immutable updates behind the scenes.

***

# Visual Comparison

Assume state:

```javascript
{
  users: [...],
  settings: {
    theme: "light"
  },
  dashboard: {...}
}
```

***

## structuredClone

```javascript
const copy =
  structuredClone(state);
```

Creates:

```text
users      -> cloned
settings   -> cloned
dashboard  -> cloned
```

Everything copied.

***

## Immer

```javascript
draft.settings.theme =
  "dark";
```

Creates:

```text
users      -> reused
dashboard  -> reused
settings   -> copied
```

Only affected branches are copied.

***

# Performance Comparison

| Feature                     | structuredClone | Immer       |
| --------------------------- | --------------- | ----------- |
| Deep Clone Entire Tree      | ✅               | ❌           |
| Immutable Updates           | ❌ Manual        | ✅           |
| Structural Sharing          | ❌               | ✅           |
| Large React States          | ⚠️ Expensive    | ✅ Excellent |
| Redux Toolkit               | ❌               | ✅ Built-in  |
| Easy Syntax                 | ✅               | ✅           |
| Memory Efficient            | ❌               | ✅           |
| React Optimisation Friendly | ⚠️              | ✅           |

***

# When Should You Use Each?

### Use Spread (`...`)

```javascript
setUser(prev => ({
  ...prev,
  name: "John"
}));
```

For:

* Simple updates
* Flat objects
* Small state changes

***

### Use Immer

```javascript
produce(...)
```

For:

* Deeply nested state
* Redux Toolkit
* Enterprise React applications
* Complex forms (TurboTax-style forms)
* Large dashboards

***

### Use structuredClone

```javascript
const copy =
  structuredClone(data);
```

For:

* Cloning API responses
* Copying configuration objects
* Undo/redo snapshots
* Temporary data manipulation

Avoid using it as the primary React state update mechanism.

***

# Senior React Interview Answer

> **Spread operators are ideal for simple immutable updates. For deeply nested state, Immer is the preferred solution because it provides immutable updates with structural sharing, reducing unnecessary copying and improving React rendering performance. `structuredClone()` is excellent for deep-cloning arbitrary data structures, but in React state management it is usually less efficient because it recreates the entire state tree on every update.**
