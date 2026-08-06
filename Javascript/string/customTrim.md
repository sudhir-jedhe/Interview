```js
// trim() method
function trim(str) {
  // remove leading and trailing whitespace
  return str.replace(/^\s+|\s+$/g, "");
}

// Example usage
const str = "   Hello, World!   ";
const trimmedStr = trim(str);

console.log(trimmedStr); // Output: 'Hello, World!'

/****************************** */
String.prototype.customTrim = function (characters) {
  let result = this;

  for (let i = 0; i < characters.length; i++) {
    while (result.charAt(0) === characters[i]) {
      result = result.substring(1);
    }

    while (result.charAt(result.length - 1) === characters[i]) {
      result = result.substring(0, result.length - 1);
    }
  }
  return result;
};

let str = " ,Hello, World!, ";
let trimmedStr = str.customTrim(", ");

console.log(trimmedStr); // Output: "Hello, World"

let str = "Hello, World!";
let extractedStr = str.trim().substring(0, 5);
console.log(extractedStr); // Output: "Hello"


/****************************************** */
<script>

// Declare a whitespaces array
const whitespaces = [" ", "", "\s", "\t", "\n", "\u3000"];

const trim = (str) => {
    let stringBeg = 0, stringEnd = str.length;

    // Find the index from the beginning of the string
    // which is not a whitespace
    for (let i = 0; i < str.length; i++) {
        if (whitespaces.indexOf(str[i]) === -1) {
            stringBeg = i;
            break;
        }
    }

    // Find the index from the end of the string
    // which is not a whitespace
    for (let j = str.length - 1; j >= 0; j--) {
        if (whitespaces.indexOf(str[j]) === -1) {
            stringEnd = j;
            break;
        }
    }

    // Return the string between the 2 found indices
    return str.slice(stringBeg, stringEnd + 1);
}

let s = " Geeksforgeeks";
console.log(s);
console.log(trim(s));
</script>


/******************************* */
<html>
<body>
   <h2>Using the <i> trim() method with polyfill </i> in JavaScript</h2>
   <div id = "content"> </div>
   <script>
      let content = document.getElementById('content');
      String.prototype.trim = function () {
         const spaces = ["\s", "\t", "", " ", "", "\u3000"];
         let start = 0;
         let end = this.length - 1;

         // get the first index of the valid character from the start
         for (let m = 0; m < this.length; m++) {
            if (!spaces.includes(this[m])) {
               start = m;
               break;
            }
         }

         // get the first index of valid characters from the last
         for (let n = this.length - 1; n > -1; n--) {
            if (!spaces.includes(this[n])) {
               end = n;
               break;
            }
         }

         // slice the string
         return this.slice(start, end + 1);
      }
      let str = " Hi, How are you? ";
      content.innerHTML += "The original string is :-" + str + ".<br>";
      let trimmed = str.trim();
      content.innerHTML += "The trimmed string using trim() method is :-" + str + "<br>";
   </script>
</body>




/************/


const WHITESPACES = [" ", "", "\s", "\t", "\n", "\u3000"];
/**
 * @param {string} str
 * @return {string}
 */
function trim(str) {
  let wordStart = 0;
  let wordEnd = str.length;
  for (let i = 0; i < str.length; i++) {
    if (WHITESPACES.indexOf(str[i]) === -1) {
      wordStart = i;
      break;
    }
  }
  for(let j = str.length - 1; j >= 0; j--) {
    if (WHITESPACES.indexOf(str[j]) === -1) {
      wordEnd = j;
      break;
    }
  }
  return str.slice(wordStart, wordEnd + 1);
}
```
