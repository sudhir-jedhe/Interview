```js
//Promise.reject
let promise = new Promise((resolve, reject) => {
  let b = Math.random() < 0.3;

  if (b) {
    resolve(10);
  } else {
    reject("promise error");
  }
});

promise
  .then((val) => console.log(val))
  .catch((err) => {
    console.log(`${err}`);
  });

console.log("finished");

/************************************************** */
function rejectPromise(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
}

// Example usage:

const promise = rejectPromise("This promise is rejected!");

promise.catch((reason) => {
  console.log(reason); // 'This promise is rejected!'
});

// The rejectPromise() function takes a single argument, reason, which is the
// reason for the rejection. The function then returns a new Promise object that
// is immediately rejected with the given reason. The catch() method on the
// Promise object is used to handle rejected promises. The catch() method takes
// a callback function that is called with the reason for the rejection as its
// argument. In the example above, the catch() callback function simply logs the
// reason for the rejection to the console. However, you can use the catch()
// callback function to do whatever you need to do to handle the rejected
// promise.
