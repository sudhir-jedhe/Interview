```js
// Function to generate random number
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

console.log("Random Number between 1 and 5: ");

// Function call
console.log(randomNumber(1, 5));

/************************************** */
// Function to generate random number
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

console.log("Random Number between 1 and 100: ");

// Function call
console.log(randomNumber(1, 100));

/****************************************** */
// Function to generate random number
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("Random Number between 1 and 10: ");

// Function call
console.log(randomNumber(1, 10));
