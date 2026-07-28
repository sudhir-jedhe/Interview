```js
// Input: arr[] = {6, -3, -10, 0, 2}
// Output:  180
// Explanation: The subarray is {6, -3, -10}

// Input: arr[] = {-1, -3, -10, 0, 60}
// Output:   60
// Explanation: The subarray is {60}

// Javascript program to find Maximum Product Subarray

/* Returns the product of max product subarray.*/
function maxSubarrayProduct(arr, n) {
  // Initializing result
  let result = arr[0];

  for (let i = 0; i < n; i++) {
    let mul = arr[i];
    // traversing in current subarray
    for (let j = i + 1; j < n; j++) {
      // updating result every time
      // to keep an eye over the maximum product
      result = Math.max(result, mul);
      mul *= arr[j];
    }
    // updating the result for (n-1)th index.
    result = Math.max(result, mul);
  }
  return result;
}

// Driver code

let arr = [1, -2, -3, 0, 7, -8, -2];
let n = arr.length;
document.write("Maximum Sub array product is " + maxSubarrayProduct(arr, n));

// This code is contributed by Mayank Tyagi

/********************************************** */

// JavaScript program to find Maximum Product Subarray

/* Returns the product
of max product subarray. */
function maxSubarrayProduct(arr, n) {
  // max positive product
  // ending at the current position
  let max_ending_here = arr[0];

  // min negative product ending
  // at the current position
  let min_ending_here = arr[0];

  // Initialize overall max product
  let max_so_far = arr[0];

  /* Traverse through the array.
	the maximum product subarray ending at an index
	will be the maximum of the element itself,
	the product of element and max product ending previously
	and the min product ending previously. */
  for (let i = 1; i < n; i++) {
    let temp = Math.max(
      Math.max(arr[i], arr[i] * max_ending_here),
      arr[i] * min_ending_here
    );
    min_ending_here = Math.min(
      Math.min(arr[i], arr[i] * max_ending_here),
      arr[i] * min_ending_here
    );
    max_ending_here = temp;
    max_so_far = Math.max(max_so_far, max_ending_here);
  }
  return max_so_far;
}

// Driver code
let arr = [1, -2, -3, 0, 7, -8, -2];
let n = arr.length;
document.write("Maximum Sub array product is " + maxSubarrayProduct(arr, n));

// This code is contributed by shinjanpatra

/*********************************************************** */
// JavaScript program to find Maximum Product Subarray

// Function to find the maximum product subarray
function maxSubarrayProduct(arr, n) {
  let ans = -Infinity;
  let product = 1;

  for (let i = 0; i < n; i++) {
    product *= arr[i];
    ans = Math.max(ans, product);
    if (arr[i] === 0) {
      product = 1;
    }
  }

  product = 1;

  for (let i = n - 1; i >= 0; i--) {
    product *= arr[i];
    ans = Math.max(ans, product);
    if (arr[i] === 0) {
      product = 1;
    }
  }

  return ans;
}

// Driver code
const arr = [1, -2, -3, 0, 7, -8, -2];
const n = arr.length;
console.log(`Maximum Subarray product is ${maxSubarrayProduct(arr, n)}`);

//This code is written by Sundaram
