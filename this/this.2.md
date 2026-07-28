The code you've provided contains a common issue related to the usage of the `this` keyword inside an arrow function.

### Code Breakdown:

```javascript
const a = {
  dev: "BFE.dev",
  update: (name) => {
    this.dev = name; // 'this' refers to the lexical context of the arrow function
  },
};

a.update("bigfrontend.dev"); // Calling the arrow function
console.log(a.dev); // Checking the value of a.dev
```

### Key Concepts:

1. **Arrow Functions and `this`**:
   - Arrow functions **do not have their own `this` context**. Instead, they **inherit `this` from the surrounding (lexical) scope**.
   - In the case of `a.update`, `this` refers to the **lexical context** in which the arrow function was defined, not the object `a` itself. Since `update` is defined as an arrow function inside the object, `this` will **not** point to `a`, but instead to the surrounding context (which, in this case, is the global object in non-strict mode or `undefined` in strict mode).

2. **What Happens Here**:
   - When you call `a.update("bigfrontend.dev")`, the arrow function is executed.
   - However, inside the arrow function, `this` does **not** refer to the object `a`. Instead, it refers to the global object (`window` in the browser) in non-strict mode, or `undefined` in strict mode. Therefore, `this.dev = name;` doesn't update `a.dev` as you might expect.
   - Since the arrow function doesn't modify the `dev` property of `a`, the `dev` property of `a` remains unchanged.

3. **Why `a.dev` Remains "BFE.dev"**:
   - Since the arrow function does not affect the `dev` property of object `a` (due to `this` not referring to `a`), the output of `console.log(a.dev)` is `"BFE.dev"`, as the `dev` property in `a` remains unchanged.

### Fixing the Issue:

To fix this, you should use a **regular function** instead of an **arrow function** for the `update` method so that `this` correctly refers to the object `a`:

```javascript
const a = {
  dev: "BFE.dev",
  update(name) {
    this.dev = name; // 'this' will now refer to the object 'a'
  },
};

a.update("bigfrontend.dev");
console.log(a.dev); // Output will be "bigfrontend.dev"
```

### Explanation of the Fix:

- In this case, `update` is now a regular method (non-arrow function) of object `a`.
- Inside the method, `this` correctly refers to the object `a`, so calling `this.dev = name` updates `a.dev` as expected.

### Output:

```javascript
bigfrontend.dev; // The 'dev' property of 'a' is updated successfully.
```

### Summary:

- **Arrow functions** bind `this` lexically, meaning they inherit `this` from the surrounding scope. In your case, it was not referring to the object `a`, but to the global context.
- **Regular functions** use the object (`a` in this case) as the value of `this`, allowing you to update properties on the object correctly.
