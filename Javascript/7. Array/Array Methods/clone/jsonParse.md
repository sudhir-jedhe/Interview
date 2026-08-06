## Clone Using `JSON.parse()` + `JSON.stringify()`

Before `structuredClone()`, the most common deep-cloning technique was:

```javascript
const deepClone = JSON.parse(
  JSON.stringify(original)
);
```

***

# Basic Example

```javascript
const original = [
  {
    id: 1,
    name: "Sudhir"
  }
];

const cloned = JSON.parse(
  JSON.stringify(original)
);

cloned[0].name = "John";

console.log(original);
console.log(cloned);
```

### Output

```javascript
original:
[
  {
    id: 1,
    name: "Sudhir"
  }
]

cloned:
[
  {
    id: 1,
    name: "John"
  }
]
```

✅ Deep clone created.

***

# Nested Objects

```javascript
const user = {
  name: "Sudhir",
  address: {
    city: "Pune",
    country: "India"
  }
};

const cloned = JSON.parse(
  JSON.stringify(user)
);

cloned.address.city = "Mumbai";

console.log(user.address.city);
console.log(cloned.address.city);
```

### Output

```javascript
Pune
Mumbai
```

✅ Nested objects are copied.

***

# Nested Arrays

```javascript
const original = [
  [1, 2],
  [3, 4]
];

const cloned = JSON.parse(
  JSON.stringify(original)
);

cloned[0][0] = 100;

console.log(original);
console.log(cloned);
```

### Output

```javascript
original:
[
  [1, 2],
  [3, 4]
]

cloned:
[
  [100, 2],
  [3, 4]
]
```

✅ Nested arrays are copied.

***

# React Example

Suppose state is:

```javascript
const [users, setUsers] = useState([
  {
    id: 1,
    profile: {
      city: "Pune"
    }
  }
]);
```

You could clone like:

```javascript
const clonedUsers = JSON.parse(
  JSON.stringify(users)
);

clonedUsers[0].profile.city = "Mumbai";

setUsers(clonedUsers);
```

✅ Works

⚠️ Not recommended for frequent React updates because it clones the entire tree.

***

# Limitations of JSON Cloning

## Date Becomes String

```javascript
const data = {
  createdAt: new Date()
};

const clone = JSON.parse(
  JSON.stringify(data)
);

console.log(typeof clone.createdAt);
```

Output:

```javascript
"string"
```

❌ Date object lost.

***

## Functions Removed

```javascript
const user = {
  name: "Sudhir",

  greet() {
    return "Hello";
  }
};

const clone = JSON.parse(
  JSON.stringify(user)
);

console.log(clone);
```

Output:

```javascript
{
  name: "Sudhir"
}
```

❌ Function removed.

***

## Map Lost

```javascript
const data = {
  users: new Map()
};

const clone = JSON.parse(
  JSON.stringify(data)
);

console.log(clone);
```

Output:

```javascript
{
  users: {}
}
```

❌ Map not preserved.

***

## Set Lost

```javascript
const data = {
  skills: new Set(["React"])
};

const clone = JSON.parse(
  JSON.stringify(data)
);
```

Output:

```javascript
{
  skills: {}
}
```

❌ Set lost.

***

## Circular References Fail

```javascript
const user = {};

user.self = user;

JSON.stringify(user);
```

Output:

```text
TypeError:
Converting circular structure to JSON
```

❌ Cannot handle circular references.

***

# JSON vs structuredClone

### JSON

```javascript
const clone = JSON.parse(
  JSON.stringify(data)
);
```

Supports:

```text
✅ Objects
✅ Arrays
✅ Strings
✅ Numbers
✅ Booleans
```

Does NOT support:

```text
❌ Date
❌ Function
❌ Map
❌ Set
❌ Circular References
❌ WeakMap
❌ WeakSet
```

***

### structuredClone

```javascript
const clone =
  structuredClone(data);
```

Supports:

```text
✅ Objects
✅ Arrays
✅ Date
✅ Map
✅ Set
✅ RegExp
✅ Circular References
✅ TypedArrays
```

***

# Interview Comparison

```javascript
// Modern (Recommended)
const clone = structuredClone(data);

// Legacy
const clone = JSON.parse(
  JSON.stringify(data)
);
```

### When to Use JSON Cloning

✅ API response data

✅ Simple configuration objects

✅ Plain JSON structures

### When NOT to Use It

❌ React state with complex structures

❌ Class instances

❌ Maps/Sets

❌ Dates

❌ Circular references

***

## Senior React Interview Answer

> `JSON.parse(JSON.stringify())` is a simple way to deep-clone plain objects and arrays, but it loses Dates, Maps, Sets, functions, and circular references. In modern JavaScript, `structuredClone()` is the preferred deep-cloning solution. For React state updates, I usually avoid deep-cloning entire state trees and instead use immutable updates with spread operators or Immer for better performance and structural sharing.


## When to Prefer `JSON.parse(JSON.stringify())` vs `structuredClone()`

Both can be used for deep cloning, but they are suitable for different scenarios.

***

# Use JSON Cloning When

Your data contains only:

```javascript
{
  name: "Sudhir",
  age: 32,
  skills: ["React", "Node"],
  address: {
    city: "Pune"
  }
}
```

### Example

```javascript
const user = {
  name: "Sudhir",
  skills: ["React", "Node"]
};

const clone = JSON.parse(
  JSON.stringify(user)
);
```

### Advantages

✅ Works in older browsers

✅ Simple syntax

✅ Good for API payloads

✅ Good for plain JSON data

✅ Removes functions and undefined values automatically

***

# Use `structuredClone()` When

Your data contains modern JavaScript objects:

```javascript
const state = {
  createdAt: new Date(),
  permissions: new Set(["read"]),
  users: new Map(),
  profile: {
    city: "Pune"
  }
};
```

### Example

```javascript
const clone =
  structuredClone(state);
```

### Advantages

✅ Preserves `Date`

✅ Preserves `Map`

✅ Preserves `Set`

✅ Preserves `RegExp`

✅ Supports circular references

✅ Handles TypedArrays

✅ Modern standard approach

***

# Real Difference Example

## Date Object

### JSON

```javascript
const obj = {
  createdAt: new Date()
};

const clone = JSON.parse(
  JSON.stringify(obj)
);

console.log(clone.createdAt);
console.log(typeof clone.createdAt);
```

Output:

```javascript
"2026-07-03T10:00:00.000Z"
"string"
```

❌ Date became a string

***

### structuredClone

```javascript
const clone =
  structuredClone(obj);

console.log(clone.createdAt);
console.log(
  clone.createdAt instanceof Date
);
```

Output:

```javascript
true
```

✅ Date preserved

***

# Circular References

### JSON

```javascript
const user = {};

user.self = user;

JSON.stringify(user);
```

Output:

```text
TypeError:
Converting circular structure to JSON
```

❌ Fails

***

### structuredClone

```javascript
const user = {};

user.self = user;

const clone =
  structuredClone(user);

console.log(
  clone.self === clone
);
```

Output:

```javascript
true
```

✅ Works

***

# Map and Set

### JSON

```javascript
const data = {
  users: new Map(),
  skills: new Set(["React"])
};

const clone = JSON.parse(
  JSON.stringify(data)
);

console.log(clone);
```

Output:

```javascript
{
  users: {},
  skills: {}
}
```

❌ Data lost

***

### structuredClone

```javascript
const clone =
  structuredClone(data);

console.log(clone.skills);
```

Output:

```javascript
Set { "React" }
```

✅ Preserved

***

# React Perspective

## JSON Cloning

```javascript
const clonedState =
  JSON.parse(
    JSON.stringify(state)
  );
```

Works, but:

```text
❌ Clones entire tree
❌ Loses Date
❌ Loses Map
❌ Loses Set
❌ Slower for large state trees
```

***

## structuredClone

```javascript
const clonedState =
  structuredClone(state);
```

Better:

```text
✅ Handles modern JS types
✅ True deep clone
✅ Easier to maintain
```

However, for React state updates:

```javascript
setState(prev => ({
  ...prev,
  name: "Updated"
}));
```

or

```javascript
Immer
```

is usually preferred over deep-cloning the whole state.

***

# Performance Considerations

### JSON

```javascript
JSON.parse(
  JSON.stringify(data)
);
```

Often fast for simple JSON-like data.

However:

```text
Serialization → String → Parsing
```

Extra conversion work happens.

***

### structuredClone

```javascript
structuredClone(data);
```

Clones directly without converting to a string.

Better for:

* Large nested objects
* Maps
* Sets
* Dates
* Binary data

***

# Interview Summary Table

| Feature               | JSON Clone       | structuredClone |
| --------------------- | ---------------- | --------------- |
| Plain Objects         | ✅                | ✅               |
| Arrays                | ✅                | ✅               |
| Nested Objects        | ✅                | ✅               |
| Date                  | ❌ Becomes String | ✅               |
| Map                   | ❌                | ✅               |
| Set                   | ❌                | ✅               |
| RegExp                | ❌                | ✅               |
| Circular References   | ❌                | ✅               |
| Functions             | ❌ Removed        | ❌ Not Supported |
| WeakMap / WeakSet     | ❌                | ❌               |
| Modern Recommendation | ⚠️ Legacy        | ✅ Preferred     |

***

## Senior React Interview Answer

> Use `JSON.parse(JSON.stringify())` only when dealing with simple serialisable JSON data. Use `structuredClone()` when the data contains nested objects, Dates, Maps, Sets, or circular references. For React state management, avoid deep-cloning entire state trees on every update; prefer immutable updates with the spread operator or Immer, which preserve structural sharing and improve rendering performance.
