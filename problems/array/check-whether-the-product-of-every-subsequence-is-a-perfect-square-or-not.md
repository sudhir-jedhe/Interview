```js
// Input: arr[] = {1, 4, 100}
// Output: Yes
// Explanation:
// Following are the subsequences of the given array arr[]:

// {1}, the product is equal to 1, and is a perfect square.
// {1, 4}, the product is equal to 4, and is a perfect square.
// {1, 100}, the product is equal to 100 and is a perfect square.
// {1, 4, 100}, the product is equal to 400 and is a perfect square.
// {4}, the product is equal to 4 and is a perfect square.
// {4, 100}, the product is equal to 400 and is a perfect square.
// {100}, the product is equal to 100 and is a perfect square.
// Therefore, print “Yes”.

// Input: arr[] = {1, 3}
// Output: No

// Javascript program for the above approach

// Function to check if the product of
// every subsequence of the array is a
// perfect square or not
function perfectSquare(arr, N) {
  // Traverse the given array
  for (let i = 0; i < N; i++) {
    // If arr[i] is a perfect
    // square or not
    let p = Math.sqrt(arr[i]);

    if (p * p != arr[i]) {
      return "No";
    }
  }

  // Return "Yes"
  return "Yes";
}

// Driver Code
let arr = [1, 4, 100];
let N = arr.length;

document.write(perfectSquare(arr, N));

// This code is contributed by target_2
