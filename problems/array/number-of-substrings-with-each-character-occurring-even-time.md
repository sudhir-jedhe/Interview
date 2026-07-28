```js
// Input: S = “abbaa”
// Output: 4
// Explanation:
// The substrings having frequency of each character is even are {“abba”, “aa”, “bb”, “bbaa”}.
// Therefore, the count is 4.

// Input: S = “geeksforgeeks”
// Output: 2

// Define a function to find the number of substrings with an even number of characters
function findevenone(s, n) {
  let cnt = 0; // Counter variable

  // Nested for loop for traversing all possible substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let xoro = 0;
      // For loop to XOR all characters in the current substring
      for (let k = i; k <= j; k++) {
        xoro ^= s.charCodeAt(k);
      }
      // Increment counter if the XOR of the substring is zero
      if (xoro == 0) cnt++;
    }
  }

  console.log("Number of substring with even number of characters is : " + cnt); // Output the result
}

// Main function
function main() {
  let str = "abbaa"; // Initialize the string
  let size = str.length;

  findevenone(str, size); // Call the function to find the number of substrings with even number of characters
}

// Call the main function
main();

/************************************************************************************* */

// JavaScript program for the above approach
// Function to count substrings having
// even frequency of each character
function subString(s, n) {
  // Stores the total
  // count of substrings
  var count = 0;

  // Traverse the range [0, N]:
  for (var i = 0; i < n; i++) {
    // Traverse the range [i + 1, N]
    for (var len = i + 1; len <= n; len++) {
      // Stores the substring over
      // the range of indices [i, len]
      var test_str = s.substring(i, len);

      // Stores the frequency of characters
      var res = {};

      // Count frequency of each character

      var temp = test_str.split("");

      for (const keys of temp) {
        res[keys] = (res[keys] ? res[keys] : 0) + 1;
      }

      var flag = 0;

      // Traverse the dictionary
      for (const [key, value] of Object.entries(res)) {
        // If any of the keys
        // have odd count
        if (res[key] % 2 != 0) {
          flag = 1;
          break;
        }
      }

      // Otherwise
      if (flag == 0) count += 1;
    }
  }

  // Return count
  return count;
}

// Driver Code
var S = "abbaa";
var N = S.length;

document.write(subString(S, N));

// This code is contributed by rdtank

/*********************************************************************************** */

// JavaScript program for the above approach

// Function to count substrings having
// even frequency of each character
function subString(s, n) {
  // Stores the count of a character
  let hash = new Map();
  hash.set(0, 1);

  // Stores bitmask
  let pre = 0;

  // Stores the count of substrings
  // with even count of each character
  let count = 0;

  // Traverse the string S
  for (let i = 0; i < n; i++) {
    // Flip the ord(i)-97 bits in pre
    pre ^= 1 << (s[i].charCodeAt(0) - 97);

    if (!hash.has(pre)) hash.set(pre, 0);

    // Increment the count by hash[pre]
    count += hash.get(pre);

    // Increment count of pre in hash
    hash.set(pre, hash.get(pre) == null ? 0 : hash.get(pre) + 1);
  }

  // Return the total count obtained
  return count;
}

// Driver code
let S = "abbaa";
let N = S.length;

document.write(subString(S, N));
