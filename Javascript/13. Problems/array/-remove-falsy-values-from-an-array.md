```js
// Input: [23, 0, “gfg”, false, true, NaN, 12, “hi”, undefined, [], “”]
// Output: [23, “gfg”, true, 12, “hi”, []]
// Input: [“”, 0, false, undefined, NaN, null]
// Output: []

let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalsey(arr) {
  // newly created array
  let newArr = [];

  // Iterate the array using the forEach loop
  arr.forEach((k) => {
    // check for the truthy value
    if (k) {
      newArr.push(k);
    }
  });
  // return the new array
  return newArr;
}
console.log(removeFalsey(arr));

/************************************************************** */

let arr = ["", 0, false, undefined, NaN, null];

function removeFalsey(arr) {
  // Applying the filter method on the array
  return arr.filter((k) => {
    // Checking if the value is truthy
    if (k) {
      return k;
    }
  });
}
console.log(removeFalsey(arr));

/**************************************** */
let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalsey(arr) {
  // Return the first parameter of the callback function
  return arr.filter((val) => val);
}

console.log(removeFalsey(arr));

/*****************************************************************/
let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalsey(arr) {
  return arr.reduce((acc, curr) => {
    // Check if the truthy then return concatenated value acc with curr.
    // else return only acc.
    if (curr) {
      return [...acc, curr];
    } else {
      return acc;
    }
  }, []); // Initialize with an empty array
}

console.log(removeFalsey(arr));

/************************************************* */
let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalsey(arr) {
  // Create a new array
  let output = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      output.push(arr[i]);
    }
  }
  return output;
}
console.log(removeFalsey(arr));
