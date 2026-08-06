### **Arrow Functions vs Normal Functions in JavaScript**
Arrow functions and normal functions (also known as traditional functions) are two ways to define functions in JavaScript. While both have similarities, they differ in several important aspects, including syntax, behavior of this, and other features.

Here is a comparison between arrow functions and normal functions in table format (Markdown):


| **Feature**              | **Arrow Function**                               | **Normal Function**                                     |
|--------------------------|--------------------------------------------------|---------------------------------------------------------|
| **Syntax**               | `const myFunction = (a, b) => a + b;`            | `function myFunction(a, b) { return a + b; }`           |
| **`this` Binding**       | Lexical `this` (inherited from the outer context) | Dynamic `this` (depends on how the function is called)   |
| **Constructor**          | Cannot be used as a constructor (throws error)   | Can be used as a constructor with `new` keyword         |
| **`arguments` Object**   | Does not have its own `arguments` object         | Has its own `arguments` object                           |
| **Method Definitions**   | Cannot be used as object methods (in some cases) | Can be used as object methods                            |
| **Return Behavior**      | Implicit return for single expressions          | Requires explicit `return` statement for returning a value |
| **Hoisting**             | Not hoisted (must be defined before use)         | Hoisted (can be used before its definition)              |
| **Usage in Callbacks**   | Ideal for anonymous functions and callbacks      | Can be used in callbacks, but often requires more code  |
| **Readable and Concise** | More concise, especially for single expressions  | More verbose, requires curly braces and return keyword   |

**Detailed Comparison:**
**1. Syntax**
Arrow Functions:
Arrow functions provide a shorter syntax compared to normal functions, especially when used for simple expressions.
Example:
```javascript
const add = (a, b) => a + b;
```

Normal Functions:
Normal functions require the function keyword and curly braces for the body if the function has multiple statements.
Example:
```javascript
function add(a, b) {
  return a + b;
}
```
**2. this Binding**
`Arrow Functions:`

Arrow functions do not have their own this. Instead, they inherit this from the surrounding context (lexical scoping).
Example:
```javascript
const obj = {
  value: 5,
  arrowFunc: () => {
    console.log(this.value); // `this` refers to the outer scope, not `obj`
  }
};
obj.arrowFunc(); // `this` refers to the global context, not `obj`
```
`Normal Functions:`

Normal functions have their own this, which is dynamically set depending on how the function is called.
Example:
```javascript
const obj = {
  value: 5,
  normalFunc: function() {
    console.log(this.value); // `this` refers to `obj`
  }
};
obj.normalFunc(); // `this` refers to `obj`
```
**3. Constructor Behavior**
`Arrow Functions:`

Arrow functions cannot be used as constructors. Attempting to use them with new will throw an error.
Example:
```javascript
const Person = (name) => {
  this.name = name;
};
const john = new Person('John'); // Error: Person is not a constructor
```
`Normal Functions:`

Normal functions can be used as constructors, allowing the creation of new objects using the new keyword.
```javascript
Copy code
function Person(name) {
  this.name = name;
}
const john = new Person('John'); // Works fine
```

**4. arguments Object**
`Arrow Functions:`

Arrow functions do not have their own arguments object. If you need to access arguments in an arrow function, you must rely on the rest parameter (...args).
Example:
```javascript
const func = () => {
  console.log(arguments); // Error: arguments is not defined
};
```
`Normal Functions`:

Normal functions have their own arguments object, which contains an array-like collection of all arguments passed to the function.
Example:
```javascript
function func() {
  console.log(arguments); // [1, 2, 3]
}
func(1, 2, 3);
```

**5. Return Behavior**
`Arrow Functions:`

Arrow functions have implicit return for single expressions, meaning you don't need to use the return keyword for a one-liner.
Example:
```javascript
const multiply = (a, b) => a * b; // Implicit return
```
`Normal Functions:`

Normal functions require an explicit return statement if you want to return a value.
Example:
```javascript
function multiply(a, b) {
  return a * b; // Explicit return
}
```
**6. Hoisting**
`Arrow Functions:`

Arrow functions are not hoisted, meaning they must be defined before they are called.
Example:
```javascript
console.log(add(2, 3)); // Error: add is not a function
const add = (a, b) => a + b;
```
`Normal Functions:`

Normal functions are hoisted, meaning they can be called before their definition in the code.
Example:
```javascript
console.log(add(2, 3)); // Works fine
function add(a, b) {
  return a + b;
}
```
**7. Method Definitions in Objects**
`Arrow Functions:`

Arrow functions are not ideal for object methods. This is because they inherit this from the outer context, which can lead to unexpected behavior when trying to access object properties inside the method.
Example:
```javascript
const obj = {
  value: 10,
  method: () => {
    console.log(this.value); // `this` refers to the global object, not `obj`
  }
};
obj.method(); // `this` is not bound to `obj`
```
**Normal Functions:**

Normal functions are ideal for object methods, as this is bound to the object when the method is invoked.
Example:
```javascript
const obj = {
  value: 10,
  method: function() {
    console.log(this.value); // `this` refers to `obj`
  }
};
obj.method(); // 10
```

| **Aspect**              | **Arrow Function**                               | **Normal Function**                                     |
|-------------------------|--------------------------------------------------|---------------------------------------------------------|
| **Syntax**              | Concise (e.g., `() => {}`)                      | More verbose (e.g., `function() {}`)                    |
| **`this` Binding**      | Lexical `this` (inherits from outer scope)       | Dynamic `this` (depends on how the function is called)  |
| **Constructor**         | Cannot be used as a constructor                  | Can be used as a constructor                            |
| **`arguments` Object**  | No own `arguments` object                        | Has its own `arguments` object                          |
| **Method Definitions**  | Not ideal for methods in objects                 | Ideal for methods in objects                            |
| **Return Behavior**     | Implicit return for single expressions          | Requires explicit `return`                              |
| **Hoisting**            | Not hoisted                                      | Hoisted                                                 |



`super`, `new`, and `new.target` are important **ES6 OOP concepts** and are frequently asked in JavaScript/React interviews along with classes and inheritance. The internal training material also notes that **`super` should be used in subclasses** and discusses ES6 class inheritance. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/RBT-Javascript-Training-19th-21stApril/Shared%20Documents/General/Daywise%20session%20demo/Day2.zip?web=1)

# 1. `new` Keyword

The `new` keyword creates an object from a constructor function or class.

```javascript
class Employee {
  constructor(name) {
    this.name = name;
  }
}

const emp = new Employee("Sudhir");

console.log(emp.name);
```

Output:

```text
Sudhir
```

### What `new` Does Internally

```javascript
const user = new User();
```

JavaScript performs:

```text
1. Creates empty object {}
2. Sets prototype
3. Binds this to object
4. Executes constructor
5. Returns object
```

***

# 2. `super`

`super` is used in inheritance.

It refers to:

```text
Parent Class Constructor
Parent Class Methods
```

***

## Calling Parent Constructor

```javascript
class Person {

  constructor(name) {
    this.name = name;
  }
}

class Employee extends Person {

  constructor(name, role) {

    super(name);

    this.role = role;
  }
}

const emp =
  new Employee(
    "Sudhir",
    "Project Lead"
  );

console.log(emp);
```

Output:

```javascript
{
  name: "Sudhir",
  role: "Project Lead"
}
```

***

## Why `super()`?

Without it:

```javascript
class Employee extends Person {

  constructor(name) {

    this.name = name;
  }
}
```

Error:

```text
Must call super constructor
before accessing 'this'
```

***

## Calling Parent Method

```javascript
class Person {

  greet() {
    return "Hello";
  }
}

class Employee extends Person {

  greet() {

    return (
      super.greet() +
      " Sudhir"
    );
  }
}

const emp =
  new Employee();

console.log(
  emp.greet()
);
```

Output:

```text
Hello Sudhir
```

***

# 3. `new.target`

One of the most asked senior JavaScript interview questions.

`new.target` tells you:

```text
Which constructor
was called with new
```

***

## Example

```javascript
function Person() {

  console.log(
    new.target
  );
}

new Person();
```

Output:

```text
[Function: Person]
```

***

## Called Without `new`

```javascript
function Person() {

  console.log(
    new.target
  );
}

Person();
```

Output:

```text
undefined
```

***

# Enforce Object Creation

```javascript
function User(name) {

  if (!new.target) {

    throw new Error(
      "Use new keyword"
    );
  }

  this.name = name;
}
```

***

### Correct

```javascript
new User("Sudhir");
```

Output:

```text
Success
```

***

### Incorrect

```javascript
User("Sudhir");
```

Output:

```text
Error: Use new keyword
```

***

# `new.target` with Inheritance

```javascript
class Person {

  constructor() {

    console.log(
      new.target.name
    );
  }
}

class Employee
  extends Person {}

new Employee();
```

Output:

```text
Employee
```

Even though the parent constructor runs.

Reason:

```text
new.target refers
to the actual class
being instantiated
```

***

# Real Interview Example

### Abstract Class Simulation

JavaScript doesn't have true abstract classes.

Use:

```javascript
class Shape {

  constructor() {

    if (
      new.target === Shape
    ) {

      throw new Error(
        "Cannot instantiate Shape"
      );
    }
  }
}

class Circle
  extends Shape {}

new Circle(); // ✅

new Shape();  // ❌
```

***

# React Connection

In modern React:

```jsx
function App() {}
```

you usually don't use:

```text
new
super
new.target
```

because React primarily uses:

```text
Functional Components
Hooks
```

But these concepts are still important for:

```text
JavaScript Interviews
Class Components
Inheritance
OOP Design
```

***

# Interview Comparison

| Concept          | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `new`            | Create object instance                         |
| `super()`        | Call parent constructor                        |
| `super.method()` | Call parent method                             |
| `new.target`     | Detect constructor actually invoked with `new` |

***

# Senior Interview Answer

```javascript
class Employee extends Person {

  constructor(name) {

    super(name);
  }
}
```

* `new` creates an object instance and binds `this`.
* `super()` invokes the parent constructor and must be called before using `this` in derived classes.
* `super.method()` allows access to parent methods.
* `new.target` returns the constructor that was directly instantiated and is commonly used to enforce constructor invocation rules or simulate abstract classes.


Arrow functions are a very common React interview topic, especially when discussing `this`, event handlers, and array methods. They are also explicitly referenced in the JavaScript and React interview preparation material found in your environment.

# Arrow Function vs Normal Function in React

## 1. Syntax

### Normal Function

```javascript
function add(a, b) {
  return a + b;
}
```

### Arrow Function

```javascript
const add = (a, b) => {
  return a + b;
};
```

### Short Form

```javascript
const add = (a, b) => a + b;
```

***

# 2. `this` Binding (Most Important Difference)

## Normal Function

Normal functions create their own `this`.

```javascript
const user = {
  name: "Sudhir",

  greet: function () {
    console.log(this.name);
  }
};

user.greet();
```

Output:

```text
Sudhir
```

***

## Arrow Function

Arrow functions do **not** create their own `this`.

They inherit `this` from their surrounding scope.

```javascript
const user = {
  name: "Sudhir",

  greet: () => {
    console.log(this.name);
  }
};

user.greet();
```

Output:

```text
undefined
```

***

# 3. React Class Components

Before arrow functions, React developers often used `bind(this)`. React training materials in your environment discuss class components and component methods.

### Normal Function

```jsx
class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick =
      this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this);
  }

  render() {
    return (
      <button
        onClick={this.handleClick}
      >
        Click
      </button>
    );
  }
}
```

***

### Arrow Function

```jsx
class App extends React.Component {

  handleClick = () => {
    console.log(this);
  };

  render() {
    return (
      <button
        onClick={this.handleClick}
      >
        Click
      </button>
    );
  }
}
```

Benefit:

```text
✅ No bind(this)
✅ Cleaner code
✅ Lexical this
```

***

# 4. Constructor Support

### Normal Function

```javascript
function Person(name) {
  this.name = name;
}

const p =
  new Person("Sudhir");
```

Works ✅

***

### Arrow Function

```javascript
const Person = (name) => {
  this.name = name;
};

new Person("Sudhir");
```

Error ❌

```text
TypeError: Person is not a constructor
```

***

# 5. Arguments Object

### Normal Function

```javascript
function test() {
  console.log(arguments);
}

test(1, 2, 3);
```

Output:

```text
[1,2,3]
```

***

### Arrow Function

```javascript
const test = () => {
  console.log(arguments);
};
```

Error ❌

Use rest operator:

```javascript
const test = (...args) => {
  console.log(args);
};
```

***

# 6. Arrow Functions in Array Methods

React applications heavily use array methods such as `map()` and `filter()` for rendering data and transforming state.

## `map()`

```javascript
const nums =
  [1, 2, 3];

const doubled =
  nums.map(
    num => num * 2
  );

console.log(doubled);
```

Output:

```javascript
[2,4,6]
```

***

## React List Rendering

```jsx
const users = [
  "Sudhir",
  "John",
  "Apoorva"
];

function Users() {

  return (
    <ul>
      {users.map(user => (
        <li key={user}>
          {user}
        </li>
      ))}
    </ul>
  );
}
```

***

## `filter()`

```javascript
const numbers =
  [1,2,3,4,5];

const even =
  numbers.filter(
    num => num % 2 === 0
  );

console.log(even);
```

Output:

```javascript
[2,4]
```

***

## `reduce()`

```javascript
const nums =
  [1,2,3,4];

const sum =
  nums.reduce(
    (acc, curr) =>
      acc + curr,
    0
  );

console.log(sum);
```

Output:

```text
10
```

***

# Interview Comparison Table

| Feature                       | Arrow Function | Normal Function |
| ----------------------------- | -------------- | --------------- |
| Short Syntax                  | ✅              | ❌               |
| Own `this`                    | ❌              | ✅               |
| Needs `bind(this)`            | ❌              | ✅               |
| Constructor (`new`)           | ❌              | ✅               |
| `arguments` Object            | ❌              | ✅               |
| Great for `map/filter/reduce` | ✅              | ✅               |
| Most Common in Modern React   | ✅              | ❌               |

# Senior React Interview Answer

> Arrow functions use **lexical `this`**, meaning they inherit `this` from the surrounding scope instead of creating their own. This makes them ideal for React event handlers because they eliminate the need for manual `bind(this)` calls in class components. They are also widely used with array methods such as `map()`, `filter()`, and `reduce()` to render lists, transform data, and perform immutable state updates in React applications.
