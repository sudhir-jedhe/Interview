```js
// Javascript script to convert negative number
// to positive number

// Function to convert
// given number to
// positive number
function convert_positive(a) {
  // Check the number is negative
  if (a < 0) {
    // Multiply number with -1
    // to make it positive
    a = a * -1;
  }
  // Return the positive number
  return a;
}

//Driver code
let n = -10;
let m = 5;

// Call function
n = convert_positive(n);

// Print result
console.log(n);

// Call function
m = convert_positive(m);

// Print result
console.log(m);
// 10
// 5

/********************************************** */
// Javascript script to convert negative number
// to positive number

//Driver code
let n = -30;
let m = 15;

// Using Math.abs() function
n = Math.abs(n);

// Print result
console.log(n);

// Using Math.abs() function
m = Math.abs(m);

// Print result
console.log(m);

/*********************************************** */
// Javascript script
// to convert negative number
// to positive number

// Function to convert
// given number to
// positive number
function convert_positive(a) {
  return a < 0 ? ~a + 1 : a;
}

//Driver code
let n = -10;
let m = 5;

// Call function
n = convert_positive(n);

// Print result
console.log(n);

// Call function
m = convert_positive(m);

// Print result
console.log(m);

/****************************************** */
// Javascript script
// to convert negative number
// to positive number

// Function to convert
// given number to
// positive number
function convert_positive(a) {
  return a < 0 ? ~a + 1 : a;
}

//Driver code
let n = -10;
let m = 5;

// Call function
n = convert_positive(n);

// Print result
console.log(n);

// Call function
m = convert_positive(m);

// Print result
console.log(m);
