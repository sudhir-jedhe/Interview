```js
// Function for printing
// star square pattern
// in console

function printSquare(size) {
  for (let i = 1; i <= size; i++) {
    let line = "";
    for (let j = 1; j <= size; j++) {
      line += "* ";
    }
    console.log(line);
  }
}

// Square pattern size variable
let patternSize = 5;

// Calling function for pattern printing
printSquare(patternSize);

/************************** */
// Creating variable
let line = "";
// Function for printing square star pattern
function square(n) {
  // First loop for row
  for (let i = 1; i <= n; i++) {
    line += "* ";
  }
  // Second loop for column
  for (let j = 1; j <= n; j++) {
    console.log(line);
  }
}

let size = 5;
// Calling function for printing pattern
square(size);

/******************************************* */

// Function for printing square pattern
function printSquare(n) {
  const row = "* ".repeat(n);
  // For loop
  for (let i = 0; i < size; i++) {
    console.log(row);
  }
}
let size = 5;
// Calling function printSquare
printSquare(size);

/******************************* */
// Javascript program for
// printing square of stars
// in console

function printSquare(n) {
  const rowArray = Array(n).fill("*");
  for (let i = 0; i < size; i++) {
    console.log(rowArray.join(" "));
  }
}

// Calling fucntion
let size = 5;
printSquare(size);

/*************************** */
// Javascript program for
// printing square of stars
// in console

let size = 3;
const rowOfSquare = "* ".repeat(size);

// Using template literal
// \n is used for next line

const square = `${rowOfSquare}\n`.repeat(size);

// Printing square
console.log(square);
