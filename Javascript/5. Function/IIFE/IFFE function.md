Here are examples of IIFEs (Immediately Invoked Function Expressions) with explanations:

---

### 1. **Basic IIFE**
```javascript
(function () {
  console.log("IIFE runs immediately!");
})();
```
**Output:** `IIFE runs immediately!`  
The function executes as soon as it is defined.

---

### 2. **Returning a Value**
```javascript
const result = (function () {
  return 5 + 10;
})();
console.log(result); // Output: 15
```
The IIFE calculates and returns a value directly.

---

### 3. **Passing Arguments**
```javascript
(function (name) {
  console.log(`Hello, ${name}!`);
})("John");
```
**Output:** `Hello, John!`  
Arguments can be passed to the IIFE like any regular function.

---

### 4. **Using IIFE for Data Privacy**
```javascript
const counter = (function () {
  let count = 0; // Private variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
})();

console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1
console.log(counter.decrement()); // 0
```
Here, the `count` variable is private and can only be accessed through the returned methods.

---

### 5. **Avoid Polluting Global Scope**
```javascript
(function () {
  const temp = "Temporary variable";
  console.log(temp); // Temporary variable
})();

console.log(typeof temp); // undefined
```
The variable `temp` is not accessible outside the IIFE, avoiding global scope pollution.

---

### 6. **IIFE with Arrow Functions**
```javascript
(() => {
  console.log("Arrow function IIFE");
})();
```
**Output:** `Arrow function IIFE`  
Modern syntax using arrow functions.

---

### 7. **Modules with IIFE**
```javascript
const MathModule = (function () {
  const pi = 3.14159; // Private variable
  return {
    areaOfCircle: (radius) => pi * radius * radius,
    circumference: (radius) => 2 * pi * radius
  };
})();

console.log(MathModule.areaOfCircle(5)); // 78.53975
console.log(MathModule.circumference(5)); // 31.4159
```
This creates a simple module pattern using an IIFE.

---

### 8. **Conditional Execution**
```javascript
(function (env) {
  if (env === "production") {
    console.log("Production mode");
  } else {
    console.log("Development mode");
  }
})("production");
```
**Output:** `Production mode`  
IIFE executes different logic based on the input.

---

### 9. **IIFE with Event Listeners**
```javascript
document.addEventListener("DOMContentLoaded", (function () {
  return function () {
    console.log("DOM fully loaded and parsed");
  };
})());
```
The IIFE returns a function to handle the event.

---

### 10. **Loop Closure with IIFE**
```javascript
for (var i = 0; i < 5; i++) {
  (function (index) {
    setTimeout(() => {
      console.log(`Index: ${index}`);
    }, 1000);
  })(i);
}
```
**Output (after 1 second):**
```
Index: 0
Index: 1
Index: 2
Index: 3
Index: 4
```
The IIFE captures the current value of `i` in each iteration, avoiding closure issues.

---

### 11. **Asynchronous Initialization**
```javascript
(async function () {
  const data = await Promise.resolve("IIFE with async/await");
  console.log(data);
})();
```
**Output:** `IIFE with async/await`  
You can use `async/await` with IIFEs for asynchronous tasks.

---

### 12. **Complex Logic Encapsulation**
```javascript
(function () {
  const start = Date.now();
  for (let i = 0; i < 1e6; i++); // Simulate work
  console.log(`Work completed in ${Date.now() - start}ms`);
})();
```
**Output:** Shows the time taken to complete the loop, encapsulated in an IIFE.

---

### 13. **Chaining IIFE with Method Calls**
```javascript
const chainable = (function () {
  return {
    method1: () => {
      console.log("Method 1");
      return chainable;
    },
    method2: () => {
      console.log("Method 2");
      return chainable;
    }
  };
})();

chainable.method1().method2();
```
**Output:**
```
Method 1
Method 2
```
An IIFE initializes and provides a chainable interface.

---

### Advantages of IIFE
1. **Data Privacy:** Variables inside the IIFE are not accessible outside.
2. **Immediate Execution:** Runs as soon as defined.
3. **Avoids Global Scope Pollution:** Keeps code clean and avoids conflicts.
4. **Encapsulation:** Groups logic for better modularity.



# IIFE (Immediately Invoked Function Expression)

An **IIFE** is a JavaScript function that is **defined and executed immediately after it is created**. The term "Immediately-Called Function Expressions" (IIFE) is also referenced in JavaScript tooling documentation found in your environment. [\[md__d___p_..._e_a_d_m_e \| HTML\]](https://persistentsystems.sharepoint.com/sites/GEMSTraining498/Shared%20Documents/General/Assignment%20Submissions/Prasad_kulkarni_55249/END%20TO%20END%20LAB/Developer%20Productivity/html/md__d___p_e_s_1__m_e_a_n_mean_stack_example_client_node_modules_terser__r_e_a_d_m_e.html?web=1), [\[md__d__git..._e_a_d_m_e \| HTML\]](https://persistentsystems.sharepoint.com/sites/GEMSTraining498/Shared%20Documents/General/Assignment%20Submissions/Pavan_bollepalli_44859/End%20to%20End/devoloper%20productivity/documentation%20using%20doxygen/meanstack%20client/html/md__d__github_projects_mean_stack_example_client_node_modules_terser__r_e_a_d_m_e.html?web=1)

***

## Basic Syntax

```javascript
(function () {
  console.log("IIFE Executed");
})();
```

Output:

```text
IIFE Executed
```

### How It Works

```javascript
(function () {
  // function definition
})();
```

* First `()` → Converts function declaration to function expression
* Second `()` → Immediately invokes the function

***

## IIFE with Parameters

```javascript
(function (name) {
  console.log(`Hello ${name}`);
})("Sudhir");
```

Output:

```text
Hello Sudhir
```

***

## Arrow Function IIFE

Modern ES6 syntax:

```javascript
(() => {
  console.log("Arrow IIFE");
})();
```

Output:

```text
Arrow IIFE
```

***

# Why Use IIFE?

## 1. Avoid Polluting Global Scope

Without IIFE:

```javascript
var counter = 0;
```

Global variable:

```javascript
window.counter
```

exists.

***

With IIFE:

```javascript
(function () {

  var counter = 0;

  console.log(counter);

})();
```

Output:

```text
0
```

Outside access:

```javascript
console.log(counter);
```

Output:

```text
ReferenceError
```

***

## 2. Create Private Variables

```javascript
const counter = (function () {

  let count = 0;

  return {
    increment() {
      count++;
      return count;
    }
  };

})();
```

Usage:

```javascript
console.log(
  counter.increment()
);

console.log(
  counter.increment()
);
```

Output:

```text
1
2
```

`count` remains private.

***

## 3. Module Pattern (Before ES6 Modules)

```javascript
const UserModule = (function () {

  let users = [];

  return {

    add(user) {
      users.push(user);
    },

    getUsers() {
      return users;
    }

  };

})();
```

Usage:

```javascript
UserModule.add("Sudhir");

console.log(
  UserModule.getUsers()
);
```

Output:

```javascript
["Sudhir"]
```

***

# IIFE with Async/Await

Useful when top-level `await` isn't available.

```javascript
(async function () {

  const data =
    await Promise.resolve(
      "API Response"
    );

  console.log(data);

})();
```

Output:

```text
API Response
```

***

# React Usage

In modern React, IIFEs are not very common, but sometimes used inside JSX for complex conditional rendering.

```jsx
function App({ role }) {

  return (

    <div>

      {
        (() => {

          if (role === "admin") {
            return <h1>Admin</h1>;
          }

          return <h1>User</h1>;

        })()
      }

    </div>

  );
}
```

***

# IIFE vs Normal Function

### Normal Function

```javascript
function greet() {
  console.log("Hello");
}

greet();
```

Needs explicit call.

***

### IIFE

```javascript
(function () {
  console.log("Hello");
})();
```

Runs automatically.

***

# Common Interview Questions

### Why do we wrap the function in parentheses?

```javascript
(function () {})
```

Because JavaScript treats it as an **expression**, not a function declaration.

***

### Can Arrow Functions Be Used as IIFE?

```javascript
(() => {
  console.log("Yes");
})();
```

✅ Yes

***

### Is IIFE Still Relevant?

Modern JavaScript provides:

```javascript
ES Modules
block scope (let / const)
```

which reduce the need for IIFEs.

However, IIFEs are still useful for:

```text
✅ Encapsulation
✅ Private variables
✅ Initialisation code
✅ Interview questions
```

***

# Senior Interview Answer

> An **IIFE (Immediately Invoked Function Expression)** is a function expression that executes as soon as it is defined. It is typically used to create a private scope, avoid global namespace pollution, encapsulate variables, and implement module-like patterns. Before ES6 modules and block-scoped variables (`let` and `const`), IIFEs were widely used to achieve data privacy and isolation. Today they are still useful for one-time initialization logic and interview discussions. [\[md__d___p_..._e_a_d_m_e \| HTML\]](https://persistentsystems.sharepoint.com/sites/GEMSTraining498/Shared%20Documents/General/Assignment%20Submissions/Prasad_kulkarni_55249/END%20TO%20END%20LAB/Developer%20Productivity/html/md__d___p_e_s_1__m_e_a_n_mean_stack_example_client_node_modules_terser__r_e_a_d_m_e.html?web=1), [\[md__d__git..._e_a_d_m_e \| HTML\]](https://persistentsystems.sharepoint.com/sites/GEMSTraining498/Shared%20Documents/General/Assignment%20Submissions/Pavan_bollepalli_44859/End%20to%20End/devoloper%20productivity/documentation%20using%20doxygen/meanstack%20client/html/md__d__github_projects_mean_stack_example_client_node_modules_terser__r_e_a_d_m_e.html?web=1)


# 1. IIFE with Parameters

An IIFE (Immediately Invoked Function Expression) can accept arguments just like a normal function. The internal JavaScript material in your environment references IIFEs as "Immediately-Called Function Expressions".

### Traditional IIFE

```javascript
(function (name, role) {

  console.log(
    `Name: ${name}`
  );

  console.log(
    `Role: ${role}`
  );

})(
  "Sudhir",
  "Project Lead"
);
```

Output:

```text
Name: Sudhir
Role: Project Lead
```

***

### Arrow Function IIFE

```javascript
((name, city) => {

  console.log(
    `${name} from ${city}`
  );

})(
  "Sudhir",
  "Pune"
);
```

Output:

```text
Sudhir from Pune
```

***

### Returning a Value

```javascript
const total = (
  function (a, b) {

    return a + b;

  }
)(10, 20);

console.log(total);
```

Output:

```text
30
```

***

# 2. IIFE Use Cases in React

Modern React rarely needs IIFEs because we have:

```text
✅ ES Modules
✅ Hooks
✅ Functional Components
✅ let / const block scope
```

However, IIFEs are still occasionally useful.

***

## Conditional Rendering

Instead of complex ternary chains:

```jsx
function Dashboard({ role }) {

  return (

    <div>

      {
        (() => {

          if (role === "admin") {
            return <Admin />;
          }

          if (role === "manager") {
            return <Manager />;
          }

          return <User />;
        })()
      }

    </div>

  );
}
```

***

## One-Time Initialization

```javascript
const config = (() => {

  const env = "prod";

  return {
    apiUrl:
      env === "prod"
        ? "https://api.com"
        : "http://localhost"
  };

})();
```

This runs only once.

***

## Private Configuration

```javascript
const Logger = (() => {

  let count = 0;

  return {

    log(msg) {

      count++;

      console.log(
        `${count}: ${msg}`
      );
    }

  };

})();
```

Usage:

```javascript
Logger.log("Start");
Logger.log("Loaded");
```

Output:

```text
1: Start
2: Loaded
```

***

# 3. IIFE vs ES6 Modules

Before ES6 modules existed, developers commonly used IIFEs to avoid polluting the global scope and to create private variables. Modern JavaScript now provides native module support.

## IIFE Module Pattern

```javascript
const UserModule = (() => {

  const users = [];

  return {

    add(user) {
      users.push(user);
    },

    getUsers() {
      return users;
    }

  };

})();
```

Usage:

```javascript
UserModule.add("Sudhir");
```

***

## ES6 Module

### user.js

```javascript
const users = [];

export function add(user) {
  users.push(user);
}

export function getUsers() {
  return users;
}
```

### app.js

```javascript
import {
  add,
  getUsers
} from "./user.js";

add("Sudhir");

console.log(
  getUsers()
);
```

***

# Comparison

| Feature                  | IIFE | ES6 Modules |
| ------------------------ | ---- | ----------- |
| Creates Private Scope    | ✅    | ✅           |
| Avoids Global Pollution  | ✅    | ✅           |
| Import / Export          | ❌    | ✅           |
| Tree Shaking             | ❌    | ✅           |
| Static Analysis          | ❌    | ✅           |
| Browser Support (Modern) | ✅    | ✅           |
| Recommended Today        | ❌    | ✅           |

***

# When to Use Which?

### Use IIFE For

```text
✅ Quick one-time execution
✅ Small isolated utilities
✅ Interview questions
✅ Legacy JavaScript code
```

### Use ES6 Modules For

```text
✅ React Applications
✅ Large Codebases
✅ Reusable Components
✅ Shared Utilities
✅ Production Projects
```

***

# Senior React Interview Answer

> An IIFE (Immediately Invoked Function Expression) is a function that executes immediately after being defined. Historically, it was used to create private scope, encapsulate variables, and implement module patterns before ES6 modules existed. In modern React applications, ES6 modules are preferred because they provide native import/export support, better maintainability, tree-shaking, and static analysis. IIFEs are still occasionally useful for one-time initialization logic or complex JSX conditional rendering, but ES6 modules have largely replaced them in production React development.


# React Example: IIFE for Conditional Rendering

Although React usually uses ternary operators or separate components for conditional rendering, an IIFE can be useful when the logic becomes more complex. IIFEs (Immediately Invoked Function Expressions) are JavaScript function expressions that execute immediately after being defined.

```jsx
function Dashboard({ role }) {
  return (
    <div>
      {
        (() => {
          if (role === "admin") {
            return <h1>Admin Dashboard</h1>;
          }

          if (role === "manager") {
            return <h1>Manager Dashboard</h1>;
          }

          return <h1>User Dashboard</h1>;
        })()
      }
    </div>
  );
}
```

### Output

```jsx
<Dashboard role="admin" />
```

Displays:

```text
Admin Dashboard
```

***

## Another Practical React Example

```jsx
function UserStatus({ user }) {
  return (
    <div>
      {
        (() => {
          if (!user) {
            return <p>Loading...</p>;
          }

          if (!user.isActive) {
            return <p>User is inactive</p>;
          }

          return <p>Welcome {user.name}</p>;
        })()
      }
    </div>
  );
}
```

This avoids deeply nested ternary operators.

***

# How IIFE Helps with Private Variables

Before ES6 modules existed, IIFEs were commonly used to create **private scope** and avoid polluting the global namespace.

## Without IIFE

```javascript
var count = 0;

function increment() {
  count++;
}
```

Problem:

```javascript
count = 100;
```

Anyone can modify it.

***

## With IIFE

```javascript
const Counter = (function () {

  let count = 0;

  return {
    increment() {
      count++;
      return count;
    },

    getCount() {
      return count;
    }
  };

})();
```

Usage:

```javascript
console.log(
  Counter.increment()
);

console.log(
  Counter.increment()
);

console.log(
  Counter.getCount()
);
```

Output:

```text
1
2
2
```

***

## Why Is `count` Private?

```javascript
console.log(count);
```

Output:

```text
ReferenceError: count is not defined
```

Because:

```text
count lives inside the IIFE scope
and cannot be accessed directly
from outside.
```

Only the returned methods can access it through **closure**.

***

# Real-World Module Pattern

```javascript
const UserModule = (() => {

  const users = [];

  return {

    addUser(user) {
      users.push(user);
    },

    getUsers() {
      return [...users];
    }

  };

})();
```

```javascript
UserModule.addUser("Sudhir");

console.log(
  UserModule.getUsers()
);
```

Output:

```javascript
["Sudhir"]
```

The `users` array remains private and cannot be modified directly from outside the module.

***

# Interview Answer

> An IIFE (Immediately Invoked Function Expression) executes immediately after being defined. In React, it can be used for complex conditional rendering inside JSX when ternary operators become difficult to read. In JavaScript, IIFEs create a private scope, allowing variables to remain inaccessible from the global scope while still being available through closures. Before ES6 modules, IIFEs were widely used to implement the module pattern and encapsulate private state.
# 1. More React Examples Using IIFE

IIFEs are not common in modern React, but they can be useful when JSX conditions become complex.

***

## Role-Based Rendering

```jsx
function Dashboard({ role }) {
  return (
    <div>
      {(() => {
        switch (role) {
          case "admin":
            return <AdminPanel />;

          case "manager":
            return <ManagerPanel />;

          case "employee":
            return <EmployeePanel />;

          default:
            return <AccessDenied />;
        }
      })()}
    </div>
  );
}
```

***

## Multiple Conditions

Instead of nested ternaries:

```jsx
function UserCard({ user }) {
  return (
    <div>
      {(() => {

        if (!user) {
          return <Loading />;
        }

        if (!user.isActive) {
          return <InactiveUser />;
        }

        if (user.role === "admin") {
          return <AdminProfile user={user} />;
        }

        return <RegularProfile user={user} />;

      })()}
    </div>
  );
}
```

***

## Dynamic Button Actions

```jsx
function ActionButton({ status }) {
  return (
    <>
      {(() => {
        if (status === "pending") {
          return <button>Approve</button>;
        }

        if (status === "approved") {
          return <button>View</button>;
        }

        return <button>Retry</button>;
      })()}
    </>
  );
}
```

***

# 2. Closure with IIFE in JavaScript

The biggest benefit of an IIFE is that it creates a **private scope**.

## Example Without Closure

```javascript
let count = 0;

function increment() {
  count++;
}

increment();

console.log(count);
```

Output:

```text
1
```

Problem:

```javascript
count = 1000;
```

Anybody can modify it.

***

## Example With IIFE + Closure

```javascript
const Counter = (function () {

  let count = 0;

  return {

    increment() {
      count++;
      return count;
    },

    getCount() {
      return count;
    }

  };

})();
```

Usage:

```javascript
console.log(
  Counter.increment()
);

console.log(
  Counter.increment()
);

console.log(
  Counter.getCount()
);
```

Output:

```text
1
2
2
```

***

## Why Does This Work?

When the IIFE finishes:

```javascript
(function () {
  let count = 0;
})();
```

Normally:

```text
count should disappear
```

But returned functions still reference it.

```javascript
increment()
getCount()
```

This is called a **closure**.

```text
A closure remembers variables
from its outer scope even after
that scope has finished executing.
```

***

## Real Module Pattern

```javascript
const UserModule = (function () {

  const users = [];

  return {

    addUser(user) {
      users.push(user);
    },

    getUsers() {
      return [...users];
    }

  };

})();
```

Outside access:

```javascript
console.log(
  UserModule.users
);
```

Output:

```text
undefined
```

The array remains private.

***

# 3. IIFE vs React Hooks for Encapsulation

Many developers compare:

```text
IIFE
vs
React Hooks
```

because both help encapsulate state/logic, but they solve different problems.

***

## IIFE

```javascript
const Counter = (() => {

  let count = 0;

  return {

    increment() {
      count++;
    },

    getCount() {
      return count;
    }

  };

})();
```

Characteristics:

```text
✅ Private variables
✅ Encapsulation
✅ Runs once
✅ Not reactive
❌ No React re-render
```

***

## React Hook

```jsx
function Counter() {

  const [count, setCount] =
    useState(0);

  return (
    <button
      onClick={() =>
        setCount(
          count + 1
        )
      }
    >
      {count}
    </button>
  );
}
```

Characteristics:

```text
✅ State management
✅ Automatic re-render
✅ Reactive UI
✅ Lifecycle integration
```

***

## Custom Hook

This is the modern React equivalent of the old module pattern.

```jsx
function useCounter() {

  const [count,
         setCount] =
    useState(0);

  const increment =
    () =>
      setCount(
        prev =>
          prev + 1
      );

  return {
    count,
    increment
  };
}
```

Usage:

```jsx
function App() {

  const {
    count,
    increment
  } = useCounter();

  return (
    <button
      onClick={increment}
    >
      {count}
    </button>
  );
}
```

***

# IIFE vs Hooks Comparison

| Feature             | IIFE | React Hook |
| ------------------- | ---- | ---------- |
| Private Variables   | ✅    | ✅          |
| Closure Support     | ✅    | ✅          |
| Encapsulation       | ✅    | ✅          |
| State Updates UI    | ❌    | ✅          |
| Re-render Component | ❌    | ✅          |
| Lifecycle Access    | ❌    | ✅          |
| React Recommended   | ❌    | ✅          |

***

# Senior React Interview Answer

> An IIFE creates a private scope and uses closures to preserve access to internal variables after execution. Historically, it was used to build module patterns and encapsulate state before ES6 modules and React hooks existed. In React applications, custom hooks are generally preferred because they encapsulate logic while also supporting reactive state updates and component re-rendering. IIFEs are occasionally useful for complex JSX conditional rendering or one-time initialisation logic, but hooks are the modern solution for component-level encapsulation and state management.


# 1. IIFE with Async Data Fetching in React

In React, you'll often see an async function declared inside `useEffect`. An async IIFE is another way to execute asynchronous code immediately.

```jsx
import { useEffect, useState } from "react";

function Users() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    (async () => {

      try {

        const response =
          await fetch(
            "/api/users"
          );

        const data =
          await response.json();

        setUsers(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }

    })();

  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### Why use an async IIFE?

`useEffect` itself cannot be declared as `async`.

❌ Don't do this:

```jsx
useEffect(async () => {
  // warning
}, []);
```

✅ Instead:

```jsx
useEffect(() => {

  (async () => {
    // await code
  })();

}, []);
```

***

# 2. Closure Benefits with More JavaScript Examples

A **closure** occurs when a function remembers variables from its outer scope even after the outer function has finished executing.

***

## Example 1: Private Counter

```javascript
function createCounter() {

  let count = 0;

  return function () {

    count++;

    return count;
  };
}

const counter =
  createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

Output:

```text
1
2
3
```

### Why?

```javascript
count
```

still exists because the returned function forms a closure over it.

***

## Example 2: Function Factory

```javascript
function multiply(x) {

  return function(y) {

    return x * y;
  };
}

const double =
  multiply(2);

const triple =
  multiply(3);

console.log(double(5));
console.log(triple(5));
```

Output:

```text
10
15
```

Each function remembers its own value of:

```javascript
x
```

***

## Example 3: Private Configuration

```javascript
const Config = (() => {

  const secretKey =
    "abc123";

  return {

    getKey() {
      return secretKey;
    }

  };

})();
```

Access:

```javascript
console.log(
  Config.getKey()
);
```

Output:

```text
abc123
```

Direct access:

```javascript
console.log(secretKey);
```

Output:

```text
ReferenceError
```

***

# Real-Life Closure Example in React

```jsx
function Counter() {

  const [count,
         setCount] =
    useState(0);

  const increment =
    () => {

      setCount(
        current =>
          current + 1
      );
    };

  return (
    <button
      onClick={increment}
    >
      {count}
    </button>
  );
}
```

The updater function:

```javascript
current => current + 1
```

uses closure concepts to access state safely.

***

# 3. IIFE vs React Context for Encapsulation

These solve different problems.

***

## IIFE

```javascript
const Counter = (() => {

  let count = 0;

  return {

    increment() {
      count++;
    },

    getCount() {
      return count;
    }

  };

})();
```

Provides:

```text
✅ Private Variables
✅ Closure
✅ Encapsulation
✅ One-Time Initialization

❌ No UI Updates
❌ No React Integration
```

***

## React Context

```jsx
const AuthContext =
  createContext();

function AuthProvider({
  children
}) {

  const [user,
         setUser] =
    useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

Provides:

```text
✅ Shared State
✅ Re-renders Components
✅ Global Data Access
✅ React Integration
```

***

## Example Usage

```jsx
function Header() {

  const { user } =
    useContext(
      AuthContext
    );

  return (
    <h1>
      {user?.name}
    </h1>
  );
}
```

When:

```javascript
setUser(...)
```

runs:

```text
Header Re-renders Automatically
```

An IIFE cannot do this.

***

# IIFE vs Context Comparison

| Feature                  | IIFE | React Context |
| ------------------------ | ---- | ------------- |
| Private Variables        | ✅    | ❌             |
| Closures                 | ✅    | ❌             |
| Encapsulation            | ✅    | ✅             |
| Shared Across Components | ❌    | ✅             |
| Triggers Re-render       | ❌    | ✅             |
| React Aware              | ❌    | ✅             |
| State Management         | ❌    | ✅             |
| Modern React Solution    | ❌    | ✅             |

***

# Senior React Interview Answer

> IIFEs create a private scope and use closures to preserve internal variables. They were historically used to implement module patterns and encapsulation before ES6 modules existed. React Context solves a different problem: sharing state across a component tree while supporting automatic re-renders. In modern React applications, Context and custom hooks are preferred for state encapsulation, while IIFEs are mostly limited to one-time initialization logic, closure demonstrations, or occasional complex JSX rendering scenarios.
# Closure with Nested Functions

A **closure** happens when an inner function remembers and can access variables from its outer function **even after the outer function has finished executing**. Closures are a core JavaScript concept and are commonly discussed alongside callback functions, higher-order functions, and scope in interview preparation materials.

***

## Basic Nested Function Example

```javascript
function outer() {

  let message = "Hello Sudhir";

  function inner() {
    console.log(message);
  }

  return inner;
}

const fn = outer();

fn();
```

### Output

```text
Hello Sudhir
```

***

## What Happens Internally?

```javascript
function outer() {

  let message = "Hello";

  return function inner() {
    console.log(message);
  };
}
```

Execution:

```text
outer() executes
      ↓
message variable created
      ↓
inner function returned
      ↓
outer() finishes
      ↓
message should normally disappear
      ↓
BUT inner() remembers it
```

This "remembering" behaviour is called a **closure**.

***

# Example: Counter Using Closure

```javascript
function createCounter() {

  let count = 0;

  return function () {

    count++;

    return count;

  };
}

const counter =
  createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

### Output

```text
1
2
3
```

The variable:

```javascript
count
```

is private and can only be accessed through the returned function.

***

# Multiple Closures

```javascript
function multiplier(x) {

  return function(y) {
    return x * y;
  };
}

const double =
  multiplier(2);

const triple =
  multiplier(3);

console.log(double(5));
console.log(triple(5));
```

### Output

```text
10
15
```

Each closure keeps its own copy of:

```javascript
x
```

***

# Closure with Multiple Nested Functions

```javascript
function grandParent() {

  let grandParentVar =
    "Grand Parent";

  function parent() {

    let parentVar =
      "Parent";

    function child() {

      console.log(
        grandParentVar
      );

      console.log(
        parentVar
      );
    }

    return child;
  }

  return parent();
}

const fn =
  grandParent();

fn();
```

### Output

```text
Grand Parent
Parent
```

The innermost function can access:

```text
✅ Its own variables
✅ Parent variables
✅ Grandparent variables
```

This is called the **lexical scope chain**.

***

# Real-World Example: Private Data

```javascript
function createBankAccount() {

  let balance = 1000;

  return {

    deposit(amount) {
      balance += amount;
    },

    getBalance() {
      return balance;
    }

  };
}

const account =
  createBankAccount();

account.deposit(500);

console.log(
  account.getBalance()
);
```

### Output

```text
1500
```

Direct access:

```javascript
console.log(balance);
```

Output:

```text
ReferenceError
```

Because `balance` is protected by a closure.

***

# Closure in React

```jsx
function Counter() {

  const [count, setCount] =
    useState(0);

  const increment = () => {

    setCount(prev =>
      prev + 1
    );

  };

  return (
    <button
      onClick={increment}
    >
      {count}
    </button>
  );
}
```

The event handler:

```javascript
increment
```

forms a closure over component state and variables available in its scope.

***

# Interview Definition

> A closure is created when an inner function retains access to variables from its outer function's scope even after the outer function has completed execution. Closures are commonly used for data privacy, function factories, event handlers, callbacks, and module patterns.

### Easy Memory Trick

```text
Function + Remembered Scope
=
Closure
```

Example:

```javascript
function outer() {

  let x = 10;

  return function() {
    console.log(x);
  };
}
```

The returned function "remembers" `x` forever through a closure.
