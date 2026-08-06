You've provided a nice example of currying in JavaScript! To expand on it, currying transforms a function that takes multiple arguments into a series of functions that each take one argument. Let's break it down and explain the key concepts:

### 1. **Traditional Function (Non-Curried)**

```javascript
const multiArgFunction = (a, b, c) => a + b + c;
console.log(multiArgFunction(1, 2, 3)); // 6
```

- This function takes three arguments (`a`, `b`, `c`) and returns their sum.
- You call it once with all three arguments and get the result.

### 2. **Curried Function**

```javascript
const curryUnaryFunction = (a) => (b) => (c) => a + b + c;
```

- The function `curryUnaryFunction` is a curried version of `multiArgFunction`.
- It returns a function that accepts the next argument until all arguments have been provided.

### Example Breakdown

- **Step 1**: `curryUnaryFunction(1)` returns a new function that expects the next argument `b`.
- **Step 2**: `curryUnaryFunction(1)(2)` returns another function that expects the final argument `c`.
- **Step 3**: `curryUnaryFunction(1)(2)(3)` finally computes the result, which is `6`.

### Why Use Currying?

- **Improved Reusability**: You can use a curried function partially. For example, if you only need to provide a specific argument later, you can reuse the curried functions.
- **Functional Composition**: Currying makes it easier to compose functions because you can chain them together and apply each function to a single argument.

### Example of Partial Application (Reusability)

```javascript
const add = (a) => (b) => a + b;

const add5 = add(5);  // `add5` is a function that adds 5 to any number.
console.log(add5(10)); // 15
```

Here, `add5` is a reusable function that adds `5` to any value passed to it.

### Code Summary

```javascript
const multiArgFunction = (a, b, c) => a + b + c;
console.log(multiArgFunction(1, 2, 3)); // 6

// Curried version of multiArgFunction
const curryUnaryFunction = (a) => (b) => (c) => a + b + c;

console.log(curryUnaryFunction(1)(2)(3)); // 6
```

### Key Takeaways

- **Currying** makes a function more flexible and reusable.
- A curried function returns a series of functions that take one argument at a time.
- **Partial application** allows you to "pre-fill" some arguments, creating new functions.

```js
const curry = (fn) => {
  const args = [];

  const curried = (...newArgs) => {
    args.push(...newArgs);

    if (args.length < fn.length) {
      return curried;
    } else {
      return fn(...args);
    }
  };

  return curried;
};

// Example usage:
const sum = (a, b, c, d) => a + b + c + d;

const curriedSum = curry(sum);
const result = curriedSum(1)(2)(3)(4); // 1 + 2 + 3 + 4 = 10
console.log(result);  // Output: 10
```

```js
function curriedSum(a) {
  let sum = a;
  
  function addNext(b) {
    if (b === undefined) {
      return sum;
    }
    sum += b;
    return addNext;
  }
  
  return addNext;
}

// Test the curriedSum function
console.log(curriedSum(1)(2)(3)(4)()); // Should output 10

// Let's break it down step by step
const step1 = curriedSum(1);
console.log(step1()); // 1

const step2 = step1(2);
console.log(step2()); // 3

const step3 = step2(3);
console.log(step3()); // 6

const step4 = step3(4);
console.log(step4()); // 10

// We can also use it with different numbers of arguments
console.log(curriedSum(5)(10)(15)()); // 30
console.log(curriedSum(2)(4)(6)(8)(10)()); // 30
```

// 1. Basic Currying
const basicCurry = (a) => (b) => (c) => a + b + c;
console.log("1. Basic Currying:", basicCurry(1)(2)(3)); // 6

// 2. Partial Application
const partialAdd = (a) => (b) => (c) => a + b + c;
const add5 = partialAdd(5);
const add5and10 = add5(10);
console.log("2. Partial Application:", add5and10(15)); // 30

// 3. Variadic Currying
function variadicCurry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = variadicCurry(sum);
console.log("3. Variadic Currying:",
  curriedSum(1)(2)(3),      // 6
  curriedSum(1, 2)(3),      // 6
  curriedSum(1)(2, 3),      // 6
  curriedSum(1, 2, 3)       // 6
);

// 4. Infinite Currying
const infiniteCurry = (fn) => {
  const next = (...args) => {
    return (x) => {
      if (x === undefined) {
        return fn(...args);
      }
      return next(...args, x);
    };
  };
  return next();
};

const infiniteSum = infiniteCurry((args) => args.reduce((a, b) => a + b, 0));
console.log("4. Infinite Currying:", infiniteSum(1)(2)(3)(4)(5)()); // 15

// 5. Object-Oriented Currying
const objectCurry = (obj, fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(obj, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
};

const person = {
  name: "John",
  greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
};

const curriedGreet = objectCurry(person, person.greet);
console.log("5. Object-Oriented Currying:", curriedGreet("Hello")("!")); // Hello, John!

// 6. Lazy Evaluation
const lazyCurry = (fn) => {
  const args = [];
  return function curried(arg) {
    args.push(arg);
    if (args.length === fn.length) {
      const result = fn.apply(this, args);
      args.length = 0; // Reset args for next use
      return result;
    } else {
      return curried;
    }
  };
};

const lazySum = lazyCurry((a, b, c) => a + b + c);
console.log("6. Lazy Evaluation:", lazySum(1)(2)(3)); // 6

// 7. Currying with Default Parameters
const defaultCurry = (a = 0) => (b = 0) => (c = 0) => a + b + c;
console.log("7. Currying with Default Parameters:",
  defaultCurry(1)(2)(3),  // 6
  defaultCurry(1)(2)(),   // 3
  defaultCurry(1)()()     // 1
);

// 8. Currying with Placeholders
const _= Symbol('placeholder');
function advancedCurry(fn) {
  return function curried(...args) {
    const complete = args.length >= fn.length && !args.slice(0, fn.length).includes(_);
    if (complete) return fn.apply(this, args);
    return function(...newArgs) {
      const res = args.map(arg => arg === _ && newArgs.length ? newArgs.shift() : arg);
      return curried.apply(this, res.concat(newArgs));
    }
  };
}

const curriedDivide = advancedCurry((a, b) => a / b);
console.log("8. Currying with Placeholders:",
  curriedDivide(10, 2),    // 5
  curriedDivide(_, 2)(10), // 5
  curriedDivide(10)(2),    // 5
  curriedDivide(_)(10)(2)  // 5
);

**Currying** is a functional programming technique where a function with multiple arguments is transformed into a sequence of functions, each taking **one argument at a time**. Currying is commonly discussed alongside closures, higher-order functions, and functional programming concepts in JavaScript interview guidelines. [\[Interview...JavaScript \| PDF\]](https://persistentsystems.sharepoint.com/sites/Pi/HR/Talent-Management/Documents/Interview%20Guidelines%20and%20Standards-HTML-CSS-JavaScript.pdf?web=1)

# Normal Function

```javascript
function add(a, b, c) {
  return a + b + c;
}

console.log(
  add(10, 20, 30)
);
```

Output:

```text
60
```

***

# Curried Version

```javascript
function add(a) {

  return function (b) {

    return function (c) {

      return a + b + c;

    };

  };

}

console.log(
  add(10)(20)(30)
);
```

Output:

```text
60
```

***

# Arrow Function Version

```javascript
const add =
  a =>
    b =>
      c =>
        a + b + c;

console.log(
  add(10)(20)(30)
);
```

Output:

```text
60
```

***

# How Does It Work?

```javascript
add(10)
```

returns:

```javascript
function(b) {
  return function(c) {
    return 10 + b + c;
  }
}
```

Then:

```javascript
add(10)(20)
```

returns:

```javascript
function(c) {
  return 10 + 20 + c;
}
```

Finally:

```javascript
add(10)(20)(30)
```

returns:

```text
60
```

This works because of **closures**.

***

# Currying and Closures

```javascript
function multiply(a) {

  return function(b) {

    return a * b;

  };
}

const double =
  multiply(2);

console.log(
  double(5)
);
```

Output:

```text
10
```

The inner function remembers:

```javascript
a = 2
```

through closure.

***

# Real World Example

## Tax Calculator

```javascript
function tax(rate) {

  return function(amount) {

    return amount * rate;

  };

}
```

Create reusable functions:

```javascript
const gst18 =
  tax(0.18);

const gst5 =
  tax(0.05);

console.log(
  gst18(1000)
);

console.log(
  gst5(1000)
);
```

Output:

```text
180
50
```

***

# React Example

Imagine different button handlers.

Without currying:

```jsx
<button
  onClick={() =>
    handleClick(1)
  }
>
  Edit
</button>
```

Using currying:

```jsx
const handleClick =
  id =>
    () =>
      console.log(id);
```

```jsx
<button
  onClick={handleClick(1)}
>
  Edit
</button>
```

***

# Generic Curry Function

Interview Favourite:

```javascript
function curry(fn) {

  return function curried(...args) {

    if (
      args.length >= fn.length
    ) {
      return fn(...args);
    }

    return function(...nextArgs) {

      return curried(
        ...args,
        ...nextArgs
      );

    };
  };
}
```

Usage:

```javascript
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum =
  curry(sum);

console.log(
  curriedSum(1)(2)(3)
);

console.log(
  curriedSum(1, 2)(3)
);

console.log(
  curriedSum(1)(2, 3)
);
```

Output:

```text
6
6
6
```

***

# Currying vs Partial Application

### Currying

```javascript
add(10)(20)(30)
```

One argument at a time.

***

### Partial Application

```javascript
function add(a, b, c) {
  return a + b + c;
}

const partial =
  add.bind(null, 10);

partial(20, 30);
```

Output:

```text
60
```

***

# Interview Use Cases

```text
✅ Reusable functions
✅ Event handlers in React
✅ Functional programming
✅ Dependency injection
✅ Configuration APIs
✅ Function composition
```

***

# Senior React Interview Answer

> Currying is a technique where a function taking multiple arguments is transformed into a chain of functions that each accept a single argument. It relies on closures to preserve previously supplied arguments. Currying improves reusability, supports function composition, and is commonly used in React event handlers, functional programming patterns, and utility libraries. A curried function like `add(1)(2)(3)` is equivalent to calling a normal function `add(1, 2, 3)`, but allows partial application of arguments over time.
**Currying has several practical uses in React**, especially for event handlers, reusable logic, and component configuration. It's closely related to **closures** and **higher-order functions**, which are listed as important JavaScript interview topics in the frontend interview guidelines. [\[Interview...Algorithms \| PDF\]](https://persistentsystems.sharepoint.com/sites/Pi/HR/Talent-Management/Documents/Interview%20Guidelines%20and%20Standards%20-%20Design%20Patterns%20and%20Algorithms.pdf?web=1)

# 1. Event Handlers with Parameters

One of the most common React use cases.

### Without Currying

```jsx
function UserList() {
  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  return (
    <button
      onClick={() => handleDelete(101)}
    >
      Delete
    </button>
  );
}
```

***

### With Currying

```jsx
function UserList() {

  const handleDelete =
    (id) =>
      () => {
        console.log(
          "Delete:",
          id
        );
      };

  return (
    <button
      onClick={handleDelete(101)}
    >
      Delete
    </button>
  );
}
```

### Flow

```text
handleDelete(101)
      ↓
returns function
      ↓
React executes it
when clicked
```

***

# 2. Reusable Form Handlers

For large forms.

```jsx
function Form() {

  const [form, setForm] =
    useState({
      firstName: "",
      lastName: ""
    });

  const handleChange =
    field =>
      e => {

        setForm(prev => ({
          ...prev,
          e.target.value
        }));

      };

  return (
    <>
      <input
        onChange={
          handleChange(
            "firstName"
          )
        }
      />

      <input
        onChange={
          handleChange(
            "lastName"
          )
        }
      />
    </>
  );
}
```

### Benefit

Instead of:

```javascript
handleFirstNameChange
handleLastNameChange
handleEmailChange
```

you create:

```javascript
handleChange(field)
```

once.

***

# 3. Role-Based Actions

Very useful given your frequent RBAC discussions.

```jsx
const performAction =
  role =>
    action =>
      () => {

        console.log(
          `${role} can ${action}`
        );

      };
```

Usage:

```jsx
<button
  onClick={
    performAction(
      "admin"
    )("delete")
  }
>
  Delete User
</button>
```

Output:

```text
admin can delete
```

***

# 4. API Service Configuration

```javascript
const createApiClient =
  baseUrl =>
    endpoint =>
      fetch(
        `${baseUrl}${endpoint}`
      );
```

Usage:

```javascript
const api =
  createApiClient(
    "https://api.com"
  );

api("/users");
api("/posts");
```

This is currying plus partial application.

***

# 5. React Table Actions

Common in enterprise dashboards.

```jsx
const handleRowAction =
  action =>
    rowId =>
      () => {

        console.log(
          action,
          rowId
        );

      };
```

Usage:

```jsx
<button
  onClick={
    handleRowAction(
      "edit"
    )(101)
  }
>
  Edit
</button>

<button
  onClick={
    handleRowAction(
      "delete"
    )(101)
  }
>
  Delete
</button>
```

Output:

```text
edit 101
delete 101
```

***

# 6. Custom Hooks

Currying is useful when building reusable hooks.

```jsx
const usePermission =
  role =>
    permission =>
      role === permission;
```

Usage:

```javascript
const checkAdmin =
  usePermission(
    "admin"
  );

console.log(
  checkAdmin(
    "admin"
  )
);
```

Output:

```text
true
```

***

# 7. Redux Action Creators

```javascript
const updateField =
  field =>
    value => ({
      type: "UPDATE",
      payload: {
        field,
        value
      }
    });
```

Usage:

```javascript
dispatch(
  updateField(
    "name"
  )("Sudhir")
);
```

***

# Interview Comparison

### Normal Function

```javascript
handleClick(id)
```

Call immediately.

***

### Curried Function

```javascript
handleClick(id)()
```

Returns another function.

Useful for:

```text
✅ Event handlers
✅ Form updates
✅ API configuration
✅ Reusable hooks
✅ Redux actions
✅ Permission checks
```

# Senior React Interview Answer

> Currying is particularly useful in React for creating reusable event handlers, form field handlers, role-based actions, and configurable APIs. It allows arguments to be supplied progressively while leveraging closures to retain state. Common examples include `handleChange(field)(event)`, `handleDelete(id)()`, and Redux action creators. Currying improves code reuse and helps avoid repetitive handler definitions in large React applications. [\[Interview...Algorithms \| PDF\]](https://persistentsystems.sharepoint.com/sites/Pi/HR/Talent-Management/Documents/Interview%20Guidelines%20and%20Standards%20-%20Design%20Patterns%20and%20Algorithms.pdf?web=1)



const createApi =
  baseUrl =>
    endpoint =>
      `${baseUrl}${endpoint}`;

const api =
  createApi(
    "https://api.company.com"
  );

console.log(
  api("/users")
);

console.log(
  api("/orders")
);


const updateField =
  field =>
    value => ({
      type: "UPDATE",
      payload: {
        field,
        value
      }
    });

console.log(
  updateField(
    "name"
  )("Sudhir")
);


Absolutely. **Currying shines in large React and enterprise applications** because it helps create reusable, configurable functions.

# 1. Permission-Based Access (RBAC)

Very relevant for admin/manager/user roles.

```javascript
const hasPermission =
  role =>
    permission =>
      permissions[role]?.includes(
        permission
      );

const adminAccess =
  hasPermission("admin");

console.log(
  adminAccess("delete-user")
);

console.log(
  adminAccess("edit-user")
);
```

Output:

```text
true
true
```

Benefits:

```text
✅ Reusable
✅ Cleaner RBAC logic
✅ Easy testing
```

***

# 2. Logger Factory

Enterprise applications often need different loggers.

```javascript
const logger =
  level =>
    message =>
      console.log(
        `[${level}] ${message}`
      );

const info =
  logger("INFO");

const error =
  logger("ERROR");

info("Application Started");
error("Database Failed");
```

Output:

```text
[INFO] Application Started
[ERROR] Database Failed
```

***

# 3. API Client Builder

```javascript
const createApiClient =
  baseUrl =>
    endpoint =>
      fetch(
        `${baseUrl}${endpoint}`
      );

const githubApi =
  createApiClient(
    "https://api.github.com"
  );

githubApi("/users");
githubApi("/repos");
```

***

# 4. Feature Flags

```javascript
const isEnabled =
  config =>
    feature =>
      config[feature];

const checkFeature =
  isEnabled({
    darkMode: true,
    betaFeature: false
  });

console.log(
  checkFeature(
    "darkMode"
  )
);
```

Output:

```text
true
```

***

# 5. React Table Actions

Common in enterprise dashboards.

```jsx
const handleAction =
  action =>
    id =>
      () =>
        console.log(
          action,
          id
        );

<button
  onClick={
    handleAction(
      "edit"
    )(101)
  }
>
  Edit
</button>

<button
  onClick={
    handleAction(
      "delete"
    )(101)
  }
>
  Delete
</button>
```

Output:

```text
edit 101
delete 101
```

***

# 6. Form Validation Rules

```javascript
const minLength =
  min =>
    value =>
      value.length >= min;

const validatePassword =
  minLength(8);

console.log(
  validatePassword(
    "password123"
  )
);
```

Output:

```text
true
```

***

# 7. React Hook Configuration

```javascript
const createFetcher =
  baseUrl =>
    async endpoint => {

      const response =
        await fetch(
          `${baseUrl}${endpoint}`
        );

      return response.json();
    };

const fetchApi =
  createFetcher(
    "/api"
  );

fetchApi("/users");
fetchApi("/orders");
```

***

# 8. Redux Middleware Style

Redux itself uses currying extensively. The training material in your environment shows middleware implemented as:

```javascript
const myLogger =
  store =>
    next =>
      action => {
        console.log(action);
        next(action);
      };
```

and notes that `connect()` is a currying-based API.

General shape:

```javascript
const middleware =
  store =>
    next =>
      action => {

        console.log(
          action.type
        );

        next(action);
      };
```

***

# 9. Internationalisation (i18n)

```javascript
const translate =
  language =>
    key =>
      dictionary[language][key];

const t =
  translate("en");

console.log(
  t("welcome")
);
```

Output:

```text
Welcome
```

***

# 10. Theme Provider

```javascript
const theme =
  themeName =>
    property =>
      themes[themeName][property];

const darkTheme =
  theme("dark");

console.log(
  darkTheme(
    "background"
  )
);
```

Output:

```text
#000
```

***

# Senior React Interview Answer

Real-world currying use cases include:

```text
✅ Event Handlers
✅ Form Handlers
✅ Validation Functions
✅ API Client Builders
✅ Redux Middleware
✅ Permission Checks (RBAC)
✅ Feature Flags
✅ Logging Utilities
✅ Internationalisation (i18n)
✅ Theme Configuration
✅ Custom Hooks
```

The biggest advantage is **reusability through closures**. You configure a function once:

```javascript
const adminCheck =
  hasPermission("admin");
```

and reuse it throughout the application without repeatedly passing the same arguments. This pattern is heavily used in React, Redux middleware, functional programming utilities, and enterprise-scale frontend architectures.
