You mean **`structuredClone()`** ✅ (not "strulerdeclone").

`structuredClone()` is the modern JavaScript API for creating a **true deep copy** of objects and arrays.

***

# Basic Array Clone

```javascript
const original = [1, 2, 3, 4];

const cloned = structuredClone(original);

console.log(cloned);
```

Output:

```javascript
[1, 2, 3, 4]
```

***

# Deep Clone Nested Objects

```javascript
const user = {
  name: "Sudhir",
  address: {
    city: "Pune"
  }
};

const clonedUser = structuredClone(user);

clonedUser.address.city = "Mumbai";

console.log(user.address.city);
console.log(clonedUser.address.city);
```

Output:

```javascript
Pune
Mumbai
```

✅ Original is unaffected.

***

# Deep Clone Nested Arrays

```javascript
const original = [
  [1, 2],
  [3, 4]
];

const cloned = structuredClone(original);

cloned[0][0] = 100;

console.log(original);
console.log(cloned);
```

Output:

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

✅ Inner arrays are cloned too.

***

# Clone Map

```javascript
const users = new Map();

users.set(1, {
  name: "Sudhir"
});

const clonedUsers =
  structuredClone(users);

clonedUsers.get(1).name =
  "John";

console.log(
  users.get(1).name
);

console.log(
  clonedUsers.get(1).name
);
```

Output:

```javascript
Sudhir
John
```

✅ Map contents preserved.

***

# Clone Set

```javascript
const skills = new Set([
  "React",
  "TypeScript"
]);

const clonedSkills =
  structuredClone(skills);

clonedSkills.add("Node");

console.log(skills);
console.log(clonedSkills);
```

Output:

```javascript
Set { 'React', 'TypeScript' }

Set {
  'React',
  'TypeScript',
  'Node'
}
```

✅ Set preserved.

***

# Clone Circular References

```javascript
const user = {
  name: "Sudhir"
};

user.self = user;

const cloned =
  structuredClone(user);

console.log(
  cloned.self === cloned
);
```

Output:

```javascript
true
```

✅ Works perfectly.

***

# React Example

### Clone State Snapshot

```javascript
const snapshot =
  structuredClone(state);
```

### Example

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

copy.users[0]
  .profile.city = "Mumbai";

console.log(
  state.users[0]
    .profile.city
);
```

Output:

```javascript
Pune
```

✅ Deep copy created.

***

# Limitations

### Functions ❌

```javascript
const user = {
  greet() {
    return "Hello";
  }
};

structuredClone(user);
```

Throws:

```text
DataCloneError
```

***

### Class Instances Lose Prototype ❌

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return "Hello";
  }
}

const user = new User("Sudhir");

const clone =
  structuredClone(user);

console.log(
  clone instanceof User
);
```

Output:

```javascript
false
```

Methods are not preserved.

***

# Interview Cheat Sheet

```javascript
// Shallow clone
const a = [...arr];
const b = Array.from(arr);
const c = arr.slice();
const d = [].concat(arr);
const e = Object.assign({}, obj);

// Deep clone (modern)
const f = structuredClone(data);

// Deep clone (legacy)
const g = JSON.parse(
  JSON.stringify(data)
);
```

### When to Use `structuredClone()`

✅ Nested Objects  
✅ Nested Arrays  
✅ Map  
✅ Set  
✅ Date  
✅ Circular References  
✅ Temporary Data Snapshots

### Avoid for Frequent React State Updates

Instead use:

```javascript
setState(prev => ({
  ...prev,
  name: "Updated"
}));
```

or **Immer**, because they preserve structural sharing and are more efficient than cloning the entire state tree on every update.


## 1. React Example: Updating Nested Arrays with `structuredClone()`

Consider a project management application.

### State

```jsx
const [projects, setProjects] = useState([
  {
    id: 1,
    name: "Portal",
    tasks: [
      {
        id: 101,
        title: "Build Login",
        completed: false
      }
    ]
  }
]);
```

### Update Task Using `structuredClone`

```jsx
const markTaskCompleted = (projectId, taskId) => {
  setProjects(prev => {
    const copy = structuredClone(prev);

    const project = copy.find(
      p => p.id === projectId
    );

    const task = project.tasks.find(
      t => t.id === taskId
    );

    task.completed = true;

    return copy;
  });
};
```

### Result

```javascript
[
  {
    id: 1,
    tasks: [
      {
        id: 101,
        completed: true
      }
    ]
  }
]
```

✅ Works correctly

✅ No mutation of original state

✅ Easy to understand

***

## Another Example: Add Item to Nested Array

```jsx
setProjects(prev => {
  const copy = structuredClone(prev);

  copy[0].tasks.push({
    id: 102,
    title: "API Integration",
    completed: false
  });

  return copy;
});
```

***

# 2. Limitations of `structuredClone()` in React State

Although it works, it's usually **not the best choice for routine React updates**.

***

## Limitation 1: Clones Entire State Tree

Imagine:

```javascript
{
  users: [...1000 users],
  dashboard: {...},
  settings: {...}
}
```

Updating only:

```javascript
settings.theme
```

using:

```javascript
structuredClone(state)
```

copies:

```text
users
dashboard
settings
everything
```

even though only one value changed.

### Impact

```text
More memory allocation
More CPU work
More garbage collection
```

***

## Limitation 2: Breaks Structural Sharing

React performance relies on keeping unchanged references unchanged.

### With structuredClone

```javascript
const copy =
  structuredClone(state);
```

Everything gets new references.

```text
users      -> new
settings   -> new
dashboard  -> new
```

Even unchanged parts.

***

## Limitation 3: React.memo Becomes Less Effective

Suppose:

```jsx
<UserList users={users} />
```

wrapped with:

```jsx
React.memo(UserList)
```

Using:

```javascript
structuredClone(state)
```

creates:

```javascript
oldUsers !== newUsers
```

even when users didn't change.

Therefore:

```text
Child components re-render unnecessarily
```

***

## Limitation 4: Cannot Clone Functions

```javascript
const state = {
  handler() {}
};

structuredClone(state);
```

Throws:

```text
DataCloneError
```

***

## Limitation 5: Class Instances Lose Methods

```javascript
class User {
  greet() {
    return "Hello";
  }
}

const user = new User();

const clone =
  structuredClone(user);
```

Result:

```javascript
clone.greet // undefined
```

Prototype information is lost.

***

# 3. `structuredClone()` vs Immer

This is a very common senior React interview question.

***

## Using structuredClone

```jsx
setState(prev => {
  const copy =
    structuredClone(prev);

  copy.user.address.city =
    "Mumbai";

  return copy;
});
```

### Pros

✅ Simple

✅ True deep clone

✅ Works with nested structures

✅ Supports Map/Set/Date

***

### Cons

❌ Clones everything

❌ No structural sharing

❌ More memory usage

❌ More re-renders

***

## Using Immer

```jsx
import { produce } from "immer";

setState(prev =>
  produce(prev, draft => {
    draft.user.address.city =
      "Mumbai";
  })
);
```

### Pros

✅ Very readable

✅ Immutable updates

✅ Structural sharing

✅ Excellent React performance

✅ Used by Redux Toolkit

***

### What Immer Does Internally

Original:

```javascript
{
  users: [...],
  settings: {
    theme: "light"
  }
}
```

Change:

```javascript
draft.settings.theme =
  "dark";
```

Immer creates:

```text
users       -> reused
settings    -> copied
theme       -> updated
```

Only modified branches change.

***

# Visual Comparison

### structuredClone

```text
state
 ├─ users      NEW
 ├─ settings   NEW
 └─ dashboard  NEW
```

Everything recreated.

***

### Immer

```text
state
 ├─ users      SAME
 ├─ dashboard  SAME
 └─ settings   NEW
```

Only affected paths recreated.

***

# Performance Comparison

| Feature                | structuredClone | Immer            |
| ---------------------- | --------------- | ---------------- |
| Deep Clone Entire Tree | ✅               | ❌                |
| Structural Sharing     | ❌               | ✅                |
| React.memo Friendly    | ⚠️ Lower        | ✅ Excellent      |
| Nested Updates         | ✅               | ✅                |
| Memory Efficient       | ❌               | ✅                |
| Large State Trees      | ❌               | ✅                |
| Redux Toolkit          | ❌               | ✅ Built-in       |
| Map/Set Support        | ✅               | Limited use case |

***

# When Should You Use Each?

### Use `structuredClone()` ✅

```javascript
const snapshot =
  structuredClone(data);
```

Good for:

* Undo/redo history
* Cloning API responses
* Copying configuration data
* Temporary editing buffers
* Data export/import workflows

***

### Use Immer ✅

```javascript
produce(...)
```

Good for:

* React state updates
* Redux Toolkit reducers
* Complex forms
* Dashboard applications
* Large nested state trees

***

## Senior React Interview Answer

> `structuredClone()` is excellent for creating a complete deep copy of data and is ideal for snapshots or temporary data manipulation. However, for React state management, it is usually less efficient because it recreates the entire state tree and breaks structural sharing. Immer is generally preferred for complex React state updates because it provides immutable updates while preserving references to unchanged data, reducing unnecessary re-renders and improving performance.
