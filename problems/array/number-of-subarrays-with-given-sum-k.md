```js
function countSubArrays(arr, k) {
  //get the size the of the array
  let length = arr.length;

  //Keep the count
  let count = 0;

  //traverse through the array
  for (let i = 0; i < length; i++) {
    //temp variables to store the sum
    let sum = 0;

    //traverse through the every next element after i
    for (let j = i; j < length; j++) {
      sum += arr[j];

      //if sum is equal to k then increase the count.
      if (sum === k) {
        count++;
      }
    }
  }

  return count;
}

/********************************* */
function countSubArrays(arr, sum) {
  //HashMap to keep track of the elements
  let prevSum = new Map();

  //To count the subarrays
  let count = 0;

  // Sum of elements so far.
  let currsum = 0;

  for (let i = 0; i < arr.length; i++) {
    // Add current element to sum so far.
    currsum += arr[i];

    // If currsum is equal to desired sum,
    // then a new subarray is found.
    // So increase count of subarrays.
    if (currsum == sum) {
      count++;
    }

    // currsum has element
    // then add it to the count
    if (prevSum.has(currsum - sum)) {
      count += prevSum.get(currsum - sum);
    }

    // Add currsum value to count of
    // different values of sum.
    let total = prevSum.get(currsum);
    if (!total) {
      prevSum.set(currsum, 1);
    } else {
      prevSum.set(currsum, total + 1);
    }
  }

  return count;
}

Input: console.log(countSubArrays([3, 4, -7, 1, 3, 3, 1, -4], 7));

Output: 4;
