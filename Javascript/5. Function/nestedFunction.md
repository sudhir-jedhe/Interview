This is a common JavaScript interview question:

> Given a nested object, recursively execute all function values and replace them with their returned values.

***

## Example

### Input

```js
const obj = {
  a: 1,
  b: () => 2,
  c: {
    d: () => 3,
    e: {
      f: () => 4,
    },
  },
};
```

### Output

```js
{
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: {
      f: 4
    }
  }
}
```

***

# Solution 1: Recursive DFS

```js
function resolveFunctions(obj) {
  const result = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "function") {
      result[key] = value();
    } else if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      result[key] = resolveFunctions(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
```

### Usage

```js
const obj = {
  a: 1,
  b: () => 2,
  c: {
    d: () => 3,
    e: {
      f: () => 4,
    },
  },
};

console.log(resolveFunctions(obj));
```

Output:

```js
{
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: {
      f: 4
    }
  }
}
```

***

# Solution 2: Support Arrays

### Input

```js
const obj = {
  users: [
    () => "John",
    () => "Jane",
  ],
};
```

### Solution

```js
function resolveFunctions(obj) {
  if (typeof obj === "function") {
    return obj();
  }

  if (Array.isArray(obj)) {
    return obj.map(resolveFunctions);
  }

  if (obj !== null && typeof obj === "object") {
    const result = {};

    for (const key in obj) {
      result[key] = resolveFunctions(obj[key]);
    }

    return result;
  }

  return obj;
}
```

### Usage

```js
const data = {
  name: () => "Sudhir",
  age: () => 30,
  skills: [
    () => "React",
    () => "TypeScript",
  ],
  address: {
    city: () => "Pune",
  },
};

console.log(resolveFunctions(data));
```

Output:

```js
{
  name: "Sudhir",
  age: 30,
  skills: ["React", "TypeScript"],
  address: {
    city: "Pune"
  }
}
```

***

# Solution 3: Async Function Support

Interviewers often ask:

```js
{
  user: async () => {
    return fetchUser();
  }
}
```

### Async Version

```js
async function resolveAsync(obj) {
  if (typeof obj === "function") {
    return await obj();
  }

  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map(resolveAsync)
    );
  }

  if (obj !== null && typeof obj === "object") {
    const result = {};

    for (const key in obj) {
      result[key] = await resolveAsync(
        obj[key]
      );
    }

    return result;
  }

  return obj;
}
```

### Usage

```js
const obj = {
  name: async () => "Sudhir",
  city: () => "Pune",
};

resolveAsync(obj).then(console.log);
```

Output:

```js
{
  name: "Sudhir",
  city: "Pune"
}
```

***

# Optimised Version (Preserve Original Object)

```js
function resolveFunctions(obj) {
  if (typeof obj === "function") {
    return obj();
  }

  if (Array.isArray(obj)) {
    return obj.map(item =>
      resolveFunctions(item)
    );
  }

  if (
    obj &&
    typeof obj === "object"
  ) {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([key, value]) => [
          key,
          resolveFunctions(value),
        ]
      )
    );
  }

  return obj;
}
```

***

# Complexity Analysis

Let:

```text
n = total properties
```

### Time

```text
O(n)
```

Every property is visited once.

### Space

```text
O(h)
```

Where:

```text
h = depth of nesting
```

due to recursion stack.

***

# Senior Interview Follow-up

What if functions depend on sibling values?

```js
const obj = {
  a: 10,
  b: (ctx) => ctx.a * 2,
  c: {
    d: (ctx) => ctx.a + 5,
  },
};
```

You can pass the root object as context:

```js
function resolveFunctions(obj, root = obj) {
  if (typeof obj === "function") {
    return obj(root);
  }

  if (Array.isArray(obj)) {
    return obj.map(item =>
      resolveFunctions(item, root)
    );
  }

  if (obj !== null && typeof obj === "object") {
    const result = {};

    for (const key in obj) {
      result[key] = resolveFunctions(
        obj[key],
        root
      );
    }

    return result;
  }

  return obj;
}
```

This demonstrates recursion, object traversal, higher-order functions, and handling nested structures—exactly the concepts interviewers often look for in Senior JavaScript/React rounds.
