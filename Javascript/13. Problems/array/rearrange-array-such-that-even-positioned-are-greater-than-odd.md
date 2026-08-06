```js
//Using Reverse Iteration
function rearrangeArrayUsingReverseIteration(arrayInput) {
  const n = arrayInput.length;
  const descSortedArray = arrayInput.slice().sort((a, b) => b - a);
  const rearrangedArray = [];
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      rearrangedArray[i] = descSortedArray.pop();
    } else {
      rearrangedArray[i] = descSortedArray.shift();
    }
  }
  return rearrangedArray;
}
const inputArray = [2, 4, 3, 5, 6];
const rearrangedArray = rearrangeArrayUsingReverseIteration(inputArray);
console.log(rearrangedArray); //  [2, 6, 3, 5, 4 ]

/************************************************** */
// Using Element Swapping
function rearrangeArrayUsingElementSwapping(arrInput, sizeOfArray) {
  for (let i = 0; i < sizeOfArray - 1; i++) {
    if (i % 2 === 0) {
      if (arrInput[i] > arrInput[i + 1]) {
        [arrInput[i], arrInput[i + 1]] = [arrInput[i + 1], arrInput[i]];
      }
    }
    if (i % 2 !== 0) {
      if (arrInput[i] < arrInput[i + 1]) {
        [arrInput[i], arrInput[i + 1]] = [arrInput[i + 1], arrInput[i]];
      }
    }
  }
}
let arrayInput = [2, 1, 4, 3, 6, 5, 8, 7];
let totalSize = arrayInput.length;
rearrangeArrayUsingElementSwapping(arrayInput, totalSize);
console.log(`[${arrayInput.join(", ")}]`);
