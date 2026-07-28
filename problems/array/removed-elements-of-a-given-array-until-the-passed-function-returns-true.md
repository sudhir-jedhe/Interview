```js
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let removeArr = [];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] < 6) {
    removeArr.push(arr.shift());
  } else {
    break;
  }
}
console.log(removeArr);

/******************************************************************** */
let array = [1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 8, 8];

// Removing elements less than 5 and returning them

let limiter = 5;

// function which slices the array taking limiter as parameter
let retrieveRemoved = function (array, limiter) {
  let i;
  for (i = 0; i < array.length; i++) {
    // If the number value is greater or equal than limiter
    if (array[i] >= limiter) {
      // It takes the array from 0th
      // index to i, excluding it
      return array.slice(0, i);
    }
  }

  return array.slice(i);
};
let removed = retrieveRemoved(array, limiter);
console.log("The removed elements: " + removed);
/********************************************************** */

let array = [1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 8, 8];

// Removing elements less than 5 and returning them
let limiter = 5;

let retrieveRemoved = function (array, limiter) {
  let i, s;
  let res = [];
  for (i = 0; i < array.length; i++) {
    if (array[i] < limiter) {
      // Push() method is used to
      // values into the res[].
      res.push(array[i]);
    } else {
      s = i;
      break;
    }
  }
  return res;

  return array.slice(i);
};
let removed = retrieveRemoved(array, limiter);
console.log("The removed elements are: " + removed);

/********************************************************** */
let array = [1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 8, 8];
let limiter = 5;
function retrieveRemoved(ele) {
  return ele < limiter;
}
let removed = array.filter(retrieveRemoved);
console.log("The removed elements are: " + removed);
