If you're asking:

> **"How do we achieve JavaScript class private fields (`#field`) in functions?"**

The answer is **Closures**.

Before ES2022 private fields existed, JavaScript developers used closures to create private data.

***

# 1. Private Variable Using Closure

## Class Version

```javascript
class BankAccount {
  #balance = 1000;

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();

console.log(account.getBalance());
```

***

## Functional Version (Closure)

```javascript
function createBankAccount() {
  let balance = 1000;

  return {
    getBalance() {
      return balance;
    },

    deposit(amount) {
      balance += amount;
    }
  };
}

const account =
  createBankAccount();

console.log(
  account.getBalance()
);

account.deposit(500);

console.log(
  account.getBalance()
);
```

Output:

```javascript
1000
1500
```

***

# Why Is `balance` Private?

```javascript
console.log(account.balance);
```

Output:

```javascript
undefined
```

Because:

```javascript
balance
```

lives inside the function scope.

***

# 2. Private Method Using Closure

## Class Version

```javascript
class User {
  #validate(name) {
    return name.length > 3;
  }

  save(name) {
    return this.#validate(name);
  }
}
```

***

## Functional Version

```javascript
function createUser() {

  function validate(name) {
    return name.length > 3;
  }

  return {
    save(name) {
      return validate(name);
    }
  };
}

const user = createUser();

console.log(
  user.save("Sudhir")
);
```

Output:

```javascript
true
```

***

# 3. Getters and Setters Using Closure

```javascript
function createEmployee() {
  let salary = 0;

  return {
    getSalary() {
      return salary;
    },

    setSalary(amount) {
      if (amount < 0) {
        throw new Error(
          "Invalid Salary"
        );
      }

      salary = amount;
    }
  };
}

const emp =
  createEmployee();

emp.setSalary(50000);

console.log(
  emp.getSalary()
);
```

Output:

```javascript
50000
```

***

# 4. Module Pattern (Very Popular Interview Question)

```javascript
const Counter = (() => {
  let count = 0;

  return {
    increment() {
      count++;
    },

    decrement() {
      count--;
    },

    getCount() {
      return count;
    }
  };
})();

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

# 5. React Functional Component Equivalent

Instead of private fields:

```javascript
class Counter {
  #count = 0;
}
```

React functional components typically use:

```jsx
import { useRef } from "react";

function Counter() {
  const countRef =
    useRef(0);

  const increment = () => {
    countRef.current++;
  };

  return (
    <button
      onClick={increment}
    >
      Increment
    </button>
  );
}
```

`countRef.current` behaves like a private variable for the component instance.

***

# 6. Private State with Factory Function

```javascript
function createEmployee(
  name,
  salary
) {
  let _salary = salary;

  return {
    name,

    getSalary() {
      return _salary;
    },

    incrementSalary() {
      _salary += 1000;
    }
  };
}

const emp =
  createEmployee(
    "Sudhir",
    50000
  );

emp.incrementSalary();

console.log(
  emp.getSalary()
);
```

Output:

```javascript
51000
```

***

# Modern Comparison

## ES2022 Class

```javascript
class Employee {
  #salary = 50000;

  getSalary() {
    return this.#salary;
  }
}
```

***

## Closure-Based Function

```javascript
function Employee() {
  let salary = 50000;

  return {
    getSalary() {
      return salary;
    }
  };
}
```

Both provide encapsulation.

***

# Which Is Better?

### Class Private Field

```javascript
#salary
```

✅ Built-in language feature

✅ Better readability

✅ Better inheritance support

✅ True privacy

***

### Closure

```javascript
let salary = 50000;
```

✅ Works everywhere

✅ Excellent encapsulation

✅ Great for factory functions

✅ Common in React hooks and modules

***

# Senior Interview Answer

> The functional equivalent of JavaScript private class fields is a closure. Variables declared inside a function remain inaccessible from outside while still being available to returned methods. This pattern was the primary way to achieve encapsulation before ES2022 introduced private class fields using the `#` syntax. In modern React applications, closures and hooks (`useState`, `useRef`) are commonly used instead of class-based private fields.
# React Hook Example Using Closure for Private State

In functional components, **closures are the natural replacement for private class fields**.

***

# 1. Private Counter Using Closure

Instead of:

```javascript
class Counter {
  #count = 0;
}
```

Use a custom hook.

```jsx
import { useRef } from "react";

function usePrivateCounter() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current++;
  };

  const getCount = () => {
    return countRef.current;
  };

  return {
    increment,
    getCount
  };
}

export default function App() {
  const counter =
    usePrivateCounter();

  const handleClick = () => {
    counter.increment();

    console.log(
      counter.getCount()
    );
  };

  return (
    <button
      onClick={handleClick}
    >
      Increment
    </button>
  );
}
```

### Why is it Private?

```javascript
countRef.current
```

cannot be accessed outside the hook unless you explicitly expose it.

***

# 2. True Closure-Based Private State

```jsx
function createEmployee() {
  let salary = 50000;

  return {
    getSalary() {
      return salary;
    },

    increaseSalary() {
      salary += 1000;
    }
  };
}

export default function App() {
  const employee =
    React.useMemo(
      () =>
        createEmployee(),
      []
    );

  return (
    <button
      onClick={() => {
        employee.increaseSalary();

        console.log(
          employee.getSalary()
        );
      }}
    >
      Increase Salary
    </button>
  );
}
```

The variable:

```javascript
salary
```

exists only inside the closure.

***

# 3. React Hook with Encapsulated Logic

A more practical React example.

```jsx
import { useState } from "react";

function useBankAccount(
  initialBalance
) {
  let secretLimit = 100000;

  const [balance, setBalance] =
    useState(initialBalance);

  const deposit = amount => {
    setBalance(
      prev => prev + amount
    );
  };

  const canWithdraw =
    amount =>
      amount <= balance &&
      amount <
        secretLimit;

  return {
    balance,
    deposit,
    canWithdraw
  };
}
```

Component:

```jsx
function App() {
  const account =
    useBankAccount(5000);

  return (
    <>
      <h2>
        Balance:
        {account.balance}
      </h2>

      <button
        onClick={() =>
          account.deposit(
            1000
          )
        }
      >
        Deposit
      </button>
    </>
  );
}
```

Here:

```javascript
secretLimit
```

is never exposed.

***

# Private Fields vs Closures

## Private Fields (`#`)

```javascript
class Employee {
  #salary = 50000;

  getSalary() {
    return this.#salary;
  }
}
```

***

### Advantages

✅ Native language feature

✅ Readable syntax

✅ Easy inheritance

✅ Better OOP design

✅ True encapsulation

✅ Good for large class hierarchies

***

### Disadvantages

❌ Only works in classes

❌ Requires modern JavaScript support

❌ Less common in modern React since hooks dominate

***

# Closures

```javascript
function createEmployee() {
  let salary = 50000;

  return {
    getSalary() {
      return salary;
    }
  };
}
```

***

### Advantages

✅ Works without classes

✅ Natural fit for React Hooks

✅ Great encapsulation

✅ Supports factory functions

✅ Functional programming friendly

✅ Widely used in React ecosystem

***

### Disadvantages

❌ Every instance gets its own copy of functions

```javascript
createEmployee()
createEmployee()
```

creates new function objects.

***

❌ Harder inheritance

```javascript
extends
super
```

don't exist naturally.

***

❌ Can be harder to debug in large applications

***

# Memory Comparison

## Class

```javascript
class Employee {
  getSalary() {}
}
```

Methods live on:

```javascript
Employee.prototype
```

Shared by all instances.

```text
1000 Employees
↓
1 getSalary method
```

***

## Closure

```javascript
function createEmployee() {
  return {
    getSalary() {}
  };
}
```

```text
1000 Employees
↓
1000 getSalary functions
```

Higher memory consumption.

***

# React Perspective

Modern React rarely uses classes:

```jsx
function App() {}
```

Instead:

```jsx
useState()
useRef()
useMemo()
useCallback()
custom hooks
```

All rely heavily on closures.

Example:

```jsx
function useCounter() {
  const [count, setCount] =
    useState(0);

  const increment = () => {
    setCount(
      c => c + 1
    );
  };

  return {
    count,
    increment
  };
}
```

`increment()` forms a closure over React state.

***

# Senior Interview Answer

> Private class fields (`#field`) provide native encapsulation and are ideal for object-oriented designs with inheritance and shared prototype methods. Closures achieve privacy by keeping variables inside a function scope and are the foundation of React Hooks. In modern React applications, closures are generally preferred because hooks, custom hooks, and functional components naturally leverage closure-based state management, whereas private class fields are mostly relevant in class-based architectures.
# React Hook Example Using `useState` for "Private State"

In React functional components, there is no concept of `private` like:

```javascript
#salary
```

However, state inside a **custom hook** is effectively private because consumers can only access what the hook returns.

***

# Example 1: Private Counter Hook

```jsx
import { useState } from "react";

function useCounter() {
  const [count, setCount] =
    useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  const decrement = () => {
    setCount(prev => prev - 1);
  };

  // Only expose what consumers need
  return {
    count,
    increment,
    decrement
  };
}

export default function App() {
  const counter = useCounter();

  return (
    <>
      <h2>
        Count: {counter.count}
      </h2>

      <button
        onClick={counter.increment}
      >
        +
      </button>

      <button
        onClick={counter.decrement}
      >
        -
      </button>
    </>
  );
}
```

### Why is it "private"?

The component cannot access:

```javascript
setCount
```

directly because it is not returned from the hook.

***

# Example 2: Private Bank Account Hook

```jsx
import { useState } from "react";

function useBankAccount(
  initialBalance
) {
  const [balance, setBalance] =
    useState(initialBalance);

  const deposit = amount => {
    setBalance(
      prev => prev + amount
    );
  };

  const withdraw = amount => {
    setBalance(
      prev => prev - amount
    );
  };

  return {
    balance,
    deposit,
    withdraw
  };
}

function App() {
  const account =
    useBankAccount(5000);

  return (
    <>
      <h2>
        Balance:
        {account.balance}
      </h2>

      <button
        onClick={() =>
          account.deposit(
            1000
          )
        }
      >
        Deposit
      </button>

      <button
        onClick={() =>
          account.withdraw(
            500
          )
        }
      >
        Withdraw
      </button>
    </>
  );
}
```

### Encapsulation

Users of the hook can:

```javascript
account.balance
account.deposit()
```

But cannot access:

```javascript
setBalance()
```

because it remains hidden inside the hook.

***

# Example 3: Validation Hook (Private Logic)

```jsx
import { useState } from "react";

function useEmployeeForm() {
  const [name, setName] =
    useState("");

  const [error, setError] =
    useState("");

  const validate = value => {
    return value.length >= 3;
  };

  const updateName = value => {
    setName(value);

    if (!validate(value)) {
      setError(
        "Minimum 3 characters required"
      );
    } else {
      setError("");
    }
  };

  return {
    name,
    error,
    updateName
  };
}
```

Usage:

```jsx
function App() {
  const form =
    useEmployeeForm();

  return (
    <>
      <input
        value={form.name}
        onChange={e =>
          form.updateName(
            e.target.value
          )
        }
      />

      {form.error && (
        <p>{form.error}</p>
      )}
    </>
  );
}
```

Notice:

```javascript
validate()
```

is completely private.

***

# Example 4: Private State + Public API

This pattern is very common in enterprise React projects.

```jsx
function useShoppingCart() {
  const [items, setItems] =
    useState([]);

  const addItem = item => {
    setItems(prev => [
      ...prev,
      item
    ]);
  };

  const removeItem = id => {
    setItems(prev =>
      prev.filter(
        item =>
          item.id !== id
      )
    );
  };

  const totalItems =
    items.length;

  return {
    items,
    totalItems,
    addItem,
    removeItem
  };
}
```

Component sees:

```javascript
items
totalItems
addItem
removeItem
```

Internal implementation remains hidden.

***

# Comparing Class Private Fields vs React Hook State

## Class

```javascript
class Employee {
  #salary = 50000;
}
```

Privacy enforced by JavaScript runtime.

***

## Hook

```javascript
function useEmployee() {
  const [salary] =
    useState(50000);

  return {};
}
```

Privacy achieved through **encapsulation**.

The component cannot access state that the hook does not return.

***

# Interview Answer

> In React functional components, private state is typically achieved using custom hooks and closures rather than class private fields. State created with `useState()` remains encapsulated inside the hook, and consumers can only interact with the values and functions explicitly returned. This creates a clean public API while keeping implementation details such as validation logic, setters, and helper functions private.
