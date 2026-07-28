```js
// Input: N = 6, K = 7, arr[] = {1, 2, 3, 4, 5, 6}
// Output: 3
// Explanation: Possible pairs are: (5, 2), (1, 3), (4, 6)

// Input: N = 4, K = 22, arr[] = {1, 3, 12, 9}
// Output: 1
// Explanation: Only one pair is possible.
// The pair can be either (1, 3) or (1, 9) or (3, 9).

// JavaScript code for the above approach

// Function to find the total possible pairs
function go(ar, N, K) {
  // Stores the count of odd & even
  // elements in the array
  let odds = 0,
    evens = 0;
  for (let i = 0; i < N; i++) {
    if (ar[i] & 1) odds++;
    else evens++;
  }

  // Total pairs
  let ans = odds / 2 + evens / 2;

  // If number of both odds & even
  // elements are odd
  if (odds & 1 && evens & 1) {
    let occ = new Map();
    for (let i = 0; i < N; i++) {
      if (occ.has(arr[i])) occ.set(ar[i], occ.get(arr[i]) + 1);
      else occ.set(arr[i], 1);
    }

    // Check if there exists a pair
    // with different parity &
    // sum equals to K
    for (let i = 0; i < N; i++) {
      if (occ.has(K - ar[i])) {
        if (
          (ar[i] & 1 && !((K - ar[i]) & 1)) ||
          (!(ar[i] & 1) && (K - ar[i]) & 1)
        ) {
          ans++;
          break;
        }
      }
    }
  }

  document.write(ans + "<br");
}

// Driver Code

let N = 6,
  K = 7;
let arr = [1, 2, 3, 4, 5, 6];
go(arr, N, K);
