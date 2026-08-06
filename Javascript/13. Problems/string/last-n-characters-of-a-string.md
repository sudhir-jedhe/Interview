```js
function getCharacter(str, n) {
  let newString = str.slice(-n);
  return newString;
}
let str = "Hello Geeks!";
let n = 6;
console.log(getCharacter(str, n));

/******************************* */

function getLastCharacter(str, n) {
  let newString = str.substring(str.length - n);
  return newString;
}
let str = "Geeksforgeeks";
let n = 5;
console.log(getLastCharacter(str, n));

/**************************************************** */

function getCharacter(str, n) {
  let newString = "";
  for (let i = str.length - n; i < str.length; i++) {
    newString += str[i];
  }
  return newString;
}
let str = "Hello Geeks!";
let n = 6;
console.log(getCharacter(str, n));
