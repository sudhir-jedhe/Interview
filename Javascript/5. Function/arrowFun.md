# In this code, you're working with a class `Site` that has a method `getHandle()`, which returns an object containing three methods: `getName1`, `getName2`, and `getName3`. Each of these methods behaves differently due to the way they reference `this`

Let's break down what happens when you run the code:

### 1. **`getName1()`**

This method is a **regular function**. In JavaScript, the value of `this` inside a regular function is determined by how the function is called. When `getName1` is called as `site.getHandle().getName1()`, `this` refers to the **object returned by `getHandle()`**, not the `Site` instance.

- `this.name` will access `name` from the **object returned by `getHandle()`** (which doesn't have a `name` property, so `this.name` is `undefined`).

  ```javascript
  console.log(site.getHandle().getName1()); // undefined
  ```

### 2. **`getName2()`**

This is an **arrow function**. Arrow functions do not have their own `this`. Instead, they inherit `this` from the surrounding lexical context, i.e., the context in which they were defined. In this case, `getName2` is defined inside the `getHandle()` method, and thus `this` in `getName2` refers to the `Site` instance because `getHandle()` was called on `site` (an instance of `Site`).

- `this.name` in `getName2()` refers to the `name` property of the `Site` instance, which is `"BFE"`.

  ```javascript
  console.log(site.getHandle().getName2()); // "BFE"
  ```

### 3. **`getName3()`**

This method is a **regular function**, but unlike `getName1()`, it is **defined using the function keyword** within the returned object. In this case, `this` will refer to the object the function is called on — which is the object returned by `getHandle()`.

- Since the object returned by `getHandle()` doesn't have a `name` property, `this.name` will be `undefined` again.

  ```javascript
  console.log(site.getHandle().getName3()); // undefined
  ```

### Summary of Behavior

- **`getName1()`**: Since it’s a regular function, `this` refers to the object returned by `getHandle()`, which doesn't have a `name` property. Therefore, `this.name` is `undefined`.
- **`getName2()`**: Since it’s an arrow function, `this` is lexically bound to the `Site` instance (i.e., `site`), so `this.name` refers to `"BFE"`.
- **`getName3()`**: Like `getName1()`, it’s a regular function, so `this` refers to the object returned by `getHandle()`, which doesn't have a `name` property. Therefore, `this.name` is `undefined`.

### The output of the code will be

```javascript
undefined; // from getName1()
("BFE"); // from getName2()
undefined; // from getName3()
```

### Key Takeaways

- **Regular functions**: `this` depends on how the function is called.
- **Arrow functions**: `this` is lexically bound and inherited from the surrounding context (the class in this case).

This pattern highlights one of JavaScript's most tested concepts: **how `this` binding works across regular methods, arrow functions, and explicit closure variable aliasing**.

Here is a typical implementation of that `Site` class and a breakdown of why each method behaves differently:

```javascript
class Site {
  constructor(name) {
    this.name = name || "Default Site";
  }

  getHandle() {
    // Variable alias for lexical scope capture
    const self = this;

    return {
      name: "Handle Object",

      // 1. Regular Function / Method
      getName1: function () {
        return this.name;
      },

      // 2. Arrow Function
      getName2: () => {
        return this.name;
      },

      // 3. Regular Function using closure variable (`self` / `that`)
      getName3: function () {
        return self.name;
      },
    };
  }
}
```

---

### How Each Method Behaves & Why

Assuming we instantiate the class and call `getHandle()`:

```javascript
const site = new Site("MyAwesomeSite");
const handle = site.getHandle();

console.log(handle.getName1()); // Output: "Handle Object"
console.log(handle.getName2()); // Output: "MyAwesomeSite"
console.log(handle.getName3()); // Output: "MyAwesomeSite"
```

---

### 1. `getName1()` — Dynamic `this` (Implicit Binding)

- **Behavior:** Refers to `handle` (the object executing the function), returning `"Handle Object"`.
- **Why:** Traditional `function` keywords determine `this` **at runtime, depending on how the function is invoked**. Because you call `handle.getName1()`, the object to the left of the dot (`handle`) becomes `this`. It loses reference to the outer `Site` instance.

---

### 2. `getName2()` — Lexical `this` (Arrow Function)

- **Behavior:** Refers to the `Site` instance, returning `"MyAwesomeSite"`.
- **Why:** Arrow functions **do not have their own `this` context**. Instead, they capture `this` lexically from the surrounding scope where `getHandle()` was executed. Since `site.getHandle()` was called, `this` inside `getHandle()` was the `site` instance, so the arrow function inherits that reference.

---

### 3. `getName3()` — Variable Closure (`self` / `that`)

- **Behavior:** Refers to the `Site` instance, returning `"MyAwesomeSite"`.
- **Why:** Before ES6 arrow functions existed, developers preserved outer scope contexts by assigning `const self = this;` inside the method. Because JavaScript functions form closures, `getName3()` retains access to `self` regardless of how or where `getName3()` is invoked.

---

### Summary Comparison Table

| Method         | Syntax Type                       | How `this` / Context is Found                           | Value of `name`   |
| -------------- | --------------------------------- | ------------------------------------------------------- | ----------------- |
| **`getName1`** | Regular `function()`              | Resolved dynamically at call time (`handle.getName1()`) | `"Handle Object"` |
| **`getName2`** | Arrow `() => {}`                  | Inherits `this` lexically from `getHandle()`            | `"MyAwesomeSite"` |
| **`getName3`** | Regular `function()` using `self` | Reads `self` from closure scope                         | `"MyAwesomeSite"` |

#### What if the methods are detached?

```javascript
const { getName1, getName2, getName3 } = site.getHandle();

getName1(); // Returns undefined or throws TypeError (Strict Mode) because `this` is lost
getName2(); // Still returns "MyAwesomeSite" (bound lexically)
getName3(); // Still returns "MyAwesomeSite" (bound via closure)
```
