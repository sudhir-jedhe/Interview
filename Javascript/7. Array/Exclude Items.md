If you're referring to the common JavaScript interview problem **"Exclude Items"**, the goal is usually:

> Remove items from one array based on another array or a set of exclusion rules.

***

# Problem 1: Exclude Items from Array

### Input

```js
const items = [1, 2, 3, 4, 5];
const exclude = [2, 4];
```

### Output

```js
[1, 3, 5]
```

### Solution

```js
function excludeItems(items, exclude) {
  const excludeSet = new Set(exclude);

  return items.filter(
    item => !excludeSet.has(item)
  );
}

console.log(
  excludeItems([1, 2, 3, 4, 5], [2, 4])
);
```

### Complexity

```text
Time: O(n)
Space: O(m)
```

where:

* n = items length
* m = excluded items length

***

# Problem 2: Exclude Objects by ID

### Input

```js
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Bob" }
];

const excludedIds = [2];
```

### Output

```js
[
  { id: 1, name: "John" },
  { id: 3, name: "Bob" }
]
```

### Solution

```js
function excludeUsers(users, ids) {
  const excludedSet = new Set(ids);

  return users.filter(
    user => !excludedSet.has(user.id)
  );
}
```

***

# Problem 3: Exclude Multiple Properties

### Input

```js
const users = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
  { id: 3, role: "guest" },
];
```

Exclude:

```js
[
  { key: "role", value: "guest" }
]
```

### Solution

```js
function excludeItems(items, excludes) {
  return items.filter(item =>
    !excludes.some(
      rule =>
        item[rule.key] === rule.value
    )
  );
}
```

### Usage

```js
const result = excludeItems(
  users,
  [
    {
      key: "role",
      value: "guest",
    },
  ]
);

console.log(result);
```

***

# Frontend Interview Version (Google Style)

### Input

```js
const items = [
  {
    color: "red",
    type: "tv",
    age: 18
  },
  {
    color: "silver",
    type: "phone",
    age: 20
  }
];

const excludes = [
  {
    k: "color",
    v: "silver"
  },
  {
    k: "type",
    v: "tv"
  }
];
```

### Output

```js
[]
```

***

### Solution

```js
function excludeItems(items, excludes) {
  const excludeMap = excludes.reduce(
    (acc, { k, v }) => {
      if (!acc[k]) {
        acc[k] = new Set();
      }

      acc[k].add(v);

      return acc;
    },
    {}
  );

  return items.filter(item => {
    for (const key in excludeMap) {
      if (
        excludeMap[key].has(item[key])
      ) {
        return false;
      }
    }

    return true;
  });
}
```

***

# Optimized Solution

Instead of:

```js
excludes.some(...)
```

for every item,

build a lookup:

```js
{
  color: Set(["silver"]),
  type: Set(["tv"])
}
```

Then each check becomes:

```js
O(1)
```

Resulting complexity:

```text
Build Map   : O(m)
Filter      : O(n)

Total       : O(n + m)
```

***

# React Example

```tsx
const filteredUsers = useMemo(() => {
  const excludedIds = new Set([2, 4]);

  return users.filter(
    user => !excludedIds.has(user.id)
  );
}, [users]);
```

***

### Interview Follow-up

For a Senior Frontend interview, explain:

* Use `Set` for O(1) lookups instead of `Array.includes()`
* Preprocess exclusion rules into a hash map
* Complexity improves from roughly **O(n × m)** to **O(n + m)**
* Suitable for search results, filters, permissions, and large datasets

This "Exclude Items" question frequently appears in JavaScript machine coding and frontend interview rounds at companies like Google, Amazon, Walmart, and Microsoft.
