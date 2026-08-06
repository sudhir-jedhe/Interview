# Module Pattern in JavaScript

The **Module Pattern** is a design pattern used to:

✅ Encapsulate code  
✅ Create private variables and methods  
✅ Expose only a public API  
✅ Avoid global scope pollution

Before ES6 modules, this was one of the most common patterns in JavaScript.

***

# Problem Without Module Pattern

```javascript
let count = 0;

function increment() {
  count++;
}

function decrement() {
  count--;
}
```

Problem:

```javascript
count = 1000;
```

Anyone can modify it.

***

# Module Pattern Using IIFE

(**Immediately Invoked Function Expression**)

```javascript
const Counter = (function () {

  let count = 0;

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function getCount() {
    return count;
  }

  return {
    increment,
    decrement,
    getCount
  };

})();
```

***

# Usage

```javascript
Counter.increment();
Counter.increment();

console.log(
  Counter.getCount()
);
```

Output:

```javascript
2
```

***

# Private Variables

```javascript
console.log(
  Counter.count
);
```

Output:

```javascript
undefined
```

Because:

```javascript
count
```

is private.

***

# Private Methods

```javascript
const UserModule = (function () {

  function validateUser() {
    return true;
  }

  function login() {
    if (validateUser()) {
      console.log("Logged In");
    }
  }

  return {
    login
  };

})();
```

Usage:

```javascript
UserModule.login();
```

Output:

```text
Logged In
```

Cannot call:

```javascript
UserModule.validateUser();
```

Output:

```javascript
undefined
```

***

# Shopping Cart Example

Interview Favourite ⭐

```javascript
const Cart = (function () {

  let items = [];

  function addItem(item) {
    items.push(item);
  }

  function removeItem(id) {
    items =
      items.filter(
        item => item.id !== id
      );
  }

  function getItems() {
    return [...items];
  }

  return {
    addItem,
    removeItem,
    getItems
  };

})();
```

Usage:

```javascript
Cart.addItem({
  id: 1,
  name: "Laptop"
});

Cart.addItem({
  id: 2,
  name: "Phone"
});

console.log(
  Cart.getItems()
);
```

***

# React-Like API Module

```javascript
const ApiModule = (function () {

  const BASE_URL =
    "https://api.com";

  async function getUsers() {

    const response =
      await fetch(
        `${BASE_URL}/users`
      );

    return response.json();
  }

  return {
    getUsers
  };

})();
```

Usage:

```javascript
ApiModule.getUsers();
```

***

# Modern ES6 Module Pattern

Instead of IIFE:

## userService.js

```javascript
let users = [];

export function addUser(
  user
) {
  users.push(user);
}

export function getUsers() {
  return users;
}
```

***

## App.js

```javascript
import {
  addUser,
  getUsers
} from "./userService";

addUser({
  name: "Sudhir"
});

console.log(
  getUsers()
);
```

***

# React Example

## userStore.js

```javascript
const UserStore =
  (function () {

    let users = [];

    return {

      addUser(user) {
        users.push(user);
      },

      getUsers() {
        return users;
      }

    };

  })();

export default UserStore;
```

***

## React Component

```jsx
import UserStore
  from "./userStore";

function Users() {

  UserStore.addUser({
    name: "Sudhir"
  });

  return (
    <pre>
      {JSON.stringify(
        UserStore.getUsers()
      )}
    </pre>
  );
}
```

***

# Revealing Module Pattern

A variation of Module Pattern.

```javascript
const Calculator =
  (function () {

    function add(a, b) {
      return a + b;
    }

    function subtract(
      a,
      b
    ) {
      return a - b;
    }

    return {
      add,
      subtract
    };

  })();
```

Usage:

```javascript
Calculator.add(10, 20);
```

Output:

```javascript
30
```

***

# Benefits

### Encapsulation

```javascript
private variables
private functions
```

***

### Avoid Global Scope Pollution

Instead of:

```javascript
window.user
window.count
window.items
```

Everything stays inside module.

***

### Better Maintainability

```javascript
AuthModule
CartModule
PaymentModule
ApiModule
```

***

### Reusability

```javascript
export
import
```

across components.

***

# Module Pattern vs Singleton

### Module

```javascript
const CartModule =
  (function () {})();
```

Encapsulation focus.

***

### Singleton

```javascript
class Database {
  static instance;
}
```

Single instance focus.

***

# Interview Questions

### Q1: What is Module Pattern?

A pattern that encapsulates data and exposes a public API while hiding implementation details.

***

### Q2: Why use IIFE?

```javascript
(function() {})();
```

Creates a private scope immediately.

***

### Q3: How do you create private variables?

```javascript
let count = 0;
```

inside the module closure.

***

### Q4: Difference Between Module Pattern and ES6 Modules?

**Module Pattern**

```javascript
IIFE
Closure
```

**ES6 Module**

```javascript
import
export
```

Modern approach.

***

### Q5: What is Revealing Module Pattern?

A variation where private functions are defined internally and returned in a public object.

```javascript
return {
  add,
  subtract
}
```

***

# Senior React Interview Answer

> The Module Pattern uses closures to create private state and expose a controlled public API. Traditionally it was implemented using an IIFE, but modern applications use ES6 modules with `import` and `export`. The pattern improves encapsulation, prevents global namespace pollution, and organises code into reusable units such as API services, authentication modules, cart management, and state utilities. In React projects, ES modules are the preferred modern implementation of the Module Pattern.


# ES6 Modules vs Module Pattern

## 1. Traditional Module Pattern (IIFE)

Before ES6, developers used closures and IIFEs to create private members.

```javascript
const UserModule = (function () {

  let users = [];

  function addUser(user) {
    users.push(user);
  }

  function getUsers() {
    return users;
  }

  return {
    addUser,
    getUsers
  };

})();
```

### Usage

```javascript
UserModule.addUser({
  name: "Sudhir"
});

console.log(
  UserModule.getUsers()
);
```

### Benefits

✅ Private variables

✅ Encapsulation

✅ No global pollution

***

## 2. ES6 Modules (Modern Approach)

### userService.js

```javascript
let users = [];

export function addUser(user) {
  users.push(user);
}

export function getUsers() {
  return users;
}
```

***

### App.js

```javascript
import {
  addUser,
  getUsers
} from "./userService";

addUser({
  name: "Sudhir"
});

console.log(
  getUsers()
);
```

***

# Comparison

| Feature         | Module Pattern | ES6 Modules      |
| --------------- | -------------- | ---------------- |
| Private State   | ✅              | ✅ (module scope) |
| import/export   | ❌              | ✅                |
| Tree Shaking    | ❌              | ✅                |
| Bundler Support | Limited        | ✅                |
| React Standard  | ❌              | ✅                |
| Code Splitting  | ❌              | ✅                |

***

# React Example Using ES6 Modules

## API Service Module

### services/userService.js

```javascript
const BASE_URL =
  "/api/users";

export async function getUsers() {

  const response =
    await fetch(BASE_URL);

  return response.json();
}

export async function createUser(
  user
) {

  return fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(user)
  });
}
```

***

### React Component

```jsx
import {
  getUsers
} from "./services/userService";

import {
  useEffect,
  useState
} from "react";

function Users() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    getUsers()
      .then(setUsers);

  }, []);

  return (
    <>
      {users.map(user => (
        <div
          key={user.id}
        >
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# Module Pattern Benefits in React Apps

## 1. Encapsulation

Keep implementation details hidden.

```javascript
const API_KEY =
  "private-key";
```

Not exposed directly.

***

## 2. Separation of Concerns

```text
services/
hooks/
utils/
components/
store/
```

Example:

```text
UserService
AuthService
PaymentService
```

Each module has one responsibility.

***

## 3. Reusability

```javascript
import { getUsers }
```

Use anywhere.

```javascript
Dashboard
UsersPage
AdminPage
```

***

## 4. Testability

```javascript
export function calculateTax() {}
```

Easy to test.

```javascript
import {
  calculateTax
} from "./tax";
```

***

## 5. Maintainability

Without modules:

```javascript
5000 lines
```

single file.

With modules:

```javascript
UserService.js
AuthService.js
TableUtils.js
DateUtils.js
```

Easy to maintain.

***

## 6. Tree Shaking

Only imports used code.

```javascript
import {
  getUsers
}
```

Unused exports removed from bundle.

***

## 7. Code Splitting

```javascript
const Dashboard =
  lazy(() =>
    import("./Dashboard")
  );
```

Loads only when needed.

***

# Real Enterprise React Structure

```text
src/
├── api/
│   ├── userApi.js
│   ├── authApi.js
│
├── hooks/
│   ├── useUsers.js
│
├── services/
│   ├── UserService.js
│
├── utils/
│   ├── DateUtils.js
│
├── store/
│   ├── userSlice.js
```

Every folder is essentially a module.

***

# Module Pattern Interview Questions

## Q1. What is the Module Pattern?

**Answer:**

A design pattern that encapsulates data and exposes a public API while hiding implementation details through closures.

***

## Q2. Why was Module Pattern used before ES6?

Because JavaScript had no:

```javascript
import
export
```

support.

Developers used:

```javascript
IIFE
```

and closures for privacy.

***

## Q3. What is an IIFE?

```javascript
(function () {

})();
```

Immediately Invoked Function Expression.

Creates private scope.

***

## Q4. How are private variables created?

```javascript
const Module = (function () {

  let secret = 123;

})();
```

Only functions inside the closure can access `secret`.

***

## Q5. Difference Between Module Pattern and ES6 Modules?

### Module Pattern

```javascript
IIFE
Closure
return {
 publicMethods
}
```

### ES6 Module

```javascript
export
import
```

Modern solution.

***

## Q6. Why Prefer ES6 Modules Today?

✅ Native browser support

✅ Tree shaking

✅ Code splitting

✅ Better tooling

✅ Better TypeScript support

***

## Q7. Difference Between Module and Singleton?

### Module

Focus:

```text
Encapsulation
```

### Singleton

Focus:

```text
Single Instance
```

***

## Q8. How Does React Use Modules?

Every file:

```javascript
export default Component;
```

or

```javascript
export function helper() {}
```

is an ES6 module.

***

## Q9. Give Real React Examples

```text
AuthService.js
UserService.js
DateUtils.js
ApiClient.js
Redux Slices
Custom Hooks
```

***

## Q10. What are the benefits of modules in large React projects?

✅ Encapsulation

✅ Reusability

✅ Maintainability

✅ Testability

✅ Tree Shaking

✅ Code Splitting

✅ Team Scalability

***

# Senior React Interview Answer

> The Module Pattern was traditionally implemented using IIFEs and closures to encapsulate private state and expose a controlled public API. Modern React applications use ES6 modules instead, leveraging `import` and `export` for dependency management and encapsulation. Modules improve maintainability by separating concerns, enabling code reuse, supporting testing, and allowing advanced optimisations such as tree shaking and code splitting. In large React applications, services, utilities, hooks, Redux slices, and API clients are all commonly organised as modules.


# Module Pattern with Private State

One of the biggest advantages of the Module Pattern is **private state** using closures.

***

## Example: Counter Module

```javascript
const CounterModule = (function () {

  let count = 0; // Private State

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function getCount() {
    return count;
  }

  return {
    increment,
    decrement,
    getCount
  };

})();
```

***

## Usage

```javascript
CounterModule.increment();
CounterModule.increment();

console.log(
  CounterModule.getCount()
);
```

Output:

```javascript
2
```

***

## Private Data Access

```javascript
console.log(
  CounterModule.count
);
```

Output:

```javascript
undefined
```

Because:

```javascript
count
```

exists only inside the closure.

***

# Shopping Cart Module Example

A very common interview example.

```javascript
const CartModule = (function () {

  let items = [];

  function addItem(item) {
    items.push(item);
  }

  function removeItem(id) {
    items = items.filter(
      item => item.id !== id
    );
  }

  function getItems() {
    return [...items];
  }

  function getTotalItems() {
    return items.length;
  }

  return {
    addItem,
    removeItem,
    getItems,
    getTotalItems
  };

})();
```

***

## Usage

```javascript
CartModule.addItem({
  id: 1,
  name: "Laptop"
});

CartModule.addItem({
  id: 2,
  name: "Phone"
});

console.log(
  CartModule.getItems()
);

console.log(
  CartModule.getTotalItems()
);
```

***

# Organising React Services Using Modules

In large React applications (like the enterprise dashboards and React projects you're preparing for), services are usually organised as ES6 modules.

***

# Recommended Folder Structure

```text
src/
│
├── services/
│   ├── apiClient.js
│   ├── userService.js
│   ├── authService.js
│   ├── projectService.js
│
├── hooks/
│   ├── useUsers.js
│
├── components/
│
├── pages/
│
└── utils/
```

***

# apiClient Module

## services/apiClient.js

```javascript
const BASE_URL =
  "https://api.company.com";

export async function get(url) {

  const response =
    await fetch(
      `${BASE_URL}${url}`
    );

  return response.json();
}

export async function post(
  url,
  body
) {

  const response =
    await fetch(
      `${BASE_URL}${url}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify(body)
      }
    );

  return response.json();
}
```

***

# User Service Module

## services/userService.js

```javascript
import {
  get,
  post
} from "./apiClient";

export function getUsers() {
  return get("/users");
}

export function createUser(user) {
  return post(
    "/users",
    user
  );
}
```

***

# React Hook

## hooks/useUsers.js

```javascript
import {
  useEffect,
  useState
} from "react";

import {
  getUsers
} from "../services/userService";

export function useUsers() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    getUsers()
      .then(setUsers);

  }, []);

  return users;
}
```

***

# React Component

```jsx
import {
  useUsers
} from "../hooks/useUsers";

function UsersPage() {

  const users =
    useUsers();

  return (
    <>
      {users.map(user => (
        <div
          key={user.id}
        >
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# Enterprise Service Module Pattern

For larger applications:

```text
UserService
AuthService
ProjectService
NotificationService
PaymentService
FeatureFlagService
```

Example:

```javascript
export const UserService = {
  getUsers,
  createUser,
  deleteUser,
  updateUser
};
```

Usage:

```javascript
UserService.getUsers();
```

***

# Why This Improves React Applications

### ✅ Separation of Concerns

```text
UI
↓
Hooks
↓
Services
↓
API
```

Clean architecture.

***

### ✅ Reusability

Same service can be used in:

```text
Dashboard
Admin Page
Reports Page
```

***

### ✅ Testability

```javascript
jest.mock(
  "../services/userService"
);
```

Easy mocking.

***

### ✅ Maintainability

Instead of:

```javascript
fetch(...)
```

inside every component:

```javascript
UserService.getUsers()
```

Centralised logic.

***

### ✅ Scalability

Large teams can work independently on:

```text
Auth Module
User Module
Project Module
Payment Module
```

without conflicts.

***

# Common Interview Questions

### Q1. What is the Module Pattern?

**Answer:**

A design pattern that uses closures to encapsulate private state and expose a controlled public API.

***

### Q2. How is private state achieved?

```javascript
let count = 0;
```

inside an IIFE or module scope.

***

### Q3. Why use modules in React?

```text
Encapsulation
Reusability
Maintainability
Testability
Scalability
```

***

### Q4. Difference Between Module Pattern and ES6 Modules?

**Module Pattern**

```javascript
(function() {})();
```

Uses closures and IIFEs.

**ES6 Modules**

```javascript
import
export
```

Native JavaScript module system.

***

### Q5. Real-World React Examples?

```text
AuthService
UserService
PaymentService
ApiClient
DateUtils
Custom Hooks
Redux Slices
```

***

# Senior React Interview Answer

> The Module Pattern encapsulates private state using closures and exposes a public API. In modern React applications, ES6 modules (`import`/`export`) are the preferred evolution of this pattern. Services such as `UserService`, `AuthService`, and `ApiClient` should be organised into separate modules, keeping API logic out of components. This improves maintainability, testability, code reuse, and scalability, especially in large enterprise React applications.
