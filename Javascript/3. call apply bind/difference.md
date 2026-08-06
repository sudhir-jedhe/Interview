The `call()`, `apply()`, and `bind()` methods in JavaScript are all used to set the value of `this` in a function and control its behavior. Though they have a similar purpose, there are key differences in how they work, particularly in how they handle arguments and when the function is executed. Let's break down each method with examples:

### **1. `call()` Method**

- **Purpose:** The `call()` method invokes a function with a specified `this` value and arguments provided individually (not as an array).
- **Syntax:**
  ```javascript
  func.call(thisArg, arg1, arg2, ...);
  ```
- **When to use:** Use `call()` when you want to invoke a function immediately and pass the arguments one by one.

#### Example:
```javascript
var employee1 = { firstName: "John", lastName: "Rodson" };
var employee2 = { firstName: "Jimmy", lastName: "Baily" };

function invite(greeting1, greeting2) {
  console.log(greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2);
}

invite.call(employee1, "Hello", "How are you?");  // Hello John Rodson, How are you?
invite.call(employee2, "Hello", "How are you?");  // Hello Jimmy Baily, How are you?
```

- **Key Point:** The arguments are passed individually after the `this` context (i.e., `employee1` or `employee2`).

### **2. `apply()` Method**

- **Purpose:** The `apply()` method also invokes a function with a specified `this` value, but the arguments are passed as an array (or array-like object).
- **Syntax:**
  ```javascript
  func.apply(thisArg, [argsArray]);
  ```
- **When to use:** Use `apply()` when you have an array of arguments that need to be passed to the function.

#### Example:
```javascript
var employee1 = { firstName: "John", lastName: "Rodson" };
var employee2 = { firstName: "Jimmy", lastName: "Baily" };

function invite(greeting1, greeting2) {
  console.log(greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2);
}

invite.apply(employee1, ["Hello", "How are you?"]);  // Hello John Rodson, How are you?
invite.apply(employee2, ["Hello", "How are you?"]);  // Hello Jimmy Baily, How are you?
```

- **Key Point:** The arguments are passed as an array (or array-like object), i.e., `["Hello", "How are you?"]`.

### **3. `bind()` Method**

- **Purpose:** The `bind()` method returns a new function, allowing you to set `this` for that new function. The arguments can be provided at the time of binding (partial application) or when the new function is called later.
- **Syntax:**
  ```javascript
  let boundFunc = func.bind(thisArg, arg1, arg2, ...);
  ```
- **When to use:** Use `bind()` when you want to create a new function with a fixed `this` value and optionally pre-set arguments.

#### Example:
```javascript
var employee1 = { firstName: "John", lastName: "Rodson" };
var employee2 = { firstName: "Jimmy", lastName: "Baily" };

function invite(greeting1, greeting2) {
  console.log(greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2);
}

var inviteEmployee1 = invite.bind(employee1);  // Bound to employee1
var inviteEmployee2 = invite.bind(employee2);  // Bound to employee2

inviteEmployee1("Hello", "How are you?");  // Hello John Rodson, How are you?
inviteEmployee2("Hello", "How are you?");  // Hello Jimmy Baily, How are you?
```

- **Key Point:** `bind()` creates a new function, and the original function is not invoked immediately. You can invoke the bound function later, and it will always use the same `this` value.

### **Key Differences Between `call()`, `apply()`, and `bind()`**

| Feature               | `call()`                                   | `apply()`                                  | `bind()`                                   |
|-----------------------|--------------------------------------------|--------------------------------------------|--------------------------------------------|
| **Invocation Timing** | Executes immediately.                     | Executes immediately.                      | Returns a new function, does not execute immediately. |
| **Arguments**         | Arguments passed one by one.               | Arguments passed as an array (or array-like object). | Arguments passed as part of the binding process. |
| **Return Value**      | Executes the function and returns its result. | Executes the function and returns its result. | Returns a new function that can be invoked later. |
| **Use Case**           | When you want to invoke a function immediately with specified `this` and arguments. | When you want to invoke a function immediately with specified `this` and arguments in an array. | When you want to create a function with a specific `this` and possibly pre-set arguments to call later. |

### **Summary:**

- **`call()`**: Executes the function immediately with a given `this` context and comma-separated arguments.
- **`apply()`**: Executes the function immediately with a given `this` context, but arguments must be passed as an array.
- **`bind()`**: Returns a new function that is permanently bound to a specific `this` context and optionally pre-set arguments, and it can be executed later.

### **Use Cases:**
- Use `call()` and `apply()` when you need to invoke the function immediately with a specific `this` context and arguments.
- Use `bind()` when you want to create a new function with a fixed `this` and pass arguments later, or when you need to use the function as a callback or event handler.