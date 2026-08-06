### Explanation of `call()`, `apply()`, and `bind()`

In JavaScript, the `call()`, `apply()`, and `bind()` methods are used to set the context (`this`) of a function and control the way arguments are passed. Although they are similar, they differ in how they pass arguments and how they invoke the function.

Let's break down each method, including examples:

---

### 1. **Function.prototype.call()**

The `call()` method invokes a function with a specified `this` context and individual arguments.

#### Syntax

```javascript
func.call(thisArg, arg1, arg2, ...);
```

- **`thisArg`**: The value to use as `this` when calling the function.
- **`arg1, arg2, ...`**: Arguments to pass to the function.

#### Example

```javascript
function printThisAndData(...data) {
  console.log(this.data, ...data);
}

const obj = { data: 0 };
const data = [1, 2, 3];

printThisAndData.call(obj, data);       // logs: 0 [1, 2, 3]
printThisAndData.call(obj, ...data);    // logs: 0 1 2 3
```

- **Key Point**: `call()` immediately invokes the function, and each argument is passed individually.

---

### 2. **Function.prototype.apply()**

The `apply()` method works similarly to `call()`, but it requires arguments to be passed as an array (or array-like object).

#### Syntax

```javascript
func.apply(thisArg, [arg1, arg2, ...]);
```

- **`thisArg`**: The value to use as `this` when calling the function.
- **`[arg1, arg2, ...]`**: An array or array-like object of arguments to pass to the function.

#### Example

```javascript
function printThisAndData(...data) {
  console.log(this.data, ...data);
}

const obj = { data: 0 };
const data = [1, 2, 3];

printThisAndData.apply(obj, data);      // logs: 0 1 2 3
printThisAndData.apply(obj, ...data);   // Throws a TypeError
```

- **Key Point**: `apply()` expects the arguments to be passed as an array, not as individual parameters like `call()`.

---

### 3. **Function.prototype.bind()**

The `bind()` method is different from `call()` and `apply()`. It **does not invoke the function immediately**; instead, it returns a new function with the `this` context bound to the specified value and any initial arguments pre-set. The returned function can be invoked later.

#### Syntax

```javascript
const boundFunc = func.bind(thisArg, arg1, arg2, ...);
```

- **`thisArg`**: The value to use as `this` when the function is called.
- **`arg1, arg2, ...`**: Arguments to pre-set for the function.

#### Example

```javascript
function printThisAndData(...data) {
  console.log(this.data, ...data);
}

const obj = { data: 0 };
const data = [1, 2, 3];

const printObjAndData = printThisAndData.bind(obj);

printObjAndData(data);                  // logs: 0 [1, 2, 3]
printObjAndData(...data);               // logs: 0 1 2 3

const printObjTwoAndData = printThisAndData.bind(obj, 2);

printObjTwoAndData(data);               // logs: 0 2 [1, 2, 3]
printObjTwoAndData(...data);            // logs: 0 2 1 2 3
```

- **Key Point**: `bind()` creates a new function that can be invoked later with the specified `this` context and any pre-set arguments.

---

### **Real-life Usage Examples**

Understanding the differences between `call()`, `apply()`, and `bind()` can help in various situations when you need to control the `this` context or pass specific arguments to a function. Here are some practical examples:

---

### Example 1: **Bind a Method to an Object**

You can use `apply()` to create a function that invokes a method at a given key of an object, optionally prepending any additional supplied parameters to the arguments.

#### Code

```javascript
const bindKey = (context, fn, ...boundArgs) => (...args) =>
  context[fn].apply(context, [...boundArgs, ...args]);

const freddy = {
  user: 'fred',
  greet: function(greeting, punctuation) {
    return greeting + ' ' + this.user + punctuation;
  }
};

const freddyBound = bindKey(freddy, 'greet');
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

- **Explanation**: The `bindKey` function binds the `greet` method of the `freddy` object, ensuring that `this` inside `greet` always refers to `freddy`.

---

### Example 2: **Bind All Object Methods**

You can also bind all methods of an object to the object itself, so that their `this` context is always correctly set.

#### Code

```javascript
const bindAll = (obj, ...fns) =>
  fns.forEach(fn => {
    const f = obj[fn];
    obj[fn] = function() {
      return f.apply(obj, arguments);
    };
  });

let view = {
  label: 'docs',
  click: function() {
    console.log('clicked ' + this.label);
  }
};

bindAll(view, 'click');
document.body.addEventListener('click', view.click); // Logs 'clicked docs' when clicked
```

- **Explanation**: The `bindAll` function binds all methods specified in the object to the object itself, so that `this` in the methods always refers to the object.

---

### Example 3: **Bind Function Context**

If you need to invoke a function with a specific context and optional pre-set arguments, you can use `apply()` or `bind()`.

#### Code

```javascript
const bind = (fn, context, ...boundArgs) => (...args) =>
  fn.apply(context, [...boundArgs, ...args]);

function greet(greeting, punctuation) {
  return greeting + ' ' + this.user + punctuation;
}

const freddy = { user: 'fred' };
const freddyBound = bind(greet, freddy);
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

- **Explanation**: The `bind` function ensures that the `greet` function always uses `freddy` as its `this` context, and it allows you to pre-set arguments if needed.

---

### Key Takeaways

- **`call()`**: Immediately invokes the function with the specified `this` context and individual arguments.
- **`apply()`**: Like `call()`, but expects arguments to be passed as an array.
- **`bind()`**: Returns a new function with the `this` context set and allows you to pre-set arguments, but it doesn't invoke the function immediately.

---

By understanding the distinctions and use cases for `call()`, `apply()`, and `bind()`, you can apply these methods to handle function context management and argument passing more effectively in your JavaScript code.

`call()`, `apply()`, and `bind()` are among the most frequently asked JavaScript interview topics. Below are common interview questions along with concise answers.

---

# 1. What is the difference between `call()`, `apply()`, and `bind()`?

| `call()`                      | `apply()`                    | `bind()`                                 |
| ----------------------------- | ---------------------------- | ---------------------------------------- |
| Invokes function immediately  | Invokes function immediately | Returns a new function                   |
| Arguments passed individually | Arguments passed as an array | Arguments passed individually (optional) |
| Returns function result       | Returns function result      | Returns bound function                   |

Example:

```javascript
function greet(city) {
    console.log(this.name, city);
}

const user = { name: "John" };

greet.call(user, "Delhi");
greet.apply(user, ["Delhi"]);

const fn = greet.bind(user);
fn("Delhi");
```

---

# 2. Why do we need `bind()`?

`bind()` is used when we want to execute a function later while preserving the value of `this`.

Example:

```javascript
const person = {
    name: "Alice",

    sayHi() {
        console.log(this.name);
    }
};

setTimeout(person.sayHi, 1000); // undefined

setTimeout(person.sayHi.bind(person), 1000); // Alice
```

---

# 3. What happens if you don't use `bind()` in callbacks?

`this` may refer to another object (or `undefined` in strict mode).

```javascript
const obj = {
    name: "John",

    show() {
        console.log(this.name);
    }
};

const fn = obj.show;

fn(); // undefined
```

Correct:

```javascript
const fn = obj.show.bind(obj);

fn(); // John
```

---

# 4. Which one is faster: `call()` or `apply()`?

There is almost no practical performance difference in modern JavaScript engines.

Choose based on the argument format:

- `call()` → individual arguments
- `apply()` → array of arguments

---

# 5. Can we use `call()` instead of `apply()`?

Yes.

```javascript
const arr = [1, 2, 3];

fn.call(obj, ...arr);
```

is equivalent to

```javascript
fn.apply(obj, arr);
```

Today, developers usually prefer the spread operator (`...`) over `apply()`.

---

# 6. What does `bind()` return?

It returns a **new function**.

```javascript
function greet() {}

const bound = greet.bind({});

console.log(typeof bound); // "function"
```

---

# 7. Does `bind()` execute the function?

No.

```javascript
function hello() {
    console.log("Hello");
}

const fn = hello.bind(null);

console.log("Before");

// Nothing printed yet

fn();

// Hello
```

---

# 8. Can we change `this` after using `bind()`?

No.

```javascript
function show() {
    console.log(this.name);
}

const obj1 = { name: "Alice" };
const obj2 = { name: "Bob" };

const bound = show.bind(obj1);

bound.call(obj2);
```

Output:

```
Alice
```

Once a function is bound, `call()` and `apply()` cannot change its `this`.

---

# 9. What is function borrowing?

Using `call()` or `apply()` to use another object's method.

```javascript
const person1 = {
    name: "Alice",

    greet() {
        console.log(this.name);
    }
};

const person2 = {
    name: "Bob"
};

person1.greet.call(person2);
```

Output:

```
Bob
```

---

# 10. Can arrow functions use `call()`, `apply()`, or `bind()`?

No. Arrow functions do not have their own `this`; they inherit it lexically.

```javascript
const name = "Global";

const obj = {
    name: "John",

    arrow: () => {
        console.log(this.name);
    }
};

obj.arrow.call({ name: "Alice" });
```

Output:

```
Global
```

`call()` cannot change the `this` of an arrow function.

---

# 11. What is partial application using `bind()`?

`bind()` can pre-fill arguments.

```javascript
function multiply(a, b) {
    return a * b;
}

const double = multiply.bind(null, 2);

console.log(double(5));
```

Output:

```
10
```

---

# 12. What happens if `thisArg` is `null` or `undefined`?

```javascript
function show() {
    console.log(this);
}

show.call(null);
```

- In **non-strict mode**, `this` becomes the global object (`window` in browsers).
- In **strict mode**, `this` remains `null`.

---

# 13. Can `apply()` accept multiple arguments?

No.

Incorrect:

```javascript
fn.apply(obj, 1, 2, 3);
```

Correct:

```javascript
fn.apply(obj, [1, 2, 3]);
```

---

# 14. Can `call()` accept an array?

Yes, but only as a **single argument**.

```javascript
function show(...args) {
    console.log(args);
}

show.call(null, [1, 2, 3]);
```

Output:

```
[[1, 2, 3]]
```

To pass array elements as separate arguments:

```javascript
show.call(null, ...[1, 2, 3]);
```

Output:

```
[1, 2, 3]
```

---

# 15. Real Interview Question

### What is the output?

```javascript
const person = {
    name: "John"
};

function greet(city) {
    console.log(this.name, city);
}

const bound = greet.bind(person);

bound.call({ name: "Alice" }, "Delhi");
```

**Answer:**

```
John Delhi
```

Reason: `bind()` permanently binds `this`. `call()` cannot override it.

---

# 16. Tricky Interview Question

```javascript
function test() {
    console.log(this);
}

const obj = {};

const fn = test.bind(obj);

fn.apply(window);
```

**Output:**

```
{}
```

Reason: `bind()` takes precedence over `apply()` for the `this` value.

---

# 17. Which method is used in event handlers?

Usually `bind()`.

```javascript
button.addEventListener(
    "click",
    obj.handleClick.bind(obj)
);
```

---

## Quick Interview Cheat Sheet

| Question                                | Answer                                  |
| --------------------------------------- | --------------------------------------- |
| Executes immediately?                   | `call()`, `apply()`                     |
| Returns new function?                   | `bind()`                                |
| Arguments individually?                 | `call()`, `bind()`                      |
| Arguments as array?                     | `apply()`                               |
| Can `bind()` be overridden by `call()`? | No                                      |
| Used for function borrowing?            | `call()`, `apply()`                     |
| Used for event handlers?                | `bind()`                                |
| Works with arrow functions?             | Cannot change `this` of arrow functions |
| Supports partial application?           | `bind()`                                |

These questions cover the majority of `call()`, `apply()`, and `bind()` topics commonly asked in JavaScript interviews, especially for front-end and full-stack roles.

Here are some **advanced (`call()`, `apply()`, `bind()`) interview questions** that are commonly asked in interviews at companies like Amazon, Microsoft, Adobe, Walmart, and product-based startups.

---

# 1. What is the output?

```javascript
const obj = {
  name: "John"
};

function show() {
  console.log(this.name);
}

const bound = show.bind(obj);

bound.call({ name: "Alice" });
```

### Output

```
John
```

### Why?

`bind()` permanently binds `this`. Once a function is bound, `call()` and `apply()` cannot change its `this`.

---

# 2. What is the output?

```javascript
const obj = {
  x: 10,

  getX() {
    return this.x;
  }
};

const fn = obj.getX;

console.log(fn());
```

### Output

```
undefined
```

(in strict mode)

### Why?

The method is detached from the object, so `this` is no longer `obj`.

Correct:

```javascript
const fn = obj.getX.bind(obj);
```

---

# 3. What is the output?

```javascript
const obj = {
  name: "John"
};

function greet(age) {
  console.log(this.name, age);
}

greet.bind(obj)(25);
```

### Output

```
John 25
```

---

# 4. What is the output?

```javascript
function add(a, b) {
  return a + b;
}

const add10 = add.bind(null, 10);

console.log(add10(5));
```

### Output

```
15
```

This is called **partial application**.

---

# 5. Predict the output

```javascript
function show() {
  console.log(this);
}

show.call(null);
```

### Answer

Strict mode:

```
null
```

Non-strict mode:

```
window
```

---

# 6. What is the output?

```javascript
const person = {
  name: "John",

  greet: () => {
    console.log(this.name);
  }
};

person.greet.call({ name: "Alice" });
```

### Output

```
undefined
```

### Why?

Arrow functions don't have their own `this`.

`call()`, `apply()`, and `bind()` cannot change the `this` value of an arrow function.

---

# 7. What is the output?

```javascript
function show(a, b) {
  console.log(this.name, a, b);
}

const obj = {
  name: "John"
};

show.apply(obj, [10, 20]);
```

### Output

```
John 10 20
```

---

# 8. Predict the output

```javascript
function show(a) {
  console.log(a);
}

show.call(null, [1, 2]);
```

### Output

```
[1, 2]
```

Only one argument is passed.

---

# 9. What is the output?

```javascript
function show(...args) {
  console.log(args);
}

show.call(null, ...[1, 2, 3]);
```

### Output

```
[1, 2, 3]
```

---

# 10. What is the output?

```javascript
function show() {
  console.log(this.name);
}

const obj = {
  name: "John"
};

const fn = show.bind(obj);

setTimeout(fn, 1000);
```

### Output

```
John
```

Without `bind()`, `this` would not refer to `obj`.

---

# 11. Can `bind()` be called multiple times?

```javascript
function show() {
  console.log(this.name);
}

const fn = show.bind({ name: "John" });

const fn2 = fn.bind({ name: "Alice" });

fn2();
```

### Output

```
John
```

### Why?

The first `bind()` wins. Subsequent `bind()` calls cannot change `this`.

---

# 12. What is the output?

```javascript
function show() {
  console.log(this.name);
}

const obj = {
  name: "John"
};

const bound = show.bind(obj);

bound.apply({ name: "Alice" });
```

### Output

```
John
```

---

# 13. What is the output?

```javascript
const obj = {
  x: 5,

  show() {
    console.log(this.x);
  }
};

const another = {
  x: 100
};

another.show = obj.show;

another.show();
```

### Output

```
100
```

`this` depends on **how the function is called**, not where it was defined.

---

# 14. Predict the output

```javascript
const obj = {
  x: 10,

  show() {
    return () => {
      console.log(this.x);
    };
  }
};

const fn = obj.show();

fn.call({ x: 50 });
```

### Output

```
10
```

The returned arrow function captures `this` from `show()`, so `call()` has no effect.

---

# 15. Constructor + bind (Very Popular)

```javascript
function Person(name) {
  this.name = name;
}

const BoundPerson = Person.bind({
  name: "Old"
});

const p = new BoundPerson("John");

console.log(p.name);
```

### Output

```
John
```

### Why?

When a bound function is called with `new`, the newly created instance becomes `this`, ignoring the bound `thisArg`.

---

# 16. What is the output?

```javascript
function show() {
  console.log(this.name);
}

const obj = {
  name: "John"
};

const bound = show.bind(obj);

new bound();
```

### Output

```
undefined
```

### Why?

Using `new` creates a fresh object. The bound `this` is ignored, so the new object has no `name` property.

---

# 17. Implement your own `bind()`

```javascript
Function.prototype.myBind = function (context, ...args) {
  const fn = this;

  return function (...newArgs) {
    return fn.apply(context, [...args, ...newArgs]);
  };
};
```

This is a common coding interview question. (A production-ready polyfill also needs to handle constructor calls with `new`.)

---

# 18. Implement your own `call()`

```javascript
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis;

  const key = Symbol();

  context[key] = this;

  const result = context[key](...args);

  delete context[key];

  return result;
};
```

---

# 19. Implement your own `apply()`

```javascript
Function.prototype.myApply = function (context, args = []) {
  context = context || globalThis;

  const key = Symbol();

  context[key] = this;

  const result = context[key](...args);

  delete context[key];

  return result;
};
```

---

# 20. Most Difficult Interview Question

### What is the output?

```javascript
const obj = {
  name: "John"
};

function show() {
  console.log(this.name);
}

const bound = show.bind(obj);

const another = {
  name: "Alice",
  fn: bound
};

another.fn.call({
  name: "Bob"
});
```

### Output

```
John
```

### Why?

1. `show.bind(obj)` permanently binds `this` to `obj`.
2. Assigning the bound function to another object does not change its `this`.
3. Calling it with `call()` also cannot override the bound `this`.

---

## Interview Tip

A common follow-up question is:

> **Which has higher priority: `new`, `bind`, `call`, or `apply`?**

The precedence is:

```
new  >  bind  >  call/apply  >  implicit object call  >  default/global
```

For example:

```javascript
function Foo() {
  console.log(this);
}

const bound = Foo.bind({ a: 1 });

bound.call({ b: 2 }); // this -> { a: 1 }

new bound();          // this -> new instance
```

Understanding this precedence helps explain many tricky `this`-binding questions in interviews.


If you mean **complex interview questions on `this`**, here are some of the trickiest ones, along with explanations.

---

# 1. Nested Function

```javascript
const obj = {
  name: "John",

  show() {
    console.log(this.name);

    function inner() {
      console.log(this.name);
    }

    inner();
  }
};

obj.show();
```

### Output

```text
John
undefined
```

**Why?**

* `show()` is called as `obj.show()`, so `this === obj`.
* `inner()` is a regular function, so `this` is the global object (or `undefined` in strict mode).

**Fix**

```javascript
const obj = {
  name: "John",

  show() {
    const inner = () => {
      console.log(this.name);
    };

    inner();
  }
};

obj.show();
```

Output:

```text
John
```

---

# 2. Method Extraction

```javascript
const obj = {
  name: "John",

  show() {
    console.log(this.name);
  }
};

const fn = obj.show;

fn();
```

### Output

```text
undefined
```

`this` depends on **how the function is called**, not where it is defined.

---

# 3. `setTimeout`

```javascript
const obj = {
  name: "John",

  show() {
    setTimeout(function () {
      console.log(this.name);
    }, 0);
  }
};

obj.show();
```

### Output

```text
undefined
```

### Fix

```javascript
setTimeout(() => {
  console.log(this.name);
});
```

Output

```text
John
```

---

# 4. `bind()` vs `call()`

```javascript
function show() {
  console.log(this.name);
}

const obj1 = {
  name: "John"
};

const obj2 = {
  name: "Alice"
};

const fn = show.bind(obj1);

fn.call(obj2);
```

### Output

```text
John
```

`bind()` wins.

---

# 5. Arrow Function Inside Object

```javascript
const obj = {
  name: "John",

  show: () => {
    console.log(this.name);
  }
};

obj.show();
```

### Output

```text
undefined
```

Arrow functions don't create their own `this`.

---

# 6. Arrow Returning Arrow

```javascript
const obj = {
  name: "John",

  show() {
    return () => {
      console.log(this.name);
    };
  }
};

const fn = obj.show();

fn.call({
  name: "Alice"
});
```

### Output

```text
John
```

Arrow functions ignore `call()`.

---

# 7. Constructor + `bind()`

```javascript
function Person(name) {
  this.name = name;
}

const Bound = Person.bind({
  name: "Old"
});

const p = new Bound("John");

console.log(p.name);
```

### Output

```text
John
```

`new` ignores the bound `this`.

---

# 8. Multiple `bind()`

```javascript
function show() {
  console.log(this.name);
}

const fn1 = show.bind({
  name: "John"
});

const fn2 = fn1.bind({
  name: "Alice"
});

fn2();
```

### Output

```text
John
```

Only the first `bind()` affects `this`.

---

# 9. Object Reference Trick

```javascript
const obj = {
  name: "John",

  show() {
    console.log(this.name);
  }
};

const another = {
  name: "Alice",
  show: obj.show
};

another.show();
```

### Output

```text
Alice
```

`this` is determined by the object before the dot (`another.show()`).

---

# 10. Chained Assignment

```javascript
const obj = {
  name: "John",

  show() {
    console.log(this.name);
  }
};

const fn = obj.show;

obj.show();
fn();
```

### Output

```text
John
undefined
```

---

# 11. Destructuring

```javascript
const obj = {
  name: "John",

  show() {
    console.log(this.name);
  }
};

const { show } = obj;

show();
```

### Output

```text
undefined
```

Destructuring extracts the function without its object context.

---

# 12. Callback

```javascript
const obj = {
  name: "John",

  show() {
    console.log(this.name);
  }
};

function execute(fn) {
  fn();
}

execute(obj.show);
```

### Output

```text
undefined
```

---

# 13. Array Method

```javascript
const obj = {
  nums: [1, 2, 3],

  print() {
    this.nums.forEach(function (n) {
      console.log(this, n);
    });
  }
};

obj.print();
```

### Output

```text
undefined 1
undefined 2
undefined 3
```

### Fix

```javascript
this.nums.forEach((n) => {
  console.log(this.nums, n);
});
```

---

# 14. `call()` on Arrow Function

```javascript
const show = () => {
  console.log(this);
};

show.call({
  x: 10
});
```

### Output

The lexical `this` (not `{ x: 10 }`).

`call()` cannot change the `this` of an arrow function.

---

# 15. The Hardest One

```javascript
const obj = {
  name: "John",

  show() {
    console.log(this.name);

    return function () {
      console.log(this.name);

      return () => {
        console.log(this.name);
      };
    };
  }
};

obj.show()()();
```

### Output

```text
John
undefined
undefined
```

### Explanation

1. `obj.show()` → `this` is `obj` → `"John"`.
2. Returned regular function is called as `()`, so `this` is `undefined` (or the global object in non-strict mode).
3. The returned arrow function captures the `this` of the regular function, so it also logs `undefined`.

---

## Golden Rules for `this`

Remember these five rules in order of precedence:

1. **`new` binding** → `this` is the newly created object.
2. **Explicit binding** → `call()`, `apply()`, `bind()`.
3. **Implicit binding** → `obj.method()`.
4. **Default binding** → regular function call (`fn()`).
5. **Arrow functions** → no own `this`; they inherit it lexically from the surrounding scope.

These patterns cover the majority of advanced `this` questions asked in JavaScript interviews.
Here are **advanced and tricky interview questions** on `let`, `var`, and `const` that are commonly asked in JavaScript interviews.

---

# 1. What is the output?

```javascript
console.log(a);
var a = 10;

console.log(b);
let b = 20;
```

### Output

```text
undefined
ReferenceError
```

**Explanation**

* `var` is hoisted and initialized with `undefined`.
* `let` is hoisted but stays in the **Temporal Dead Zone (TDZ)** until its declaration.

---

# 2. What is the output?

```javascript
var a = 10;

function test() {
    console.log(a);
    var a = 20;
}

test();
```

### Output

```text
undefined
```

Equivalent to:

```javascript
function test() {
    var a;
    console.log(a);
    a = 20;
}
```

---

# 3. What is the output?

```javascript
let a = 10;

function test() {
    console.log(a);
    let a = 20;
}

test();
```

### Output

```text
ReferenceError
```

**Reason:** The inner `a` shadows the outer `a` but is in the TDZ until initialized.

---

# 4. What is the output?

```javascript
{
    console.log(a);
    let a = 10;
}
```

### Output

```text
ReferenceError
```

---

# 5. What is the output?

```javascript
{
    console.log(a);
    var a = 10;
}
```

### Output

```text
undefined
```

---

# 6. What is the output?

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
```

### Output

```text
3
3
3
```

---

# 7. What is the output?

```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
```

### Output

```text
0
1
2
```

**Reason:** `let` creates a new binding for each loop iteration.

---

# 8. What is the output?

```javascript
const obj = {
    name: "John"
};

obj.name = "Alice";

console.log(obj.name);
```

### Output

```text
Alice
```

`const` prevents reassignment of the variable, not mutation of the object.

---

# 9. What is the output?

```javascript
const obj = {
    name: "John"
};

obj = {};
```

### Output

```text
TypeError
```

You cannot reassign a `const` variable.

---

# 10. What is the output?

```javascript
{
    var x = 10;
}

console.log(x);
```

### Output

```text
10
```

---

# 11. What is the output?

```javascript
{
    let x = 10;
}

console.log(x);
```

### Output

```text
ReferenceError
```

---

# 12. What is the output?

```javascript
var a = 10;

{
    let a = 20;
}

console.log(a);
```

### Output

```text
10
```

---

# 13. What is the output?

```javascript
let a = 10;

{
    let a = 20;
    console.log(a);
}

console.log(a);
```

### Output

```text
20
10
```

This demonstrates **variable shadowing**.

---

# 14. What is the output?

```javascript
let a = 10;

{
    var b = 20;
}

console.log(a);
console.log(b);
```

### Output

```text
10
20
```

---

# 15. What is the output?

```javascript
var a = 10;

{
    var a = 20;
}

console.log(a);
```

### Output

```text
20
```

`var` ignores block scope.

---

# 16. What is the output?

```javascript
var a = 1;

function test() {
    console.log(a);

    if (true) {
        var a = 2;
    }

    console.log(a);
}

test();
```

### Output

```text
undefined
2
```

The inner `var a` is hoisted to the top of the function.

---

# 17. What is the output?

```javascript
let a = 1;

function test() {
    console.log(a);

    if (true) {
        let a = 2;
    }
}

test();
```

### Output

```text
1
```

The inner `let` exists only inside the `if` block.

---

# 18. What is the output?

```javascript
function test() {
    if (true) {
        var a = 10;
        let b = 20;
    }

    console.log(a);
    console.log(b);
}

test();
```

### Output

```text
10
ReferenceError
```

---

# 19. What is the output?

```javascript
console.log(typeof a);

let a = 10;
```

### Output

```text
ReferenceError
```

Many expect `"undefined"`, but `typeof` does **not** bypass the TDZ for `let` and `const`.

---

# 20. What is the output?

```javascript
console.log(typeof a);
```

### Output

```text
"undefined"
```

Here, `a` was never declared, so `typeof` safely returns `"undefined"`.

---

# 21. What is the output?

```javascript
let x = 10;

{
    console.log(x);

    let x = 20;
}
```

### Output

```text
ReferenceError
```

The inner `x` shadows the outer one and is in the TDZ.

---

# 22. What is the output?

```javascript
var x = 10;

{
    console.log(x);

    var x = 20;
}
```

### Output

```text
undefined
```

Equivalent to:

```javascript
var x;

console.log(x);

x = 10;

console.log(x);

x = 20;
```

The `var x` declaration inside the block is the same declaration as the outer `var x`, so the first `console.log(x)` runs before the assignment `x = 10`.

---

# 23. What is the output?

```javascript
const arr = [1, 2];

arr.push(3);

console.log(arr);
```

### Output

```text
[1, 2, 3]
```

---

# 24. What is the output?

```javascript
const arr = [1, 2];

arr = [];
```

### Output

```text
TypeError
```

---

# 25. What is the output?

```javascript
var a = 10;

(function () {
    console.log(a);

    var a = 20;
})();
```

### Output

```text
undefined
```

The `var a` inside the IIFE is hoisted within that function.

---

## ⭐ Most Frequently Asked Theory Questions

1. What is hoisting?
2. What is the Temporal Dead Zone (TDZ)?
3. Why is `let` preferred over `var`?
4. Why should `const` be the default choice?
5. Can a `const` object be modified?
6. Difference between **scope** and **hoisting**.
7. Difference between **redeclaration** and **reassignment**.
8. What is variable shadowing?
9. What is illegal shadowing?
10. Why does `let` in a `for` loop print `0 1 2`, while `var` prints `3 3 3`?

These questions are commonly used to test a deep understanding of JavaScript's scoping and execution model.
