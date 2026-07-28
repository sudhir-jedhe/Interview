```js
// Input: str = “569431”, K = 3
// Output: 999931
// Replace first, second and fourth digits with 9.
// Input: str = “5687”, K = 2
// Output: 9987

// JavaScript implementation of the approach
// Function to return the maximum number
// that can be formed by changing
// at most k digits in str
function findMaximumNum(str, n, k) {
  // For every digit of the number
  for (var i = 0; i < n; i++) {
    // If no more digits can be replaced
    if (k < 1) break;

    // If current digit is not already 9
    if (str[i] !== "9") {
      // Replace it with 9
      str[i] = "9";

      // One digit has been used
      k--;
    }
  }
  return str.join("");
}

// Driver code
var str = "569431";
var n = str.length;
var k = 3;

document.write(findMaximumNum(str.split(""), n, k));
