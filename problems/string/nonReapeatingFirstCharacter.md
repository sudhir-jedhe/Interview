```js
// Brute force: Time: O(N^2) | Space: O(1)
const nonRepeatingFirstCharacter = (str) => {
    for (let i = 0; i < str.length; i++) {
      let duplicate = false;
      for (let j = i + 1; j < str.length; j++) {
        if (str[i] === str[j]) {
          duplicate = true;
          break;
        }
      }
  
      if (!duplicate) {
        return i;
      }
    }
    return null;
  };
  
  const str = "abcdcaf";
  console.log(nonRepeatingFirstCharacter(str));


  // Time: O(N) | Space: O(1) - because there are atmost 26 characters
const nonRepeatingFirstCharacter = (str) => {
    let map = {};
    for (let i = 0; i < str.length; i++) {
      map[str[i]] = map[str[i]] ? map[str[i]] + 1 : 1;
    }
  
    for (let i = 0; i < str.length; i++) {
      if (map[str[i]] === 1) {
        return i;
      }
    }
  
    return null;
  };
  
  const str = "abcdcaf";
  console.log(nonRepeatingFirstCharacter(str));

//   Given a string of characters, return the index of the first non-repeating character.

// Example
// Input: "abcdcaf"
// Output: 1
// Explanation
// The non-duplicate characters in the above string are b, d and f. Since b occurs first, the index of b, which is 1 is returned.

// Example
// Input: "abcdefghabcdefgh"
// Output: null
// Explanation
// Since all the characters are repeating, null is returned.

// Constraints
// String
// 1 <= str <= 26
