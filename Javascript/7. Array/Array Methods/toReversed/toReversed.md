```js

const items = [1, 2, 3];
console.log(items); // [1, 2, 3]

const reversedItems = items.toReversed();
console.log(reversedItems); // [3, 2, 1]
console.log(items); // [1, 2, 3]

console.log([1, , 3].toReversed()); // [3, undefined, 1]
console.log([1, , 3, 4].toReversed()); // [4, 3, undefined, 1]


const arrayLike = {
  length: 3,
  unrelated: "foo",
  2: 4,
};
console.log(Array.prototype.toReversed.call(arrayLike));
// [4, undefined, undefined]
// The '0' and '1' indices are not present so they become undefined

```

### `Array.prototype.toReversed()`

`toReversed()` is a modern JavaScript array method introduced in ES2023.

Unlike `reverse()`, it **does not modify the original array**.

***

## `reverse()` (Mutates)

```javascript
const arr = [1, 2, 3];

const reversed = arr.reverse();

console.log(reversed);
console.log(arr);
```

### Output

```javascript
[3, 2, 1]

[3, 2, 1]
```

⚠️ Original array changed.

***

## `toReversed()` (Immutable)

```javascript
const arr = [1, 2, 3];

const reversed =
  arr.toReversed();

console.log(reversed);
console.log(arr);
```

### Output

```javascript
[3, 2, 1]

[1, 2, 3]
```

✅ Original array remains unchanged.

***

# Equivalent Polyfill

```javascript
Array.prototype.customToReversed =
  function () {
    return [...this].reverse();
  };
```

### Usage

```javascript
const arr = [1, 2, 3];

const result =
  arr.customToReversed();

console.log(result);
console.log(arr);
```

### Output

```javascript
[3, 2, 1]

[1, 2, 3]
```

***

# Manual Polyfill (Interview Question)

```javascript
Array.prototype.customToReversed =
  function () {
    const result = [];

    for (
      let i = this.length - 1;
      i >= 0;
      i--
    ) {
      result.push(this[i]);
    }

    return result;
  };
```

***

# With Objects

```javascript
const users = [
  { id: 1 },
  { id: 2 },
  { id: 3 }
];

const reversed =
  users.toReversed();

console.log(reversed);
console.log(users);
```

Output:

```javascript
[
  { id: 3 },
  { id: 2 },
  { id: 1 }
]

[
  { id: 1 },
  { id: 2 },
  { id: 3 }
]
```

***

# React Example

### ❌ Avoid

```javascript
setUsers(
  users.reverse()
);
```

Mutates state.

***

### ✅ Use

```javascript
setUsers(
  users.toReversed()
);
```

or

```javascript
setUsers(
  [...users].reverse()
);
```

***

# Interview Comparison

| Method         | Mutates Original | Returns New Array |
| -------------- | ---------------- | ----------------- |
| `reverse()`    | ✅                | ❌                 |
| `toReversed()` | ❌                | ✅                 |

***

# Related ES2023 Immutable Methods

### `toSorted()`

```javascript
const arr = [3, 1, 2];

const sorted =
  arr.toSorted();

console.log(sorted);
```

Output:

```javascript
[1, 2, 3]
```

***

### `toSpliced()`

```javascript
const arr = [1, 2, 3];

const result =
  arr.toSpliced(1, 1);
```

Output:

```javascript
[1, 3]
```

***

### `with()`

```javascript
const arr = [1, 2, 3];

const result =
  arr.with(1, 100);

console.log(result);
```

Output:

```javascript
[1, 100, 3]
```

***

### Interview One-Liner

> `toReversed()` is the immutable version of `reverse()`. It returns a new reversed array without modifying the original array, making it especially useful in React and functional programming where immutability is important.
>
# 1. `toReversed()` with Strings

`toReversed()` works on arrays, not directly on strings.

### Reverse Characters in a String

```javascript
const str = "Sudhir";

const reversed =
  [...str].toReversed().join("");

console.log(reversed);
```

### Output

```javascript
"rihduS"
```

***

### Reverse Words in a Sentence

```javascript
const sentence =
  "React JavaScript TypeScript";

const result = sentence
  .split(" ")
  .toReversed()
  .join(" ");

console.log(result);
```

### Output

```javascript
"TypeScript JavaScript React"
```

***

# 2. `toReversed()` with Objects

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
  },
  {
    id: 3,
    name: "Mike"
  }
];

const reversed =
  users.toReversed();

console.log(reversed);
```

### Output

```javascript
[
  { id: 3, name: "Mike" },
  { id: 2, name: "John" },
  { id: 1, name: "Sudhir" }
]
```

Original array remains:

```javascript
[
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" },
  { id: 3, name: "Mike" }
]
```

***

# 3. Compare `toReversed()`, `toSorted()`, and `toSpliced()`

These are the new **immutable array methods**.

***

## `toReversed()`

Returns a reversed copy.

```javascript
const arr = [1, 2, 3];

const result =
  arr.toReversed();

console.log(result);
```

Output:

```javascript
[3, 2, 1]
```

Original:

```javascript
[1, 2, 3]
```

***

## `toSorted()`

Returns a sorted copy.

```javascript
const arr = [3, 1, 2];

const result =
  arr.toSorted();

console.log(result);
```

Output:

```javascript
[1, 2, 3]
```

Original:

```javascript
[3, 1, 2]
```

***

### Objects Example

```javascript
const users = [
  { name: "John", age: 35 },
  { name: "Sudhir", age: 30 }
];

const sorted =
  users.toSorted(
    (a, b) => a.age - b.age
  );

console.log(sorted);
```

***

## `toSpliced()`

Immutable version of `splice()`.

```javascript
const arr = [1, 2, 3, 4];

const result =
  arr.toSpliced(
    1,
    2
  );

console.log(result);
```

Output:

```javascript
[1, 4]
```

Original:

```javascript
[1, 2, 3, 4]
```

***

## Comparison Table

| Method         | Purpose          | Mutates Original |
| -------------- | ---------------- | ---------------- |
| `reverse()`    | Reverse array    | ✅                |
| `toReversed()` | Reverse copy     | ❌                |
| `sort()`       | Sort array       | ✅                |
| `toSorted()`   | Sort copy        | ❌                |
| `splice()`     | Add/remove items | ✅                |
| `toSpliced()`  | Add/remove copy  | ❌                |

***

# 4. React Example Using `toReversed()`

## Reverse List Order

```jsx
import { useState } from "react";

export default function App() {
  const [users, setUsers] =
    useState([
      "Sudhir",
      "John",
      "Mike"
    ]);

  const reverseOrder = () => {
    setUsers(prev =>
      prev.toReversed()
    );
  };

  return (
    <>
      <button onClick={reverseOrder}>
        Reverse
      </button>

      <ul>
        {users.map(user => (
          <li key={user}>
            {user}
          </li>
        ))}
      </ul>
    </>
  );
}
```

***

### Initial UI

```text
Sudhir
John
Mike
```

***

### After Click

```text
Mike
John
Sudhir
```

***

# React Example with Chat Messages

A common pattern:

```jsx
const [messages, setMessages] =
  useState(data);

const showLatestFirst = () => {
  setMessages(prev =>
    prev.toReversed()
  );
};
```

Useful for:

* Chat applications
* Activity feeds
* Notifications
* Transaction history

***

# React Example with useMemo

```jsx
const latestUsers = useMemo(
  () => users.toReversed(),
  [users]
);
```

This avoids recalculating the reversed array on every render.

***

## Interview Answer

> `toReversed()`, `toSorted()`, and `toSpliced()` are ES2023 immutable array methods. Unlike `reverse()`, `sort()`, and `splice()`, they return a new array without mutating the original. They are particularly useful in React applications because they align with React's immutable state update patterns and prevent accidental state mutations.

Updating state immutably is a core requirement in React. Before ES2023, updating nested arrays or sorting lists in state required creating explicit shallow copies using spread syntax (`[...]`), `concat()`, or `slice()` before performing mutations.

With ES2023 methods (`toSorted`, `toSpliced`, and `with`), you can perform these array transformations cleanly in a **single step**, returning a brand-new array copy that triggers React re-renders properly.

---

### 1. Sorting State with `toSorted()`

The traditional `sort()` mutates the state array in-place, which fails to trigger a re-render because React detects the exact same array reference. `toSorted()` returns a sorted copy automatically.

```jsx
import { useState } from 'react';

export function UserList() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Charlie', score: 85 },
    { id: 2, name: 'Alice', score: 95 },
    { id: 3, name: 'Bob', score: 90 },
  ]);

  // ❌ OLD WAY: Must spread first to avoid mutating state
  const sortByScoreOld = () => {
    setUsers([...users].sort((a, b) => b.score - a.score));
  };

  // ✅ NEW WAY: toSorted() returns a new sorted array directly
  const sortByScore = () => {
    setUsers(prev => prev.toSorted((a, b) => b.score - a.score));
  };

  return (
    <div>
      <button onClick={sortByScore}>Sort by Highest Score</button>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}: {u.score}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

### 2. Updating a Specific Item by Index with `with()`

Replacing an item at a specific index previously required `map()` or array slicing. `with(index, value)` replaces an item at an index in a new array copy.

```jsx
import { useState } from 'react';

export function TodoList() {
  const [todos, setTodos] = useState([
    { text: 'Buy groceries', completed: false },
    { text: 'Walk the dog', completed: false },
    { text: 'Read a book', completed: false },
  ]);

  const toggleTodo = (indexToToggle) => {
    setTodos(prevTodos => {
      const currentTodo = prevTodos[indexToToggle];
      const updatedTodo = { ...currentTodo, completed: !currentTodo.completed };

      // ❌ OLD WAY: Using map() or spreading
      // return prevTodos.map((todo, i) => i === indexToToggle ? updatedTodo : todo);

      // ✅ NEW WAY: with() updates indexToToggle in a fresh array copy
      return prevTodos.with(indexToToggle, updatedTodo);
    });
  };

  return (
    <ul>
      {todos.map((todo, index) => (
        <li
          key={index}
          onClick={() => toggleTodo(index)}
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

```

---

### 3. Inserting, Deleting, and Replacing Items with `toSpliced()`

While `splice()` mutates the array and returns the *deleted items*, `toSpliced()` returns the *entire updated array*.

#### A. Deleting an Item by Index

```jsx
const removeItem = (indexToRemove) => {
  setItems(prev => prev.toSpliced(indexToRemove, 1));
};

```

#### B. Inserting an Item at a Specific Index

```jsx
const insertItem = (newItem, insertAtIndex) => {
  // Start at index, delete 0 items, insert newItem
  setItems(prev => prev.toSpliced(insertAtIndex, 0, newItem));
};

```

#### Complete React Component Example

```jsx
import { useState } from 'react';

export function TagManager() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);

  // Remove tag at index
  const removeTag = (indexToRemove) => {
    setTags(prev => prev.toSpliced(indexToRemove, 1));
  };

  // Add a tag specifically after the first tag
  const insertTagAfterFirst = (newTag) => {
    setTags(prev => prev.toSpliced(1, 0, newTag));
  };

  return (
    <div>
      <button onClick={() => insertTagAfterFirst('Next.js')}>
        Insert 'Next.js' at Position 2
      </button>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {tags.map((tag, index) => (
          <span key={tag} style={{ border: '1px solid #ccc', padding: '4px 8px' }}>
            {tag} <button onClick={() => removeTag(index)}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
}

```

---

### Summary: Old vs. New React Immutable Array Updates

| Operation               | Old Immutable Approach                                     | ES2023 Immutable Approach              |
| ----------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Sort items**          | `setItems([...items].sort(fn))`                            | `setItems(items.toSorted(fn))`         |
| **Reverse items**       | `setItems([...items].reverse())`                           | `setItems(items.toReversed())`         |
| **Update index $i$**    | `setItems(items.map((x, idx) => idx === i ? val : x))`     | `setItems(items.with(i, val))`         |
| **Remove index $i$**    | `setItems(items.filter((_, idx) => idx !== i))`            | `setItems(items.toSpliced(i, 1))`      |
| **Insert at index $i$** | `setItems([...items.slice(0, i), val, ...items.slice(i)])` | `setItems(items.toSpliced(i, 0, val))` |
