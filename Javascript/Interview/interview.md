<div align="center">
  <img height="60" src="https://img.icons8.com/color/344/javascript.png">
  <h1>JavaScript Questions</h1>
</div>

> [!NOTE]  
> This repo was created in 2019 and the questions provided here are therefore based on the JavaScript syntax and behaviour at that time. Since JavaScript is a constantly evolving language, there are newer language features that are not covered by the questions here.

---

<p align="center">
From basic to advanced: test how well you know JavaScript, refresh your knowledge a bit, or prepare for your coding interview! :muscle: :rocket: I update this repo regularly with new questions. I added the answers in the **collapsed sections** below the questions, simply click on them to expand it. It's just for fun, good luck! :heart:</p>

<p align="center">Feel free to reach out to me! 😊</p>

<p align="center">
  <a href="https://www.instagram.com/theavocoder">Instagram</a> || <a href="https://www.twitter.com/lydiahallie">Twitter</a> || <a href="https://www.linkedin.com/in/lydia-hallie">LinkedIn</a> || <a href="https://www.lydiahallie.io/">Blog</a>
</p>

| Feel free to use them in a project! 😃 I would _really_ appreciate a reference to this repo, I create the questions and explanations (yes I'm sad lol) and the community helps me so much to maintain and improve it! 💪🏼 Thank you and have fun! |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

### Table of Contents

| No. | Questions                                                                                                |
| --- | -------------------------------------------------------------------------------------------------------- |
| 1   | [What is Hoisting](#what-is-hoisting)                                                                    |
| 2   | [What is var let const](#Var-Let-Const)                                                                  |
| 3   | [What are the differences between let, var or const](#what-are-the-differences-between-let-var-or-const) |

**[⬆ Back to Top](#table-of-contents)**

2.  **[⬆ Back to Top](#table-of-contents)**

    ### Can I redeclare let and const variables

    No, you cannot redeclare let and const variables. If you do, it throws below error

    ```bash
    Uncaught SyntaxError: Identifier 'someVariable' has already been declared
    ```

    **Explanation:** The variable declaration with `var` keyword refers to a function scope and the variable is treated as if it were declared at the top of the enclosing scope due to hoisting feature. So all the multiple declarations contributing to the same hoisted variable without any error. Let's take an example of re-declaring variables in the same scope for both var and let/const variables.

    ```javascript
    var name = "John";
    function myFunc() {
      var name = "Nick";
      var name = "Abraham"; // Re-assigned in the same function block
      alert(name); // Abraham
    }
    myFunc();
    alert(name); // John
    ```

    The block-scoped multi-declaration throws syntax error,

    ```javascript
    let name = "John";
    function myFunc() {
      let name = "Nick";
      let name = "Abraham"; // Uncaught SyntaxError: Identifier 'name' has already been declared
      alert(name);
    }

    myFunc();
    alert(name);
    ```

    **[⬆ Back to Top](#table-of-contents)**

3.  ### Is const variable makes the value immutable

    No, the const variable doesn't make the value immutable. But it disallows subsequent assignments(i.e, You can declare with assignment but can't assign another value later)

    ```javascript
    const userList = [];
    userList.push("John"); // Can mutate even though it can't re-assign
    console.log(userList); // ['John']
    ```

    **[⬆ Back to Top](#table-of-contents)**

4.  ### What is the Temporal Dead Zone

    The Temporal Dead Zone(TDZ) is a specific period or area of a block where a variable is inaccessible until it has been intialized with a value. This behavior in JavaScript that occurs when declaring a variable with the let and const keywords, but not with var. In ECMAScript 6, accessing a `let` or `const` variable before its declaration (within its scope) causes a ReferenceError.

    TDZ is a period during which let and const variables exist but are not yet accessible. It helps catch potential issues caused by accessing variables before their initialisation, ensuring more reliable and predictable code.

    Let's see this behavior with an example,

    ```javascript
    function somemethod() {
      console.log(counter1); // undefined
      console.log(counter2); // ReferenceError
      console.log(counter3); // ReferenceError
      var counter1 = 1;
      let counter2 = 2;
      const counter3 = 3;
    }
    ```

In the example above, we try to access the variable counter2 before its declaration and initialization. This triggers the TDZ because the variable exists within the scope but has not been assigned a value yet. As a result, JavaScript throws a ReferenceError indicating that the variable counter2 cannot be accessed before initialization.

The TDZ ends and the variable becomes accessible after its declaration and initialization

The TDZ ensures that variables are accessed only after they have been properly declared and initialized, promoting better coding practices and reducing the likelihood of accessing variables in an undefined or uninitialized state.

The Temporal Dead Zone and typeof
Using the typeof operator to check the type of a variable in it's tdz will throw a ReferenceError. But for the undeclared variables it will throw undefined.

```javascript
console.log(typeof iAmNotDeclared); // undefined

console.log(typeof iAmDeclared); // ReferenceError: iAmDeclared is not defined
//Above this is it's temporal dead zone
let iAmDeclared = 10;
```

Temporal Dead Zone with lexical or block scoping

```javascript
function test() {
  var foo = 33;
  if (true) {
    let foo = foo + 55; // ReferenceError: foo is not defined
  }
}
test();
```

Due to lexical or block scoping let foo = (foo + 55) access the foo of the current block that is inside the if condition. It does not access the var foo = 33; as let is blocked scope. let foo is declared but it is not initialized that is why it is still in temporal dead zone.

432. ### What is global execution context?

     The global execution context is the default or first execution context that is created by the JavaScript engine before any code is executed(i.e, when the file first loads in the browser). All the global code that is not inside a function or object will be executed inside this global execution context. Since JS engine is single threaded there will be only one global environment and there will be only one global execution context.

     For example, the below code other than code inside any function or object is executed inside the global execution context.

     ```javascript
     var x = 10;

     function A() {
       console.log("Start function A");

       function B() {
         console.log("In function B");
       }

       B();
     }

     A();

     console.log("GlobalContext");
     ```

     **[⬆ Back to Top](#table-of-contents)**

433. ### What is function execution context?

     Whenever a function is invoked, the JavaScript engine creates a different type of Execution Context known as a Function Execution Context (FEC) within the Global Execution Context (GEC) to evaluate and execute the code within that function.

     **[⬆ Back to Top](#table-of-contents)**

434. ### What is call stack and event loop

     Call Stack is a data structure for javascript interpreters to keep track of function calls(creates execution context) in the program. It has two major actions,
     1. Whenever you call a function for its execution, you are pushing it to the stack.
     2. Whenever the execution is completed, the function is popped out of the stack.

     Let's take an example and it's state representation in a diagram format

     ```javascript
     function hungry() {
       eatFruits();
     }
     function eatFruits() {
       return "I'm eating fruits";
     }

     // Invoke the `hungry` function
     hungry();
     ```

     The above code processed in a call stack as below,
     1. Add the `hungry()` function to the call stack list and execute the code.
     2. Add the `eatFruits()` function to the call stack list and execute the code.
     3. Delete the `eatFruits()` function from our call stack list.
     4. Delete the `hungry()` function from the call stack list since there are no items anymore.

     A call stack is a way for the JavaScript engine to keep track of its place in code that calls multiple functions. It has the information on what function is currently being run and what functions are invoked from within that function…

     Also, the JavaScript engine uses a call stack to manage execution contexts:

     The global execution context
     Function execution contexts
     The call stack works based on the last-in-first-out (LIFO) principle.

     When you execute a script, the JavaScript engine creates a global execution context and pushes it on top of the call stack.

     Whenever a function is called, the JavaScript engine creates a function execution context for the function, pushes it on top of the call stack, and starts executing the function.

     If a function calls another function, the JavaScript engine creates a new function execution context for the function being called and pushes it on top of the call stack.

     When the current function completes, the JavaScript engine pops it off the call stack and resumes the execution where it left off.

     The script will stop when the call stack is empty.

     ```javascript
     function add(a, b) {
       return a + b;
     }

     function average(a, b) {
       return add(a, b) / 2;
     }

     let x = average(10, 20);
     ```

     When the JavaScript engine executes this script, it places the global execution context (denoted by main() or global() function on the call stack.

     The global execution context enters the creation phase and moves to the execution phase.

     The JavaScript engine executes the call to the average(10, 20) function and creates a function execution context for the average() function and pushes it on top of the call stack:

     The JavaScript engine starts executing the average() since because the average() function is on the top of the call stack.

     The average() function calls add() function. At this point, the JavaScript engine creates another function execution context for the add() function and places it on the top of the call stack:

     JavaScript engine executes the add() function and pops it off the call stack:

     At this point, the average() function is on the top of the call stack, the JavaScript engine executes and pops it off the call stack.

     Now, the call stack is empty so the script stops executing:

     Stack Overflow
     The call stack has a fixed size, depending on the implementation of the host environment, either the web browser or Node.js.

     If the number of execution contexts exceeds the size of the stack, a stack overflow error will occur.

     For example, when you execute a recursive function that has no exit condition, the JavaScript engine will issue a stack overflow error:

     ```js
     function fn() {
       fn();
     }
     fn(); // stack overflow
     ```

     Asynchronous JavaScript
     JavaScript is a single-threaded programming language. This means that the JavaScript engine has only one call stack. Therefore, it only can do one thing at a time.

     When executing a script, the JavaScript engine executes code from top to bottom, line by line. In other words, it is synchronous.

     Asynchronous means the JavaScript engine can execute other tasks while waiting for another task to be completed. For example, the JavaScript engine can:

     Request for data from a remote server.
     Display a spinner
     When the data is available, display it on the webpage.

     JavaScript single-threaded model
     JavaScript is a single-threaded programming language. This means that JavaScript can do only one thing at a single point in time.

     The JavaScript engine executes a script from the top of the file and works its way down. It creates the execution contexts, and pushes, and pops functions onto and off the call stack in the execution phase.

     If a function takes a long time to execute, you cannot interact with the web browser during the function’s execution because the page hangs.

     A function that takes a long time to complete is called a blocking function. Technically, a blocking function blocks all the interactions on the webpage, such as mouse clicks.

     An example of a blocking function is a function that calls an API from a remote server.

     ```js
     function task(message) {
       // emulate time consuming task
       let n = 10000000000;
       while (n > 0) {
         n--;
       }
       console.log(message);
     }

     console.log("Start script...");
     task("Call an API");
     console.log("Done!");
     ```

     Callbacks to the rescue
     To prevent a blocking function from blocking other activities, you typically put it in a callback function for execution later. For example:

     ```js
     console.log("Start script...");

     setTimeout(() => {
       task("Download a file.");
     }, 1000);

     console.log("Done!");
     ```

     ```js
     Start script...
     Done!
     Download a file.
     ```

     The Javascript Engine consists of two main components:

     Memory Heap — this is where the memory allocation happens, all of our object variables are assigned here in a random manner.
     Call Stack — this is where your function calls are stored.

     As mentioned earlier, the JavaScript engine can do only one thing at a time. However, it’s more precise to say that the JavaScript runtime can do one thing at a time.

     The web browser also has other components, not just the JavaScript engine.

     When you call the setTimeout() function, make a fetch request, or click a button, the web browser can do these activities concurrently and asynchronously.

     The setTimeout(), fetch requests and DOM events are parts of the Web APIs of the web browser.

     In our example, when calling the setTimeout() function, the JavaScript engine places it on the call stack, and the Web API creates a timer that expires in 1 second.

     Then JavaScript engine places the task() function into a queue called a callback queue or a task queue:

     The event loop is a constantly running process that monitors both the callback queue and the call stack.

     If the call stack is not empty, the event loop waits until it is empty and places the next function from the callback queue to the call stack. If the callback queue is empty, nothing will happen:

     event loop is a fundamental mechanism that enables the asynchronous execution of code. It’s an essential part of the JavaScript runtime environment, allowing the language to handle non-blocking operations efficiently. The event loop is responsible for managing the execution of code, handling events, and maintaining the flow of control.

     It means that the main thread where JavaScript code is run, runs in one line at a time manner and there is no possibility of running code in parallel.

     How do Event loops work?
     Call Stack:
     JavaScript uses a call stack to keep track of the currently executing function (where the program is in its execution).
     Callback Queue:
     Asynchronous operations, such as I/O operations or timers, are handled by the browser or Node.js runtime. When these operations are complete, corresponding functions (callbacks) are placed in the callback queue.
     Event Loop:
     The event loop continuously checks the call stack and the callback queue. If the call stack is empty, it takes the first function from the callback queue and pushes it onto the call stack for execution.
     Execution:
     The function on top of the call stack is executed. If this function contains asynchronous code, it might initiate further asynchronous operations.
     Callback Execution:
     When an asynchronous operation is complete, its callback is placed in the callback queue.
     Repeat:
     The event loop continues this process, ensuring that the call stack is always empty before taking the next function from the callback queue.
     The event queue is responsible for sending new functions to the stack for processing. It follows the queue data structure to maintain the correct sequence in which all operations should be sent for execution.

     Whenever an async function is called, it is sent to a browser API. These are APIs built into the browser. Based on the command received from the call stack, the API starts its own single-threaded operation.

     An example of this is the setTimeout method. When a setTimeout operation is processed in the stack, it is sent to the corresponding API which waits till the specified time to send this operation back in for processing.

     Where does it send the operation? The event queue. Hence, we have a cyclic system for running async operations in JavaScript. The language itself is single-threaded, but the browser APIs act as separate threads.

     The event loop facilitates this process; it constantly checks whether or not the call stack is empty. If it is empty, new functions are added from the event queue. If it is not, then the current function call is processed.

     In JavaScript, the main difference between macrotask and microtask queues is their priority. The event loop gives higher priority to the microtask queue.

     Task type
     Macrotasks are collections of independent tasks. Microtasks are minor tasks that update the state of an application

     Execution order
     After each macrotask execution, the event loop executes all the microtasks in the queue before executing the next macrotask.

     Priority
     Microtasks are suitable for tasks that need to be executed as soon as possible, such as updating the UI or responding to user input. Macro tasks are more appropriate for less time-sensitive operations, like I/O operations and scheduled callbacks

     Here are some examples of microtasks:
     Promise callbacks
     MutationObserver callbacks
     DOM modification change

     Here are some examples of macrotasks:
     Timers
     I/O events
     User interface events
     Running the code

     The main difference between microtask and macrotask queue is their priority. The event loop always gives higher priority to the microtask queue, and will process all the callbacks in the microtask queue before moving on to the macrotask queue.

     The microtask queue contains the callbacks of operations that are considered more urgent or important, such as promises and mutation observers APIs.

     The macrotask queue contains the callbacks of operations that are less urgent such as timers, I/O events, and user interface events.

     ```javascript
     console.log("Start");
     setTimeout(function () {
       console.log("Timeout");
     }, 0);

     Promise.resolve().then(function () {
       console.log("Promise"); // microTask!
     });
     console.log("End");
     ```

     ```javascript
     Start -> End -> Promise -> Timeout
     ```

     Understanding the difference between microtask and macrotask queue can help you write better asynchronous code in JavaScript. It can help you avoid some common mistakes such as:

     Blocking the event loop by creating too many microtasks or long-running microtasks. This can cause performance issues and delay other important tasks.

     Creating race conditions or unexpected results by relying on the order of execution of different types of tasks. For example, if you use setTimeout to schedule some code after a promise, you cannot guarantee that the promise will resolve before the timeout.

     For example, if you use setTimeout with a delay of 0 milliseconds to defer some code execution, you might miss some events that happen in between.

**[⬆ Back to Top](#table-of-contents)**
