```js
/*
Input : S = “geeksforgeeks” and c = ‘e’
Output : 4
Explanation: ‘e’ appears four times in str.

Input : S = “abccdefgaa” and c = ‘a’
Output : 3
Explanation: ‘a’ appears three times in str.

*/

function countFrequency(inputString, targetChar) {
  let count = 0;
  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i] === targetChar) {
      count++;
    }
  }
  return count;
}

const text = "Hello Geeks!";
const charToCount = "l";

console.log(countFrequency(text, charToCount));

/***************************************** */
function countFrequency(inputString, targetChar) {
  const stringArray = inputString.split("");
  const count = stringArray.filter((char) => char === targetChar).length;
  return count;
}

const text = "Hello Geeks!";
const charToCount = "e";

console.log(countFrequency(text, charToCount));

/***************************** */
function countFrequency(inputString, targetChar) {
  const regexPattern = new RegExp(targetChar, "g");
  const frequencyMatches = inputString.match(regexPattern);
  const counter = frequencyMatches ? frequencyMatches.length : 0;
  return counter;
}

const text = "Hello Geeks!";
const charToCount = "H";

console.log(countFrequency(text, charToCount));
