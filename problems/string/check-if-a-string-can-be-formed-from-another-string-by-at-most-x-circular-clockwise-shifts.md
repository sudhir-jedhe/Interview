```js
// Input: S1 = “abcd”, S2 = “dddd”, X = 3
// Output: Yes
// Explanation:
// Given string S1 can be converted to string S2 as-
// Character “a” – Shift 3 times – “d”
// Character “b” – Shift 2 times – “d”
// Character “c” – Shift 1 times – “d”
// Character “d” – Shift 0 times – “d”

// Input: S1 = “you”, S2 = “ara”, X = 6
// Output: Yes
// Explanation:
// Given string S1 can be converted to string S2 as –
// Character “y” – Circular Shift 2 times – “a”
// Character “o” – Shift 3 times – “r”
// Character “u” – Circular Shift 6 times – “a”

// Javascript implementation to check
// that a given string can be
// converted to another string
// by circular clockwise shift
// of each character by atmost
// X times

// Function to check that all
// characters of s1 can be
// converted to s2 by circular
// clockwise shift atmost X times
function isConversionPossible(s1, s2, x) {
  let diff = 0,
    n;
  n = s1.length;

  // Check for all characters of
  // the strings whether the
  // difference between their
  // ascii values is less than
  // X or not
  for (let i = 0; i < n; i++) {
    // If both the characters
    // are same
    if (s1[i] == s2[i]) continue;

    // Calculate the difference
    // between the ASCII values
    // of the characters
    diff = (s2[i].charCodeAt(0) - s1[i].charCodeAt(0) + 26) % 26;

    // If difference exceeds X
    if (diff > x) {
      document.write("NO<br>");
      return;
    }
  }
  document.write("YES<br>");
}

// Driver Code
let s1 = "you";
let s2 = "ara";
let x = 6;

// Function call
isConversionPossible(s1, s2, x);

// This code is contributed by avanitrachhadiya2155
