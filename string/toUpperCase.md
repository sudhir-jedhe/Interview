/\*
The toUpperCase() method returns the value of the string converted to uppercase.
This method does not affect the value of the string itself since JavaScript strings are immutable.

MDN Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase

Characters from A-Z have ASCII code from 65 - 90.
And characters from a-z have ASCII code from 97-122.
We're checking this condition to implement this function.

```js
*/
String.prototype.toUpperCase = function myToUpperCase() {
let upperCaseString = "";
for (let i = 0; i < this.length; i += 1) {
  const character = this[i];
  const charCode = character.charCodeAt();
  if (charCode >= 97 && charCode <= 122) {
    upperCaseString += String.fromCharCode(charCode - 32);
  } else {
    upperCaseString += character;
  }
}
return upperCaseString;
};

let vowels = ["A", "E", "I", "O", "U"];
let str = "LeaRNeRSBuCKeT iS THe BeST WeBSiTe To LeaRN PRoGRaMMiNG";
let temp = "";
for (let chars of str) {
if (vowels.includes(chars)) {
  temp += chars.toUpperCase();
} else {
  temp += chars;
}
}

console.log(temp);
//"LEARNERSBUCKET IS THE BEST WEBSITE TO LEARN PROGRAMMING"

let str = "eXAMPLE";
let temp = str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
console.log(temp);
//EXAMPLE

let str = "a(b)cdef{1}g2hi3gk%!78l";
let temp = "";
for (let chars of str) {
//Get the ascii value of character
let value = chars.charCodeAt();

//If the character is in uppercase
if (value >= 97 && value <= 122) {
  //convert it to lowercase
  temp += String.fromCharCode(value - 32);
} else {
  //else add the original character
  temp += chars;
}
}

console.log(temp);
//"A(B)CDEF{1}G2HI3GK%!78L"
```
