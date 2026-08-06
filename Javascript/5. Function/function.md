You've provided a wide range of JavaScript programming tasks and concepts. Let's break down each one into a concise explanation with code snippets, where applicable.

### 1. **Function Returning Another Function**

```javascript
function higherOrderFunction() {
  function displayHello() {
    console.log("Hello");
  }
  return displayHello;
}

// driver code
var func = higherOrderFunction();
func(); // Hello
```
- **Explanation**: This is an example of a **higher-order function** that returns another function, which is executed after the initial function is called.

---

### 2. **Function Executing Another Function (Callback)**

```javascript
function callbackExecutor(callback) {
  if (typeof callback === "function") {
    callback();
  }
}

// driver code
function callbackFunc() {
  console.log("Callback function executed");
}

callbackExecutor(callbackFunc); // Callback function executed
```
- **Explanation**: Here, a function (`callbackExecutor`) accepts another function (`callbackFunc`) as an argument and executes it.

---

### 3. **Function Printing All Arguments Passed**

```javascript
function func() {
  for (let value of arguments) {
    console.log(value);
  }
}

// driver code
func(1, "Hello", true); // 1, Hello, true
```
- **Explanation**: The `arguments` object allows functions to access all arguments passed to it, even if no parameters are defined. In ES6+, you can use the `...args` syntax to achieve the same.

---

### 4. **Function Checking Argument Length**

```javascript
function func(a, b, c) {
  if (func.length === arguments.length) {
    console.log("Number of arguments passed match the expected arguments");
  } else {
    throw new Error("Number of arguments passed do not match the expected arguments");
  }
}

// driver code
func(1, 2, 3); // Number of arguments passed match the expected arguments
```
- **Explanation**: You can compare the `arguments.length` to the function's `length` property to ensure the correct number of arguments are passed.

---

### 5. **Function Handling Variable Number of Arguments**

```javascript
function varArgsFunc(...params) {
  params.forEach((value, index) => {
    console.log(index, ": ", value);
  });
}

// driver code
varArgsFunc("Hello", ",", "World", "!!!");
```
- **Explanation**: Using **rest parameters** (`...params`), this function can accept any number of arguments and log each one with its index.

---

### 6. **Common Ways to Create Functions**

```javascript
// Function Declaration (Hoisted)
function functionName(params) {
  // code block
}

// Function Expression (Not hoisted)
const functionName = function (params) {
  // code block
};

// Arrow Function Expression
const arrowFunctionName = (params) => {
  // code block
};
```
- **Explanation**: The most common ways to define functions in JavaScript are:
  - **Function declaration**: Hoisted, so you can call the function before it's defined.
  - **Function expression**: Assigned to variables; **not hoisted**.
  - **Arrow functions**: Concise syntax and does not have its own `this`.

---

### 7. **Different Forms of Arrow Functions**

```javascript
const noArgsFunc = () => "No args passed";

const singleArgFunc = (arg1) => "Argument is " + arg1;

const twoArgsFunc = (arg1, arg2) => arg1 + arg2;

const threeArgsFunc = (arg1, arg2, arg3) => {
  console.log("Sum is " + (arg1 + arg2 + arg3));
  return true;
};
```
- **Explanation**: Arrow functions can have a concise syntax, with or without parentheses for a single parameter, and optionally omit curly braces and `return` for single expressions.

---

### 8. **Visualizing Hoisting**

```javascript
num1 = 10;
printHello();

var num1;
function printHello() {
  console.log("Hello");
}

var nonHoistedFunc = function () {
  console.log("Hello");
};
```
- **Explanation**: In JavaScript, **function declarations are hoisted**, so you can call `printHello()` before it is declared. However, **function expressions** (like `nonHoistedFunc`) are not hoisted and must be defined first.

---

### 9. **Immediately Invoked Function Expression (IIFE)**

```javascript
(function IIFE() {
  console.log("I am an Immediately invoked function");
})();

// Using a unary plus to invoke the IIFE
+(function IIFE() {
  console.log("I am an Immediately invoked function");
})();
```
- **Explanation**: **IIFE** allows a function to be executed immediately after being defined, which helps avoid polluting the global scope.

---

### 10. **IIFE Receiving Arguments**

```javascript
(function IIFE(param1, param2) {
  console.log("Parameter 1: " + param1);
  console.log("Parameter 2: " + typeof param2);
  console.log("Parameter 2 output: " + param2());
})("hello", function () {
  return "I am a string from a function passed to IIFE";
});
```
- **Explanation**: **IIFE** can accept arguments, including functions, and execute them as part of its body.

---

### 11. **IIFE for Setting Variable Values**

```javascript
var randomNumber = (function () {
  return Math.floor(Math.random() * 100);
})();
console.log(randomNumber);
```
- **Explanation**: This pattern allows creating values immediately without polluting the global scope.

---

### 12. **Returning Multiple Values from a Function**

```javascript
function multipleValueReturnFunc() {
  const a = 5, b = 10;
  return [a, b]; // Returning as array
}

// Destructuring
const [x, y] = multipleValueReturnFunc();
```

```javascript
function multipleValueReturnFunc() {
  const a = "Java", b = "Script";
  return { a, b }; // Returning as object
}

const { a: x, b: y } = multipleValueReturnFunc();
```

```javascript
function* multipleValueReturnFunc() {
  const a = 5, b = 10;
  yield a;
  yield b;
}

const iterator = multipleValueReturnFunc();
const x = iterator.next().value;
const y = iterator.next().value;
```
- **Explanation**: Functions can return multiple values in an **array**, **object**, or by using **generators** (`yield`).

---

### 13. **Default Parameters in Functions**

```javascript
function defaultValueFunc(num = 10, num2 = 20, bool = false, sum = num + num2) {
  console.log(num, num2, bool, sum);
}

// driver code
defaultValueFunc(); // 10, 20, false, 30
defaultValueFunc(4, 8); // 4, 8, false, 12
```
- **Explanation**: Default parameter values can be set for any missing or `undefined` arguments passed to a function.

---

### 14. **Usage of `call`, `apply`, and `bind`**

```javascript
function displayThisValue(param1, param2) {
  console.log(this.value, param1, param2);
}

const obj = { value: 10 };
const valueArr = [20, 30];

// Using call
displayThisValue.call(obj, ...valueArr); // 10, 20, 30

// Using apply
displayThisValue.apply(obj, valueArr); // 10, 20, 30

// Using bind
setTimeout(displayThisValue.bind(obj), 1000, ...valueArr); // 10, 20, 30
```
- **Explanation**:
  - **`call`**: Invokes the function with a specified `this` context and arguments.
  - **`apply`**: Similar to `call`, but arguments are passed as an array.
  - **`bind`**: Returns a new function with a specific `this` context, without immediately invoking it.

---

### 15. **Function Used as a Constructor**

```javascript
function Employee(id) {
  this.id = id;
}

Employee.prototype.setSalary = function (salary) {
  this.salary = salary;
};

Employee.prototype.getSalary = function () {
  return this.salary;
};

// driver code
const emp = new Employee(1);
emp.setSalary(10000);
console.log(emp.getSalary()); // 10000
```
- **Explanation**: Constructor functions (`Employee`) are used to create new objects, and properties/methods are attached to the `prototype`.

---

### 16. **Factory Function**

```javascript
function factoryFunc(username, password, isActive = false, isAdmin = false) {
  return {
    username,
    password,
    isActive,
    isAdmin,
    created: new Date(),
  };
}

// driver code
const user = factoryFunc("admin", "password");
```
- **Explanation**: Factory functions create and return objects without needing the `new` keyword.

---

### 17. **Prototypal Inheritance**

```javascript
function parent(name) {
  this.name = name;
}

parent.prototype.getName = function () {
  return this.name;
};

function child(name) {
  parent.call(this, name);
}

child.prototype = Object.create(parent.prototype);
child.prototype.getMyName = function () {
  return this.name;
};

// driver code
const fk = new

 child("FK");
console.log(fk.getName()); // FK
```
- **Explanation**: This shows how **prototypal inheritance** works in JavaScript using the `prototype` chain.

---

### 18. **Currying vs. Partial Application**

```javascript
// Currying
function multiply(num1) {
  return function (num2) {
    return function (num3) {
      return num1 * num2 * num3;
    };
  };
}

// Partial Application
function multiply(num1) {
  return function (num2, num3) {
    return num1 * num2 * num3;
  };
}
```
- **Explanation**:
  - **Currying** involves a series of functions each taking a single argument.
  - **Partial application** involves a function returning another function that can take multiple arguments.

---

### 19. **Mixin Example**

```javascript
function mixin(sourceObj, targetObj) {
  return Object.assign(targetObj, sourceObj);
}

// driver code
const obj1 = { task1() { console.log("Task1"); } };
const obj2 = { task2() { console.log("Task2"); } };
let mixinObj = mixin(obj1, {});
mixinObj = mixin(obj2, mixinObj);
mixinObj.task1(); // Task1
mixinObj.task2(); // Task2
```
- **Explanation**: A **mixin** allows copying properties or methods from one object to another.

---

### 20. **Proxy for Functions**

```javascript
const proxy = new Proxy(
  function () { console.log(arguments); },
  {
    apply(target, context, args) {
      console.log("Proxy apply invoked on target with arguments:", args);
      return target.apply(context, args);
    }
  }
);

proxy(1, 2, 3); // Proxy apply invoked on target with arguments: [1, 2, 3]
```
- **Explanation**: **Proxy** allows you to intercept function calls and manipulate their behavior using traps.

---

Let me know if you need further clarifications!


It looks like you're asking about common JavaScript **function terminology** often asked in interviews.

# 1. Function Declaration

A function definition that creates a named function.

```javascript
function add(a, b) {
  return a + b;
}
```

Here:

```javascript
function add(a, b)
```

is the **function declaration**.

***

# 2. Function Invocation (Function Call)

Executing a function.

```javascript
add(10, 20);
```

This is called:

```text
Function Invocation
Function Call
```

***

# 3. Parameters

Variables listed in the function definition.

```javascript
function add(a, b) {
  return a + b;
}
```

Parameters are:

```javascript
a
b
```

Parameters receive values when the function is called. Type definitions are often applied to function parameters in TypeScript projects. [\[Mitali Mul...282_1-71-1 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/Mitali%20Mulgaonkar_PSL201282_1-71-1.pdf?web=1), [\[AI_Intevie...r_00003224 \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Mitali%20Mulgaonkar_00003224.pdf?web=1)

***

# 4. Arguments

Actual values passed during invocation.

```javascript
add(10, 20);
```

Arguments are:

```javascript
10
20
```

### Parameter vs Argument

```javascript
function greet(name) {
           // parameter
}

greet("Sudhir");
//    argument
```

***

# 5. Return Statement

Used to send a value back from a function.

```javascript
function add(a, b) {
  return a + b;
}
```

```javascript
const result =
  add(10, 20);
```

Output:

```javascript
30
```

***

# 6. Expression

Anything that produces a value.

### Examples

```javascript
10 + 20
```

```javascript
true && false
```

```javascript
add(1, 2)
```

All are expressions because they evaluate to a value.

***

# 7. Function Expression

A function assigned to a variable.

```javascript
const add = function(a, b) {
  return a + b;
};
```

Difference:

### Function Declaration

```javascript
function add() {}
```

### Function Expression

```javascript
const add =
  function() {};
```

***

# 8. Arrow Function Expression

```javascript
const add =
  (a, b) => a + b;
```

Equivalent to:

```javascript
function add(a, b) {
  return a + b;
}
```

Arrow functions are a common JavaScript interview topic. [\[UI_Intervi..._Questions \| Word\]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# Complete Example

```javascript
function add(a, b) {

  return a + b;

}

const result =
  add(10, 20);

console.log(result);
```

### Breakdown

```javascript
function add(a, b)
```

→ Function Declaration

```javascript
a, b
```

→ Parameters

```javascript
add(10,20)
```

→ Function Invocation

```javascript
10,20
```

→ Arguments

```javascript
return a + b
```

→ Return Statement

```javascript
a + b
```

→ Expression

***

# Interview Quick Answer

```javascript
function multiply(a, b) {
  return a * b;
}

multiply(5, 10);
```

| Term                 | Example                    |
| -------------------- | -------------------------- |
| Function Declaration | `function multiply(a,b){}` |
| Parameters           | `a`, `b`                   |
| Arguments            | `5`, `10`                  |
| Invocation           | `multiply(5,10)`           |
| Return Value         | `50`                       |
| Expression           | `a * b`                    |

### Senior Interview One-Liner

> Parameters are variables declared in a function definition, arguments are the actual values passed during invocation, an invocation is the act of calling a function, a return statement sends a value back to the caller, and an expression is any piece of code that evaluates to a value.


These are the **4 common ways to create functions in JavaScript**, and they are frequently asked in JavaScript/React interviews. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1)

# 1. Function Declaration

A named function declared using the `function` keyword.

```javascript
function greet(name) {
  return `Hello ${name}`;
}

console.log(greet("Sudhir"));
```

Output:

```text
Hello Sudhir
```

### Characteristics

✅ Hoisted

```javascript
sayHello();

function sayHello() {
  console.log("Hello");
}
```

Works because function declarations are hoisted.

### Interview Question

**Can function declarations be called before they are defined?**

✅ Yes, due to hoisting.

***

# 2. Function Expression

A function assigned to a variable.

```javascript
const greet = function(name) {
  return `Hello ${name}`;
};

console.log(greet("Sudhir"));
```

### Characteristics

❌ Not fully hoisted

```javascript
greet();

const greet = function() {
  console.log("Hello");
};
```

Output:

```text
ReferenceError
```

***

# Named Function Expression

```javascript
const greet = function sayHello(name) {
  return `Hello ${name}`;
};
```

Useful for:

```text
Debugging
Recursion
```

***

# 3. Arrow Functions (ES6)

Shorter syntax.

```javascript
const add = (a, b) => {
  return a + b;
};
```

Short form:

```javascript
const add = (a, b) => a + b;
```

### Example

```javascript
const square =
  num => num * num;

console.log(square(5));
```

Output:

```text
25
```

### Key Differences

Arrow functions:

❌ No own `this`

❌ No `arguments`

❌ Cannot be constructors

***

### React Example

```jsx
const Button = () => {
  return (
    <button>
      Click
    </button>
  );
};
```

Very common in React.

***

# 4. Function Constructor

Rarely used in modern applications.

```javascript
const add =
  new Function(
    "a",
    "b",
    "return a + b"
  );

console.log(
  add(10, 20)
);
```

Output:

```text
30
```

### Equivalent To

```javascript
function add(a, b) {
  return a + b;
}
```

***

### Why Is It Rare?

Problems:

```text
Slower Performance

Harder To Read

Security Risks

Code Generated At Runtime
```

Most teams avoid it.

***

# Comparison Table

| Feature         | Function Declaration | Function Expression | Arrow Function        | Function Constructor |
| --------------- | -------------------- | ------------------- | --------------------- | -------------------- |
| Hoisted         | ✅                    | ❌                   | ❌                     | ❌                    |
| Has Name        | ✅                    | Optional            | Usually Variable Name | ❌                    |
| Has own `this`  | ✅                    | ✅                   | ❌                     | ✅                    |
| Constructor     | ✅                    | ✅                   | ❌                     | ✅                    |
| Common in React | ⚠️                   | ✅                   | ✅✅                    | ❌                    |

***

# Most Asked Interview Questions

### Q1: Function Declaration vs Function Expression?

```javascript
function fn() {}
```

vs

```javascript
const fn = function() {};
```

Difference:

```text
Declaration → Hoisted

Expression → Not Hoisted
```

***

### Q2: Arrow Function vs Normal Function?

Arrow functions:

```text
No own this
No arguments object
Cannot use new
```

***

### Q3: Can Arrow Functions Be Constructors?

```javascript
const Person =
  (name) => {
    this.name = name;
  };

new Person("Sudhir");
```

❌ Error

Arrow functions cannot be used with `new`.

***

### Q4: Which Function Type Is Most Used in React?

```text
Arrow Functions ✅
Function Components ✅
```

Example:

```jsx
const UserCard = () => {
  return <div>User</div>;
};
```

# Senior Interview Answer

> JavaScript supports Function Declarations, Function Expressions, Arrow Functions, and Function Constructors. Function Declarations are hoisted, Function Expressions are assigned to variables, Arrow Functions provide concise syntax and lexical `this`, while Function Constructors create functions dynamically at runtime but are rarely used due to performance and maintainability concerns. In modern React applications, Arrow Functions and Function Components are the most commonly used patterns. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1)


# Function Declaration vs Function Expression

This is one of the most commonly asked JavaScript interview questions.

***

# 1. Syntax Difference

## Function Declaration

```javascript
function add(a, b) {
  return a + b;
}
```

### Characteristics

✅ Named function

✅ Hoisted completely

✅ Can be called before definition

***

## Function Expression

```javascript
const add = function(a, b) {
  return a + b;
};
```

### Characteristics

✅ Assigned to variable

✅ Not fully hoisted

✅ Executed after assignment

***

# 2. Hoisting Difference (Most Asked)

## Function Declaration

```javascript
sayHello();

function sayHello() {
  console.log("Hello");
}
```

Output:

```text
Hello
```

Reason:

```text
Entire function is hoisted
```

***

## Function Expression

```javascript
sayHello();

const sayHello =
  function() {
    console.log("Hello");
  };
```

Output:

```text
ReferenceError
```

Reason:

```text
Variable exists

Function assignment doesn't
```

***

# 3. Readability

## Declaration

```javascript
function calculateTax() {
}
```

Easy to identify.

Good for:

```text
Utility functions

Reusable functions

Helper methods
```

***

## Expression

```javascript
const calculateTax =
  function() {
  };
```

Often used when:

```text
Functions passed around

Callbacks

Higher-order functions
```

***

# 4. Conditional Functions

Function declarations can behave unexpectedly inside conditions.

### Avoid

```javascript
if (true) {

  function test() {
  }

}
```

***

### Preferred

```javascript
const test =
  function() {
  };

if (condition) {

  test();

}
```

***

# 5. React Example

Most React code uses expressions.

```jsx
const UserCard = () => {

  return (
    <div>
      User
    </div>
  );

};
```

Instead of:

```jsx
function UserCard() {

  return (
    <div>
      User
    </div>
  );

}
```

Both work.

Many teams prefer:

```text
Arrow Function Expressions
```

for consistency.

***

# Declaration vs Expression Summary

| Feature                    | Function Declaration | Function Expression |
| -------------------------- | -------------------- | ------------------- |
| Hoisted                    | ✅ Yes                | ❌ No                |
| Can Call Before Definition | ✅ Yes                | ❌ No                |
| Assigned to Variable       | ❌ No                 | ✅ Yes               |
| Good for Utilities         | ✅                    | ✅                   |
| Common in React            | ⚠️                   | ✅                   |

***

# Function Constructors

## What Is a Function Constructor?

JavaScript allows creating functions dynamically.

```javascript
const add =
  new Function(
    "a",
    "b",
    "return a + b"
  );

console.log(
  add(10, 20)
);
```

Output:

```text
30
```

***

# Equivalent Normal Function

```javascript
function add(a, b) {
  return a + b;
}
```

***

# Pros of Function Constructors

## 1. Dynamic Function Creation

Useful when:

```text
Function logic known only at runtime
```

Example:

```javascript
const operation =
  "a * b";

const multiply =
  new Function(
    "a",
    "b",
    `return ${operation}`
  );
```

Output:

```javascript
multiply(2,3)
```

```text
6
```

***

## 2. Runtime Code Generation

Used by:

```text
Template Engines

Expression Evaluators

Code Generators
```

***

## 3. Flexible Configuration

Example:

```javascript
const formula =
  "salary * 0.10";

const calculateBonus =
  new Function(
    "salary",
    `return ${formula}`
  );
```

***

# Cons of Function Constructors (Very Important)

## 1. Performance Problem

Every call:

```text
Parse

Compile

Generate Function
```

at runtime.

Slower than:

```javascript
function add() {}
```

***

## 2. Security Risk

Huge interview point.

Example:

```javascript
const userInput =
  "alert('Hacked')";

new Function(userInput);
```

Danger:

```text
Code Injection
```

Similar risk to:

```javascript
eval()
```

***

## 3. Harder Debugging

```javascript
new Function(...)
```

creates anonymous runtime code.

Stack traces are harder to understand.

***

## 4. No Closure Access

Normal Function:

```javascript
const tax = 18;

function calc(price) {

  return price * tax;

}
```

Works.

***

Function Constructor:

```javascript
const tax = 18;

const calc =
  new Function(
    "price",
    "return price * tax"
  );
```

Output:

```text
ReferenceError
```

Reason:

```text
Function Constructor
does not capture local scope.
```

***

## 5. Not Recommended

Modern applications prefer:

```text
Function Declaration

Function Expression

Arrow Functions
```

***

# Interview Questions

### Why are Function Declarations hoisted?

Because JavaScript loads the entire function definition into memory during the creation phase.

***

### Why use Function Expressions?

Because they provide better control over execution order and are useful for callbacks and React components.

***

### Is Function Constructor Similar to eval()?

✅ Yes, in spirit.

Both:

```text
Generate executable code dynamically.
```

Both should generally be avoided.

***

### When Would You Use Function Constructor?

Only in specialised scenarios:

```text
Rule Engines

Formula Builders

Template Compilers

Dynamic Expression Parsers
```

Never for normal application code.

***

# Senior Interview Answer

> Function declarations are fully hoisted and can be invoked before their definition, while function expressions are assigned to variables and become available only after assignment. Function expressions are commonly used in React applications and callbacks because they offer better control and composability. Function constructors allow dynamic creation of functions at runtime but introduce performance overhead, debugging complexity, security risks similar to `eval`, and lack access to lexical scope. Therefore, function constructors are rarely used in modern production applications except for specialised runtime expression generation scenarios.


# Arrow Functions vs Function Expressions

This is a very common JavaScript interview question.

## 1. Syntax

### Function Expression

```javascript
const add = function(a, b) {
  return a + b;
};
```

### Arrow Function

```javascript
const add = (a, b) => {
  return a + b;
};
```

Short form:

```javascript
const add = (a, b) => a + b;
```

***

# 2. `this` Binding (Most Important Difference)

## Function Expression

Has its **own `this`**.

```javascript
const person = {

  name: "Sudhir",

  greet: function() {

    console.log(this.name);

  }

};

person.greet();
```

Output:

```text
Sudhir
```

***

## Arrow Function

Does **not** have its own `this`.

It inherits `this` from the surrounding scope.

```javascript
const person = {

  name: "Sudhir",

  greet: () => {

    console.log(this.name);

  }

};

person.greet();
```

Output:

```text
undefined
```

### Interview Answer

```text
Normal Function → Dynamic this

Arrow Function → Lexical this
```

Arrow functions are frequently discussed as a distinct JavaScript function type in front-end interview question sets. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1)

***

# 3. arguments Object

## Function Expression

Supports `arguments`.

```javascript
const sum = function() {

  console.log(arguments);

};

sum(1, 2, 3);
```

Output:

```text
[1, 2, 3]
```

***

## Arrow Function

No `arguments` object.

```javascript
const sum = () => {

  console.log(arguments);

};
```

Output:

```text
ReferenceError
```

Use rest parameters instead:

```javascript
const sum = (...args) => {

  console.log(args);

};
```

***

# 4. Constructor Support

## Function Expression

Can be used with `new`.

```javascript
const Person = function(name) {

  this.name = name;

};

const p =
  new Person("Sudhir");

console.log(p.name);
```

Output:

```text
Sudhir
```

***

## Arrow Function

Cannot be used as constructor.

```javascript
const Person = (name) => {

  this.name = name;

};

new Person("Sudhir");
```

Output:

```text
TypeError
```

***

# 5. Hoisting

Both are assigned to variables:

```javascript
const fn = ...
```

Therefore neither can be used before initialization.

```javascript
sayHello();

const sayHello =
  () => {};
```

Output:

```text
ReferenceError
```

***

# 6. Implicit Return

## Function Expression

```javascript
const square =
  function(num) {

    return num * num;

  };
```

***

## Arrow Function

```javascript
const square =
  num => num * num;
```

Shorter and cleaner.

***

# 7. React Usage

### Function Expression

```jsx
const UserCard = function() {

  return <div>User</div>;

};
```

***

### Arrow Function

```jsx
const UserCard = () => {

  return <div>User</div>;

};
```

Arrow functions are more commonly used in modern React projects because of their concise syntax and lexical `this`.

***

# Comparison Table

| Feature             | Function Expression | Arrow Function |
| ------------------- | ------------------- | -------------- |
| Syntax              | Longer              | Shorter        |
| Own `this`          | ✅ Yes               | ❌ No           |
| Own `arguments`     | ✅ Yes               | ❌ No           |
| Constructor Support | ✅ Yes               | ❌ No           |
| Implicit Return     | ❌ No                | ✅ Yes          |
| React Usage         | ✅                   | ✅✅ Common      |
| Lexical `this`      | ❌ No                | ✅ Yes          |

***

# When to Use Function Expressions

✅ Object methods

```javascript
const user = {
  login: function() {}
};
```

✅ Constructors

```javascript
function Person() {}
```

✅ When you need `arguments`

***

# When to Use Arrow Functions

✅ Array methods

```javascript
arr.map(item => item.id);
```

✅ React components

```jsx
const Dashboard = () => {};
```

✅ Callbacks

```javascript
setTimeout(() => {
  console.log("Hello");
}, 1000);
```

✅ When you want lexical `this`

***

# Interview Question

### Why do React developers prefer arrow functions?

**Answer:**

```text
Shorter syntax

Lexical this

Cleaner callbacks

Better readability
```

***

# Senior Interview Answer

> The biggest difference is that function expressions have their own `this`, `arguments`, and can be used as constructors, whereas arrow functions do not. Arrow functions inherit `this` from the surrounding scope (lexical `this`), support concise syntax with implicit returns, and are commonly used in React components, callbacks, and array operations. Function expressions are preferred when constructor behaviour, dynamic `this`, or the `arguments` object is required. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1)
