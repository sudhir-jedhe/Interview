```js
/*
Input: Array[] = {1, 3, 5, 7, 9}, K = 2.
Output: 7 9 1 3 5
Explanation:
After 1st rotation - {9, 1, 3, 5, 7}
After 2nd rotation - {7, 9, 1, 3, 5}
Input: Array[] = {1, 2, 3, 4, 5}, K = 4.
Output: 2 3 4 5 1
*/
// Javascript implementation of right rotation
// of an array K number of times

// Function to rightRotate array
function RightRotate(a, n, k) {
  // If rotation is greater
  // than size of array
  k = k % n;

  for (let i = 0; i < n; i++) {
    if (i < k) {
      // Printing rightmost
      // kth elements
      document.write(a[n + i - k] + " ");
    } else {
      // Prints array after
      // 'k' elements
      document.write(a[i - k] + " ");
    }
  }
  document.write("<br>");
}

// Driver code
let Array = [1, 2, 3, 4, 5];
let N = Array.length;
let K = 2;

RightRotate(Array, N, K);

// This code is contributed by gfgking.

/*********************** */
// Javascript program to rotate right an array by K times
let arr = [1, 3, 5, 7, 9, 11];
let n = arr.length;
let k = 3; //No. of rotations
k = k % n;
let i, j;

// Reverse last k numbers
for (i = n - k, j = n - 1; i < j; i++, j--) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Reverse the first n-k terms
for (i = 0, j = n - k - 1; i < j; i++, j--) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
// Reverse the entire array
for (i = 0, j = n - 1; i < j; i++, j--) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Print the rotated array
for (let i = 0; i < n; i++) {
  console.log(arr[i] + " ");
}

// This code is contributed by Aman Kumar


/*********************************************************** */
function rotateArray(arr, n, k):
   // Reduce the number of rotations
   k = k % n

   // Reverse the first part of the array
   reverse(arr, arr + n – k)

   // Reverse the second part of the array
   reverse(arr + n – k, arr + n)

   // Reverse the entire array
   reverse(arr, arr + n)

// Driver code
arr = {1, 3, 5, 7, 9}
n = size(arr)
k = 2

rotateArray(arr, n, k)

for i = 0 to n-1:
   console.log(arr[i])

// This  is contributed by  Vaibhav Saroj