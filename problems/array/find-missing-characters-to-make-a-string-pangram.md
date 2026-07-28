```js
// Input : welcome to geeksforgeeks
// Output : abdhijnpquvxyz
// Input : The quick brown fox jumps
// Output : adglvyz

let inputStr = "welcome to geeksforgeeks";
let letters = "abcdefghijklmnopqrstuvwxyz";
let inputSet = new Set(inputStr);
let missingChars = [...letters].filter((char) => !inputSet.has(char)).join("");
console.log(missingChars);

/****************************************** */
let inputStr = "welcome to geeksforgeeks";
let letters = "abcdefghijklmnopqrstuvwxyz";
let output = "";
inputStr = inputStr.toLowerCase();
for (let c of letters) {
  if (!inputStr.includes(c)) {
    output += c;
  }
}
console.log(output);

/******************************* */
let inputStr = "welcome to geeksforgeeks";
let letters = "abcdefghijklmnopqrstuvwxyz";
let output = "";
inputStr = inputStr.toLowerCase();
for (let i = 0; i < letters.length; i++) {
  if (inputStr.indexOf(letters[i]) === -1) {
    output += letters[i];
  }
}
console.log(output);
