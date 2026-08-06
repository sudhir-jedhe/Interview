```js
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  const cnt = new Array(26).fill(0);
  for (const c of s) {
    ++cnt[c.charCodeAt() - "a".charCodeAt()];
  }
  for (let i = 0; i < s.length; ++i) {
    if (cnt[s[i].charCodeAt() - "a".charCodeAt()] === 1) {
      return i;
    }
  }
  return -1;
};

// Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.

// Example 1:

// Input: s = "leetcode"
// Output: 0
// Example 2:

// Input: s = "loveleetcode"
// Output: 2
// Example 3:

// Input: s = "aabb"
// Output: -1
```
