```js
// Using concat() and slice() method
function mergeSortedArrayUsingConcat(array1, array2) {
  let sortedArray = [],
    Array1Index = 0,
    Array2Index = 0;
  while (Array1Index < array1.length && Array2Index < array2.length) {
    if (sortFunc(array1[Array1Index], array2[Array2Index]) > 0) {
      sortedArray.push(array2[Array2Index++]);
    } else {
      sortedArray.push(array1[Array1Index++]);
    }
  }
  if (Array2Index < array2.length) {
    sortedArray = sortedArray.concat(array2.slice(Array2Index));
  } else {
    sortedArray = sortedArray.concat(array1.slice(Array1Index));
  }
  return sortedArray;
}
function sortFunc(a, b) {
  return a - b;
}
console.log(mergeSortedArrayUsingConcat([1, 2, 3, 5, 9], [4, 6, 7, 8]));

/********************************************************/

//Using Array.reduce() and shift method method
function mergeSortedArraysUsingReduce(array1, array2) {
  // Using array.reduce to generate new sorted array
  let singleMergedArray = array1.reduce((outputVar, array1Element) => {
    while (array2.length && array2[0] < array1Element) {
      outputVar.push(array2.shift());
    }
    outputVar.push(array1Element);
    return outputVar;
  }, []);

  return singleMergedArray.concat(array2);
}
let array1 = [1, 2, 3, 5, 9];
let array2 = [4, 6, 7, 8];
const outputArray = mergeSortedArraysUsingReduce(array1, array2);
console.log(outputArray);

/***************************************** */

// O(n log n) time & O(n) space
function mergeTwo(arr1, arr2) {
  let result = [...arr1, ...arr2];
  return result.sort((a, b) => a - b);
}

/******************************************************************* */
// O(n) time & O(n) space
function mergeTwo(arr1, arr2) {
  let merged = [];
  let index1 = 0;
  let index2 = 0;
  let current = 0;

  while (current < arr1.length + arr2.length) {
    let isArr1Depleted = index1 >= arr1.length;
    let isArr2Depleted = index2 >= arr2.length;

    if (!isArr1Depleted && (isArr2Depleted || arr1[index1] < arr2[index2])) {
      merged[current] = arr1[index1];
      index1++;
    } else {
      merged[current] = arr2[index2];
      index2++;
    }

    current++;
  }

  return merged;
}

mergeTwo(arr1, arr2);
// [1, 2, 3, 5, 6, 7, 8, 10, 11, 15, 19, 20]
