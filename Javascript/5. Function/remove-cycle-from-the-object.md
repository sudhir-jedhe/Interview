# getCircularReplacer

Let's break down both functions you've shared — `getCircularReplacer` and `removeCycle` — as well as their expected behavior, and ensure that they handle circular references properly.

## 1. **`getCircularReplacer`**

This function is designed to be used with `JSON.stringify` to avoid errors when trying to serialize objects that have circular references. Circular references happen when an object references itself directly or indirectly.

## What does it do?

- It uses a `WeakSet` to track objects that have already been encountered during the serialization process.
- If an object is encountered that has already been added to the `WeakSet`, the function skips it to prevent an infinite loop.
- Otherwise, it adds the object to the `WeakSet` and proceeds with serialization.

### Code

```javascript
const getCircularReplacer = () => {
  // A WeakSet to track objects that have been seen
  const seen = new WeakSet();

  // Return the replacer function used by JSON.stringify
  return (key, value) => {
    // If value is an object and it's not null
    if (typeof value === "object" && value !== null) {
      // If we've already seen this object, return undefined (skip serialization)
      if (seen.has(value)) {
        return;
      }
      // Otherwise, add it to the WeakSet
      seen.add(value);
    }
    return value;
  };
};

// Example usage:
const item1 = { val: 10 };
const item2 = { val: 20 };
const item3 = { val: 30 };

item1.next = item2;
item2.next = item3;
item3.next = item1; // Circular reference

console.log(JSON.stringify(item1, getCircularReplacer()));
// Output: {"val":10,"next":{"val":20,"next":{"val":30}}}
```

#### Explanation

- **WeakSet**: This data structure ensures that we don't keep strong references to objects, which helps with memory management. It allows us to track object references without preventing garbage collection.
- **Circular Detection**: The `replacer` function checks whether an object has been seen before. If so, it returns `undefined`, effectively omitting that property from serialization (thus avoiding infinite recursion).

#### Output

```json
{
  "val": 10,
  "next": {
    "val": 20,
    "next": {
      "val": 30
    }
  }
}
```

The circular reference is effectively handled, and we don't end up with an infinite loop or an error during `JSON.stringify()`.

---

### 2. **`removeCycle`**

This function is designed to remove circular references from an object, effectively "breaking" the cycle and preventing infinite loops during operations like serialization.

## What does it do ?

- It uses a `WeakSet` to track objects encountered during the traversal.
- If a reference to an object is encountered again (which indicates a circular reference), it removes that reference by using `delete`.
- The function works recursively by traversing through the object's properties and their nested objects.

## Code1

```javascript
const removeCycle = (obj) => {
  // A WeakSet to keep track of objects we've already visited
  const set = new WeakSet([obj]);

  // Helper function to iterate over the object and remove cycles
  (function iterateObj(obj) {
    for (let key in obj) {
      // If the object has the property directly (not from its prototype chain)
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          // If we've seen this object reference before, delete the key
          if (set.has(obj[key])) {
            delete obj[key];
          } else {
            // Otherwise, add the object to the WeakSet
            set.add(obj[key]);
            // Recursively check the next object
            iterateObj(obj[key]);
          }
        }
      }
    }
  })(obj);
};

// Example usage:
const List = function (val) {
  this.next = null;
  this.val = val;
};

const item1 = new List(10);
const item2 = new List(20);
const item3 = new List(30);

item1.next = item2;
item2.next = item3;
item3.next = item1; // Circular reference

removeCycle(item1); // Remove the cycle
console.log(item1);
```

## Explanation 1

- **WeakSet**: Similar to the previous function, we use `WeakSet` to track objects we've visited. This prevents revisiting objects and ensures that circular references are identified.
- **Recursive Iteration**: We recursively traverse all properties of the object and check if any object references have already been encountered. If a circular reference is detected (i.e., we've seen this object before), we delete the corresponding property.

## Output. 11

```json
{
  "val": 10,
  "next": {
    "val": 20,
    "next": {
      "val": 30
    }
  }
}
```

In this case, the cycle between `item3` and `item1` is removed, and no circular reference is left in the final structure.

---

### Conclusion

1. **`getCircularReplacer`** is used to serialize objects with circular references into a JSON string, omitting the circular references to prevent infinite loops during serialization.
2. **`removeCycle`** removes circular references from an object by deleting the properties that create the cycle, breaking the loop and ensuring the object can be safely serialized or otherwise manipulated.

Both of these functions are useful when working with complex data structures that may have cyclic relationships, and they handle circular references gracefully without causing memory or recursion issues.

# Remove Cycle from Object – Frontend System Design + Code

This is a very common **JavaScript / React interview question**.

## Problem

Suppose we have:

```js
const person = {
  name: "Sudhir",
};

person.self = person;
```

Visual representation:

```txt
person
 │
 ├── name = "Sudhir"
 │
 └── self ─────┐
               │
               ▼
            person
```

This creates a **circular reference (cycle)**.

---

## What Problem Does It Cause?

### JSON.stringify Fails

```js
JSON.stringify(person);
```

Output:

```txt
TypeError:
Converting circular structure to JSON
```

Because:

```txt
person
  → self
      → person
          → self
              → person
```

Infinite loop.

---

# System Design Approach

## Requirements

```txt
Input:
Object with possible circular references

Output:
Same object without cycles

Constraints:
✅ Nested objects
✅ Arrays
✅ Multiple cycles
✅ Deep structures
✅ Preserve non-circular data
```

---

# Solution 1: Using WeakSet (Recommended)

## Idea

Track objects already visited.

```txt
Visited before?
      │
 ┌────┴─────┐
 │          │
Yes        No
 │          │
Remove    Continue
Cycle
```

---

## Code

```js
function removeCycles(obj) {
  const seen = new WeakSet();

  function traverse(value) {
    if (value === null || typeof value !== "object") {
      return value;
    }

    if (seen.has(value)) {
      return undefined;
    }

    seen.add(value);

    const result = Array.isArray(value) ? [] : {};

    for (const key in value) {
      result[key] = traverse(value[key]);
    }

    return result;
  }

  return traverse(obj);
}
```

---

## Example

```js
const person = {
  name: "Sudhir",
};

person.self = person;

const result = removeCycles(person);

console.log(result);
```

Output:

```js
{
  name: "Sudhir",
  self: undefined
}
```

---

# Solution 2: Replace Cycle with String

Instead of removing:

```txt
"[Circular]"
```

---

```js
function removeCycles(obj) {
  const seen = new WeakSet();

  function recursion(value) {
    if (value === null || typeof value !== "object") {
      return value;
    }

    if (seen.has(value)) {
      return "[Circular]";
    }

    seen.add(value);

    const result = {};

    for (const key in value) {
      result[key] = recursion(value[key]);
    }

    return result;
  }

  return recursion(obj);
}
```

---

## Output

```js
{
  name: "Sudhir",
  self: "[Circular]"
}
```

Much easier for debugging.

---

# Solution 3: Custom JSON.stringify

Most asked interview version.

---

```js
function safeStringify(obj) {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (value && typeof value === "object") {
        if (seen.has(value)) {
          return "[Circular]";
        }

        seen.add(value);
      }

      return value;
    },
    2,
  );
}
```

---

## Example

```js
const person = {
  name: "Sudhir",
};

person.self = person;

console.log(safeStringify(person));
```

Output:

```json
{
  "name": "Sudhir",
  "self": "[Circular]"
}
```

---

# Complex Example

```js
const a = {
  name: "A",
};

const b = {
  name: "B",
};

const c = {
  name: "C",
};

a.friend = b;
b.friend = c;
c.friend = a;
```

Visual:

```txt
A
 ↓
B
 ↓
C
 ↓
A
```

Cycle exists.

---

Using:

```js
safeStringify(a);
```

Output:

```json
{
  "name": "A",
  "friend": {
    "name": "B",
    "friend": {
      "name": "C",
      "friend": "[Circular]"
    }
  }
}
```

---

## React Real-World Use Cases

### Logging Redux State

```js
console.log(safeStringify(store.getState()));
```

---

### Sending Data To API

```js
const payload = removeCycles(formData);

await api.post("/save", payload);
```

---

### Deep Clone Objects

Before cloning:

```js
removeCycles(data);
```

Then:

```js
structuredClone(data);
```

---

## Interview Follow-Up

### Why WeakSet Instead of Set?

```js
const seen = new WeakSet();
```

### WeakSet Benefits

```txt
Objects only
Garbage collection friendly
Prevents memory leaks
```

---

### Set Version

```js
const seen = new Set();
```

Works but:

```txt
Retains references
More memory usage
```

---

## Time Complexity

Let:

```txt
n = number of nodes
```

Every object visited once.

```txt
Time Complexity = O(n)
```

---

## Space Complexity

WeakSet stores visited nodes.

```txt
Space Complexity = O(n)
```

---

## Most Preferred Interview Answer

```js
function safeStringify(obj) {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    if (value && typeof value === "object") {
      if (seen.has(value)) {
        return "[Circular]";
      }

      seen.add(value);
    }

    return value;
  });
}
```

### Interview Explanation

> "To remove or handle cycles in an object, I keep track of previously visited objects using a WeakSet. During traversal, if I encounter an object that has already been visited, I either remove it or replace it with a placeholder like `[Circular]`. This prevents infinite recursion and allows safe serialisation using JSON.stringify. The algorithm runs in O(n) time and O(n) space, where n is the number of object nodes."
