```js
// JavaScript Program to remoove first
// and last character of a string
function removeFirstLast(str) {
  return str.slice(1, -1);
}

// Driver code
const str = "GeeksforGeeks";

console.log(removeFirstLast(str));

/**************************************** */

// JavaScript Program to remoove first
// and last character of a string
function removeFirstLast(str) {
  return str.substring(1, str.length - 1);
}

// Driver code
const str = "GeeksforGeeks";

console.log(removeFirstLast(str));
