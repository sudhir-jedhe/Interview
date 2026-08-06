```js
// Input:GeeksForGeeks
// Output:  5

// Input: Hello Geeks
// Output:  4

function getVowels(string) {
  let Vowels = "aAeEiIoOuU";
  let vowelsCount = 0;
  for (let i = 0; i < string.length; i++) {
    if (Vowels.indexOf(string[i]) !== -1) {
      vowelsCount += 1;
    }
  }
  return vowelsCount;
}
console.log(
  "The Number of vowels in -" +
    " A Computer Science Portal for Geeks:" +
    getVowels("A Computer Science Portal for Geeks")
);

/********************************** */
function vowelCount(str) {
  const vowelRegex = /[aeiou]/gi;
  const strMatches = str.match(vowelRegex);

  if (strMatches) {
    return strMatches.length;
  } else {
    return 0;
  }
}
const string = "Geeksforgeeks";
const len = vowelCount(string);
console.log("Number of vowels:", len);

/************************************* */
function countVowelsReduce(str) {
  const vowels = "aeiouAEIOU";
  return str.split("").reduce(function (count, char) {
    return vowels.indexOf(char) !== -1 ? count + 1 : count;
  }, 0);
}
const result = countVowelsReduce("Hello, World!");
console.log(result); // Output: 3

/****************************************** */
function findVowels(str) {
  const vowels = 'aeiouAEIOU';
  let vowelsFound = '';

  for (let char of str) {
    if (vowels.includes(char)) {
      vowelsFound += char;
    }
  }

  return vowelsFound;
}

// Example usage:
const inputString = 'Hello World';
const result = findVowels(inputString);
console.log("Vowels found:", result); // Output: eoO
