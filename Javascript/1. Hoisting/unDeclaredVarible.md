Let's go through both versions of your code and explain the behavior, especially with respect to variable scoping and how the global variables are handled.

### **First Version: Implicit Global Variables**

```javascript
function test() {
  const a = b = c = "Sudhir";
  // Declaring b and c globally (implicitly)

}

test();

console.log(typeof a); // 'undefined' because `a` is block-scoped
console.log(typeof b); // 'string' because `b` is globally declared
console.log(typeof c); // 'string' because `c` is globally declared
```

### **Explanation:**

1. **`const a = b = c = "Sudhir";`**:
   - Here, `a` is **declared using `const`**, which means it's block-scoped to the `test` function, so it **won't be accessible outside** the function.
   - `b = c = "Sudhir";` does **not have a declaration keyword (`let`, `const`, or `var`)**, which means both `b` and `c` are implicitly **global variables**. They get added to the **global scope** (in a browser environment, they are attached to the `window` object).
   - **Important**: In strict mode (which is the default in modern JavaScript environments), this will throw an error because we are trying to assign values to undeclared variables. In non-strict mode (such as in a browser console), it silently creates global variables.

2. **`console.log(typeof a);`**:
   - `a` is declared as `const` inside the function, so it **won't be accessible** outside the function. Therefore, the result is `'undefined'` because `a` doesn't exist in the global scope.

3. **`console.log(typeof b);` and `console.log(typeof c);`**:
   - Both `b` and `c` are **implicitly declared as global variables**, so they are accessible globally. Hence, the result is `'string'` because they are both assigned the value `"Sudhir"`.

### **Output for the First Version:**
```text
In Js "=" execute right to left, c is undeclare variable become window.c, window.b, a declare with const . c = "Sudhir" => b = "Sudhir" => a => undefined
undefined
string
string
```

### **Second Version: Explicit Global Variables with `window`**

```javascript
function test() {
  const a = "Sudhir";
  // Declaring b and c globally
  window.b = "Sudhir";
  window.c = "Sudhir";
}

test();

console.log(typeof a); // 'undefined' because `a` is block-scoped
console.log(typeof b); // 'string' because `b` is globally declared
console.log(typeof c); // 'string' because `c` is globally declared
```

### **Explanation:**

1. **`const a = "Sudhir";`**:
   - `a` is still declared using `const`, so it's block-scoped to the `test` function. As a result, it is **not accessible outside** the function, and we get `'undefined'` when we try to log its type.

2. **`window.b = "Sudhir";` and `window.c = "Sudhir";`**:
   - In this version, you're explicitly assigning `b` and `c` to the `window` object, which means they become **global properties** (specifically, `window.b` and `window.c`).
   - In a browser environment, the `window` object represents the global scope, so `window.b` and `window.c` will be globally accessible.
   - Since they are now global variables, their type is `'string'`, and we can access them outside the function.

3. **`console.log(typeof a);`**:
   - Since `a` is declared as a block-scoped variable inside the function, it is **not accessible** outside the function, so we get `'undefined'`.

4. **`console.log(typeof b);` and `console.log(typeof c);`**:
   - `b` and `c` are now properties of the global `window` object. Since they have the value `"Sudhir"`, their type is `'string'`.

### **Output for the Second Version:**
```text
undefined
string
string
```

### **Key Differences:**
1. **First Version:**
   - Implicitly global variables (`b` and `c`) are created without using the `window` object or any declaration keywords (`let`, `const`, `var`).
   - This can lead to **unintended global variables** that can conflict with other variables in your program. It is considered a bad practice to implicitly create global variables.
   
2. **Second Version:**
   - `b` and `c` are explicitly added to the global `window` object, which is safer and more explicit, although still not ideal for managing global state. Explicitly attaching variables to `window` makes it clear that they are global, but it's still preferable to manage state in a more contained manner (e.g., using modules, closures, or specific namespaces).

### **Conclusion:**
- **Never implicitly create global variables**. Always use `let`, `const`, or `var` to properly scope your variables, or explicitly attach them to the global object if absolutely necessary.
- Block-scoped variables (using `const` or `let`) are not accessible outside their scope, while variables attached to the global object are accessible throughout your entire program.



You're right in your observation, and I apologize for the confusion in the initial explanation.

Let’s clarify the behavior in more detail:

### Original Code:
```javascript
var finalScore = 1 + score;
score = 100;
console.log(finalScore);
```

### Why this throws an error in JavaScript:

1. **Hoisting with `var`**:
   - When we declare variables using `var`, JavaScript **hoists** the declarations (but not their initializations) to the top of the scope. So, if you had written:
     ```javascript
     var score;
     ```
     Then the `score` variable would be hoisted to the top of the code.
     
   - **But,** in this case, **`score` is never declared** before you try to use it in the `finalScore` calculation.

2. **`score` is undeclared**:
   - The key here is that **`score` is not declared anywhere before it is used** in the expression `1 + score`. JavaScript will not automatically declare `score` for you.
   - So, trying to access `score` before it has been declared results in a **`ReferenceError`**: `"score is not defined"`.

### The actual error:
Since `score` is not declared at the time `finalScore` is being calculated, you will get a **ReferenceError**:

```
ReferenceError: score is not defined
```

### Corrected Version:
To avoid the error, you need to **declare** the `score` variable **before** you use it:

```javascript
var score = 100;          // Declare and initialize score first
var finalScore = 1 + score; // Now `score` is defined, and this will work
console.log(finalScore);  // Logs 101
```

### Key Points:
- **Hoisting** applies only to **declarations**, not **initializations**. In your code, `score` was never declared before you tried to use it.
- A variable needs to be **declared** before you use it. Otherwise, JavaScript will throw a **ReferenceError** (`"is not defined"`) because it can't find the variable in the current scope.

### Conclusion:
When you try to access a variable that hasn't been declared yet, you get a `ReferenceError` because it doesn't exist in memory. If the variable is declared but not initialized, it will have a value of `undefined`, but in your case, the variable `score` was never declared at all, causing the error.