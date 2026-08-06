```js
firstCharacter("hello"); // "h"
firstCharacter("dad"); // "a"
firstCharacter("racecar"); // null
firstCharacter("aabbcc"); // null
firstCharacter(""); // null

export const firstCharacter = (str) => {
  const charCount = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (charCount[char] === undefined) {
      charCount[char] = 1;
    } else {
      charCount[char]++;
    }
  }

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (charCount[char] === 1) {
      return char;
    }
  }

  return null;
};
