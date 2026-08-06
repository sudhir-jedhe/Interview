 Implement async filter function in JavaScript
Posted on April 2, 2024 | by Prashant Yadav

Posted in Interview, Javascript | Tagged async

Implement a function that takes an array of input and an async iteratee function and returns a promise that resolves with the list of inputs that has passed the test through iteratee function in JavaScript.

The inputs will run in parallel, but the output will be in the same order as the original.

The asynchronous iteratee function will accept an input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.

```javascript
Input:
let numPromise = filter([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    
    // throw error
    if(num === 7){
      callback(true);
    }else{
      callback(null, num !== 4);
    }
    
  }, 2000);
});
//
numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
2
4
6
8
10
"success:1,3,4,5"

```

 This function is a simple extension of Array.filter() to handle the async operations.

To implement this we will create a new promise and return it, inside this promise, run all the input values in parallel using the Array.forEach() and inside the forEach pass each value to the iteratee function.

Inside the iteratee function’s callback if the result is true which means the input has passed the test, then add that input to the result at the current index.

In the end, if we are the last element of the input array, resolve the promise with the result.

Filter the final output to remove the gaps as we have to maintain the order for the passed values. There will no value at the indexes of unpassed values in the output array.

```javascript

const filter = (arr, fn) => {
  // return a new promise
  return new Promise((resolve, reject) => {
    const output = [];
    let track = 0;
    
    arr.forEach((e, i) => {
      fn(e, (error, result) => {
        // track the no of inputs processed
        track++;
        
        // if the input passes the test
        // add it to the current index
        if(result){
          output[i] = e;
        }
        
        // if the last element of the input array
        if(track >= arr.length){
          // filter the final output with truthy values
          // to return the value in order
          resolve(output.filter(Boolean));
        }
      });
    });
   
  });
};

```

```javascript

Input:
let numPromise = filter([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    
    // throw error
    if(num === 7){
      callback(true);
    }else{
      callback(null, num !== 4);
    }
    
  }, 2000);
});

numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
2
4
6
8
10
"success:1,3,4,5"

```

```js

async function asyncFilter(inputs, iteratee) {
  // Create an array of promises, one for each input
  const promises = inputs.map((input, index) => {
    return new Promise((resolve) => {
      // Call the iteratee function with the input and a callback
      iteratee(input, (error, result) => {
        // Resolve the promise with an object containing the result, error, and original index
        resolve({ result, error, index });
      });
    });
  });

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Filter and sort the results
  const filteredResults = results
    .filter(({ result, error }) => !error && result)
    .sort((a, b) => a.index - b.index)
    .map(({ result }) => result);

  return filteredResults;
}

// Example usage
const inputs = [1, 2, 3, 4, 5];

const asyncIteratee = (input, callback) => {
  setTimeout(() => {
    const isEven = input % 2 === 0;
    callback(null, isEven ? input : null);
  }, Math.random() * 1000); // Simulate varying processing times
};

asyncFilter(inputs, asyncIteratee)
  .then(result => console.log('Filtered result:', result))
  .catch(error => console.error('Error:', error));

  ```

  I'll implement a function that meets your requirements. This function will process an array of inputs in parallel using an asynchronous iteratee function, while maintaining the original order of the inputs in the output. Let's break this down step by step.

Here's the implementation:

```javascript project="Async Filter" file="asyncFilter.js"
...
```

Let's break down the `asyncFilter` function:

1. We map each input to a Promise that wraps the iteratee function call.
2. Each Promise resolves with an object containing the result, any error, and the original index.
3. We use `Promise.all()` to wait for all iteratee functions to complete.
4. After all Promises resolve, we filter out any results with errors or falsy values.
5. We then sort the results based on the original index to maintain the input order.
6. Finally, we map the sorted results to only include the actual values.

The example usage demonstrates how to use this function with an asynchronous iteratee that filters even numbers. The iteratee simulates varying processing times using `setTimeout`.

This implementation satisfies all the requirements:

- It processes inputs in parallel.
- It maintains the original order of inputs in the output.
- It uses a callback-style iteratee function.
- It returns a promise that resolves with the filtered list.

You can run this code to see the result. The output will be the even numbers from the input array, in their original order.
