```js
// Input: arr[] = {1, 2, 3, 4, 5}
// Output: 4 2 1
// All possible pairs of the subsequence are:
// (4, 2) -> 4 % 2 = 0
// (4, 1) -> 4 % 1 = 0
// and (2, 1) -> 2 % 1 = 0

// Input: arr[] = {1, 3, 4, 9}
// Output: 1 3 9

// Javascript implementation of above approach

// Function to find the required subsequence
function findSubSeq(arr, n) {
  // Sort the array
  arr.sort();

  // Keep a count of the length of the
  // subsequence and the previous element
  var count = new Array(n);
  var prev = new Array(n);

  // Set the initial values
  count.fill(1);
  prev.fill(-1);

  // Maximum length of the subsequence and
  // the last element
  var max = 0;
  var maxprev = -1;

  // Run a loop for every element
  for (var i = 0; i < n; i++) {
    // Check for all the divisors
    for (var j = i - 1; j >= 0; j--) {
      // If the element is a divisor and the length
      // of subsequence will increase by adding
      // j as previous element of i
      if (arr[i] % arr[j] == 0 && count[j] + 1 > count[i]) {
        // Increase the count
        count[i] = count[j] + 1;
        prev[i] = j;
      }
    }

    // Update the max count
    if (max < count[i]) {
      max = count[i];
      maxprev = i;
    }
  }

  // Get the last index of the subsequence
  var i = maxprev;
  while (i >= 0) {
    // Print the element
    if (arr[i] != -1) document.write(arr[i] + " ");

    // Move the index to the previous element
    i = prev[i];
  }
}

var arr = [1, 2, 3, 4, 5];
var n = arr.length;
findSubSeq(arr, n);

/******************************************** */
function findSubSeq(arr) {
  const n = arr.length;

  // Sort the array
  arr.sort((a, b) => a - b);

  // Keep a count of the length of the subsequence and the previous element
  const count = new Array(n).fill(1);
  const prev = new Array(n).fill(-1);

  // Maximum length of the subsequence and the last element
  let max = 0;
  let maxprev = -1;

  // Run a loop for every element
  for (let i = 0; i < n; i++) {
    // Check for all the divisors
    for (let j = i - 1; j >= 0; j--) {
      // If the element is a divisor and the length of subsequence will increase
      // by adding j as the previous element of i
      if (arr[i] % arr[j] === 0 && count[j] + 1 > count[i]) {
        // Increase the count
        count[i] = count[j] + 1;
        prev[i] = j;
      }
    }

    // Update the max count
    if (max < count[i]) {
      max = count[i];
      maxprev = i;
    }
  }

  // Print the largest divisor subset in order
  let result = [];
  let i = maxprev;
  while (i >= 0) {
    result.push(arr[i]);
    i = prev[i];
  }
  console.log(result.join(" "));
}

const arr = [1, 2, 3, 4, 5];
findSubSeq(arr);
