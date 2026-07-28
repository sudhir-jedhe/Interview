**3. What is a closure in JavaScript? Provide an example.**
Answer:

```js
function outer() {
  const message = 'Hello';
  function inner() {
    console.log(message);
  }
  return inner;
}

const innerFunc = outer();
innerFunc();  // Output: 'Hello'

This code outputs  because of a core JavaScript concept called a closure, which allows an inner function to remember and access variables from its outer function's scope even after the outer function has finished executing. [1, 2, 3, 4, 5]
Here is the step-by-step breakdown of how this works:
1. Function Definition

•  defines a local variable .
•  is nested inside  and references . [6, 7, 8]

2. Scope Chain Creation

• Every function in JavaScript creates a "lexical environment" when defined.
•  gets access to its own scope and the scope of its parent, .
• This link between  and 's variables is the closure. [9, 10, 11, 12]

3. Execution and Return

•  is called and assigns  to .
•  returns the actual function definition of  without running it.
• The variable  now holds a reference to the  function. [13, 14, 15, 16]

4. Code Execution

•  finishes running and its execution context is popped off the call stack.
• Under normal circumstances, its local variables () would be destroyed.
• However, because  still references , the JavaScript engine keeps  in memory. [17, 18, 19, 20, 21]

5. Final Output

•  is invoked in the global scope.
• It looks for  inside its own local scope and does not find it.
• It looks up the closure chain to 's saved scope, finds , and prints . [22, 23, 24, 25, 26]

If you would like to explore this concept further, I can provide examples of how closures are used for data privacy, how they work with asynchronous loops, or how they affect memory management. Which area would you like to see next?

AI responses may include mistakes.

[1] https://pynative.com/python-inner-functions/
[2] https://www.humankode.com/javascript/javascript-closures-made-easy/
[3] https://www.scaler.com/topics/javascript/closure-in-javascript/
[4] https://frontend.turing.edu/lessons/module-2/closures.html
[5] https://www.codingem.com/javascript-closures/
[6] https://gurindernarang.medium.com/closures-and-lexical-scoping-in-js-d0e0a12d49ae
[7] https://medium.com/analytics-vidhya/python-functions-6920c88c9f6f
[8] https://levelup.gitconnected.com/understanding-closures-in-javascript-a-comprehensive-guide-3f190d4a99a1
[9] https://codeworks.me/blog/what-is-closure-in-javascript/
[10] https://www.sitepoint.com/javascript-closures-demystified/
[11] https://www.educative.io/answers/lexical-scope-in-javascript
[12] https://basarat.gitbook.io/typescript/recap/closure
[13] https://unstop.com/blog/python-scope
[14] https://www.alooba.com/skills/concepts/javascript-49/javascript-closure/
[15] https://levelup.gitconnected.com/python-closures-in-30-seconds-b55390a874e9
[16] https://www.tutorialsteacher.com/javascript/closure-in-javascript
[17] https://www.ituonline.com/tech-definitions/what-is-lexical-closure/
[18] https://dev.to/sinhasagar01/closure-in-javascript-3bfh
[19] https://www.vaia.com/en-us/textbooks/computer-science/starting-out-with-python-4-edition/chapter-5/problem-8-when-a-function-is-executing-what-happens-when-the/
[20] https://ics.uci.edu/~thornton/icsh32/Notes/Modules/
[21] https://www.sitepoint.com/community/t/calling-a-function-only-once/35230
[22] https://dmitripavlutin.com/javascript-closure/
[23] https://www.upgrad.com/tutorials/software-engineering/python-tutorial/global-variable-in-python/
[24] https://www.developerway.com/posts/fantastic-closures
[25] https://zainmughalkpk.medium.com/understanding-closure-and-lexical-scope-in-javascript-63cb8a378c8d
[26] https://www.datacamp.com/tutorial/decorators-python


function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable

  return {
    deposit(amount) {
      balance += amount;
      return `Balance: $${balance}`;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return `Balance: $${balance}`;
    }
  };
}

const myAccount = createBankAccount(100);
console.log(myAccount.deposit(50));    // Output: Balance: $150
console.log(myAccount.withdraw(30));   // Output: Balance: $120
console.log(myAccount.balance);        // Output: undefined (Secure!)
```

function attachClickTracking(productId) {
const button = document.createElement('button');
button.innerText = `Buy Product ${productId}`;

// Closure preserves the 'productId' variable for this specific button
button.addEventListener('click', function() {
console.log(`Sending analytics: User clicked product ${productId}`);
});

document.body.appendChild(button);
}

// Generates independent closures for each product
attachClickTracking(101);
attachClickTracking(102);

```


function createAPIClient(baseURL) {
  // Closure remembers the base URL
  return async function(endpoint) {
    const fullURL = `${baseURL}/${endpoint}`;
    console.log(`Fetching data from: ${fullURL}`);
    // fetch(fullURL)...
  };
}

// Create specialized fetchers
const devFetch = createAPIClient('https://company.com');
const prodFetch = createAPIClient('https://company.com');

devFetch('users'); // Tracks to dev environment
prodFetch('users'); // Tracks to production environment


Here is how closures are used to solve performance issues (Memoization) and how they can accidentally cause bugs in loops.
## 1. Performance Optimization (Memoization)
Memoization caches the results of expensive function calls. A closure is used to store a private cache object so it persists across multiple function executions without cluttering the global scope.

function createHeavyCalculator() {
  const cache = {}; // Private cache persistent via closure

  return function(num) {
    if (num in cache) {
      return `[Cache Hit] Result: ${cache[num]}`;
    }

    // Simulating an expensive CPU calculation
    let result = num * 2;
    cache[num] = result;

    return `[Calculated] Result: ${result}`;
  };
}
const calculate = createHeavyCalculator();

console.log(calculate(10)); // Output: [Calculated] Result: 20
console.log(calculate(10)); // Output: [Cache Hit] Result: 20

------------------------------
## 2. The Classic Loop Bug (And the Closure Fix)
A very common interview and production bug occurs when creating asynchronous operations (like setTimeout or event listeners) inside loops using the old var keyword.
## The Broken Code (var)
Because var is function-scoped (not block-scoped), every iteration shares the exact same variable i. By the time the 100ms timer finishes, the loop has already completed, and i has reached 3.

for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(`Index: ${i}`);
  }, 100);
}// Output after 100ms:// Index: 3// Index: 3// Index: 3

## Fix Variant A: Modern Block Scope (let)
The cleanest modern fix is changing var to let. In JavaScript, let creates a brand new variable bindings and a unique closure block for each individual iteration of the loop.

for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(`Index: ${i}`);
  }, 100);
}// Output:// Index: 0// Index: 1// Index: 2

## Fix Variant B: Explicit Closure (IIFE)
If you work on legacy systems where let is not supported, you must manually force a closure using an Immediately Invoked Function Expression (IIFE) to capture the current value of i in a local parameter (index).

for (var i = 0; i < 3; i++) {
  (function(index) {
    setTimeout(function() {
      console.log(`Index: ${index}`);
    }, 100);
  })(i); // Passes 'i' into the isolated function scope
}// Output:// Index: 0// Index: 1// Index: 2

To round out your knowledge, I can show you how closures can cause memory leaks if not handled carefully, or we can look at a real-world React hook example (like useState) that relies entirely on closures. Which one sounds more helpful?

Here is how closures cause memory leaks in JavaScript and how they serve as the underlying foundation for React Hooks like useState.
------------------------------
## 1. The Dark Side: Memory Leaks
Because closures keep variables in memory as long as the inner function exists, they can accidentally prevent large objects from being cleaned up by the Garbage Collector (GC).
## The Problematic Code
In this scenario, longRunningFunction returns an inner function that is stored globally. Because that inner function references largeData, that massive array can never be cleared from memory, even if we never call inner again.

function longRunningFunction() {
  const largeData = new Array(1000000).fill("🚨"); // Uses massive memory

  return function() {
    console.log("I am active.");
    // Even if we don't explicitly use largeData here,
    // some V8 engines might retain the entire parent scope.
  };
}
// This variable stays in the global window/global scopeconst leak = longRunningFunction();

## The Fix
Manually break the closure reference by setting the variable holding the inner function to null once it is no longer needed. This signals the garbage collector to free up the memory.

// Run the codeconst leak = longRunningFunction();
leak();
// Clean up when done
leak = null; // Garbage collector now frees up largeData!

------------------------------
## 2. How React Hooks (useState) Use Closures
Have you ever wondered how a functional React component remembers its state across multiple renders without global variables? It uses closures under the hood.
Below is a simplified mental model of how React manages state internally using a global array and a closure-based function factory.

// A simplified mock of React's internal architecturelet memoizedStates = []; // React's internal array of stateslet stateIndex = 0;      // Tracks which hook is being called
function mockUseState(initialValue) {
  // 1. If state doesn't exist yet, initialize it
  const currentIndex = stateIndex;
  if (memoizedStates[currentIndex] === undefined) {
    memoizedStates[currentIndex] = initialValue;
  }

  // 2. The setter function creates a CLOSURE.
  // It permanently locks onto 'currentIndex' even after mockUseState finishes.
  const setState = (newValue) => {
    memoizedStates[currentIndex] = newValue;
    triggerReRender(); // Simulates re-rendering the UI
  };

  stateIndex++; // Move pointer for the next hook call
  return [memoizedStates[currentIndex], setState];
}
// --- Component Simulation ---function MyComponent() {
  const [count, setCount] = mockUseState(0);
  console.log(`Rendered! Count is: ${count}`);

  return { click: () => setCount(count + 1) };
}
// Simulated Executionlet app = MyComponent(); // Output: Rendered! Count is: 0
app.click();             // Output: Rendered! Count is: 1

## Why Hooks Have Rules
This closure architecture is precisely why React states you cannot use hooks inside if statements or loops. If you skip a hook, the stateIndex shifts, pointing the closure to the wrong index in the memoizedStates array, completely breaking your app's data tracking.
We have now covered data privacy, custom factories, performance optimization, loop bugs, memory leaks, and framework internals. To help you lock this in, I can give you a short, realistic interview practice question to test your reading, or I can show you how closures are used in Node.js middleware. What would you prefer?



```

**4. What is event delegation in JavaScript?**
Answer: Event delegation is a technique where a single event listener is attached to a common ancestor, allowing events to be handled for multiple children.

**5. What is the difference between == and === in JavaScript?**
Answer: == checks for equality with type coercion, while === checks for strict equality without type coercion.

difference between ==(abstract equality) and ===(strict equality) is that the == compares by value after coercion and === compares by value and type without coercion.

Let's dig deeper on the ==. So first let's talk about coercion.

coercion is the process of converting a value to another type. As in this case, the == does implicit coercion. The == has some conditions to perform before comparing the two values.

Suppose we have to compare x == y values.

If x and y have same type. Then compare them with the === operator.
If x is null and y is undefined then return true.
If x is undefined and y is null then return true.
If x is type number and y is type string Then return x == toNumber(y).
If x is type string and y is type number Then return toNumber(x) == y.
If x is type boolean Then return toNumber(x) == y.
If y is type boolean Then return x == toNumber(y).
If x is either string,symbol or number and y is type object Then return x == toPrimitive(y).
If x is either object and x is either string,symbol Then return toPrimitive(x) == y.
Return false.

toPrimitive uses first the valueOf method then the toString method in objects to get the primitive value of that object.

Let's have examples.

x y x == y
5 5 true
1 '1' true
null undefined true
0 false true
'1,2' [1,2] true
'[object Object]' {} true
These examples all return true.

The first example goes to condition one because x and y have the same type and value.

The second example goes to condition four y is converted to a number before comparing.

The third example goes to condition two.

The fourth example goes to condition seven because y is boolean.

The fifth example goes to condition eight. The array is converted to a string using the toString() method which returns 1,2.

The last example goes to condition ten. The object is converted to a string using the toString() method which returns [object Object].

| x                 | y         | x == y |
| ----------------- | --------- | ------ |
| 5                 | 5         | true   |
| 1                 | '1'       | true   |
| null              | undefined | true   |
| 0                 | false     | true   |
| '1,2'             | [1,2]     | true   |
| '[object Object]' | {}        | true   |

If we use the === operator all the comparisons except for the first example will return false because they don't have the same type while the first example will return true because the two have the same type and value.

**6. What is the purpose of the async and await keywords in JavaScript?**
Answer: async and await are features introduced in ES2017 (ES8) that make working with asynchronous code more readable and easier to manage. They are built on top of promises.

1. async:
   async is used to declare that a function will work with promises and may use await within its body.
   It allows a function to return a promise implicitly.
   Functions marked with async always return a promise, even if you return a non-promise value.

```js
async function asyncFunction() {
  return 42; // Equivalent to returning Promise.resolve(42)
}
```

2. await:
   await can only be used within an async function.
   It is used to pause the execution of the function until a promise is resolved or rejected.
   It "awaits" the result of a promise and returns the resolved value or throws an error for a rejected promise.

```js
async function fetchUserData() {
  try {
    const response = await fetch("https://api.example.com/user");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
```

3. Difference from .then():
   While both await and .then() handle asynchronous operations, the key difference lies in how they manage the flow of asynchronous code.
   .then() is used with promises and is chaining-based, where each .then() function returns a promise and allows you to chain further operations.
   await, on the other hand, allows for more synchronous-like code within async functions, making asynchronous code appear more linear and readable.

```js
// Using .then()
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// Using await
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

In summary, async and await make asynchronous code look and behave more like synchronous code, enhancing readability and maintainability, especially when dealing with promises.

**7. Explain what the this keyword refers to in JavaScript.**
Answer: this refers to the object on which a method is being called.

Basically, this refers to the value of the object that is currently executing or invoking the function. I say currently due to the reason that the value of this changes depending on the context on which we use it and where we use it.

```js
const carDetails = {
  name: "Ford Mustang",
  yearBought: 2005,
  getName() {
    return this.name;
  },
  isRegistered: true,
};

console.log(carDetails.getName()); // logs Ford Mustang
```

This is what we would normally expect because in the getName method we return this.name, this in this context refers to the object which is the carDetails object that is currently the "owner" object of the function executing.

Ok, Let's some add some code to make it weird. Below the console.log statement add this three lines of code

```
   var name = "Ford Ranger";
   var getCarName = carDetails.getName;

   console.log(getCarName()); // logs Ford Ranger

```

The second console.log statement prints the word Ford Ranger which is weird because in our first console.log statement it printed Ford Mustang. The reason to this is that the getCarName method has a different "owner" object that is the window object. Declaring variables with the var keyword in the global scope attaches properties in the window object with the same name as the variables. Remember this in the global scope refers to the window object when "use strict" is not used.

```js
console.log(getCarName === window.getCarName); //logs true
console.log(getCarName === this.getCarName); // logs true
```

this and window in this example refer to the same object.

One way of solving this problem is by using the apply and call methods in functions.

```js
console.log(getCarName.apply(carDetails)); //logs Ford Mustang
console.log(getCarName.call(carDetails)); //logs Ford Mustang
```

The apply and call methods expects the first parameter to be an object which would be value of this inside that function.

IIFE or Immediately Invoked Function Expression, Functions that are declared in the global scope, Anonymous Functions and Inner functions in methods inside an object has a default of this which points to the window object.

```js
(function () {
  console.log(this);
})(); //logs the "window" object

function iHateThis() {
  console.log(this);
}

iHateThis(); //logs the "window" object

const myFavoriteObj = {
  guessThis() {
    function getThis() {
      console.log(this);
    }
    getThis();
  },
  name: "Marko Polo",
  thisIsAnnoying(callback) {
    callback();
  },
};

myFavoriteObj.guessThis(); //logs the "window" object
myFavoriteObj.thisIsAnnoying(function () {
  console.log(this); //logs the "window" object
});
```

If we want to get the value of the name property which is Marko Polo in the myFavoriteObj object there are two ways to solve this.

First, we save the value of this in a variable.

```js
const myFavoriteObj = {
  guessThis() {
    const self = this; //saves the this value to the "self" variable
    function getName() {
      console.log(self.name);
    }
    getName();
  },
  name: "Marko Polo",
  thisIsAnnoying(callback) {
    callback();
  },
};
```

In this image we save the value of this which would be the myFavoriteObj object. So we can access it inside the getName inner function.

Second, we use ES6 Arrow Functions.

```js
const myFavoriteObj = {
  guessThis() {
    const getName = () => {
      //copies the value of "this" outside of this arrow function
      console.log(this.name);
    };
    getName();
  },
  name: "Marko Polo",
  thisIsAnnoying(callback) {
    callback();
  },
};
```

Arrow Functions does not have its own this. It copies the value of this of the enclosing lexical scope or in this example the value of this outside the getName inner function which would be the myFavoriteObj object. We can also determine the value of this on how the function is invoked.

**8. What is a promise in JavaScript? Provide an example of creating and using a promise.**
Answer:

```js
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved!");
  }, 2000);
});

myPromise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

**9. What is a callback function in JavaScript? Provide an example.**
Answer:

```js
function fetchData(callback) {
  setTimeout(() => {
    callback("Data fetched!");
  }, 2000);
}

fetchData((data) => {
  console.log(data);
});
```

**10. What is the difference between null and undefined in JavaScript?**

Answer: null is an assignment value representing no value or no object, while undefined is a primitive value automatically assigned to uninitialized variables.

**11. What is event bubbling in JavaScript?**
Answer: Event bubbling is the propagation of an event from the target element up to its parent and higher ancestors in the DOM tree.

**12. What is event.preventDefault()? Provide an example of its usage.**
Description: event.preventDefault() is used to prevent the default behavior of an event, such as form submission or link navigation.

Answer:

```js
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevents form submission
  console.log("Form submission prevented.");
});
```

**13. What are arrow functions in JavaScript? Provide an example.**
Answer:

```js
const add = (a, b) => a + b;
console.log(add(2, 3)); // Output: 5
```

**14. What is the purpose of the localStorage and sessionStorage objects in JavaScript?**
Answer: They provide a way to store key-value pairs in a web browser, with localStorage persisting even after the browser is closed and reopened, and sessionStorage existing only for the duration of the page session.

**15. Explain event handling in JavaScript and provide an example of attaching an event listener.**
Answer:

```js
const button = document.getElementById("myButton");

button.addEventListener("click", () => {
  console.log("Button clicked!");
});
```

**16. What is the difference between map() and forEach() array methods in JavaScript?**
Answer: map() returns a new array with the results of a function applied to each element, while forEach() only iterates over the array and does not return a new array.

**17. What is a RESTful API and how do you make a GET request using JavaScript?**
Answer:

```js
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

**18. What is the purpose of the use strict directive in JavaScript?**

The "use strict" directive in JavaScript is used to enable a stricter interpretation of the code, catching common mistakes and preventing the use of certain error-prone features. When this directive is applied, the JavaScript engine enforces stricter rules for writing code.

1. Purpose:
   It helps in writing more reliable and maintainable code by identifying and disallowing potentially error-prone behavior.
   It prevents the accidental creation of global variables by enforcing block scope rules with let and const.
   It disallows the use of certain language features that are deprecated or considered bad practice.

2. Example:

```js
// Without "use strict"
function withoutStrict() {
  variable = 10; // This will create a global variable accidentally
  console.log(variable);
}

withoutStrict(); // Output: 10

// With "use strict"
function withStrict() {
  "use strict";
  variable = 20; // This will throw a ReferenceError
  console.log(variable);
}

withStrict(); // Error: variable is not defined
```

In the first example without "use strict," variable is mistakenly created as a global variable, which can lead to unexpected behavior and bugs in a larger codebase.

In the second example with "use strict," attempting to assign a value to variable without declaring it with var, let, or const will throw a ReferenceError, indicating that variable is not defined. This helps catch potential bugs and encourages better coding practices.

To enable "use strict" globally in a script, you can add it at the beginning of your JavaScript file or within a function. For modern JavaScript development, it's recommended to use "use strict" to enhance code quality and reduce the risk of errors.

Restrictions that Strict Mode gives us.

**Assigning or Accessing a variable that is not declared**.

```js
function returnY() {
  "use strict";
  y = 123;
  return y;
}
```

**Assigning a value to a read-only or non-writable global variable;**

```js
"use strict";
var NaN = NaN;
var undefined = undefined;
var Infinity = "and beyond";
```

**Deleting an undeletable property.**

```
   "use strict";
   const obj = {};

   Object.defineProperty(obj, 'x', {
      value : '1'
   });

   delete obj.x;
```

**Duplicate parameter names.**

```js
"use strict";

function someFunc(a, b, b, c) {}
```

**Creating variables with the use of the eval function.**

```js
"use strict";

eval("var x = 1;");

console.log(x); //Throws a Reference Error x is not defined
```

**The default value of this will be undefined.**

```js
"use strict";

function showMeThis() {
  return this;
}

showMeThis(); //returns undefined
```

There are many more restrictions in Strict Mode than these.

**1. Explain hoisting in JavaScript.**
Answer:

Hoisting is a JavaScript mechanism where variable and function declarations are moved to the top of their containing scope during the compile phase.

```js
console.log(x); // Output: undefined
var x = 10;
console.log(x); // Output: 10
```

**20. How do you handle errors in JavaScript? Provide an example of using a try...catch** block.
Answer:

```js
try {
  // Code that may throw an error
  const result = 10 / 0;
  console.log(result);
} catch (error) {
  console.error("An error occurred:", error.message);
}
```

**15. Why does it return false when comparing two similar objects in JavaScript?**
↑ Suppose we have an example below.

```js
let a = { a: 1 };
let b = { a: 1 };
let c = a;

console.log(a === b); // logs false even though they have the same property
console.log(a === c); // logs true hmm
```

JavaScript compares objects and primitives differently.

In primitives it compares them by value

while in objects it compares them by reference or the address in memory where the variable is stored.

That's why the first console.log statement returns false and the second console.log statement returns true.

a and c have the same reference and a and b are not.

Here is a clear, structured summary and detailed explanation of the remaining core JavaScript concepts you presented, organized for quick reading and study.

---

## 1. Event Delegation

**Event delegation** is a pattern where you attach a single event listener to a parent/ancestor element to manage events for multiple child elements (present or future) by leveraging **event bubbling**.

### Example

```html
<ul id="user-list">
  <li data-id="1">Alice</li>
  <li data-id="2">Bob</li>
  <li data-id="3">Charlie</li>
</ul>
```

```js
const userList = document.getElementById("user-list");

// Attach ONE listener to the <ul> instead of individual <li> elements
userList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const userId = event.target.getAttribute("data-id");
    console.log(`Clicked user ID: ${userId}`);
  }
});
```

### Benefits

- **Performance:** Reduces memory consumption by creating fewer event listeners in the DOM.
- **Dynamic Elements:** Automatically works for dynamically added child elements without needing to bind new listeners.

---

## 2. Abstract Equality (`==`) vs. Strict Equality (`===`)

- **`===` (Strict Equality):** Compares values **without** type conversion. If types differ, it immediately returns `false`.
- **`==` (Abstract Equality):** Compares values **after** performing implicit type coercion to convert operands to a common type.

### Abstract Equality (`==`) Algorithm Summary

When comparing `x == y`:

1. **Same Type:** Compare using `===`.
2. **`null` and `undefined`:** `null == undefined` is `true`.
3. **Number and String:** Converts the String to a Number (`x == Number(y)`).
4. **Boolean involved:** Converts the Boolean to a Number (`Number(x) == y`).
5. **Primitive and Object:** Converts the Object to a Primitive using `toPrimitive` (invoking `valueOf()` then `toString()`).
6. **All other pairs:** Return `false`.

```js
console.log(0 == false); // true  (Boolean converted to 0)
console.log("1" == 1); // true  (String converted to 1)
console.log(null == undefined); // true  (Spec rules)
console.log([1, 2] == "1,2"); // true  (Array converted to "1,2")

console.log(0 === false); // false (Types differ: Number vs Boolean)
console.log("1" === 1); // false (Types differ: String vs Number)
```

---

## 3. The `this` Keyword Mechanics

The value of `this` is evaluated dynamically at execution time based on **how a function is invoked**, not where it is defined (with the exception of arrow functions).

### Invocation Rules for `this`

| Invocation Style               | `this` Points To                                        | Example                                              |
| ------------------------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| **Method Invocation**          | The owner object to the left of the dot                 | `obj.method()` $\rightarrow$ `obj`                   |
| **Simple Function Invocation** | `window` / `globalThis` (or `undefined` in strict mode) | `fn()` $\rightarrow$ `window`                        |
| **Constructor Call**           | The newly created instance object                       | `new Person()` $\rightarrow$ new instance            |
| **Explicit Binding**           | The object explicitly passed as the first argument      | `fn.call(obj)` or `fn.apply(obj)`                    |
| **Arrow Functions**            | Lexical `this` (enclosing execution scope)              | `() => {}` $\rightarrow$ copies outer scope's `this` |

```js
const person = {
  name: "Alex",
  greetRegular() {
    console.log(this.name); // 'Alex'
  },
  greetArrow: () => {
    console.log(this.name); // undefined (inherits 'this' from window/global)
  },
};

person.greetRegular();
person.greetArrow();
```

---

## 4. `null` vs. `undefined`

| Feature             | `undefined`                                          | `null`                                   |
| ------------------- | ---------------------------------------------------- | ---------------------------------------- |
| **Meaning**         | Variable has been declared but not assigned a value. | Intentional absence of any object value. |
| **Type (`typeof`)** | `"undefined"`                                        | `"object"` _(historical JS quirk)_       |
| **Origin**          | Automatically set by the JS engine.                  | Assigned explicitly by the developer.    |

```js
let a;
console.log(a); // undefined
console.log(typeof a); // "undefined"

let b = null;
console.log(b); // null
console.log(typeof b); // "object"
```

---

## 5. Event Propagation: Bubbling vs. Capturing vs. `preventDefault()`

When an event occurs on a DOM element, it travels in three phases:

1. **Capturing Phase:** Event trickles down from `window` $\rightarrow$ `document` $\rightarrow$ `parent` $\rightarrow$ `target`.
2. **Target Phase:** Event reaches the target element.
3. **Bubbling Phase:** Event bubbles up from `target` $\rightarrow$ `parent` $\rightarrow$ `document` $\rightarrow$ `window`.

```text
       DOCUMENT
          │  ▲
Capturing │  │ Bubbling
          ▼  │
       PARENT ELEMENT
          │  ▲
          ▼  │
       TARGET ELEMENT

```

### Key Event Methods

- **`event.preventDefault()`:** Stops the browser's default browser action for that event (e.g., stops a form from submitting/reloading, stops `<a>` link navigation). Does **not** stop propagation.
- **`event.stopPropagation()`:** Stops the event from bubbling further up (or capturing further down) the DOM tree.

---

## 6. Array Methods: `map()` vs. `forEach()`

| Metric           | `map()`                                                   | `forEach()`                                      |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------ |
| **Return Value** | Returns a **new array** with transformed values.          | Returns `undefined`.                             |
| **Chaining**     | Can chain other array methods (`.filter()`, `.reduce()`). | Cannot be chained (returns `undefined`).         |
| **Use Case**     | Transforming data immutably.                              | Executing side-effects (logging, DOM mutations). |

```js
const numbers = [1, 2, 3];

// map (returns new array)
const doubled = numbers.map((num) => num * 2); // [2, 4, 6]

// forEach (returns undefined)
numbers.forEach((num) => console.log(num)); // Logs 1, 2, 3
```

---

## 7. Hoisting Mechanics

**Hoisting** is JavaScript's default behavior of moving function and variable declarations to the top of their containing scope during the compilation phase before code execution.

### Behavior by Variable Declaration Type

```js
console.log(a); // Output: undefined (var is hoisted and initialized to undefined)
var a = 10;

console.log(b); // Throws ReferenceError: Cannot access 'b' before initialization
let b = 20; // Stored in the "Temporal Dead Zone" (TDZ) until execution reaches here

hoistedFunction(); // Output: "I work!" (Function declarations are fully hoisted with definition)
function hoistedFunction() {
  console.log("I work!");
}
```

---

## 8. Object Comparison by Reference

JavaScript evaluates primitives by **value**, but objects (including arrays and functions) by **reference** (memory address).

```js
const objA = { id: 1 };
const objB = { id: 1 };
const objC = objA;

console.log(objA === objB); // false: Different memory addresses
console.log(objA === objC); // true: Points to the exact same reference
```

### Deep Equality Utility

To compare two distinct objects by properties rather than reference, write a recursive deep equality function or use `JSON.stringify(objA) === JSON.stringify(objB)` for simple, JSON-serializable objects.
