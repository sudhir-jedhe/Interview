```js
/*
Input: S = “geeks”
Output: hgglt
Explanation: 
The following modifications are done on the string S:

The frequency of ‘g’ in the string is 1. Therefore, ‘g’ is replaced by ‘h’.
The frequency of ‘e’ in the string is 2. Therefore, ‘e’ is replaced by ‘g’.
The frequency of ‘e’ in the string is 2. Therefore, ‘e’ is replaced by ‘g’.
The frequency of ‘k’ in the string is 1. Therefore, ‘k’ is converted to ‘k’ + 1 = ‘l’.
The frequency of ‘s’ in the string is 1. Therefore, ‘s’ is converted to ‘s’ + 1 = ‘t’.
Therefore, the modified string S is “hgglt”.

Input: S = “jazz”
Output: “kbbb”
*/
// JavaScript program for the above approach
// Function to modify string by replacing
// characters by the alphabet present at
// distance equal to frequency of the string
function addFrequencyToCharacter(s) {
  // Stores frequency of characters
  var frequency = new Array(26).fill(0);

  // Stores length of the string
  var n = s.length;

  // Traverse the given string S
  for (var i = 0; i < n; i++) {
    // Increment frequency of
    // current character by 1
    frequency[s[i].charCodeAt(0) - "a".charCodeAt(0)] += 1;
  }

  // Traverse the string
  for (var i = 0; i < n; i++) {
    // Store the value to be added
    // to the current character
    var add = frequency[s[i].charCodeAt(0) - "a".charCodeAt(0)] % 26;

    // Check if after adding the
    // frequency, the character is
    // less than 'z' or not
    if (s[i].charCodeAt(0) + add <= "z".charCodeAt(0))
      s[i] = String.fromCharCode(s[i].charCodeAt(0) + add);
    // Otherwise, update the value of
    // add so that s[i] doesn't exceed 'z'
    else {
      add = s[i].charCodeAt(0) + add - "z".charCodeAt(0);
      s[i] = String.fromCharCode("a".charCodeAt(0) + add - 1);
    }
  }

  // Print the modified string
  document.write(s.join("") + "<br>");
}

// Driver Code
var str = "geeks";
addFrequencyToCharacter(str.split(""));
