```js
/*
Given two unsorted arrays arr1[] and arr2[], the task is to find the sum of elements of arr1[] 
such that the number of elements less than or equal to them in arr2[] is maximum.

Input: arr1[] = {1, 2, 3, 4, 7, 9}, arr2[] = {0, 1, 2, 1, 1, 4} 
Output: 20 

arr1[i]	Count
1	4
2	5
3	5
4	6
7	6
9	6
Count for 4, 7 and 9 is maximum. 
Hence, the resultant sum is 4 + 7 + 9 = 20.
Input:arr1[] = {5, 10, 2, 6, 1, 8, 6, 12}, arr2[] = {6, 5, 11, 4, 2, 3, 7} 
Output: 12 
*/

// Javascript implementation of the approach

// Function to return the required sum
function findSumofEle(arr1, m, arr2, n) {
  let MAX = 100000;

  // Creating hash array initially
  // filled with zero
  let hash = new Array(MAX);

  for (let i = 0; i < MAX; i++) hash[i] = 0;

  // Calculate the frequency
  // of elements of arr2[]
  for (let i = 0; i < n; i++) hash[arr2[i]]++;

  // Running sum of hash array such
  // that hash[i] will give count of
  // elements less than or equal
  // to i in arr2[]
  for (let i = 1; i < MAX; i++) hash[i] = hash[i] + hash[i - 1];

  // To store the maximum value of
  // the number of elements in
  // arr2[] which are smaller
  // than or equal to some
  // element of arr1[]
  let maximumFreq = 0;
  for (let i = 0; i < m; i++) {
    maximumFreq = Math.max(maximumFreq, hash[arr1[i]]);
  }

  // Calculate the sum of elements from arr1[]
  // corresponding to maximum frequency
  let sumOfElements = 0;
  for (let i = 0; i < m; i++) {
    if (maximumFreq == hash[arr1[i]]) sumOfElements += arr1[i];
  }

  // Return the required sum
  return sumOfElements;
}

// Driver code
let arr1 = [2, 5, 6, 8];
let arr2 = [4, 10];
let m = arr1.length;
let n = arr2.length;

document.write(findSumofEle(arr1, m, arr2, n));

// This code is contributed by mohit kumar 29

/****************************************** */
// JavaScript implementation of the approach
function lower_bound(arr, n, elem) {
  for (var i = 0; i < n; i++) if (arr[i] >= elem) return i;
  return n;
}

// Function to return the required sum
function findSumofEle(arr1, m, arr2, n) {
  // Variable to store the
  // maximum count of numbers
  // which are smaller than
  // any element
  let maxi = -1000000;
  // Variable to store the answer
  let ans = 0;
  arr2.sort();

  for (var i = 0; i < m; i++) {
    // find the index of first element
    // in arr2 which is greater than
    // current element in arr1
    var y = lower_bound(arr2, n, arr1[i] + 1);

    // subtracting 1 to get the count of all smaller
    // elements
    y = y - 1;

    // if the count of all such element
    // is highest for this element in arr1
    // then it will be the answer
    if (y > maxi) {
      maxi = y;
      ans = arr1[i];
    }

    // if count of all such element is
    // equal to highest for this element
    // in arr1 then add this element also in answer
    else if (y == maxi) {
      ans += arr1[i];
    }
  }

  // Return the answer
  return ans;
}

// Driver code
let arr1 = [5, 10, 2, 6, 1, 8, 6, 12];
let arr2 = [6, 5, 11, 4, 2, 3, 7];
let m = arr1.length;
let n = arr2.length;

console.log(findSumofEle(arr1, m, arr2, n));

// This code is contributed by phasing17
