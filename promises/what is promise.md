// What is a promise

// A promise is an object that may produce a single value some time in the future with either a resolved value or a reason that it’s not resolved(for example, network error). It will be in one of the 3 possible states: fulfilled, rejected, or pending.

// The syntax of Promise creation looks like below,
```js
const promise1 = new Promise(function (resolve, reject) {
  // promise description
});

// The usage of a promise would be as below,

const promise = new Promise(
  (resolve) => {
    setTimeout(() => {
      resolve("I'm a Promise!");
    }, 5000);
  },
  (reject) => {}
);

promise.then((value) => console.log(value));
```

// Why do you need a promise

// Promises are used to handle asynchronous operations. They provide an alternative approach for callbacks by reducing the callback hell and writing the cleaner code.

// What are the three states of promise

// Promises have three states:

// 1. **Pending:** This is an initial state of the Promise before an operation begins
// 2. **Fulfilled:** This state indicates that the specified operation was completed.
// 3. **Rejected:** This state indicates that the operation did not complete. In this case an error value will be thrown.

// A promise must follow a specific set of rules:

// 1. A promise is an object that supplies a standard-compliant `.then()` method
// 2. A pending promise may transition into either fulfilled or rejected state
// 3. A fulfilled or rejected promise is settled and it must not transition into any other state.
// 4. Once a promise is settled, the value must not change.

// What is promise chaining

// The process of executing a sequence of asynchronous tasks one after another using promises is known as Promise chaining. Let's take an example of promise chaining for calculating the final result,
```js
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000);
})
  .then(function (result) {
    console.log(result); // 1
    return result * 2;
  })
  .then(function (result) {
    console.log(result); // 2
    return result * 3;
  })
  .then(function (result) {
    console.log(result); // 6
    return result * 4;
  });

  ```

// In the above handlers, the result is passed to the chain of .then() handlers with the below work flow,

// 1. The initial promise resolves in 1 second,
// 2. After that `.then` handler is called by logging the result(1) and then return a promise with the value of result \* 2.
// 3. After that the value passed to the next `.then` handler by logging the result(2) and return a promise with result \* 3.
// 4. Finally the value passed to the last `.then` handler by logging the result(6) and return a promise with result \* 4.


// What is promise.all

// Promise.all is a promise that takes an array of promises as an input (an iterable), and it gets resolved when all the promises get resolved or any one of them gets rejected. For example, the syntax of promise.all method is below,


Promise.all([Promise1, Promise2, Promise3]) .then(result) => {   console.log(result) }) .catch(error => console.log(`Error in promises ${error}`))


// **Note:** Remember that the order of the promises(output the result) is maintained as per input order.


// What is the purpose of the race method in promise

//     Promise.race() method will return the promise instance which is firstly resolved or rejected. Let's take an example of race() method where promise2 is resolved first
```js

var promise1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 500, "one");
});
var promise2 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, "two");
});

Promise.race([promise1, promise2]).then(function (value) {
    console.log(value); // "two" // Both promises will resolve, but promise2 is faster
});
```

// What are the pros and cons of promises over callbacks

// Below are the list of pros and cons of promises over callbacks,

// **Pros:**

// 1. It avoids callback hell which is unreadable
// 2. Easy to write sequential asynchronous code with .then()
// 3. Easy to write parallel asynchronous code with Promise.all()
// 4. Solves some of the common problems of callbacks(call the callback too late, too early, many times and swallow errors/exceptions)

// **Cons:**

// 5. It makes little complex code
// 6. You need to load a polyfill if ES6 is not supported



/*************************************** */

The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value. A common example of using promises would be fetching data from a URL. This would create a Promise object that represents the data we expect to receive. For example:
```js
fetch('https://my.api.com/items/1')
  .catch(err => console.log(`Failed with error: ${err}`))
  .then(response => response.json())
  .then(json => console.log(json));

  ```
The tricky part about promises is understanding that the resulting value may not initially be available. Instead, the promise can be in one of three states:

Pending: initial state, neither fulfilled nor rejected.
Fulfilled: meaning that the operation was completed successfully.
Rejected: meaning that the operation failed.
A pending Promise can either be fulfilled with a value or rejected with a reason (error). When either of these happens, the associated handlers (Promise.prototype.then(), Promise.prototype.catch()) are called.

In the previous example, the Promise starts in a pending state, until a response from the server is received. If anything goes wrong during that time, the Promise will be rejected and the Promise.prototype.catch() handler will log the error to the console. Otherwise, the Promise will be fulfilled and the first Promise.prototype.then() handler will execute, returning itself a new Promise. The new promise will be fulfilled and call the second Promise.prototype.then() handler to log the parsed JSON data to the console.