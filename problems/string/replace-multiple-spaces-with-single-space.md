```js
// String containing multiple spaces
let str = " Welcome to Geeks for Geeks ";

// Remove multiple spaces with single space
let newStr = str.replace(/\s+/g, " ");

// Display the result
console.log(newStr);

/******************************************** */

// String containing multiple spaces
let str = " Welcome to Geeks for Geeks ";

// Replace multiple spaces with single space
let newStr = str
  .trim()
  .split(/[\s,\t,\n]+/)
  .join(" ");

// Display the result
console.log(newStr);
