// Input: str = “mango is sweet when nam en tastes it#”
// Output: man
// Explanation: Substring “man” is reversed to “nam” and it is a word in the given string

// Input: str = “hello world#”
// Output: -1

// Javascript program to find first substring

// Function to find first substring
function first_substring(s) {
  var n = s.length,
    c = 0;
  var s1, s2;
  var mpp = new Map();

  // Storing the words present in string
  for (var i = 0; i < n; i++) {
    if (s[i] == " " || s[i] == "#") {
      s1 = s.substring(c, i);
      mpp.set(s1, 1);
      c = i + 1;
    }
  }

  // Calculating for all
  // possible valid substring.
  for (var i = 0; i < n; i++) {
    if (s[i] == " ") {
      continue;
    }
    for (var j = 0; j < n; j++) {
      if (s[j] == " ") {
        break;
      }
      s1 = s.substring(i, j + 1);
      s2 = s1;
      s1 = s1.split("").reverse().join("");

      if (mpp.has(s1)) {
        return s2;
      }
    }
  }
  return "-1";
}
// Driver code
var s, s1;
s = "mango is sweet when nam en tastes it#";
s1 = first_substring(s);
document.write(s1);
