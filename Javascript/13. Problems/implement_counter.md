```js
// create a javascript function count(), when called it should return how many times it has been called,
// count.reset() should also implemented.

function count() {
  // Initialize a counter variable
  let counter = 0;

  // The main function to return the count
  function getCount() {
    return counter;
  }

  // Method to reset the count
  getCount.reset = function () {
    counter = 0;
  };

  // Increment the counter each time the function is called
  getCount();

  return getCount;
}

// Example usage:
const counterFunction = count();

console.log(counterFunction()); // Output: 1
console.log(counterFunction()); // Output: 2

// Reset the count
counterFunction.reset();

console.log(counterFunction()); // Output: 1 after reset

// count() // 1
// count() // 2
// count() // 3

// count.reset()

// count() // 1
// count() // 2
// count() // 3
