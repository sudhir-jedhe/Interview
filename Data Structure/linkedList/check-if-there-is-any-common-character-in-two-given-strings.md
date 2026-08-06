// Input: s1 = "geeksforgeeks", s2 = "geeks"
// Output: Yes

// Input: s1 = "geeks", s2 = "for"
// Output: No

// Javascript implementation of above approach

// Function to match character
function check(s1, s2) {
  // Create a map to map
  // characters of 1st string
  var map = new Map();

  // traverse the first string
  // and create a hash map
  for (var i = 0; i < s1.length; i++) {
    if (map.has(s1[i].charCodeAt(0))) {
      map[s1[i].charCodeAt(0)]++;
    } else {
      map[s1[i].charCodeAt(0)] = 1;
    }
  }

  // traverse the second string
  // and if there is any
  // common character than return 1
  for (var i = 0; i < s2.length; i++)
    if (map[s2[i].charCodeAt(0)] > 0) return true;

  // else return 0
  return false;
}

// Driver code
// Declare two strings
var s1 = "geeksforgeeks",
  s2 = "geeks";
// Find if there is a common subsequence
var yes_or_no = check(s1, s2);
if (yes_or_no) document.write("Yes");
else document.write("No");
/*************************** */
function commonChars(str1, str2) {
  // Convert the strings into sets of characters
  let set1 = new Set(str1);
  let set2 = new Set(str2);

  // Find the intersection of the sets
  let common = new Set([...set1].filter((x) => set2.has(x)));

  if (common.size > 0) {
    return true;
  } else {
    return false;
  }
}

// Example usage
let string1 = "hello";
let string2 = "world";
if (commonChars(string1, string2)) {
  console.log("Yes");
} else {
  console.log("No");
}
