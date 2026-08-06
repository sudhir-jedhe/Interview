**async/await** is the new way of writing asynchronous or non-blocking code in JavaScript's. 
It is built on top of Promises. 
It makes writing asynchronous code more readable and cleaner than Promises and Callbacks. 
But you must learn the basics of Promises before using this feature because as I said earlier it is built on top of Promises which means is still uses Promises under the hood.

**Using Promises**.
```js
function callApi() {
  return fetch("url/to/api/endpoint")
    .then(resp => resp.json())
    .then(data => {
      //do something with "data"
    }).catch(err => {
      //do something with "err"
    });
}

```
**Using Async/Await**.

Note: We're using the old try/catch statement to catch any errors that happened in any of those async operations inside the try statement.
```js
async function callApi() {
  try {
    const resp = await fetch("url/to/api/endpoint");
    const data = await resp.json();
    //do something with "data"
  } catch (e) {
    //do something with "err"
  }
}

```
Note: The async keyword before the function declaration makes the function return implicitly a Promise.

```js
const giveMeOne = async () => 1;

giveMeOne()
  .then((num) => {
    console.log(num); // logs 1
  });

  ```
Note: The await keyword can only be used inside an async function. Using await keyword in any other function which is not an async function will throw an error. The await keyword awaits the right-hand side expression (presumably a Promise) to return before executing the next line of code.

```js
const giveMeOne = async () => 1;

function getOne() {
  try {
    const num = await giveMeOne();
    console.log(num);
  } catch (e) {
    console.log(e);
  }
}

```

//Throws a Compile-Time Error = Uncaught SyntaxError: await is only valid in an async function
```js
async function getTwo() {
  try {
    const num1 = await giveMeOne(); //finishes this async operation first before going to
    const num2 = await giveMeOne(); //this line
    return num1 + num2;
  } catch (e) {
    console.log(e);
  }
}

await getTwo(); // returns 2

```