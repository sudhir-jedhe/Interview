```js
// Input: arr[] = {“your”, “you”, “or”, “yo”}
// Output: ruyo
// Explanation: The string “ruyo” is the string which contains all the characters present in all the strings in arr[].
// There can be many other strings of size 4 e.g. “oury”. Those are also acceptable.

// Input: arr[] = {“abm”, “bmt”, “cd”, “tca”}
// Output: abctdm

function minSubstr(s) {
  // Stores the concatenated string
  // of all the given strings
  var str = "";

  // Loop to iterate through all
  // the given strings
  for (var i = 0; i < s.length; i++) {
    str += s[i];
  }

  // Set to store the characters
  var set = new Set();

  // Loop to iterate over all
  // the characters in str
  for (var i = 0; i < str.length; i++) {
    set.add(str.charAt(i));
  }

  // Stores the required answer
  var res = "";

  // Loop to iterate over the set
  for (let itr of set) {
    res += itr;
  }

  // Return Answer
  return res;
}

// Driver Code
var arr = ["your", "you", "or", "yo"];
document.write(minSubstr(arr));

// This code is contributed by 29AjayKumar
