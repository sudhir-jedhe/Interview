You've outlined two useful concepts: **partial application** (both left and right) of functions in JavaScript, using the spread operator (`...`). Let's break these down:

---

### **1. `partial` (Left Partial Application)**

The `partial` function allows you to create a new function with **some** arguments pre-filled, starting from the left:

```javascript
const partial = (fn, ...partials) => (...args) => fn(...partials, ...args);
```

- **How it works:**
  - The `partial` function takes a function (`fn`) and some **preset arguments** (`...partials`).
  - When you call the returned function, it expects additional arguments (`...args`), and those are appended **after** the `partials`.
  - Essentially, the `partials` are applied to the **left** side of the function, and the `args` are appended to the right.

- **Example:**

```javascript
const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetHello = partial(greet, 'Hello');  // 'Hello' is preset
console.log(greetHello('John'));  // Output: 'Hello John!'
```

- **Explanation:**
  - Here, `'Hello'` is fixed as the first argument, and `'John'` is passed when calling the `greetHello` function.
  - The final result is `'Hello John!'`.

---

### **2. `partialRight` (Right Partial Application)**

The `partialRight` function is similar to `partial`, but it applies the partial arguments **to the right side** of the function:

```javascript
const partialRight = (fn, ...partials) => (...args) => fn(...args, ...partials);
```

- **How it works:**
  - This function also takes a function (`fn`) and **preset arguments** (`...partials`).
  - When calling the returned function, it passes **`args` first**, and then the preset arguments (`partials`) are appended to the end.

- **Example:**

```javascript
const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetJohn = partialRight(greet, 'John');  // 'John' is fixed to the right
console.log(greetJohn('Hello'));  // Output: 'Hello John!'
```

- **Explanation:**
  - Here, `'John'` is preset as the second argument, and `'Hello'` is provided when calling the `greetJohn` function.
  - The result is `'Hello John!'`, because `'Hello'` becomes the first argument and `'John'` becomes the second.

---

### **Key Differences Between `partial` and `partialRight`:**

1. **`partial`**: 
   - The preset arguments are applied to the **left** side of the function, followed by any remaining arguments when the function is called.

2. **`partialRight`**:
   - The preset arguments are applied to the **right** side of the function, after the arguments passed when the function is invoked.

---

### **Further Example:**

```javascript
const multiply = (a, b, c) => a * b * c;

const multiplyBy2 = partial(multiply, 2);  // `2` is fixed at the start
console.log(multiplyBy2(3, 4));  // Output: 24 (2 * 3 * 4)

const multiplyBy3 = partialRight(multiply, 3);  // `3` is fixed at the end
console.log(multiplyBy3(2, 4));  // Output: 24 (2 * 4 * 3)
```

- **Explanation:**
  - In the first case, the number `2` is pre-filled as the first argument (`a`), and the other arguments are passed later.
  - In the second case, the number `3` is pre-filled as the last argument (`c`), and the other arguments (`a` and `b`) are passed when calling the function.

---

### **Advantages of Using Partial Functions:**

1. **Code Reusability**: You can easily create variations of a function by partially applying some of its arguments. This is particularly useful in event handling, callback functions, or working with APIs that require similar arguments repeatedly.
   
2. **Cleaner Code**: Reduces the need to repeat similar logic for multiple function calls by fixing some arguments up front.
   
3. **Functional Programming**: Partial application encourages a more declarative, functional approach to writing programs.

---

Let me know if you'd like further examples or additional explanations!