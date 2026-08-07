/\*

The toLowerCase() method returns the value of the string converted to lower case.
toLowerCase() does not affect the value of the string str itself.

MDN Link: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase>

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

Your snippet provides a great demonstration of how ASCII offset arithmetic ($+32$) works behind the scenes for basic Latin character case conversions.

However, there are a few important **JavaScript engine warnings**, **Unicode traps**, and **re-declaration syntax errors** in your code worth addressing.

---

### Critical Code & Architecture Callouts

#### 1. Prototype Pollution Warning ⚠️

Overriding built-in methods on built-in prototypes like `String.prototype.toLowerCase = ...` is considered an anti-pattern in JavaScript.

* It affects all third-party dependencies and libraries running in the same environment.
* Modern engines heavily optimize native `toLowerCase()` in C++. Replacing it with a JS `for` loop causes performance regressions across your application.

#### 2. Re-declaration Error (`let str`)

In your example snippet, `let str` is declared three separate times in the same scope:

```javascript
let str = "LEARNERSBUCKET...";
let str = "EXAMPLE"; // 💥 SyntaxError: Identifier 'str' has already been declared
let str = "A(B)CDEF..."; // 💥 SyntaxError: Identifier 'str' has already been declared

```

To run this sequentially, re-assign `str` without `let` or use distinct variable names.

#### 3. The ASCII vs. Unicode Trap (Non-English Characters)

Adding `32` to character codes works **only for ASCII letters `A-Z` (`65` to `90`)**. It fails for:

* Accented uppercase characters (e.g., `'É'` is ASCII `201`, not `65-90`).
* Non-Latin scripts (Greek `'Δ'`, Cyrillic `'Б'`).
* Multi-byte UTF-16 surrogate pairs (e.g., Emojis).

---

### Clean & Safe Utility Alternative

Instead of overriding `String.prototype`, define a standalone helper function that uses Unicode Property classes or `String.fromCodePoint()` if you want custom low-level conversions:

```javascript
/**
 * Custom ASCII lowercase conversion function (without prototype pollution)
 */
function toASCIILowerCase(str) {
  let lowerCaseString = "";

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // ASCII 'A' (65) through 'Z' (90)
    if (code >= 65 && code <= 90) {
      lowerCaseString += String.fromCharCode(code + 32);
    } else {
      lowerCaseString += str[i];
    }
  }

  return lowerCaseString;
}

// Example 1: Convert only vowels to lowercase
const vowels = new Set(["A", "E", "I", "O", "U"]);
let text1 = "LEARNERSBUCKET IS THE BEST WEBSITE TO LEARN PROGRAMMING";
let convertedVowels = "";

for (const char of text1) {
  convertedVowels += vowels.has(char) ? toASCIILowerCase(char) : char;
}

console.log(convertedVowels);
// Output: "LeaRNeRSBuCKeT iS THe BeST WeBSiTe To LeaRN PRoGRaMMiNG"

// Example 2: First character lowercase (CamelCase helper)
let text2 = "EXAMPLE";
let lowerFirst = text2.slice(0, 1).toLowerCase() + text2.slice(1);
console.log(lowerFirst);
// Output: "eXAMPLE"

// Example 3: Full string conversion with special chars
let text3 = "A(B)CDEF{1}G2HI3GK%!78L";
console.log(toASCIILowerCase(text3));
// Output: "a(b)cdef{1}g2hi3gk%!78l"

```

---

### `toLowerCase()` vs `toLocaleLowerCase()`

When dealing with internationalization (i18n), standard `.toLowerCase()` can produce incorrect results for specific languages.

For example, in Turkish, the uppercase letter `"I"` converts to a dotted lowercase `"i"` (`"\u0130"`), whereas standard English converts it to dotless `"i"` (`"i"`):

```javascript
const str = "ISTANBUL";

console.log(str.toLowerCase()); 
// Output: "istanbul" (Default English rule)

console.log(str.toLocaleLowerCase('tr-TR')); 
// Output: "İstanbul" (Turkish locale rule)

```
