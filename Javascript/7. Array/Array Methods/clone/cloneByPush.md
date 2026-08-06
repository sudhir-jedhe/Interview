### Clone Array Using `push()`

You can clone an array manually by iterating through it and pushing each element into a new array.

```javascript
const originalArray = [1, 2, 3, 4, 5];

const clonedArray = [];

for (let i = 0; i < originalArray.length; i++) {
  clonedArray.push(originalArray[i]);
}

console.log(clonedArray);
```

### Output

```javascript
[1, 2, 3, 4, 5]
```

***

## Using `for...of`

```javascript
const originalArray = [1, 2, 3, 4, 5];

const clonedArray = [];

for (const item of originalArray) {
  clonedArray.push(item);
}

console.log(clonedArray);
```

***

# Is It a Deep Copy?

❌ No.

`push()` copies values/references exactly like:

```javascript
[...arr]
Array.from(arr)
arr.slice()
[].concat(arr)
```

All perform a **shallow copy**.

***

## Shallow Copy Problem

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  }
];

const clonedUsers = [];

for (const user of users) {
  clonedUsers.push(user);
}

clonedUsers[0].name = "John";

console.log(users[0].name);
```

### Output

```javascript
John
```

Because:

```text
users[0] === clonedUsers[0]
```

Both arrays reference the same object.

***

# Clone Array of Objects Using `push()`

```javascript
const users = [
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" }
];

const clonedUsers = [];

for (const user of users) {
  clonedUsers.push({
    ...user
  });
}

clonedUsers[0].name = "Mike";

console.log(users[0].name);   // Sudhir
console.log(clonedUsers[0].name); // Mike
```

✅ Objects are copied.

***

# Clone Nested Arrays Using `push()`

```javascript
const original = [
  [1, 2],
  [3, 4]
];

const clone = [];

for (const inner of original) {
  clone.push([...inner]);
}

clone[0][0] = 100;

console.log(original);
console.log(clone);
```

### Output

```javascript
original:
[
  [1, 2],
  [3, 4]
]

clone:
[
  [100, 2],
  [3, 4]
]
```

✅ Inner arrays are cloned.

***

# React State Example

### ❌ Wrong

```javascript
const copy = [];

users.forEach(user => copy.push(user));

copy[0].name = "John";

setUsers(copy);
```

Mutates existing state because object references are shared.

***

### ✅ Correct

```javascript
const copy = [];

users.forEach(user =>
  copy.push({
    ...user
  })
);

setUsers(copy);
```

***

# Interview Comparison

```javascript
// Push
const clone = [];
arr.forEach(item => clone.push(item));

// Spread
const clone = [...arr];

// Slice
const clone = arr.slice();

// Concat
const clone = [].concat(arr);

// Array.from
const clone = Array.from(arr);
```

All of the above create a **shallow copy**.

### Modern Recommendation

```javascript
const clone = [...arr];
```

Most readable and commonly used in React applications.

### Deep Clone

```javascript
const deepClone = structuredClone(arr);
```

Use when the array contains nested objects, nested arrays, `Map`, `Set`, or circular references.
