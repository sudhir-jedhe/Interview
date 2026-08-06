```js
let myInt = 235345;

// Getting the string as a parameter
// and typecasting it into an integer
let myFunc = (num) => Number(num);

let intArr = Array.from(String(myInt), myFunc);

// Print the result array
console.log(intArr);
// [2, 3, 5, 3, 4, 5 ]

/********************************************* */
// Declare a variable and store an
// integer value
let num = 235345;

// Here we typecasting the num
// Splitting the num, so that
// we got an array of strings
// Then use map function to
// convert the array of strings
// into array of numbers

let myArr = String(num)
  .split("")
  .map((num) => {
    return Number(num);
  });

console.log(myArr);

/************************************************************* */
let myInt = 235345;

// number to string conversion
let temp = "" + myInt;
// forming array with numbers as element
let intArr = [...temp].reduce((acc, n) => acc.concat(+n), []);

// Print the result array
console.log(intArr);
