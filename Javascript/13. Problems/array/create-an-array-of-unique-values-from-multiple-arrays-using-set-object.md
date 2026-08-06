```js
/*
Input: 
         inputarray1: [1,2,3,4,5]  
         inputarray2: [4,5,6,7,8] 
Output: 
         outputArray: [1,2,3,4,5,6,7,8]

         */

function mergeUsingSpread(...inputArrays) {
  let uniqueValues = new Set();

  // Using loop to go thofugh each array
  inputArrays.forEach((arr) => {
    // Here, adding the element of current
    // array into the Set of uniqueValues
    arr.forEach((ele) => {
      uniqueValues.add(ele);
    });
  });

  // Converting the set to array
  return Array.from(uniqueValues);
}

// Multiple Input arrays
let inputArray1 = [1, 2, 3, 4, 5];
let inputArray2 = [4, 5, 6, 7, 8];
let inputArray3 = [7, 8, 9, 10, 11];
let outputArray = mergeUsingSpread(inputArray1, inputArray2, inputArray3);
console.log(outputArray);

/*********************** */
function mergeUsingConcat() {
  // We are merging all arrays
  // in one array
  let allMergedArr = Array.prototype.concat.apply([], arguments);

  // We are Removing the duplicate
  // using Set and converting it to array
  return Array.from(new Set(allMergedArr));
}

// Multiple input arrys. You can
// increase and pass to the function
let inputArray1 = [1, 2, 3, 4, 5];
let inputArray2 = [4, 5, 6, 7, 8];
let inputArray3 = [7, 8, 9, 10, 11];
let outputArray = mergeUsingConcat(inputArray1, inputArray2, inputArray3);

//Output is displayed
console.log(outputArray);

/*********************************************************** */

function mergeUsingReduce() {
  // Reduce method will merge the
  // multiple input arrays in single set here.
  return Array.prototype.reduce.call(
    arguments,
    function (res, currentArr) {
      // Iterate over each element
      // in the currentArray.
      currentArr.forEach(function (ele) {
        res.add(ele);
      });
      return res;
    },
    new Set()
  );
}

// Multiple input arrys. You can increase
// and pass to the function
let inputArray1 = [1, 2, 3, 4, 5];
let inputArray2 = [4, 5, 6, 7, 8];
let inputArray3 = [7, 8, 9, 10, 11];
let tempresult = mergeUsingReduce(inputArray1, inputArray2, inputArray3);

// We are converting Set to the array
// and printing it.
let outputArray = Array.from(tempresult);
console.log(outputArray);
