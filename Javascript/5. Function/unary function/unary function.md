Unary functions are a fundamental concept in programming where a function accepts exactly one argument. They are commonly used for simplifying operations and making code more readable. Here's a breakdown of the provided example:

### **Example of a Unary Function**

```javascript
const unaryFunction = (a) => console.log(a + 10); 
```

### **Explanation**

1. **Input**:
   - The function takes a single parameter `a`.

2. **Processing**:
   - It adds `10` to the value of `a`.

3. **Output**:
   - The result is printed to the console.

4. **Example Usage**:
   ```javascript
   unaryFunction(5); // Output: 15
   unaryFunction(20); // Output: 30
   ```

---

### **Why Unary Functions Are Useful**

1. **Functional Programming**:
   Unary functions simplify transformations in functional programming, where operations like `map`, `filter`, and `reduce` often rely on single-argument functions.

2. **Partial Application**:
   Unary functions can be easily used with partial application or currying.

3. **Higher-Order Functions**:
   Many higher-order functions, such as those that accept callbacks, prefer unary functions for simplicity.

---

### **Using Unary Functions with Arrays**

A unary function is particularly useful with methods like `map`.

```javascript
const numbers = [1, 2, 3, 4];
const addTen = (a) => a + 10;

const updatedNumbers = numbers.map(addTen); 
console.log(updatedNumbers); // Output: [11, 12, 13, 14]
```

### **Conclusion**

Unary functions are a simple yet powerful concept in JavaScript, widely used in both functional and procedural paradigms. Their concise nature makes them ideal for operations where only a single input is required.


# Unary Function in JavaScript

A **Unary Function** is a function that accepts **exactly one argument**.

```text
Unary Function = 1 Parameter
Binary Function = 2 Parameters
Ternary Function = 3 Parameters
```

Unary functions are a common topic alongside higher-order functions, callbacks, closures, and functional programming in JavaScript interviews. [\[UI_Intervi..._Questions \| Word\]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# Basic Example

```javascript
function square(num) {
  return num * num;
}

console.log(square(5));
```

Output:

```text
25
```

Here:

```javascript
square(num)
```

takes only one parameter.

✅ Unary Function

***

# Arrow Function Example

```javascript
const double =
  num => num * 2;

console.log(double(10));
```

Output:

```text
20
```

***

# Unary vs Binary vs Ternary

## Unary

```javascript
const square =
  n => n * n;
```

Accepts:

```text
1 argument
```

***

## Binary

```javascript
const add =
  (a, b) => a + b;
```

Accepts:

```text
2 arguments
```

***

## Ternary

```javascript
const total =
  (a, b, c) =>
    a + b + c;
```

Accepts:

```text
3 arguments
```

***

# Why Unary Functions Matter?

They are heavily used in:

```text
✅ Functional Programming
✅ map()
✅ filter()
✅ reduce()
✅ Currying
✅ React Event Handling
```

***

# Real JavaScript Examples

## map()

```javascript
const numbers =
  [1,2,3,4];

const squared =
  numbers.map(
    num => num * num
  );
```

Callback:

```javascript
num => num * num
```

is a unary function.

***

## filter()

```javascript
const numbers =
  [1,2,3,4];

const even =
  numbers.filter(
    num => num % 2 === 0
  );
```

Unary function:

```javascript
num => num % 2 === 0
```

***

# Currying Example

```javascript
const multiply =
  x =>
    y =>
      x * y;
```

Each function:

```javascript
x => ...
```

is unary.

```javascript
y => ...
```

is unary.

Usage:

```javascript
multiply(2)(5);
```

Output:

```text
10
```

***

# React Example

## Event Handler

```jsx
function App() {

  const handleSelect =
    id => {

      console.log(id);

    };

  return (
    <button
      onClick={() =>
        handleSelect(101)
      }
    >
      Select
    </button>
  );
}
```

Unary function:

```javascript
id => { ... }
```

Receives one argument.

***

# Interview Questions

### What is a Unary Function?

A function that accepts exactly one argument.

```javascript
const square =
  x => x * x;
```

***

### Difference Between Unary Function and Unary Operator?

### Unary Function

```javascript
const square =
  x => x * x;
```

Receives:

```text
One Parameter
```

***

### Unary Operator

```javascript
const num = -"10";
```

Acts on:

```text
One Operand
```

***

### Why Are Unary Functions Important?

Because they are widely used in:

```text
map()
filter()
currying
function composition
functional programming
React callbacks
```

***

# Senior React Interview Answer

> A unary function is a function that accepts exactly one argument. Unary functions are fundamental to functional programming and are commonly used with array methods such as `map`, `filter`, and `reduce`, as well as in currying and function composition patterns. For example, `const square = x => x * x` is a unary function because it receives only one input. In React, unary functions frequently appear in callbacks, event handlers, selectors, and utility functions. [\[UI_Intervi..._Questions \| Word\]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)
