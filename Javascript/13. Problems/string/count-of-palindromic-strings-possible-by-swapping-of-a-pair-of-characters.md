```js
// Input: s = “abba”
// Output: 2
// Explanation:
// 1st Swap: abba -> abba
// 2nd Swap: abba -> abba
// All other swaps will lead to a non-palindromic string.
// Therefore, the count of possible strings is 2.
// Input: s = “aaabaaa”
// Output: 15

// JavaScript program to implement
// the above approach
// Function to return the count of
// possible palindromic strings
function findNewString(s) {
  var ans = 0;

  // Stores the frequencies
  // of each character
  var freq = new Array(26).fill(0);

  // Stores the length of
  // the string
  var n = s.length;

  for (let i = 0; i < n; i++) {
    // Increase the number of swaps,
    // the current character make with
    // its previous occurrences
    ans += freq[s[i].charCodeAt(0) - "a".charCodeAt(0)];

    // Increase frequency
    freq[s[i].charCodeAt(0) - "a".charCodeAt(0)] += 1;
  }
  return ans;
}
// Driver Code
var s = "aaabaaa";
document.write(findNewString(s));
