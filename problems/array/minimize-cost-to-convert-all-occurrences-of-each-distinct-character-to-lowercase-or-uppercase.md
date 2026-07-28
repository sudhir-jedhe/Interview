```js
// Input: S = “aabbAA”, L = 1, U = 1
// Output: AAbbAA
// Explanation:
// The cost of converting “aabbAA” to “AAbbAA” is 1*2 = 2, which is minimum among all the possible combinations of conversions.

// Input: S = “aApbBp”, L = 1, U = 2
// Output: aapbbp

// JavaScript program for the above approach
// Function to find the minimum cost
// to convert all distinct characters
// to either uppercase or lowercase
function minimumCost(str, L, U) {
  // Store the size of the string
  var N = str.length;
  var s = str.split("");

  // string ans = "";

  // Stores the frequency of lowercase
  // & uppercase characters respectively
  var lowerFreq = new Array(26).fill(0);
  var upperFreq = new Array(26).fill(0);

  // Traverse the string S
  for (var i = 0; i < N; i++) {
    // Update uppercase
    // frequency of s[i]
    if (s[i] === s[i].toUpperCase())
      upperFreq[s[i].charCodeAt(0) - "A".charCodeAt(0)]++;
    // Otherwise, update lowercase
    // frequency of s[i]
    else lowerFreq[s[i].charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Stores if the i-th character
  // should be lowercase or not
  var result = new Array(26).fill(0);

  // Iterate over the range [0, 25]
  for (var i = 0; i < 26; i++) {
    // If the character is present
    // in the string
    if (lowerFreq[i] !== 0 || upperFreq[i] !== 0) {
      // Store the cost to convert
      // every occurrence of i to
      // uppercase and lowercase
      var costToUpper = U * lowerFreq[i];
      var costToLower = L * upperFreq[i];

      // Update result[i] to 1 if
      // lowercase cost is less
      if (costToLower < costToUpper) {
        result[i] = 1;
      }
    }
  }

  // Traverse the string S
  for (var i = 0; i < N; i++) {
    // Store the index
    // of the character
    var index = 0;

    if (s[i] === s[i].toLowerCase())
      index = s[i].charCodeAt(0) - "a".charCodeAt(0);
    else index = s[i].charCodeAt(0) - "A".charCodeAt(0);

    // Convert the current character
    // to uppercase or lowercase
    // according to the condition
    if (result[index] === 1) {
      // Update s[i]
      s[i] = s[i].toLowerCase();
    } else {
      // Update s[i]
      s[i] = s[i].toUpperCase();
    }
  }

  // Print the modified string
  document.write(s.join(""));
}

// Driver Code
var S = "aabbAA";
var L = 1,
  U = 1;
minimumCost(S, L, U);
