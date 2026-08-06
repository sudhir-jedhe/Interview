```js
// callback function that print pattern
function factor(n) {
  // base case for recursion
  if (n <= 1) {
    console.log("0" + n);
    return;
  }
  // string to store patterns
  let str = "";
  // loop for generate pattern
  for (let i = 1; i <= n; i++) {
    str += `0${i} `;
  }
  // printing patterns
  console.log(str);

  // recursion call with decrement by 1
  return factor(n - 1);
}

// function to run callback function
function test(n, callback) {
  if (n == 0) {
    console.log("please provide value n greater than 0");
    return;
  }

  let k = n;
  //calling callback function
  callback(k);
}

// initialising test number
let t_number = 4;
// calling main function to call callback function
test(t_number, factor);

/************************************** */

// call back function that return factorial
function factor(number) {
  let j = 1;
  // loop that generate factorial of number
  for (let i = 1; i <= number; i++) {
    j *= i;
  }
  // printing value of factorial
  console.log(`factorial of ${number} is `);
  console.log(j);
}

// function that iterate over callback function
function test(n, callback) {
  if (n <= 0) {
    console.log("invalid number");
    return;
  }
  let k = n;
  // iterating over callback function with for loop
  for (let i = k; i >= 1; i--) callback(i);
}

// initialising test variable
let t_umber = 5;
// main function calling
test(t_umber, factor);
