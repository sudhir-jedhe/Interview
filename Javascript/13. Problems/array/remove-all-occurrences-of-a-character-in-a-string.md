```js
let inputStr = "Geeks-for-Geeks";
let charToRemove = "-";
let regex = new RegExp(charToRemove, "g");
let result = inputStr.replace(regex, "");
console.log(result); // GeeksforGeeks

/****************************** */
let inputStr = "Hello, Geeks!";
let removeStr = "e";
let result = inputStr.split(removeStr).join("");
console.log(result);

/****************************************** */
function removeCharacter(str1, str2) {
  let result = "";
  for (let index in str1) {
    if (str1[index] !== str2) {
      result += str1[index];
    }
  }
  return result;
}

let inputStr = "Geeks";
let str2 = "e";
let result = removeCharacter(inputStr, str2);
console.log(result);
