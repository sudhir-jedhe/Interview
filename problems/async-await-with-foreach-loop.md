```js
/* 
Asynchronous is popular nowadays because it gives functionality of allowing multiple tasks 
to be executed at the same time (simultaneously) which helps to increase the productivity and efficiency of code.

Async/await is used to write asynchronous code. In JavaScript, we use the looping technique to 
traverse the array with the help of forEach loop.
*/
async function processArray(array) {
  for (const item of array) {
    await someAsyncFunction(item);
  }
}

async function someAsyncFunction(item) {
  // Simulating an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(item);
      resolve();
    }, 1000);
  });
}

const myArray = [1, 2, 3, 4, 5];

processArray(myArray);

/***************************************************************** */
async function processArray(array) {
  await Promise.all(
    array.map(async (item) => {
      await someAsyncFunction(item);
    })
  );
}

async function someAsyncFunction(item) {
  // Simulating an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(item);
      resolve();
    }, 1000);
  });
}

const myArray = [1, 2, 3, 4, 5];

processArray(myArray);
