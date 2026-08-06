```js
/*
Input:  A = "ABAC",  B = "CAB"
Output: CABAC 

*/

function findShortestCommonSupersequence(str1, str2) {
  // If either of the strings is empty,
  // return the other string as the result.
  if (str1.length === 0) {
    return str2;
  }
  if (str2.length === 0) {
    return str1;
  }

  // Check if the last characters of
  // both strings are the same.
  if (str1[str1.length - 1] === str2[str2.length - 1]) {
    // If they are, recursively find the SCS
    // without the last characters and
    // append the common character.
    return (
      findShortestCommonSupersequence(str1.slice(0, -1), str2.slice(0, -1)) +
      str1[str1.length - 1]
    );
  }

  // If the last characters are different,
  // explore both possibilities and choose
  // the shorter one.
  const result1 = findShortestCommonSupersequence(str1.slice(0, -1), str2);
  const result2 = findShortestCommonSupersequence(str1, str2.slice(0, -1));

  // Return the result with the shorter length.
  return result1.length < result2.length
    ? result1 + str1[str1.length - 1]
    : result2 + str2[str2.length - 1];
}

// Example usage:
const str1 = "ABAC";
const str2 = "CAB";
const shortestCommonSupersequence = findShortestCommonSupersequence(str1, str2);
console.log(shortestCommonSupersequence);

/********************************************* */
function findShortestSuperSequence(str1, str2) {
  // Determine the lengths of the input strings
  let m = str1.length;
  let n = str2.length;

  // Create a dynamic programming table
  // to store subproblem results
  let dpTable = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

  // Fill in the DP table to
  // calculate the length of LCS
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dpTable[i][j] = 1 + dpTable[i - 1][j - 1];
      } else {
        dpTable[i][j] = Math.max(dpTable[i][j - 1], dpTable[i - 1][j]);
      }
    }
  }

  // Initialize pointers and an empty
  // string for the supersequence
  let i = m;
  let j = n;
  let supersequence = "";

  // Reconstruct the supersequence
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      supersequence = str1[i - 1] + supersequence;
      i--;
      j--;
    } else {
      if (dpTable[i - 1][j] > dpTable[i][j - 1]) {
        supersequence = str1[i - 1] + supersequence;
        i--;
      } else {
        supersequence = str2[j - 1] + supersequence;
        j--;
      }
    }
  }

  // Add any remaining characters from both strings
  while (i > 0) {
    supersequence = str1[i - 1] + supersequence;
    i--;
  }
  while (j > 0) {
    supersequence = str2[j - 1] + supersequence;
    j--;
  }

  return supersequence;
}

// Example usage:
let str1 = "abac";
let str2 = "cab";
let shortestSuperSequence = findShortestSuperSequence(str1, str2);
console.log(shortestSuperSequence);
