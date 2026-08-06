In JavaScript, **default parameters** are a feature introduced in **ES6** (ECMAScript 2015) that allow you to set default values for function parameters. This makes your functions more flexible, especially when some arguments are not passed by the caller. Before ES6, handling missing arguments required manual checks for `undefined` values, leading to longer and less readable code. 

Let's explore the various ways **default parameters** can be used, along with examples.

---

### **Before ES6 - Handling Missing Parameters**

In versions of JavaScript prior to ES6, you would have to manually check if a parameter was passed, and if not, assign a default value:

```javascript
function increment(value, by) {
  by = (typeof by === 'undefined') ? 1 : by;  // Default value for 'by' if not passed
  return value + by;
}

console.log(increment(2, 2)); // 4
console.log(increment(2));    // 3
```

- In this example, `by` defaults to `1` if it is not provided. Without this check, calling `increment(2)` would result in `NaN` because `by` would be `undefined`.

---

### **After ES6 - Default Parameters**

ES6 introduced a much cleaner way to define default values directly in the function signature. Here's how you can do it:

```javascript
function increment(value, by = 1) {
  return value + by;
}

console.log(increment(2, 2)); // 4
console.log(increment(2));    // 3
```

In the example above, `by` is set to `1` by default if no argument is passed. This simplifies the function and reduces the need for manual checks.

---

### **Handling Falsy Values**

One important distinction with default parameters is that **they only apply to `undefined` values** and not other falsy values (like `0`, `false`, `""`, `null`).

```javascript
function increment(value, by = 1) {
  return value + by;
}

console.log(increment(2, undefined)); // 3  (by gets default value of 1)
console.log(increment(2, ''));        // 2  (by is '')
console.log(increment(2, null));      // 2  (by is null)
```

- Here, `undefined` triggers the default parameter (`by = 1`), while empty strings (`""`), `null`, and other falsy values do not.

---

### **Using Functions, Arrays, and Objects as Default Parameters**

You can also use functions, arrays, and objects as default parameters:

```javascript
function store(num = add(1), b = [], c = {}) {
  b.push(num);
  c[num] = b;
  return c;
}

function add(num) {
  return num + 1;
}

console.log(store()); // {2: Array(1)}
```

- Here, the default value for `num` is set to the return value of the `add()` function, and for `b` and `c`, we use empty arrays and objects respectively.

---

### **Default Parameters Based on Other Parameters**

In some cases, you may want to set a default value based on a previous parameter:

```javascript
function double(first, second = first) {
  return first + second;
}

console.log(double(10)); // 20 (second uses first as the default)
```

- In the example above, if the second parameter is not provided, it defaults to the first parameter (`first`). 

---

### **Default Parameters Are Evaluated at Call Time**

Default parameters are evaluated each time the function is called. This means that the default values are re-evaluated for every function call, rather than being evaluated once during function definition:

```javascript
function store(num, arr = []) {
  arr.push(num);
  return arr;
}

console.log(store(10)); // [10]
console.log(store(11)); // [11]
```

- The array `arr` is reinitialized with every function call. Each time the function is called, `arr` is set to a new empty array by default.

---

### **Using Functions in Default Parameters**

You can even use functions within the default parameter values. For example, using a function to calculate the default value:

```javascript
function add(num) {
  return num + 1;
}

function increment(value = add(1)) {
  return value;
}

console.log(increment()); // 2
console.log(increment()); // 2 (every time the function is called)
```

- Here, the default value for `value` is calculated by calling the `add(1)` function, which adds `1` to `1` and returns `2`.

---

### **Default Parameters and the `arguments` Object**

When using default parameters, the `arguments` object behaves slightly differently. The `arguments` object doesn't reflect changes made to the parameters in **strict mode**:

```javascript
function test(inp) {
  console.log(inp === arguments[0]);  // true
  inp = 'different';
  console.log(inp === arguments[0]);  // false in strict mode, true otherwise
}

test();
```

- In **non-strict mode**, changes to parameters also update the `arguments` object, but in **strict mode**, the `arguments` object does not reflect the changes to parameters.

---

### **Destructuring with Default Parameters**

ES6 also allows for **destructuring** with default values, which is useful for objects and arrays:

```javascript
let calculate = ({ quantity, price = 10, tax = 0.15 }) => {
  return quantity * price * tax;
}

console.log(calculate({ quantity: 10 }));          // 15
console.log(calculate({ quantity: 10, price: 11 })); // 16.5
console.log(calculate({ tax: 0.25, quantity: 10 }));  // 25
```

- In this example, the parameters are destructured from the passed object, and default values are applied where necessary.

You can also destructure arrays:

```javascript
function getFirst([first, ...rest] = [0, 1]) {
  return first;
}

console.log(getFirst());         // 0
console.log(getFirst([10, 20])); // 10
```

- If no argument is passed to `getFirst()`, it will use the default value `[0, 1]`.

---

### **Example: Default Parameters with First Parameters**

It’s also possible to define parameters such that left-hand parameters have default values that depend on right-hand parameters:

```javascript
function doSomethingWithValue(value = "Hello World", callback = () => { console.log(value) }) {
  callback();
}

doSomethingWithValue(); // Logs "Hello World"
```

- The `value` defaults to `"Hello World"`, and the `callback` defaults to a function that logs `value`.

---

### **Summary of Default Parameters Features in ES6:**

1. **Basic Default Parameters**:
   - You can assign default values directly in the function signature.
   - Only `undefined` values trigger default parameters, not other falsy values (like `0`, `null`, `false`, `""`).

2. **Dynamic Defaults**:
   - Default values can be functions, arrays, or objects, evaluated each time the function is called.

3. **Destructuring with Default Parameters**:
   - Default values can be used with destructuring syntax, which is especially useful for handling objects and arrays.

4. **Function Arguments**:
   - Default parameters allow you to define dependencies between parameters, such as setting one parameter’s default based on the value of another.

5. **Strict Mode Behavior**:
   - In strict mode, the `arguments` object doesn't reflect parameter changes, unlike in non-strict mode.

---

Default parameters simplify your functions, reduce boilerplate, and improve readability, making your code cleaner and more maintainable.