1. ### What is Hoisting

   Hoisting is a JavaScript mechanism where variables, function declarations are moved to the top of their scope before code execution. Remember that JavaScript only hoists declarations, not initialization.
   Let's take a simple example of variable hoisting,

   ```javascript
   console.log(message); //output : undefined
   var message = "The variable Has been hoisted";
   ```

   The above code looks like as below to the interpreter,

   ```javascript
   var message;
   console.log(message);
   message = "The variable Has been hoisted";
   ```

   In the same fashion, function declarations are hoisted too

   ```javascript
   message("Good morning"); //Good morning

   function message(name) {
     console.log(name);
   }
   ```

   This hoisting makes functions to be safely used in code before they are declared.

   Hoisting is a term used to explain the behavior of variable declarations in your code. Variables declared or initialized with the var keyword will have their declaration "moved" up to the top of their module/function-level scope, which we refer to as hoisting. However, only the declaration is hoisted, the assignment (if there is one), will stay where it is.

   Note that the declaration is not actually moved - the JavaScript engine parses the declarations during compilation and becomes aware of declarations and their scopes. It is just easier to understand this behavior by visualizing the declarations as being hoisted to the top of their scope. Let's explain with a few examples.

   ```javascript
   console.log(foo); // undefined
   var foo = 1;
   console.log(foo); // 1
   ```

   Function declarations have the body hoisted while the function expressions (written in the form of variable declarations) only has the variable declaration hoisted.

   ```javascript
   // Function Declaration
   console.log(foo); // [Function: foo]
   foo(); // 'FOOOOO'
   function foo() {
     console.log("FOOOOO");
   }
   console.log(foo); // [Function: foo]

   // Function Expression
   console.log(bar); // undefined
   bar(); // Uncaught TypeError: bar is not a function
   var bar = function () {
     console.log("BARRRR");
   };
   console.log(bar); // [Function: bar]
   ```

   Variables declared via let and const are hoisted as well. However, unlike var and function, they are not initialized and accessing them before the declaration will result in a ReferenceError exception. The variable is in a "temporal dead zone" from the start of the block until the declaration is processed.

   ```javascript
   x; // undefined
   y; // Reference error: y is not defined

   var x = "local";
   let y = "local";
   ```

   The Execution Context is the "environment of code" that is currently executing. The Execution Context has two phases compilation and execution.

   [Compilation](#) - in this phase it gets all the function declarations and hoists them up to the top of their scope so we can reference them later and gets all variables declaration (declare with the var keyword) and also hoists them up and give them a default value of undefined.

   [Execution](#) - in this phase it assigns values to the variables hoisted earlier and it executes or invokes functions (methods in objects).

   Note: only function declarations and variables declared with the var keyword are hoisted not function expressions or arrow functions, let and const keywords.

   The main difference between function declarations and class declarations is hoisting. The function declarations are hoisted but not class declarations.

   ```javascript
   console.log(y);
   y = 1;
   console.log(y);
   console.log(greet("Mark"));

   function greet(name) {
     return "Hello " + name + "!";
   }

   var y;
   ```

   ```javascript
   undefined,1, Hello Mark!
   ```

   [compilation](#compilation)

   ```javascript
   function greet(name) {
     return "Hello " + name + "!";
   }

   var y; //implicit "undefined" assignment

   //waiting for "compilation" phase to finish

   //then start "execution" phase
   /*
   console.log(y);
   y = 1;
   console.log(y);
   console.log(greet("Mark"));
   */
   ```

   [execution](#execution)

   ```javascript
   function greet(name) {
     return "Hello " + name + "!";
   }

   var y;

   //start "execution" phase

   console.log(y);
   y = 1;
   console.log(y);
   console.log(greet("Mark"));
   ```

   [classes](#classes)

   ```javascript
   const user = new User(); // ReferenceError
   class User {}
   ```

   [Constructor Function](#ConstructorFunction)

   ```javascript
   const user = new User(); // No error

   function User() {}
   ```

# Hoisting in JavaScript

**Hoisting** is JavaScript's behaviour of moving declarations to the top of their scope during the compilation phase.

***

# 1. Variable Hoisting with `var`

```javascript
console.log(name);

var name = "Sudhir";
```

### Output

```javascript
undefined
```

### What JavaScript Sees

```javascript
var name;

console.log(name);

name = "Sudhir";
```

✅ Declaration is hoisted

❌ Assignment is not

***

# 2. `let` Hoisting

```javascript
console.log(name);

let name = "Sudhir";
```

### Output

```javascript
ReferenceError:
Cannot access 'name' before initialization
```

Although `let` is hoisted, it remains in the **Temporal Dead Zone (TDZ)** until execution reaches the declaration.

***

# 3. `const` Hoisting

```javascript
console.log(name);

const name = "Sudhir";
```

### Output

```javascript
ReferenceError:
Cannot access 'name' before initialization
```

Same TDZ behaviour as `let`.

***

# 4. Function Declaration Hoisting

```javascript
greet();

function greet() {
  console.log("Hello");
}
```

### Output

```javascript
Hello
```

### What JavaScript Sees

```javascript
function greet() {
  console.log("Hello");
}

greet();
```

✅ Entire function is hoisted.

***

# 5. Function Expression Hoisting

```javascript
greet();

var greet = function () {
  console.log("Hello");
};
```

### Output

```javascript
TypeError:
greet is not a function
```

### What JavaScript Sees

```javascript
var greet;

greet();

greet = function () {
  console.log("Hello");
};
```

At call time:

```javascript
greet === undefined
```

So:

```javascript
undefined()
```

causes a TypeError.

***

# 6. Arrow Function Hoisting

```javascript
greet();

const greet = () => {
  console.log("Hello");
};
```

### Output

```javascript
ReferenceError
```

Because `const` is in TDZ.

***

# Most Common Interview Question

```javascript
var x = 10;

function test() {
  console.log(x);

  var x = 20;
}

test();
```

### Output

```javascript
undefined
```

### JavaScript Interprets It As

```javascript
function test() {
  var x;

  console.log(x);

  x = 20;
}
```

***

# Another Interview Question

```javascript
var x = 10;

function test() {
  console.log(x);
}

test();
```

### Output

```javascript
10
```

No local variable exists, so JavaScript uses the global `x`.

***

# Temporal Dead Zone (TDZ)

```javascript
{
  console.log(a);

  let a = 10;
}
```

Output:

```javascript
ReferenceError
```

TDZ exists between:

```javascript
scope start
```

and

```javascript
variable declaration
```

***

# React Example

```jsx
function App() {
  const showMessage = () => {
    console.log(message);
  };

  const message = "Hello React";

  return (
    <button onClick={showMessage}>
      Click
    </button>
  );
}
```

Works because:

```javascript
showMessage()
```

executes after:

```javascript
message
```

has been initialised.

***

# Interview Comparison

| Type                 | Hoisted | Initial Value   |
| -------------------- | ------- | --------------- |
| `var`                | ✅       | `undefined`     |
| `let`                | ✅       | TDZ             |
| `const`              | ✅       | TDZ             |
| Function Declaration | ✅       | Entire function |
| Function Expression  | Partial | `undefined`     |
| Arrow Function       | Partial | TDZ             |

***

# Senior JavaScript Interview Answer

> Hoisting is JavaScript's behaviour where declarations are processed before code execution. `var` declarations are hoisted and initialised with `undefined`, whereas `let` and `const` are hoisted but remain in the Temporal Dead Zone until their declaration is reached. Function declarations are fully hoisted, making them callable before their definition, while function expressions and arrow functions follow the hoisting rules of the variables they are assigned to.

# Hoisting with Async Functions

Async functions follow the same hoisting rules as regular functions.

***

## 1. Async Function Declaration

✅ Fully hoisted

```javascript
getUser();

async function getUser() {
  console.log("Fetching user...");
}
```

### Output

```javascript
Fetching user...
```

JavaScript treats it like:

```javascript
async function getUser() {
  console.log("Fetching user...");
}

getUser();
```

***

## 2. Async Function Expression

```javascript
getUser();

var getUser = async function () {
  console.log("Fetching user...");
};
```

### Output

```javascript
TypeError: getUser is not a function
```

### What Gets Hoisted

```javascript
var getUser;

getUser(); // undefined()

getUser = async function () {
  console.log("Fetching user...");
};
```

***

## 3. Async Arrow Function

```javascript
getUser();

const getUser = async () => {
  console.log("Fetching user...");
};
```

### Output

```javascript
ReferenceError:
Cannot access 'getUser' before initialization
```

Because:

```javascript
const
```

is in the Temporal Dead Zone (TDZ).

***

# Hoisting with Classes

Classes are hoisted differently from functions.

***

## Class Declaration

```javascript
const user = new User();

class User {
  constructor() {
    this.name = "Sudhir";
  }
}
```

### Output

```javascript
ReferenceError:
Cannot access 'User' before initialization
```

Although the class declaration is hoisted, it remains in the TDZ.

***

## Correct Usage

```javascript
class User {
  constructor() {
    this.name = "Sudhir";
  }
}

const user = new User();

console.log(user.name);
```

### Output

```javascript
Sudhir
```

***

## Function vs Class Hoisting

### Function

```javascript
greet();

function greet() {
  console.log("Hello");
}
```

✅ Works

***

### Class

```javascript
new Person();

class Person {}
```

❌ Throws ReferenceError

***

# Strict Mode vs Non-Strict Mode

Hoisting behaviour is mostly the same, but strict mode prevents some questionable JavaScript behaviour.

***

## Non-Strict Mode

```javascript
"use strict";
```

not present.

```javascript
x = 10;

console.log(x);
```

### Output

```javascript
10
```

JavaScript creates a global variable automatically.

***

## Strict Mode

```javascript
"use strict";

x = 10;
```

### Output

```javascript
ReferenceError:
x is not defined
```

Strict mode prevents accidental globals.

***

## Function Inside Blocks

### Non-Strict Mode

```javascript
if (true) {
  function greet() {
    console.log("Hello");
  }
}

greet();
```

Behaviour may vary between environments.

***

### Strict Mode

```javascript
"use strict";

if (true) {
  function greet() {
    console.log("Hello");
  }
}

greet();
```

### Output

```javascript
ReferenceError
```

Because block-scoped function declarations are not exposed outside the block.

***

# Popular Interview Questions

## Question 1

```javascript
console.log(a);

var a = 10;
```

Output:

```javascript
undefined
```

***

## Question 2

```javascript
console.log(a);

let a = 10;
```

Output:

```javascript
ReferenceError
```

***

## Question 3

```javascript
foo();

function foo() {
  console.log("foo");
}
```

Output:

```javascript
foo
```

***

## Question 4

```javascript
foo();

var foo = function () {
  console.log("foo");
};
```

Output:

```javascript
TypeError
```

***

## Question 5 (Class)

```javascript
const user = new User();

class User {}
```

Output:

```javascript
ReferenceError
```

***

# Summary Table

| Declaration Type           | Hoisted | Callable Before Declaration |
| -------------------------- | ------- | --------------------------- |
| `var`                      | ✅       | Value = `undefined`         |
| `let`                      | ✅       | ❌ TDZ                       |
| `const`                    | ✅       | ❌ TDZ                       |
| Function Declaration       | ✅       | ✅                           |
| Function Expression        | Partial | ❌                           |
| Arrow Function             | Partial | ❌                           |
| Async Function Declaration | ✅       | ✅                           |
| Async Function Expression  | Partial | ❌                           |
| Class Declaration          | ✅       | ❌ TDZ                       |

***

## Senior Interview Answer

> Hoisting occurs during JavaScript's compilation phase. Function declarations (including async function declarations) are fully hoisted and can be invoked before their definition. Variables declared with `var` are hoisted and initialised with `undefined`, whereas `let`, `const`, and class declarations are hoisted but remain in the Temporal Dead Zone until execution reaches their declaration. In strict mode, additional restrictions apply, such as preventing accidental global variables and enforcing proper block scoping.

# Hoisting with Async Arrow Functions

Async arrow functions follow the same hoisting rules as `let` and `const`.

***

## Example 1: Async Arrow Function with `const`

```javascript
getUser();

const getUser = async () => {
  return "Sudhir";
};
```

### Output

```javascript
ReferenceError:
Cannot access 'getUser' before initialization
```

### Why?

`const` is hoisted but remains in the **Temporal Dead Zone (TDZ)** until its declaration.

Internally:

```javascript
// Hoisted (uninitialised)

getUser(); // TDZ Error

const getUser = async () => {
  return "Sudhir";
};
```

***

## Example 2: Async Arrow Function with `var`

```javascript
getUser();

var getUser = async () => {
  return "Sudhir";
};
```

### Output

```javascript
TypeError:
getUser is not a function
```

### Why?

```javascript
var getUser = undefined;

getUser(); // undefined()

getUser = async () => {
  return "Sudhir";
};
```

`var` is hoisted and initialised as `undefined`.

***

## Example 3: Correct Usage

```javascript
const getUser = async () => {
  return "Sudhir";
};

getUser().then(console.log);
```

### Output

```javascript
Sudhir
```

***

# Hoisting with Class Expressions

Class expressions behave similarly to function expressions.

***

## Named Class Expression

```javascript
const User = class Person {
  constructor(name) {
    this.name = name;
  }
};

const user = new User("Sudhir");
```

Works ✅

***

## Access Before Declaration

```javascript
const user = new User();

const User = class {
  constructor() {}
};
```

### Output

```javascript
ReferenceError:
Cannot access 'User' before initialization
```

Because:

```javascript
const User
```

is in TDZ.

***

## Class Declaration vs Class Expression

### Class Declaration

```javascript
class User {}

new User();
```

✅ Works after declaration

❌ Fails before declaration

***

### Class Expression

```javascript
const User = class {};

new User();
```

✅ Works after assignment

❌ Fails before assignment

***

## Interesting Interview Question

```javascript
const User = class Person {
  static getName() {
    return Person.name;
  }
};

console.log(User.getName());
```

### Output

```javascript
Person
```

Inside the class body:

```javascript
Person
```

is accessible.

Outside:

```javascript
console.log(Person);
```

Output:

```javascript
ReferenceError
```

***

# Hoisting Effects on Variables in Strict Mode

***

## Non-Strict Mode

```javascript
x = 10;

console.log(x);
```

### Output

```javascript
10
```

JavaScript automatically creates:

```javascript
window.x = 10;
```

***

## Strict Mode

```javascript
"use strict";

x = 10;
```

### Output

```javascript
ReferenceError:
x is not defined
```

Strict mode prevents accidental globals.

***

## `var` in Strict Mode

```javascript
"use strict";

console.log(a);

var a = 10;
```

### Output

```javascript
undefined
```

Hoisting behaviour remains unchanged.

***

## `let` in Strict Mode

```javascript
"use strict";

console.log(a);

let a = 10;
```

### Output

```javascript
ReferenceError
```

Still inside TDZ.

***

## `const` in Strict Mode

```javascript
"use strict";

console.log(a);

const a = 10;
```

### Output

```javascript
ReferenceError
```

***

# Common Interview Comparison

### Example

```javascript
"use strict";

function test() {
  x = 10;
}

test();
```

### Strict Mode

```javascript
ReferenceError
```

***

### Non-Strict Mode

```javascript
10
```

(`x` becomes a global variable)

***

# Hoisting Summary Table

| Declaration                    | Hoisted                             | Initial Value | Call Before Declaration |
| ------------------------------ | ----------------------------------- | ------------- | ----------------------- |
| `var`                          | ✅                                   | `undefined`   | ✅                       |
| `let`                          | ✅                                   | TDZ           | ❌                       |
| `const`                        | ✅                                   | TDZ           | ❌                       |
| Function Declaration           | ✅                                   | Function      | ✅                       |
| Async Function Declaration     | ✅                                   | Function      | ✅                       |
| Function Expression            | Partial                             | `undefined`   | ❌                       |
| Async Arrow Function (`var`)   | Partial                             | `undefined`   | ❌                       |
| Async Arrow Function (`const`) | Partial                             | TDZ           | ❌                       |
| Class Declaration              | ✅                                   | TDZ           | ❌                       |
| Class Expression               | Depends on variable (`let`/`const`) | TDZ           | ❌                       |

***

## Senior Interview Answer

> Async arrow functions are not fully hoisted because they are typically assigned to `const` or `let`, which remain in the Temporal Dead Zone until initialisation. Class declarations are hoisted but also live in the TDZ, so instances cannot be created before the class definition. Strict mode does not change hoisting itself, but it makes JavaScript more predictable by preventing accidental global variables and enforcing stricter scoping rules.

# 1. Hoisting with Async Function Expressions

Async function **declarations** are fully hoisted, but async **function expressions** are not.

***

## Async Function Expression with `var`

```javascript
console.log(getUser);

getUser();

var getUser = async function () {
  return "Sudhir";
};
```

### Output

```javascript
undefined

TypeError: getUser is not a function
```

### What JavaScript Sees

```javascript
var getUser;

console.log(getUser);

getUser();

getUser = async function () {
  return "Sudhir";
};
```

Because:

```javascript
getUser === undefined
```

at the time it's called.

***

## Async Function Expression with `let`

```javascript
getUser();

let getUser = async function () {
  return "Sudhir";
};
```

### Output

```javascript
ReferenceError:
Cannot access 'getUser' before initialization
```

Because `let` variables are in the **Temporal Dead Zone (TDZ)**.

***

## Async Function Expression with `const`

```javascript
getUser();

const getUser = async function () {
  return "Sudhir";
};
```

### Output

```javascript
ReferenceError
```

Same TDZ behaviour.

***

## Async Function Declaration

```javascript
getUser();

async function getUser() {
  return "Sudhir";
}
```

### Output

No error ✅

Function declarations are fully hoisted.

***

# 2. Class Declarations vs Class Expressions

Many developers assume classes behave like functions. They don't.

***

## Class Declaration

```javascript
const user = new User();

class User {
  constructor() {
    this.name = "Sudhir";
  }
}
```

### Output

```javascript
ReferenceError:
Cannot access 'User' before initialization
```

Although the class is hoisted, it stays inside TDZ.

***

## Class Expression

```javascript
const user = new User();

const User = class {
  constructor() {
    this.name = "Sudhir";
  }
};
```

### Output

```javascript
ReferenceError
```

Because the variable:

```javascript
const User
```

has not been initialised yet.

***

## Named Class Expression

```javascript
const User = class Person {
  static getName() {
    return Person.name;
  }
};

console.log(User.getName());
```

Output:

```javascript
"Person"
```

Inside the class body:

```javascript
Person
```

is available.

Outside:

```javascript
console.log(Person);
```

Output:

```javascript
ReferenceError
```

***

## Comparison

| Feature                            | Function Declaration | Class Declaration |
| ---------------------------------- | -------------------- | ----------------- |
| Hoisted                            | ✅                    | ✅                 |
| Callable Before Declaration        | ✅                    | ❌                 |
| TDZ                                | ❌                    | ✅                 |
| Can Instantiate Before Declaration | N/A                  | ❌                 |

***

# 3. Variable Hoisting: Strict vs Non-Strict Mode

The hoisting rules themselves do **not change**, but strict mode prevents certain behaviours.

***

## Non-Strict Mode

```javascript
x = 10;

console.log(x);
```

### Output

```javascript
10
```

JavaScript automatically creates:

```javascript
window.x = 10;
```

***

## Strict Mode

```javascript
"use strict";

x = 10;
```

### Output

```javascript
ReferenceError:
x is not defined
```

Strict mode prohibits accidental globals.

***

## `var` Hoisting

### Non-Strict

```javascript
console.log(a);

var a = 10;
```

Output:

```javascript
undefined
```

***

### Strict Mode

```javascript
"use strict";

console.log(a);

var a = 10;
```

Output:

```javascript
undefined
```

✅ Same hoisting behaviour.

***

## `let` Hoisting

### Non-Strict

```javascript
console.log(a);

let a = 10;
```

Output:

```javascript
ReferenceError
```

***

### Strict Mode

```javascript
"use strict";

console.log(a);

let a = 10;
```

Output:

```javascript
ReferenceError
```

✅ Same TDZ behaviour.

***

## Function Scope Example

### Non-Strict

```javascript
function test() {
  value = 100;
}

test();

console.log(value);
```

Output:

```javascript
100
```

Accidental global variable created.

***

### Strict Mode

```javascript
"use strict";

function test() {
  value = 100;
}

test();
```

Output:

```javascript
ReferenceError
```

***

# Interview Summary

| Declaration                             | Hoisted             | Initial Value | Before Declaration |
| --------------------------------------- | ------------------- | ------------- | ------------------ |
| `var`                                   | ✅                   | `undefined`   | Accessible         |
| `let`                                   | ✅                   | TDZ           | ReferenceError     |
| `const`                                 | ✅                   | TDZ           | ReferenceError     |
| Function Declaration                    | ✅                   | Function      | Callable           |
| Async Function Declaration              | ✅                   | Function      | Callable           |
| Function Expression                     | Partial             | `undefined`   | TypeError          |
| Async Function Expression (`var`)       | Partial             | `undefined`   | TypeError          |
| Async Function Expression (`let/const`) | Partial             | TDZ           | ReferenceError     |
| Class Declaration                       | ✅                   | TDZ           | ReferenceError     |
| Class Expression                        | Depends on variable | TDZ           | ReferenceError     |

### Senior Interview Answer

> Async function expressions follow the hoisting behaviour of the variable (`var`, `let`, or `const`) to which they are assigned. Class declarations are hoisted but remain in the Temporal Dead Zone, making them unavailable before their declaration. Strict mode does not change hoisting itself, but it prevents accidental globals and enforces safer variable handling, which makes hoisting-related bugs easier to catch.

# Temporal Dead Zone (TDZ) Impact on Class Expressions

A **class expression** follows the hoisting behaviour of the variable it's assigned to (`let` or `const`).

Even though the variable name is hoisted, it remains in the **Temporal Dead Zone (TDZ)** until execution reaches the assignment.

***

## What is TDZ?

The TDZ is the period between:

```javascript
Scope starts
```

and

```javascript
Variable initialization
```

Accessing the variable during this period causes:

```javascript
ReferenceError
```

***

# Example 1: Class Expression with `const`

```javascript
const user = new User();

const User = class {
  constructor() {
    this.name = "Sudhir";
  }
};
```

### Output

```javascript
ReferenceError:
Cannot access 'User' before initialization
```

***

### What Happens Internally

```javascript
// User is hoisted

// TDZ starts

const user = new User(); // Error

const User = class {
  constructor() {}
};
```

The variable exists, but JavaScript prevents access until initialization.

***

# Example 2: Class Declaration

```javascript
const user = new User();

class User {
  constructor() {
    this.name = "Sudhir";
  }
}
```

### Output

```javascript
ReferenceError
```

Many developers expect classes to behave like function declarations.

They don't.

Unlike:

```javascript
greet();

function greet() {}
```

classes remain in TDZ.

***

# Example 3: Function Declaration vs Class Declaration

### Function

```javascript
greet();

function greet() {
  console.log("Hello");
}
```

✅ Works

Output:

```javascript
Hello
```

***

### Class

```javascript
new User();

class User {}
```

❌ Fails

Output:

```javascript
ReferenceError
```

***

# Example 4: Class Expression Assigned to `let`

```javascript
console.log(User);

let User = class {
  constructor() {}
};
```

### Output

```javascript
ReferenceError
```

`let` variables also have TDZ.

***

# Example 5: Class Expression Assigned to `var`

```javascript
console.log(User);

var User = class {
  constructor() {}
};
```

### Output

```javascript
undefined
```

Because:

```javascript
var User = undefined;
```

is hoisted.

***

### Then

```javascript
new User();
```

before assignment gives:

```javascript
TypeError:
User is not a constructor
```

Since:

```javascript
User === undefined
```

at that point.

***

# Named Class Expression

```javascript
const User = class Person {
  static getClassName() {
    return Person.name;
  }
};

console.log(
  User.getClassName()
);
```

### Output

```javascript
Person
```

Inside the class body:

```javascript
Person
```

exists.

Outside:

```javascript
console.log(Person);
```

### Output

```javascript
ReferenceError
```

The name is scoped only to the class body.

***

# Visualising TDZ

```javascript
{
  // TDZ starts

  console.log(User);

  const User = class {};
}
```

Timeline:

```text
Enter Scope
     ↓
TDZ
     ↓
const User = class {}
     ↓
TDZ Ends
```

Any access in the TDZ:

```javascript
User
```

causes:

```javascript
ReferenceError
```

***

# Interview Comparison

| Type                        | Hoisted | Initialised     | Usable Before Declaration |
| --------------------------- | ------- | --------------- | ------------------------- |
| Function Declaration        | ✅       | Function Object | ✅                         |
| Class Declaration           | ✅       | TDZ             | ❌                         |
| Function Expression (`var`) | Partial | `undefined`     | ❌                         |
| Class Expression (`var`)    | Partial | `undefined`     | ❌                         |
| Class Expression (`let`)    | ✅       | TDZ             | ❌                         |
| Class Expression (`const`)  | ✅       | TDZ             | ❌                         |

***

# Common Interview Question

### Output?

```javascript
console.log(typeof User);

class User {}
```

### Output

```javascript
ReferenceError
```

Unlike:

```javascript
console.log(typeof x);

var x = 10;
```

Output:

```javascript
"undefined"
```

`typeof` does **not** bypass TDZ for classes, `let`, or `const`.

***

## Senior Interview Answer

> Class expressions are affected by the Temporal Dead Zone because they are usually assigned to `let` or `const`. Although the variable name is hoisted during compilation, it is not initialised until execution reaches the assignment. Any attempt to access or instantiate the class before that point results in a `ReferenceError`. This differs from function declarations, which are fully initialised during hoisting and can be invoked before their definition.

# 1. Hoisting with Async Arrow Functions and TDZ

Async arrow functions are usually assigned to `const` or `let`, so they are affected by the **Temporal Dead Zone (TDZ)**.

***

## Example with `const`

```javascript
console.log(fetchUser);

fetchUser();

const fetchUser = async () => {
  return "Sudhir";
};
```

### Output

```javascript
ReferenceError:
Cannot access 'fetchUser' before initialization
```

### Why?

During compilation:

```javascript
// fetchUser exists

// TDZ starts here

console.log(fetchUser); // Error

const fetchUser = async () => {
  return "Sudhir";
};

// TDZ ends
```

The variable is hoisted but not initialised.

***

## Example with `let`

```javascript
fetchUser();

let fetchUser = async () => {
  return "Sudhir";
};
```

### Output

```javascript
ReferenceError
```

Same reason: TDZ.

***

## Example with `var`

```javascript
console.log(fetchUser);

fetchUser();

var fetchUser = async () => {
  return "Sudhir";
};
```

### Output

```javascript
undefined

TypeError:
fetchUser is not a function
```

Because:

```javascript
var fetchUser = undefined;
```

is hoisted.

***

# 2. Class Expression Hoisting: `let` vs `var`

Class expressions depend on the variable declaration used.

***

## Class Expression with `let`

```javascript
const user = new User();

let User = class {
  constructor() {
    this.name = "Sudhir";
  }
};
```

### Output

```javascript
ReferenceError:
Cannot access 'User' before initialization
```

Reason:

```javascript
let User
```

is inside TDZ.

***

## Class Expression with `const`

```javascript
const user = new User();

const User = class {};
```

### Output

```javascript
ReferenceError
```

Same behaviour.

***

## Class Expression with `var`

```javascript
console.log(User);

var User = class {
  constructor() {}
};
```

### Output

```javascript
undefined
```

Because:

```javascript
var User = undefined;
```

is hoisted.

***

### Instantiation Example

```javascript
new User();

var User = class {};
```

### Output

```javascript
TypeError:
User is not a constructor
```

At that moment:

```javascript
User === undefined
```

***

## Comparison

| Declaration             | Hoisted | Initial Value | Result Before Assignment |
| ----------------------- | ------- | ------------- | ------------------------ |
| `var User = class {}`   | ✅       | `undefined`   | TypeError                |
| `let User = class {}`   | ✅       | TDZ           | ReferenceError           |
| `const User = class {}` | ✅       | TDZ           | ReferenceError           |

***

# 3. Variable Hoisting Errors: Strict vs Non-Strict Mode

Hoisting itself doesn't change, but strict mode changes error behaviour.

***

## Case 1: Accidental Global Variable

### Non-Strict Mode

```javascript
function test() {
  x = 10;
}

test();

console.log(x);
```

### Output

```javascript
10
```

JavaScript creates:

```javascript
window.x = 10;
```

automatically.

***

### Strict Mode

```javascript
"use strict";

function test() {
  x = 10;
}

test();
```

### Output

```javascript
ReferenceError:
x is not defined
```

***

## Case 2: `var` Hoisting

### Non-Strict

```javascript
console.log(a);

var a = 10;
```

Output:

```javascript
undefined
```

***

### Strict

```javascript
"use strict";

console.log(a);

var a = 10;
```

Output:

```javascript
undefined
```

✅ No difference.

***

## Case 3: `let` Hoisting

### Non-Strict

```javascript
console.log(a);

let a = 10;
```

Output:

```javascript
ReferenceError
```

***

### Strict

```javascript
"use strict";

console.log(a);

let a = 10;
```

Output:

```javascript
ReferenceError
```

✅ Same TDZ behaviour.

***

## Case 4: `const` Hoisting

### Non-Strict

```javascript
console.log(a);

const a = 10;
```

Output:

```javascript
ReferenceError
```

***

### Strict

```javascript
"use strict";

console.log(a);

const a = 10;
```

Output:

```javascript
ReferenceError
```

✅ Same behaviour.

***

# Popular Interview Question

```javascript
console.log(typeof User);

class User {}
```

### Output

```javascript
ReferenceError
```

Many developers expect:

```javascript
"undefined"
```

But TDZ prevents access even through `typeof`.

Compare with:

```javascript
console.log(typeof x);

var x = 10;
```

Output:

```javascript
"undefined"
```

***

# Final Comparison Table

| Type                               | Hoisted | Initialised | Before Declaration |
| ---------------------------------- | ------- | ----------- | ------------------ |
| `var`                              | ✅       | `undefined` | Works              |
| `let`                              | ✅       | TDZ         | ReferenceError     |
| `const`                            | ✅       | TDZ         | ReferenceError     |
| Async Arrow Function (`var`)       | ✅       | `undefined` | TypeError          |
| Async Arrow Function (`let/const`) | ✅       | TDZ         | ReferenceError     |
| Class Declaration                  | ✅       | TDZ         | ReferenceError     |
| Class Expression (`var`)           | ✅       | `undefined` | TypeError          |
| Class Expression (`let/const`)     | ✅       | TDZ         | ReferenceError     |

### Senior Interview Answer

> Async arrow functions and class expressions follow the hoisting rules of the variable used to store them. With `let` and `const`, the identifier exists but remains in the Temporal Dead Zone until initialisation, producing a `ReferenceError`. With `var`, the variable is initialised to `undefined`, so accessing it before assignment results in `undefined` or a `TypeError` when attempting to call or instantiate it. Strict mode does not change hoisting itself, but it prevents accidental globals and makes hoisting-related mistakes easier to detect.
