
### **What is Closure in JavaScript?**

A **closure** is a powerful concept in JavaScript (and many other programming languages) that allows a function to "remember" and access variables from the outer function even after the outer function has finished execution.

In simpler terms, **closures** are functions that **have access to their own scope**, the scope of the outer function, and the global scope.

A closure is created when:

1. A function is defined inside another function.
2. The inner function is returned or passed around (e.g., as a callback), so it retains access to the outer function’s variables, even after the outer function has finished executing.

---

### **Why Closures are Important:**

Closures allow you to:

- **Encapsulate data**: Inner functions can access outer function variables and maintain state.
- **Create private variables**: By leveraging closures, you can simulate private variables or methods in JavaScript (since JavaScript doesn’t have native private members).
- **Maintain state between function calls**: Closures allow functions to remember and work with values over time.

---

### **How Closures Work:**

Consider the following example:

```javascript
function outerFunction() {
  let outerVar = 'I am from the outer function';

  // Inner function is a closure
  function innerFunction() {
    console.log(outerVar);
  }

  return innerFunction; // Return the inner function
}

const closureFunc = outerFunction(); // outerFunction executes, but innerFunction is returned
closureFunc(); // Output: I am from the outer function
```

#### **Explanation**

- `outerFunction()` creates a variable `outerVar` and an inner function `innerFunction()`.
- `outerFunction()` returns `innerFunction`, but even after `outerFunction()` finishes executing, `innerFunction()` still has access to `outerVar`.
- When `closureFunc()` is invoked, it remembers the context of `outerVar` and prints the value.

This is a **closure**: `innerFunction()` has access to the `outerVar` from its outer scope, even after `outerFunction()` has finished executing.

---

### **Closures and Function Scope Example**

Here’s a more detailed example using closures with function scope:

```javascript
function createCounter() {
  let count = 0;  // This is a private variable

  // The returned function is a closure that has access to 'count'
  return function() {
    count++;  // Increment the count
    return count;
  };
}

const counter = createCounter();  // 'counter' is now a closure

console.log(counter()); // Output: 1
console.log(counter()); // Output: 2
console.log(counter()); // Output: 3
```

#### **Explanation**

- `createCounter()` creates a local variable `count` and returns a function that increments `count`.
- The returned function is a **closure** because it has access to the `count` variable even after `createCounter()` has finished executing.
- Every time you call `counter()`, it remembers the previous value of `count` and increments it. This allows us to maintain a running total across multiple function calls.

---

### **Practical Example: Simulating Private Variables**

You can simulate private variables using closures. This is a common pattern in JavaScript to create data encapsulation.

```javascript
function createPerson(name, age) {
  let _name = name;  // private variable
  let _age = age;    // private variable

  // Public methods (closure)
  return {
    getName: function() {
      return _name;
    },
    getAge: function() {
      return _age;
    },
    setAge: function(newAge) {
      _age = newAge;
    }
  };
}

const person = createPerson('Alice', 30);

console.log(person.getName());  // Output: Alice
console.log(person.getAge());   // Output: 30

person.setAge(31);
console.log(person.getAge());   // Output: 31
```

#### **Explanation**

- The variables `_name` and `_age` are **private** within `createPerson()` because they can only be accessed or modified by the methods defined inside the returned object.
- The returned object has methods like `getName()`, `getAge()`, and `setAge()` that **close over** these private variables, allowing controlled access to them.
- You can't directly access or modify `_name` and `_age` from outside the function, ensuring **data privacy**.

---

### **Closures in Asynchronous JavaScript (setTimeout example)**

Closures are particularly useful when working with asynchronous code (e.g., `setTimeout`, `setInterval`). Here's an example:

```javascript
function countdown(seconds) {
  let count = seconds;

  const timer = setInterval(function() {
    console.log(count);
    count--;

    if (count < 0) {
      clearInterval(timer);  // Stop the countdown when it reaches 0
    }
  }, 1000);
}

countdown(5);
```

#### **Explanation**

- The anonymous function passed to `setInterval` is a **closure** because it has access to the variable `count` (defined in the outer `countdown()` function).
- Every time the `setInterval` callback runs, it uses the `count` variable, even though the `countdown()` function has finished executing.
- Closures allow the inner function to remember the state of `count` between invocations of the `setInterval` callback.

---

### **Common Use Cases for Closures**

1. **Private Data and Encapsulation**:
   Closures can be used to create private variables that cannot be directly accessed from outside the function, mimicking the behavior of private members in object-oriented programming.

2. **Callbacks and Event Handlers**:
   Closures are used when you pass functions as callbacks or event handlers. The callback function often needs access to variables in the outer scope, even after the outer function has finished executing.

3. **Function Factories (Creating Dynamic Functions)**:
   Closures can create dynamic functions with customized behavior based on outer function parameters.

   ```javascript
   function multiplier(factor) {
     return function(number) {
       return number * factor;
     };
   }

   const double = multiplier(2);
   console.log(double(5));  // Output: 10
   const triple = multiplier(3);
   console.log(triple(5));  // Output: 15
   ```

   In this example, `double` and `triple` are closures created by the `multiplier` function, each of which remembers the `factor` provided when they were created.

---

### **Summary of Closures**

- A **closure** is a function that retains access to variables from its **lexical scope** (the scope in which it was defined) even after that scope has finished execution.
- Closures allow functions to **remember** their environment and **access outer function variables**.
- They are commonly used for:
  - Data encapsulation and privacy.
  - Maintaining state between function calls.
  - Implementing function factories and event handlers.
  
Closures are one of the fundamental concepts that give JavaScript its powerful functional programming capabilities, allowing for cleaner, more maintainable, and more flexible code.

Closures are one of the **most important JavaScript interview topics**, especially for intermediate and senior roles. Below are common interview questions, from basic to advanced.

---

# 1. What is a closure?

**Answer:**

A **closure** is created when an inner function remembers and can access variables from its outer lexical scope, even after the outer function has finished executing.

Example:

```javascript
function outer() {
    let count = 0;

    return function () {
        count++;
        console.log(count);
    };
}

const counter = outer();

counter(); // 1
counter(); // 2
counter(); // 3
```

---

# 2. Why do we need closures?

Closures are commonly used for:

- Data encapsulation
- Private variables
- Function factories
- Event handlers
- Callbacks
- Memoization
- Module pattern
- React Hooks

---

# 3. What is the output?

```javascript
function outer() {
    let x = 10;

    function inner() {
        console.log(x);
    }

    return inner;
}

const fn = outer();

fn();
```

### Output

```
10
```

The inner function remembers `x`.

---

# 4. What is the output?

```javascript
function outer() {
    let x = 10;

    return function () {
        console.log(++x);
    };
}

const fn = outer();

fn();
fn();
fn();
```

### Output

```
11
12
13
```

The closure preserves the state of `x`.

---

# 5. What is the output?

```javascript
function test() {
    var x = 10;

    return function () {
        console.log(x);
    };
}

test()();
```

### Output

```
10
```

---

# 6. What is the output?

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i);
    }, 0);
}
```

### Output

```
3
3
3
```

All callbacks share the same `i`.

---

# 7. Fix the previous problem

```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i);
    }, 0);
}
```

### Output

```
0
1
2
```

---

# 8. Fix using closures

```javascript
for (var i = 0; i < 3; i++) {
    (function (x) {
        setTimeout(function () {
            console.log(x);
        }, 0);
    })(i);
}
```

### Output

```
0
1
2
```

---

# 9. What is the output?

```javascript
function outer() {
    let x = 10;

    return function inner() {
        x++;

        console.log(x);
    };
}

const a = outer();
const b = outer();

a();
a();
b();
a();
```

### Output

```
11
12
11
13
```

Each call to `outer()` creates a **new closure**.

---

# 10. What is the output?

```javascript
function outer() {
    let x = 10;

    return {
        increment() {
            x++;
        },

        print() {
            console.log(x);
        }
    };
}

const obj = outer();

obj.increment();
obj.increment();

obj.print();
```

### Output

```
12
```

---

# 11. Implement a counter

```javascript
function counter() {
    let count = 0;

    return {
        increment() {
            return ++count;
        },

        decrement() {
            return --count;
        }
    };
}

const c = counter();

console.log(c.increment());
console.log(c.increment());
console.log(c.decrement());
```

### Output

```
1
2
1
```

---

# 12. What is the output?

```javascript
function test() {
    var x = 10;

    return function () {
        console.log(x);
    };
}

var x = 20;

test()();
```

### Output

```
10
```

Closures use **lexical scope**, not where the function is called.

---

# 13. What is the output?

```javascript
function outer() {
    let x = 10;

    return function () {
        let y = 20;

        return function () {
            console.log(x, y);
        };
    };
}

outer()()();
```

### Output

```
10 20
```

---

# 14. What is the output?

```javascript
function outer() {
    let x = 10;

    function inner() {
        console.log(x);
    }

    x = 20;

    return inner;
}

const fn = outer();

fn();
```

### Output

```
20
```

Closures capture the **variable**, not a snapshot of its value.

---

# 15. Can a closure cause memory leaks?

**Answer:**

Yes. If a closure keeps references to objects that are no longer needed, those objects cannot be garbage collected until the closure itself becomes unreachable.

---

# 16. What is a practical use of closures?

### Function factory

```javascript
function multiply(x) {
    return function (y) {
        return x * y;
    };
}

const double = multiply(2);
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

# 17. Memoization using closures

```javascript
function memoize(fn) {
    const cache = {};

    return function (n) {
        if (cache[n]) {
            return cache[n];
        }

        cache[n] = fn(n);

        return cache[n];
    };
}
```

The `cache` variable remains available because of the closure.

---

# 18. Module Pattern

```javascript
function User() {
    let password = "123";

    return {
        login(pass) {
            return pass === password;
        }
    };
}

const user = User();

console.log(user.password);
```

### Output

```
undefined
```

`password` is private because it is only accessible through the closure.

---

# 19. Tricky Output

```javascript
function outer() {
    let x = 10;

    return function () {
        console.log(x);

        x++;
    };
}

const a = outer();

a();
a();
a();
```

### Output

```
10
11
12
```

---

# 20. Most Asked Interview Question

```javascript
function createFunctions() {
    let arr = [];

    for (var i = 0; i < 3; i++) {
        arr.push(function () {
            console.log(i);
        });
    }

    return arr;
}

const funcs = createFunctions();

funcs[0]();
funcs[1]();
funcs[2]();
```

### Output

```
3
3
3
```

### Fix

```javascript
for (let i = 0; i < 3; i++) {
```

or

```javascript
for (var i = 0; i < 3; i++) {
    ((x) => {
        arr.push(() => console.log(x));
    })(i);
}
```

---

# 21. Coding Interview: Implement `once()`

```javascript
function once(fn) {
    let called = false;
    let result;

    return function (...args) {
        if (!called) {
            called = true;
            result = fn(...args);
        }

        return result;
    };
}

const greet = once(() => "Hello");

console.log(greet());
console.log(greet());
```

### Output

```
Hello
Hello
```

The wrapped function executes only once.

---

# 22. Coding Interview: Implement `createCounter()`

```javascript
function createCounter() {
    let count = 0;

    return function () {
        return ++count;
    };
}

const counter = createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

### Output

```
1
2
3
```

---

# Quick Interview Cheat Sheet

| Question                                      | Answer                                                                                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| What is a closure?                            | A function with access to its lexical scope even after the outer function has returned.                                                           |
| Where are closures used?                      | Callbacks, event handlers, React Hooks, module pattern, memoization, function factories.                                                          |
| Do closures copy variables?                   | ❌ No, they capture references to variables.                                                                                                       |
| Can closures maintain state?                  | ✅ Yes.                                                                                                                                            |
| Can closures cause memory leaks?              | ✅ Yes, if they retain unnecessary references.                                                                                                     |
| Does each function call create a new closure? | ✅ Yes.                                                                                                                                            |
| How do closures differ from scope?            | Scope determines visibility during execution; closures allow functions to retain access to their lexical scope after the outer function finishes. |

These questions cover the closure concepts most frequently tested in JavaScript interviews, from fundamental behavior to advanced coding patterns.

The best way to understand **closures** is through real-world scenarios. Think of a closure as **a function carrying its own backpack of variables**. Even after the outer function has finished executing, the inner function still has access to those variables.

Let's go through each use case with practical examples.

---

# 1. Data Encapsulation

**Real-world:** ATM Machine

An ATM shouldn't allow you to directly modify the account balance.

```javascript
function createAccount(initialBalance) {
    let balance = initialBalance;

    return {
        deposit(amount) {
            balance += amount;
        },

        withdraw(amount) {
            balance -= amount;
        },

        getBalance() {
            return balance;
        }
    };
}

const account = createAccount(1000);

account.deposit(500);

console.log(account.getBalance()); // 1500

console.log(account.balance); // undefined
```

### Why Closure?

- `balance` is hidden.
- Only methods can modify it.
- No one can accidentally do:

```javascript
account.balance = 1000000;
```

because `balance` isn't publicly accessible.

---

# 2. Private Variables

**Real-world:** Online Banking PIN

Users shouldn't be able to access the PIN directly.

```javascript
function createUser(pin) {

    return {
        login(inputPin) {
            return inputPin === pin;
        }
    };
}

const user = createUser("1234");

console.log(user.login("1234")); // true

console.log(user.pin); // undefined
```

The PIN remains private because of the closure.

---

# 3. Function Factory

A function factory creates customized functions.

**Real-world:** E-commerce Discount

Instead of writing separate functions:

```javascript
calculate10Percent()
calculate20Percent()
calculate30Percent()
```

Use a factory:

```javascript
function createDiscount(discount) {

    return function(price) {
        return price - (price * discount) / 100;
    };
}

const studentDiscount = createDiscount(20);

const employeeDiscount = createDiscount(10);

console.log(studentDiscount(1000)); // 800

console.log(employeeDiscount(1000)); // 900
```

The returned functions remember the `discount` value.

---

# 4. Event Handlers

**Real-world:** Button Click Counter

```javascript
function clickCounter() {

    let count = 0;

    return function() {
        count++;

        console.log("Clicked", count, "times");
    };
}

const handleClick = clickCounter();

handleClick();

handleClick();

handleClick();
```

Output

```
Clicked 1 times
Clicked 2 times
Clicked 3 times
```

In a browser:

```javascript
button.addEventListener("click", handleClick);
```

The click count persists because of the closure.

---

# 5. Callbacks

**Real-world:** API Request

```javascript
function fetchUser(userId) {

    setTimeout(function() {
        console.log("Fetched user:", userId);
    }, 2000);
}

fetchUser(101);
```

Output

```
Fetched user: 101
```

Even after `fetchUser()` finishes, the callback still remembers `userId`.

---

# 6. Memoization

**Real-world:** Currency Conversion

Suppose an expensive API calculates exchange rates.

Without memoization:

```
USD → INR
API Call

USD → INR
API Call

USD → INR
API Call
```

With memoization:

```javascript
function memoize(fn) {

    const cache = {};

    return function(num) {

        if (cache[num]) {
            console.log("From Cache");
            return cache[num];
        }

        console.log("Calculated");

        cache[num] = fn(num);

        return cache[num];
    };
}

const square = memoize((n) => n * n);

console.log(square(5));

console.log(square(5));

console.log(square(5));
```

Output

```
Calculated
25

From Cache
25

From Cache
25
```

The closure keeps the `cache` alive between calls.

---

# 7. Module Pattern

Before ES6 modules, closures were commonly used to hide implementation details.

**Real-world:** Shopping Cart

```javascript
function ShoppingCart() {

    let items = [];

    return {

        add(item) {
            items.push(item);
        },

        remove() {
            items.pop();
        },

        getItems() {
            return [...items];
        }
    };
}

const cart = ShoppingCart();

cart.add("Laptop");
cart.add("Phone");

console.log(cart.getItems());

console.log(cart.items);
```

Output

```
["Laptop", "Phone"]

undefined
```

The `items` array is private and can only be modified through the provided methods.

---

# 8. React Example (Most Asked in Interviews)

Closures are heavily used in React.

```javascript
function Counter() {

    let count = 0;

    return function() {
        count++;
        console.log(count);
    };
}

const increment = Counter();

increment();

increment();

increment();
```

React Hooks like `useState` rely on closures to preserve state between renders.

---

# 9. `setTimeout` Interview Question

```javascript
function greet(name) {

    setTimeout(function() {
        console.log(name);
    }, 1000);
}

greet("Rahul");
```

Output

```
Rahul
```

Even though `greet()` has finished, the callback remembers `name`.

---

# 10. Authentication Token (Real-world)

```javascript
function createSession(token) {

    return {
        request() {
            console.log("Using Token:", token);
        }
    };
}

const session = createSession("abc123");

session.request();
```

Output

```
Using Token: abc123
```

The token stays private while still being available to methods that need it.

---

# Interview Summary

| Use Case           | Real-world Example                           | Why Closure Helps                                         |
| ------------------ | -------------------------------------------- | --------------------------------------------------------- |
| Data Encapsulation | ATM Account                                  | Protects account balance from direct access               |
| Private Variables  | Banking PIN                                  | Keeps sensitive data hidden                               |
| Function Factory   | Discount Calculator                          | Creates customized functions with preset behavior         |
| Event Handlers     | Button Click Counter                         | Maintains state across clicks                             |
| Callbacks          | API Request                                  | Remembers data until asynchronous code runs               |
| Memoization        | Currency Conversion / Expensive Calculations | Stores previous results to avoid repeated work            |
| Module Pattern     | Shopping Cart                                | Hides internal data while exposing only necessary methods |
| React              | `useState`, event handlers                   | Preserves component state and variables across renders    |

### Interview Tip

A common interview question is:

> **"If JavaScript didn't have closures, what features would be difficult to implement?"**

A strong answer is:

- Private variables
- Data encapsulation
- Function factories
- Memoization
- Module pattern
- Event handlers that maintain state
- Many asynchronous callbacks
- React Hooks like `useState` and `useEffect`

Closures are used **everywhere in React**. In fact, React Hooks (`useState`, `useEffect`, `useCallback`, event handlers, etc.) rely heavily on closures.

Here are the most common **real-world React examples**.

---

# 1. Event Handlers (Most Common)

### Real-world: Like Button

```jsx
import { useState } from "react";

function LikeButton() {
  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <button onClick={handleClick}>
      Likes: {likes}
    </button>
  );
}
```

### Where is the closure?

`handleClick` closes over (remembers):

```javascript
likes
setLikes
```

Every render creates a new `handleClick` function that remembers the latest `likes` value.

---

# 2. setTimeout

Suppose you want to show an alert after 3 seconds.

```jsx
function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setTimeout(() => {
      alert(count);
    }, 3000);
  }

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>

      <button onClick={handleClick}>
        Show Count
      </button>
    </>
  );
}
```

### Interview Question

Click:

```
Increment
Increment
Show Count
Increment
```

What will the alert show?

**Answer**

It shows the value of `count` **at the time `handleClick` was called**, because the timeout callback closes over that value.

This is known as a **stale closure**.

---

# 3. useEffect

```jsx
useEffect(() => {
  console.log(count);
}, [count]);
```

The callback passed to `useEffect` closes over the values from the render in which it was created.

React runs that callback after rendering.

---

# 4. Missing Dependency (Classic Interview Question)

```jsx
useEffect(() => {
  console.log(count);
}, []);
```

### Question

Why doesn't it print updated values?

### Answer

The effect is created only once on the initial render, so its closure contains only the initial `count`.

This is another example of a stale closure.

---

# 5. Fetch API

```jsx
function User({ id }) {

  useEffect(() => {

    fetch(`/users/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(id);
      });

  }, [id]);

}
```

The `.then()` callback remembers the `id` from the render that initiated the request.

---

# 6. useCallback

```jsx
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

The callback remembers the current `count`.

Without updating the dependencies, it may use an outdated value.

---

# 7. Custom Hook

```jsx
function useCounter() {

  const [count, setCount] = useState(0);

  function increment() {
    setCount(c => c + 1);
  }

  return {
    count,
    increment
  };
}
```

`increment` closes over `setCount`.

Whenever you call `increment()`, it still has access to that setter.

---

# 8. Debouncing Search

Real-world: Amazon Search

```jsx
const handleSearch = (text) => {

  clearTimeout(timer);

  timer = setTimeout(() => {
    search(text);
  }, 500);

};
```

The timeout callback remembers the `text` that was entered when it was scheduled.

---

# 9. React Context

```jsx
const login = () => {
    setUser(userData);
};
```

Every component consuming this function gets a version that closes over the relevant state and setters for that render.

---

# 10. Stale Closure (Most Asked React Interview Question)

```jsx
function App() {

  const [count, setCount] = useState(0);

  function increment() {

    setTimeout(() => {
      setCount(count + 1);
    }, 3000);

  }

  return (
    <button onClick={increment}>
      Click
    </button>
  );

}
```

### Question

Click the button **five times quickly**.

What is the final value?

### Answer

```
1
```

### Why?

Each timeout callback remembers:

```
count = 0
```

After 3 seconds:

```
setCount(0 + 1)
setCount(0 + 1)
setCount(0 + 1)
setCount(0 + 1)
setCount(0 + 1)
```

All update the state to `1`.

### Correct solution

```jsx
setTimeout(() => {
  setCount(c => c + 1);
}, 3000);
```

Now the final value is:

```
5
```

because the functional updater receives the latest state each time.

---

# 11. Why Functional Updates Work

```jsx
setCount(c => c + 1);
```

React passes the latest state (`c`) to the updater function, so it doesn't rely on the closed-over `count` value.

This avoids stale closure issues when multiple updates are queued.

---

# 12. Real-world Example: Shopping Cart

```jsx
function Cart() {

  const [cart, setCart] = useState([]);

  function addItem(product) {
      setCart(prev => [...prev, product]);
  }

  return (
      <button onClick={() => addItem("Laptop")}>
          Add
      </button>
  );

}
```

`addItem` closes over `setCart`, and using the functional updater ensures each addition uses the latest cart state.

---

# React Interview Cheat Sheet

| React Feature                      | How Closures Are Used                                            |
| ---------------------------------- | ---------------------------------------------------------------- |
| Event handlers                     | Remember state and props from the render where they were created |
| `useEffect`                        | Effect callbacks capture values from their render                |
| `useCallback`                      | Memoized functions still close over their dependencies           |
| Custom Hooks                       | Returned functions retain access to hook state and setters       |
| Async APIs (`setTimeout`, `fetch`) | Callbacks remember values from when they were created            |
| Debouncing/Throttling              | Delayed callbacks capture the search term or other inputs        |
| Functional state updates           | Avoid stale closures by using the latest state                   |

## Most Common React Interview Question

**Question:**

Why does this code only increment once when clicked multiple times?

```jsx
setTimeout(() => {
    setCount(count + 1);
}, 1000);
```

**Answer:**

The timeout callback closes over the `count` value from the render in which it was created. Every callback uses that same captured value. The fix is to use a functional state update:

```jsx
setTimeout(() => {
    setCount(prev => prev + 1);
}, 1000);
```

This ensures each update is based on the latest state rather than the stale value captured by the closure.

### 5. What is a closure, and how does it work?

A **closure** is a function that "remembers" its lexical scope, even when the function is executed outside that scope.

- A closure allows a function to access variables from its outer (enclosing) function even after the outer function has finished execution.

Example:

```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();
counter(); // 1
counter(); // 2
```
