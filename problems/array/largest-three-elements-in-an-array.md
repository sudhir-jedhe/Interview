```js
// Sort the array and then pick the
// first three largest elements
function findLargestThreeElementsUsingSort(arr) {
  const sortedArrOutput = arr.sort((a, b) => b - a);
  const [firstLargestEle, secondLargestEle, thirdLargestEle] =
    sortedArrOutput.slice(0, 3);

  return {
    "First Largest Element in Array": firstLargestEle,
    "Second Largest Element in Array": secondLargestEle,
    "Third Largest Element in Array": thirdLargestEle,
  };
}

const inputArray = [12, 56, 7, 89, 43, 21];
const outputElements = findLargestThreeElementsUsingSort(inputArray);
console.log(outputElements);
// {
//     'First Largest Element in Array': 89,
//     'Second Largest Element in Array': 56,
//     'Third Largest Element in Array': 43
//   }
/********************************************************** */
//Using Loops
function largestThreeElements(arr) {
  let firstLargestEle = arr[0];
  let secondLargestEle = -Infinity;
  let thirdLargestEle = -Infinity;

  for (const num of arr) {
    if (num > firstLargestEle) {
      thirdLargestEle = secondLargestEle;
      secondLargestEle = firstLargestEle;
      firstLargestEle = num;
    } else if (num > secondLargestEle) {
      thirdLargestEle = secondLargestEle;
      secondLargestEle = num;
    } else if (num > thirdLargestEle) {
      thirdLargestEle = num;
    }
  }

  return {
    "First Largest Element in Array": firstLargestEle,
    "Second Largest Element in Array": secondLargestEle,
    "Third Largest Element in Array": thirdLargestEle,
  };
}

const inputArray = [12, 56, 7, 89, 43, 21];
const outputElements = largestThreeElements(inputArray);
console.log(outputElements);

/******************************************************************** */
//Using Math.max() function
function largestThreeElements(arr) {
  const firstLargestEle = Math.max(...arr);

  arr = arr.filter((num) => num !== firstLargestEle);

  const secondLargestEle = Math.max(...arr);

  arr = arr.filter((num) => num !== secondLargestEle);

  const thirdLargestEle = Math.max(...arr);

  return {
    "First Largest Element in Array": firstLargestEle,
    "Second Largest Element in Array": secondLargestEle,
    "Third Largest Element in Array": thirdLargestEle,
  };
}

const inputArray = [12, 56, 7, 89, 43, 21];
const outputElements = largestThreeElements(inputArray);
console.log(outputElements);

/*************************************************** */

// JavaScript program to find third
// Largest element in an array
// of distinct elements

function thirdLargest(arr, arr_size) {
  /* There should be 
	atleast three elements */
  if (arr_size < 3) {
    document.write(" Invalid Input ");
    return;
  }

  // Find first
  // largest element
  let first = arr[0];
  for (let i = 1; i < arr_size; i++) if (arr[i] > first) first = arr[i];

  // Find second
  // largest element
  let second = Number.MIN_VALUE;
  for (let i = 0; i < arr_size; i++)
    if (arr[i] > second && arr[i] < first) second = arr[i];

  // Find third
  // largest element
  let third = Number.MIN_VALUE;
  for (let i = 0; i < arr_size; i++)
    if (arr[i] > third && arr[i] < second) third = arr[i];

  document.write("The third Largest " + "element is ", third);
}

// Driver Code

let arr = [12, 13, 1, 10, 34, 16];
let n = arr.length;
thirdLargest(arr, n);
/******************************************************************** */
