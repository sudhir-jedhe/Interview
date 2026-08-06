```js
// Input: arr[] = {5, 10, 12, 13, 15, 18}, K = 30
// Output: {12, 18}, {5, 12, 13}, {5, 10, 15}
// Explanation:
// Subsets with sum 30 are:
// 12 + 18 = 30
// 5 + 12 + 13 = 30
// 5 + 10 + 15 = 30

// Input: arr[] = {1, 2, 3, 4}, K = 5
// Output: {2, 3}, {1, 4}

// JavaScript implementation of the above approach

// Function to print the subsets whose
// sum is equal to the given target K
function sumSubsets(set, n, target) {
  // Create the new array with length
  // equal to array set[] to create
  // binary array as per n(decimal number)
  let x = new Array(set.length);
  let j = set.length - 1;

  // Convert the array into binary array
  while (n > 0) {
    x[j] = n % 2;
    n = Math.floor(n / 2);
    j--;
  }

  let sum = 0;

  // Calculate the sum of this subset
  for (let i = 0; i < set.length; i++) if (x[i] == 1) sum = sum + set[i];

  // Check whether sum is equal to target
  // if it is equal, then print the subset
  if (sum == target) {
    document.write("{");
    for (let i = 0; i < set.length; i++)
      if (x[i] == 1) document.write(set[i] + ", ");
    document.write("}, ");
  }
}

// Function to find the subsets with sum K
function findSubsets(arr, K) {
  // Calculate the total no. of subsets
  let x = Math.pow(2, arr.length);

  // Run loop till total no. of subsets
  // and call the function for each subset
  for (let i = 1; i < x; i++) sumSubsets(arr, i, K);
}

// Driver code

let arr = [5, 10, 12, 13, 15, 18];
let K = 30;
findSubsets(arr, K);
