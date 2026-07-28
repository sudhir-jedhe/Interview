// Promise.all() is a method that takes an iterable of elements (usually
// Promises) as an input, and returns a single Promise that resolves to an array
// of the results of the input promises. This returned promise will resolve when
// all of the input's promises have resolved, or if the input iterable contains
// no promises. It rejects immediately upon any of the input promises rejecting
// or non-promises throwing an error, and will reject with this first rejection
// message / error.

// Promise.all() is frequently used when there are multiple concurrent API
// requests and we want to wait for all of them to have completed to continue
// with code execution, usually because we depend on data from both responses.
```js
const [userData, postsData, tagsData] = await Promise.all([
  fetch("/api/user"),
  fetch("/api/posts"),
  fetch("/api/tags"),
]);

// Let's implement our own version of Promise.all(), a promiseAll function, with
// the difference being the function takes in an array instead of an iterable.
// Be sure to read the description carefully and implement accordingly!

// Resolved example.
const p0 = Promise.resolve(3);
const p1 = 42;
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 100);
});

await promiseAll([p0, p1, p2]); // [3, 42, 'foo']
/************************ */
// Rejection example.
const p0 = Promise.resolve(30);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("An error occurred!");
  }, 100);
});

try {
  await promiseAll([p0, p1]);
} catch (err) {
  console.log(err); // 'An error occurred!'
}



/**************************** */

// The Promise.all() accepts an array of promises and returns a promise that resolves when all of the promises in the array are fulfilled or when the iterable contains no promises. It rejects with the reason of the first promise that rejects.

// The Promise.all() accepts an array of promises and returns a promise that resolves when all of the promises in the array are fulfilled or when the iterable contains no promises. It rejects with the reason of the first promise that rejects.

// It will return a promise.
// The promise will resolve with result of all the passed promises or reject with the error message of first failed promise.
// The results are returned in the same order as the promises are in the given array.

function myPromiseAll(taskList) {
  //to store results 
  const results = [];
  
  //to track how many promises have completed
  let promisesCompleted = 0;

  // return new promise
  return new Promise((resolve, reject) => {

    taskList.forEach((promise, index) => {
     //if promise passes
      promise.then((val) => {
        //store its outcome and increment the count 
        results[index] = val;
        promisesCompleted += 1;
        
        //if all the promises are completed, 
        //resolve and return the result
        if (promisesCompleted === taskList.length) {
          resolve(results)
        }
      })
         //if any promise fails, reject.
        .catch(error => {
          reject(error)
        })
    })
  });
}


Input:
function task(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(time);
    }, time);
  });
}

const taskList = [task(1000), task(5000), task(3000)];

//run promise.all
myPromiseAll(taskList)
  .then(results => {
    console.log("got results", results)
  })
  .catch(console.error);

Output:
//"got results" [1000,5000,3000]




Input:
function task(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if(time < 3000){
        reject("Rejected");
      }else{
        resolve(time);
      }
    }, time);
  });
}

const taskList = [task(1000), task(5000), task(3000)];

//run promise.all
myPromiseAll(taskList)
  .then(results => {
    console.log("got results", results)
  })
  .catch(console.error);

Output:
"Rejected"