You’ve shared several interesting variations of the `pipe` function, and they each work differently based on specific use cases. Let's break down and explore the variations:

---

### **1. Basic `pipe` Implementation (with functions in sequence)**

This implementation is a simple pipe that takes a series of functions and applies them to an input in sequence.

#### **Example:**
```javascript
const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((result, func) => func(result), input);

// Example functions
const addTwo = (x) => x + 2;
const square = (x) => x * x;
const double = (x) => x * 2;

// Example usage
const result = pipe(addTwo, square, double)(3);
console.log(result); // Output: ((3 + 2)^2) * 2 = 100
```

#### **Explanation:**
- The `pipe` function takes multiple functions (`addTwo`, `square`, `double`).
- These functions are applied in order, and the result of one is passed as the input to the next.
- In this example:  
  `3 + 2 = 5`, then `5 * 5 = 25`, then `25 * 2 = 50`.

---

### **2. `pipe` using `reduce` for Iteration**

This version uses `reduce` to accumulate the result over the provided functions. It’s functionally equivalent to the previous example but gives us more flexibility with iterating over the list of functions.

```javascript
function pipe(...fns) {
  return (collection) =>
    reduce(fns, (prevResult, fn) => fn(prevResult), collection);
}
```

#### **Explanation:**
- Here, `reduce` is used to apply the functions one after the other. The result of each function becomes the input to the next.

---

### **3. Pipe that Accepts Multiple Functions and Runs Them Sequentially**

This version makes use of the `rest` operator to accept multiple functions and apply them to a value sequentially.

```javascript
const pipe = function (...fns) {
  return function (val) {
    for (let f of fns) {
      val = f(val);
    }
    return val;
  };
};
```

#### **Example:**

```javascript
const getSalary = (person) => person.salary;
const addBonus = (netSalary) => netSalary + 1000;
const deductTax = (grossSalary) => grossSalary - (grossSalary * .3);

const val = { salary: 10000 };

const result = pipe(
  getSalary,
  addBonus,
  deductTax
)({ salary: 10000 });

console.log(result); // Output: 7700
```

#### **Explanation:**
- The `pipe` function is passed multiple functions that process the data.
- `getSalary({ salary: 10000 })` returns `10000`.
- `addBonus(10000)` returns `11000`.
- `deductTax(11000)` returns `7700`.

---

### **4. Pipe with Nested Objects and Functions**

This version of `pipe` handles objects with nested functions, making it capable of applying functions to both direct properties and nested ones.

```javascript
const pipe = (obj) => {
  return function(...args) {
    for (let key in obj) {
      let val = obj[key];
      if (typeof val === 'function') {
        obj[key] = val(...args);
      } else {
        obj[key] = pipe(val)(...args);
      }
    }
    return obj;
  };
};
```

#### **Example:**
```javascript
let test = {
  a: {
    b: (a, b, c) => a + b + c,
    c: (a, b, c) => a + b - c,
  },
  d: (a, b, c) => a - b - c,
  e: 1,
  f: true
};

console.log(pipe(test)(1, 1, 1));
```

#### **Output:**
```javascript
{
  "a": {
    "b": 3,
    "c": 1
  },
  "d": -1,
  "e": 1,
  "f": true
}
```

#### **Explanation:**
- The function recursively applies the pipe to objects and their properties.
- It processes both function values (like `a.b` and `a.c`) and other properties (like `e` and `f`).
- `a.b(1, 1, 1)` gives `3`, `a.c(1, 1, 1)` gives `1`, and `d(1, 1, 1)` gives `-1`.

---

### **Key Takeaways:**

- **Basic Pipe**: Apply a series of functions to a value in sequence.
- **`reduce` with Pipe**: More flexibility in handling collections and iterating over the list of functions.
- **Sequential Function Application**: Passing multiple functions to be applied in sequence to a value.
- **Nested Object Support**: Handles objects with functions and recursive objects.

These implementations show how powerful and flexible function composition (like `pipe`) can be, allowing you to build complex logic by combining simple functions. Depending on the complexity of your data or the need for recursion, you can choose the right version of `pipe` to suit your use case.