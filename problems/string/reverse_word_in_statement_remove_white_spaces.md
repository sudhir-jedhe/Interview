```js
/*********************Reverse Word in String remove white spaces *******************/

// Example 1:

// Input: s = "the sky is blue"
// Output: "blue is sky the"
// Example 2:

// Input: s = "  hello world  "
// Output: "world hello"
// Explanation: Your reversed string should not contain leading or trailing spaces.
// Example 3:

// Input: s = "a good   example"
// Output: "example good a"
// Explanation: You need to reduce multiple spaces between two words to a single space in the reversed string.
var reverseWords = function(s) {
    return  s.toString().trim().replace(/\s+/g, " ").split(' ').reverse().join(' ')
};

console.log(reverseWords('"a good   example'))

/*************************************************************************************************** */
function reverseString(sentence, left, right) {
  if (!sentence || sentence.length < 2) return
  while (left < right) {
      let temp = sentence[left]
      sentence = sentence.substr(0, left) + sentence[right] + sentence.substr(left+1)
      sentence = sentence.substr(0, right) + temp + sentence.substr(right+1)
      left++
      right--
  }
  return sentence
}

function reverseWords(sentence) {
  let left = 0
  let right = 0
  sentence = sentence.split('').reverse().join('')
  while (true) {
      while(sentence[left] === ' ') left++
      if (left >= sentence.length) break
      right = left + 1
      while (right < sentence.length && sentence[right] != ' ') right++
      sentence = reverseString(sentence, left, right-1)
      left = right
  }
  return sentence
}

let sentence = "I love javascript";
console.log(sentence);
console.log(reverseWords(sentence));

/**
* Time Complexity O(N)
* Space Complexity O(1)
*/