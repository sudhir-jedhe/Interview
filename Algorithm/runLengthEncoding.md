// Character Counts
// Given a string of alphabets (from a to z), Print the count of the character appearing in the string right next to it. This is also called Run Length Encoding.

// Example
// Input
// str = "aabbcccddddeeeee"
// Output
// str = "2a2b3c4d5e"
// Explanation
// Every character appearing in the string will have the count printed right next to it. In the above example, a appeared 2 times, b appeared 3 times and so on.

// Example
// Input
// str = "azvdaaarrtaaa"
// Output
// str = "7a1z1v1d2r1t"
// Explanation
// Same approach as before, All the count of a specific character are printed before the string character. Note that even if the character is repeated after an interval of unique characters, they'll be printed at the place where they first occured.

// Stuck? Check o


// Time: O(N) | Space: O(N)
const runLengthEncoding = (str) => {
    let map = {};
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
      map[str[i]] = map[str[i]] ? map[str[i]] + 1 : 1;
    }
    for (let key in map) {
      newStr += map[key] + key;
    }
    return newStr;
  };
  
  const str = "azvdaaarrtaaa";
  console.log(runLengthEncoding(str));