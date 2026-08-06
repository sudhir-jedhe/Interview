## `arr.toString()` in JavaScript

The `toString()` method converts an array into a **comma-separated string**.

### Syntax

```javascript
arr.toString();
```

***

## Basic Example

```javascript
const arr = [1, 2, 3, 4];

console.log(arr.toString());
```

### Output

```javascript
"1,2,3,4"
```

***

## String Array Example

```javascript
const fruits = [
  "Apple",
  "Banana",
  "Orange"
];

console.log(
  fruits.toString()
);
```

### Output

```javascript
"Apple,Banana,Orange"
```

***

## Array of Objects

```javascript
const users = [
  { name: "Sudhir" },
  { name: "John" }
];

console.log(
  users.toString()
);
```

### Output

```javascript
"[object Object],[object Object]"
```

Reason:

```javascript
Object.prototype.toString()
```

is called on each object.

***

## Nested Arrays

```javascript
const arr = [
  [1, 2],
  [3, 4]
];

console.log(
  arr.toString()
);
```

### Output

```javascript
"1,2,3,4"
```

Notice nested arrays are flattened into the string output.

***

## Compare with `join()`

### `toString()`

```javascript
const arr = [1, 2, 3];

console.log(
  arr.toString()
);
```

Output:

```javascript
"1,2,3"
```

***

### `join()`

```javascript
console.log(
  arr.join(" - ")
);
```

Output:

```javascript
"1 - 2 - 3"
```

`toString()` internally behaves like:

```javascript
arr.join(",");
```

***

## Empty Array

```javascript
const arr = [];

console.log(
  arr.toString()
);
```

### Output

```javascript
""
```

Empty string.

***

## React Example

```jsx
function Skills() {
  const skills = [
    "React",
    "TypeScript",
    "Node.js"
  ];

  return (
    <div>
      {skills.toString()}
    </div>
  );
}
```

### Output

```text
React,TypeScript,Node.js
```

Better:

```jsx
{skills.join(", ")}
```

Output:

```text
React, TypeScript, Node.js
```

***

## Custom `toString()` for Arrays

Interview-style override:

```javascript
Array.prototype.customToString =
  function () {
    return this.join(",");
  };

const arr = [1, 2, 3];

console.log(
  arr.customToString()
);
```

Output:

```javascript
"1,2,3"
```

***

## Interview Questions

### What is the output?

```javascript
console.log(
  [1, 2, [3, 4]]
    .toString()
);
```

Output:

```javascript
"1,2,3,4"
```

***

### What is the output?

```javascript
console.log(
  [null, undefined]
    .toString()
);
```

Output:

```javascript
","
```

Because:

```javascript
null      -> ""
undefined -> ""
```

Result:

```javascript
","
```

***

## Comparison

| Method             | Output      |
| ------------------ | ----------- |
| `toString()`       | `"1,2,3"`   |
| `join(",")`        | `"1,2,3"`   |
| `join("-")`        | `"1-2-3"`   |
| `JSON.stringify()` | `"[1,2,3]"` |

### Example

```javascript
const arr = [1, 2, 3];

console.log(arr.toString());
console.log(JSON.stringify(arr));
```

Output:

```javascript
"1,2,3"

"[1,2,3]"
```

### Interview One-Liner

> `Array.prototype.toString()` converts an array into a comma-separated string by internally using `join(",")`. It does not modify the original array and is commonly used for implicit string conversion, although `join()` is preferred when a custom separator is needed.
## 1. Using `join()` with a Custom Separator

`join()` lets you choose how array elements are separated.

### Comma Separator

```javascript
const skills = ["React", "TypeScript", "Node.js"];

console.log(skills.join(", "));
```

Output:

```javascript
"React, TypeScript, Node.js"
```

***

### Pipe Separator

```javascript
const skills = ["React", "TypeScript", "Node.js"];

console.log(skills.join(" | "));
```

Output:

```javascript
"React | TypeScript | Node.js"
```

***

### Arrow Separator

```javascript
const steps = ["Login", "Dashboard", "Checkout"];

console.log(steps.join(" → "));
```

Output:

```javascript
"Login → Dashboard → Checkout"
```

***

## 2. Customising `toString()` for Array Objects

By default:

```javascript
const users = [
  { name: "Sudhir" },
  { name: "John" }
];

console.log(users.toString());
```

Output:

```javascript
"[object Object],[object Object]"
```

Because JavaScript calls each object's `toString()` method.

***

### Custom Object `toString()`

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

const users = [
  new User("Sudhir"),
  new User("John")
];

console.log(users.toString());
```

Output:

```javascript
"Sudhir,John"
```

***

### Custom Array Wrapper

```javascript
class UserList extends Array {
  toString() {
    return this.map(user => user.name)
      .join(" | ");
  }
}

const users = new UserList(
  { name: "Sudhir" },
  { name: "John" }
);

console.log(String(users));
```

Output:

```javascript
"Sudhir | John"
```

***

## 3. `toString()` vs `JSON.stringify()`

### Simple Array

```javascript
const arr = [1, 2, 3];

console.log(arr.toString());
console.log(JSON.stringify(arr));
```

Output:

```javascript
"1,2,3"

"[1,2,3]"
```

***

### Array of Objects

```javascript
const users = [
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" }
];

console.log(users.toString());
console.log(JSON.stringify(users));
```

Output:

```javascript
"[object Object],[object Object]"

'[{"id":1,"name":"Sudhir"},{"id":2,"name":"John"}]'
```

✅ `JSON.stringify()` preserves structure.

❌ `toString()` loses object details.

***

### Nested Arrays

```javascript
const arr = [1, [2, 3], [4, [5, 6]]];

console.log(arr.toString());
console.log(JSON.stringify(arr));
```

Output:

```javascript
"1,2,3,4,5,6"

"[1,[2,3],[4,[5,6]]]"
```

Notice:

* `toString()` flattens the visual representation.
* `JSON.stringify()` preserves nesting.

***

### Null and Undefined

```javascript
const arr = [null, undefined, "React"];

console.log(arr.toString());
console.log(JSON.stringify(arr));
```

Output:

```javascript
",,React"

'[null,null,"React"]'
```

***

## Comparison Table

| Feature                 | `toString()`   | `JSON.stringify()` |
| ----------------------- | -------------- | ------------------ |
| Returns String          | ✅              | ✅                  |
| Comma-separated values  | ✅              | ❌                  |
| Preserves Objects       | ❌              | ✅                  |
| Preserves Nested Arrays | ❌              | ✅                  |
| Good for Debugging      | ❌              | ✅                  |
| Custom Separator        | ❌ (use `join`) | ❌                  |

***

## React Example

```jsx
function SkillsList() {
  const skills = [
    "React",
    "TypeScript",
    "Node.js"
  ];

  return (
    <div>
      {skills.join(" • ")}
    </div>
  );
}
```

Output:

```text
React • TypeScript • Node.js
```

✅ `join()` is usually preferred in React because it gives complete control over formatting.

### Interview One-Liner

> `toString()` converts an array into a comma-separated string and is suitable for simple display. `join()` is more flexible because it allows custom separators. `JSON.stringify()` is preferred when you need to preserve the exact array structure, nested arrays, and object properties for logging, debugging, or API payloads.

# 1. `join()` with Different Separators

`join()` converts an array into a string using a custom separator.

### Comma Separator

```javascript
const arr = ["React", "Node", "TypeScript"];

console.log(arr.join(", "));
```

Output:

```javascript
"React, Node, TypeScript"
```

***

### Pipe Separator

```javascript
console.log(arr.join(" | "));
```

Output:

```javascript
"React | Node | TypeScript"
```

***

### Arrow Separator

```javascript
const steps = ["Login", "Dashboard", "Checkout"];

console.log(steps.join(" -> "));
```

Output:

```javascript
"Login -> Dashboard -> Checkout"
```

***

### New Line Separator

```javascript
const skills = ["React", "Redux", "Node"];

console.log(skills.join("\n"));
```

Output:

```text
React
Redux
Node
```

***

### Empty Separator

```javascript
const chars = ["H", "e", "l", "l", "o"];

console.log(chars.join(""));
```

Output:

```javascript
"Hello"
```

***

# 2. Customising `toString()` for Nested Arrays

Default behaviour:

```javascript
const arr = [
  [1, 2],
  [3, 4]
];

console.log(arr.toString());
```

Output:

```javascript
"1,2,3,4"
```

Notice that nesting information is lost.

***

## Custom Nested Array `toString()`

```javascript
class NestedArray extends Array {
  toString() {
    return this.map(item =>
      Array.isArray(item)
        ? `[${item.join(",")}]`
        : item
    ).join(" | ");
  }
}

const arr = new NestedArray(
  [1, 2],
  [3, 4]
);

console.log(String(arr));
```

Output:

```javascript
"[1,2] | [3,4]"
```

***

## Deep Recursive Version

```javascript
function stringifyNested(arr) {
  return `[${arr.map(item =>
    Array.isArray(item)
      ? stringifyNested(item)
      : item
  ).join(",")}]`;
}

const arr = [
  1,
  [2, 3],
  [4, [5, 6]]
];

console.log(stringifyNested(arr));
```

Output:

```javascript
"[1,[2,3],[4,[5,6]]]"
```

Similar to:

```javascript
JSON.stringify(arr)
```

but fully customisable.

***

# 3. `JSON.stringify()` vs `join()` for Objects

## Array of Objects

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  },
  {
    id: 2,
    name: "John"
  }
];
```

***

## Using `join()`

```javascript
console.log(users.join(", "));
```

Output:

```javascript
"[object Object], [object Object]"
```

Why?

Each object becomes:

```javascript
obj.toString()
```

which defaults to:

```javascript
"[object Object]"
```

***

## Using `JSON.stringify()`

```javascript
console.log(
  JSON.stringify(users)
);
```

Output:

```javascript
[
  {"id":1,"name":"Sudhir"},
  {"id":2,"name":"John"}
]
```

✅ Preserves object structure

✅ Preserves property names

✅ Useful for APIs and debugging

***

## Better Alternative to `join()`

If you want readable object data:

```javascript
console.log(
  users
    .map(user => user.name)
    .join(", ")
);
```

Output:

```javascript
"Sudhir, John"
```

***

## Nested Object Example

### Data

```javascript
const data = [
  {
    name: "Sudhir",
    skills: ["React", "Node"]
  }
];
```

***

### join()

```javascript
console.log(data.join());
```

Output:

```javascript
"[object Object]"
```

***

### JSON.stringify()

```javascript
console.log(
  JSON.stringify(data)
);
```

Output:

```javascript
'[{"name":"Sudhir","skills":["React","Node"]}]'
```

✅ Nested arrays preserved

✅ Nested objects preserved

***

# Comparison Table

| Feature                                 | `join()` | `JSON.stringify()` |
| --------------------------------------- | -------- | ------------------ |
| Works well for primitives               | ✅        | ✅                  |
| Supports custom separator               | ✅        | ❌                  |
| Preserves object properties             | ❌        | ✅                  |
| Preserves nested arrays                 | ❌        | ✅                  |
| API payloads                            | ❌        | ✅                  |
| Human-readable object data              | ❌        | ✅                  |
| Converts array to custom display string | ✅        | ❌                  |

***

# React Example

### Display User Names

```jsx
function UserNames() {
  const users = [
    { name: "Sudhir" },
    { name: "John" },
    { name: "Mike" }
  ];

  return (
    <div>
      {users
        .map(user => user.name)
        .join(" | ")}
    </div>
  );
}
```

Output:

```text
Sudhir | John | Mike
```

***

### Debugging State

```jsx
<pre>
  {JSON.stringify(
    users,
    null,
    2
  )}
</pre>
```

Output:

```json
[
  {
    "name": "Sudhir"
  },
  {
    "name": "John"
  }
]
```

### Interview One-Liner

> Use `join()` when you need a custom separator for primitive values. Use `JSON.stringify()` when working with objects, nested arrays, API payloads, or debugging because it preserves the complete data structure, whereas `join()` converts objects to `"[object Object]"`.
