/\*

The toLowerCase() method returns the value of the string converted to lower case.
toLowerCase() does not affect the value of the string str itself.

MDN Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase

Characters from A-Z have ASCII code from 65 - 90.
And characters from a-z have ASCII code from 97-122.
We're checking this condition to implement this function
\*/

```js
String.prototype.toLowerCase = function myToLowerCase() {
  let lowerCaseString = "";
  for (let i = 0; i < this.length; i += 1) {
    const character = this[i];
    const charCode = character.charCodeAt();
    if (charCode >= 65 && charCode <= 90) {
      lowerCaseString += String.fromCharCode(charCode + 32);
    } else {
      lowerCaseString += character;
    }
  }
  return lowerCaseString;
};

let vowels = ["A", "E", "I", "O", "U"];
let str = "LEARNERSBUCKET IS THE BEST WEBSITE TO LEARN PROGRAMMING";
let temp = "";
for (let chars of str) {
  if (vowels.includes(chars)) {
    temp += chars.toLowerCase();
  } else {
    temp += chars;
  }
}

console.log(temp);
//"LeaRNeRSBuCKeT iS THe BeST WeBSiTe To LeaRN PRoGRaMMiNG"

let str = "EXAMPLE";
let temp = str.slice(0, 1).toLowerCase() + str.slice(1, str.length);
console.log(temp);
//eXAMPLE

let str = "A(B)CDEF{1}G2HI3GK%!78L";
let temp = "";
for (let chars of str) {
  //Get the ascii value of character
  let value = chars.charCodeAt();

  //If the character is in uppercase
  if (value >= 65 && value <= 90) {
    //convert it to lowercase
    temp += String.fromCharCode(value + 32);
  } else {
    //else add the original character
    temp += chars;
  }
}

console.log(temp);
//"a(b)cdef{1}g2hi3gk%!78l"
```
