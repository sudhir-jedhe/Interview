```js
// Input : A[] = {3, 4}
// Output : 3

// Input : A[] = {2, 4, 1, 3}
// Output : 3

/*
Given an array A[] of n-elements. We need to select two adjacent elements and 
delete the larger of them and store smaller of them to another array say B[]. 
We need to perform this operation till array A[] contains only single element. 
Finally, we have to construct the array B[] in such a way that total sum of 
its element is minimum. Print the total sum of array B[]
*/

// JavaScript program to minimize the cost
// of array minimization

// Returns minimum possible sum in
// array B[]
function minSum(A, n) {
  let min_val = Math.min(...A);
  return min_val * (n - 1);
}

// driver function

let A = [3, 6, 2, 8, 7, 5];
let n = A.length;
document.write(minSum(A, n));

// This code is contributed by Mayank Tyagi
