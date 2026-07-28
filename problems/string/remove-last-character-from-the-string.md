```js
function removeCharacter(str) {
  let n = str.length;
  let newString = "";
  for (let i = 0; i < n - 1; i++) {
    newString += str[i];
  }
  return newString;
}

let str = "Geeksforgeeks";
console.log(removeCharacter(str));

/************************** */
function removeCharacter(str) {
  let newString = str.slice(0, -1);
  return newString;
}
let str = "Geeksforgeeks";
console.log(removeCharacter(str));

/**************************** */
function removeCharacter(str) {
  let newString = str.substring(0, str.length - 1);
  return newString;
}
let str = "Geeksforgeeks";
console.log(removeCharacter(str));

/*************************************************** */

function removeCharacter(str) {
  let splitString = str.split("");
  splitString.pop();
  return splitString.join("");
}
let str = "Geeksforgeeks";
console.log(removeCharacter(str));
