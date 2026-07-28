```js
// Function for number checking
function NumberSignChecker(n) {
  if (n > 0) {
    console.log("Positive number");
  } else if (n < 0) {
    console.log("Negative number");
  } else {
    console.log("Zero");
  }
}

// Variables holding values
let number1 = -5;
let number2 = 5;
let number3 = 0;

NumberSignChecker(number1); // Negative number
NumberSignChecker(number2); // Positive number
NumberSignChecker(number3); // Zero
/************************************************ */
let n = 0;

// Using ternary operator
// for solving the
// problem
let ans = n < 0 ? "Negative" : n > 0 ? "Positive" : "Zero";

// Printing result in
// console
console.log(ans);

/*************************** */

// JavaScript program for checking if number
// is positive, negative or zero

let num = 10;

// Switch-case statement
switch (num / num) {
  case 1:
    console.log("Positive nunber");
    break;
  case -1:
    console.log("Negative number");
    break;
  case 0:
    console.log("Zero");
    break;
}
