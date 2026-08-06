In JavaScript, **`compose()`** is a functional programming utility that combines multiple functions into one.

The functions execute **right to left**.

***

## Basic Compose Implementation

```javascript
function compose(...fns) {
  return function (value) {
    return fns.reduceRight(
      (acc, fn) => fn(acc),
      value
    );
  };
}
```

***

## Example

```javascript
const add2 = x => x + 2;
const multiply3 = x => x * 3;
const square = x => x * x;

const composed = compose(
  square,
  multiply3,
  add2
);

console.log(composed(2));
```

### Execution

```javascript
add2(2)       => 4
multiply3(4) => 12
square(12)   => 144
```

### Output

```javascript
144
```

***

# Visual Flow

```text
compose(
  square,
  multiply3,
  add2
)

Input: 2

2
↓ add2
4
↓ multiply3
12
↓ square
144
```

***

# Compare with `pipe()`

### Compose

```javascript
compose(f3, f2, f1)
```

Executes:

```javascript
f3(f2(f1(x)))
```

Right ➜ Left

***

### Pipe

```javascript
pipe(f1, f2, f3)
```

Executes:

```javascript
f3(f2(f1(x)))
```

Left ➜ Right

Implementation:

```javascript
function pipe(...fns) {
  return function (value) {
    return fns.reduce(
      (acc, fn) => fn(acc),
      value
    );
  };
}
```

***

# Multiple Arguments Support

```javascript
function compose(...fns) {
  return (...args) =>
    fns.reduceRight(
      (acc, fn, index) =>
        index === fns.length - 1
          ? fn(...acc)
          : fn(acc),
      args
    );
}
```

### Example

```javascript
const sum = (a, b) => a + b;
const double = x => x * 2;

const result =
  compose(double, sum);

console.log(result(5, 10));
```

Output:

```javascript
30
```

***

# React Example

```javascript
const trim = str => str.trim();

const toLower =
  str => str.toLowerCase();

const removeSpaces =
  str => str.replace(/\s+/g, "-");

const formatSlug = compose(
  removeSpaces,
  toLower,
  trim
);

console.log(
  formatSlug("  React JS Developer  ")
);
```

Output:

```javascript
react-js-developer
```

***

# Async Compose

```javascript
function composeAsync(...fns) {
  return value =>
    fns.reduceRight(
      (promise, fn) =>
        promise.then(fn),
      Promise.resolve(value)
    );
}
```

### Example

```javascript
const add1 = async x => x + 1;
const double = async x => x * 2;

const fn =
  composeAsync(
    double,
    add1
  );

fn(5).then(console.log);
```

Output:

```javascript
12
```

***

# Interview-Ready Polyfill

```javascript
function compose(...fns) {
  return x =>
    fns.reduceRight(
      (acc, fn) => fn(acc),
      x
    );
}
```

### Complexity

* Time Complexity: **O(n)** (`n` = number of functions)
* Space Complexity: **O(1)**

### Interview One-Liner

> `compose()` combines multiple functions into a single function and executes them from right to left. It is commonly used in functional programming, Redux middleware, data transformation pipelines, and React utility composition.


## Compose with Async Functions

Normal `compose()` works synchronously:

```javascript
const compose = (...fns) => x =>
  fns.reduceRight(
    (acc, fn) => fn(acc),
    x
  );
```

However, with async functions:

```javascript
const add1 = async x => x + 1;
const double = async x => x * 2;
```

This won't work correctly because each function returns a `Promise`.

***

### Async Compose Implementation

```javascript
function composeAsync(...fns) {
  return async (value) => {
    let result = value;

    for (let i = fns.length - 1; i >= 0; i--) {
      result = await fns[i](result);
    }

    return result;
  };
}
```

***

### Example

```javascript
const add1 = async x => {
  console.log("add1");
  return x + 1;
};

const double = async x => {
  console.log("double");
  return x * 2;
};

const square = async x => {
  console.log("square");
  return x * x;
};

const calculate = composeAsync(
  square,
  double,
  add1
);

calculate(5).then(console.log);
```

### Execution

```text
add1
double
square
```

### Calculation

```javascript
5
↓ add1
6
↓ double
12
↓ square
144
```

### Output

```javascript
144
```

***

## Compose with Multiple Arguments

The last function in the chain can accept multiple arguments.

### Implementation

```javascript
function compose(...fns) {
  return (...args) =>
    fns.reduceRight(
      (acc, fn, index) =>
        index === fns.length - 1
          ? fn(...acc)
          : fn(acc),
      args
    );
}
```

***

### Example 1

```javascript
const sum = (a, b) => a + b;

const double = x => x * 2;

const result =
  compose(double, sum);

console.log(result(5, 10));
```

### Execution

```javascript
sum(5,10)
↓
15

double(15)
↓
30
```

### Output

```javascript
30
```

***

### Example 2

```javascript
const createUser = (
  first,
  last
) => ({
  first,
  last
});

const addFullName = user => ({
  ...user,
  fullName:
    `${user.first} ${user.last}`
});

const formatUser = compose(
  addFullName,
  createUser
);

console.log(
  formatUser(
    "Sudhir",
    "Jedhe"
  )
);
```

### Output

```javascript
{
  first: "Sudhir",
  last: "Jedhe",
  fullName: "Sudhir Jedhe"
}
```

***

## Async Compose with Multiple Arguments

```javascript
function composeAsync(...fns) {
  return async (...args) => {
    let result =
      await fns...args;

    for (
      let i = fns.length - 2;
      i >= 0;
      i--
    ) {
      result =
        await fns[i](result);
    }

    return result;
  };
}
```

### Example

```javascript
const sum = async (a, b) => a + b;

const double = async x => x * 2;

const square = async x => x * x;

const calculate =
  composeAsync(
    square,
    double,
    sum
  );

calculate(2, 3)
  .then(console.log);
```

### Execution

```javascript
sum(2,3)
↓
5

double(5)
↓
10

square(10)
↓
100
```

### Output

```javascript
100
```

***

## Interview Comparison

### Compose

```javascript
compose(
  square,
  double,
  add1
)(5);
```

Equivalent to:

```javascript
square(
  double(
    add1(5)
  )
);
```

Right → Left execution

***

### Pipe

```javascript
pipe(
  add1,
  double,
  square
)(5);
```

Equivalent to:

```javascript
square(
  double(
    add1(5)
  )
);
```

Left → Right execution

***

### Senior Interview Answer

> `compose()` combines multiple functions into a single function and executes them from right to left. For async functions, each step must await the previous result before passing it to the next function. When supporting multiple arguments, the rightmost function typically receives all arguments, while the remaining functions operate on the single transformed value returned from the previous step.


## 1. Async `compose()` with Error Handling

In production, async functions can fail, so a robust `composeAsync()` should propagate errors.

### Implementation

```javascript
function composeAsync(...fns) {
  return async (...args) => {
    try {
      let result =
        await fns...args;

      for (
        let i = fns.length - 2;
        i >= 0;
        i--
      ) {
        result = await fns[i](result);
      }

      return result;
    } catch (error) {
      console.error(
        "Compose failed:",
        error.message
      );

      throw error;
    }
  };
}
```

***

### Example

```javascript
const fetchUser = async (id) => {
  if (id === 0) {
    throw new Error("Invalid User");
  }

  return {
    id,
    name: "Sudhir"
  };
};

const formatUser = async (user) => ({
  ...user,
  displayName: user.name.toUpperCase()
});

const processUser =
  composeAsync(
    formatUser,
    fetchUser
  );

try {
  const result =
    await processUser(1);

  console.log(result);
} catch (error) {
  console.log(error.message);
}
```

### Output

```javascript
{
  id: 1,
  name: "Sudhir",
  displayName: "SUDHIR"
}
```

***

### Failure Case

```javascript
await processUser(0);
```

Output:

```text
Compose failed: Invalid User
```

***

# 2. Compose vs Pipe

Both combine functions, but execution order differs.

***

## Compose

### Right → Left

```javascript
compose(
  square,
  double,
  add1
)(5);
```

Equivalent to:

```javascript
square(
  double(
    add1(5)
  )
);
```

### Flow

```text
5
↓ add1
6
↓ double
12
↓ square
144
```

***

## Pipe

### Left → Right

```javascript
pipe(
  add1,
  double,
  square
)(5);
```

Equivalent to:

```javascript
square(
  double(
    add1(5)
  )
);
```

### Flow

```text
5
↓ add1
6
↓ double
12
↓ square
144
```

***

## Implementations

### Compose

```javascript
const compose =
  (...fns) =>
  value =>
    fns.reduceRight(
      (acc, fn) => fn(acc),
      value
    );
```

### Pipe

```javascript
const pipe =
  (...fns) =>
  value =>
    fns.reduce(
      (acc, fn) => fn(acc),
      value
    );
```

***

## Comparison

| Feature                | compose        | pipe           |
| ---------------------- | -------------- | -------------- |
| Direction              | Right → Left   | Left → Right   |
| Readability            | Less intuitive | More intuitive |
| Functional Programming | Common         | Common         |
| Redux Utility Style    | Often          | Less common    |
| Beginner Friendly      | ❌              | ✅              |

***

# 3. React Example Using Async Compose

Imagine a React component that:

1. Fetches user
2. Formats data
3. Calculates role information

***

### Async Functions

```javascript
const fetchUser = async (id) => {
  const response = await fetch(
    `/api/users/${id}`
  );

  return response.json();
};

const addFullName = async (user) => ({
  ...user,
  fullName:
    `${user.firstName} ${user.lastName}`
});

const addAccessLevel = async (
  user
) => ({
  ...user,
  accessLevel:
    user.role === "Admin"
      ? "Full"
      : "Limited"
});
```

***

### Compose Pipeline

```javascript
const buildUser =
  composeAsync(
    addAccessLevel,
    addFullName,
    fetchUser
  );
```

***

### React Component

```jsx
import {
  useEffect,
  useState
} from "react";

function UserProfile() {
  const [user, setUser] =
    useState(null);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const result =
          await buildUser(1);

        setUser(result);
      } catch (err) {
        setError(err.message);
      }
    }

    loadUser();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>
        {user.fullName}
      </h2>

      <p>
        Role:
        {" "}
        {user.role}
      </p>

      <p>
        Access:
        {" "}
        {user.accessLevel}
      </p>
    </div>
  );
}
```

***

## Visual Pipeline

```text
User ID
   ↓
fetchUser()
   ↓
user object
   ↓
addFullName()
   ↓
user + fullName
   ↓
addAccessLevel()
   ↓
final user object
   ↓
React UI
```

***

## Senior Interview Answer

> `compose()` executes functions from right to left, while `pipe()` executes from left to right. For async functions, each step must await the previous result before passing data forward. In React applications, async composition is useful for building reusable data-processing pipelines such as API fetching, transformation, validation, enrichment, and formatting before rendering the final UI.
