### 1. Usage of `typeof` Operator on Different Types of Values

The `typeof` operator in JavaScript returns a string indicating the type of the operand.

```js
console.log(typeof 50); // "number"
console.log(typeof "text"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof function () {}); // "function"
console.log(typeof 10n); // "bigint"
console.log(typeof Symbol()); // "symbol"
console.log(typeof [1, 2]); // "object" (Arrays are a type of object)
console.log(typeof {}); // "object"
console.log(typeof NaN); // "number" (NaN is considered a number)
console.log(typeof undeclaredVar); // "undefined" (Undeclared variable)
console.log(typeof Infinity); // "number" (Infinity is a valid number)
console.log(typeof null); // "object" (This is a historical bug in JavaScript)
console.log(typeof /regex/); // "object" (Regular expressions are also of type 'object')
```

### 2. Different Ways of Concatenating Numbers and Strings

In JavaScript, the `+` operator is overloaded to both add numbers and concatenate strings. When combining numbers with strings, JavaScript will convert the number to a string.

```js
console.log(1 + "2"); // "12"
console.log(1 + 2 + "3"); // "33"
console.log(1 + 2 + "3" + "4"); // "334"
console.log(1 + "One"); // "1One"

console.log("1" + 2); // "12"
console.log("1" + "2" + 3); // "123"
console.log("1" + "2" + 3 + 4); // "1234"
console.log("1" + "2" + (3 + 4)); // "127"

console.log("One" + 1); // "One1"

console.log(1 + 2 + "3" + "4" + 5 + 6); // "33456"
console.log(1 + 2 + "3" + "4" + (5 + 6)); // "33411"
console.log("1" + "2" + (3 + 4) + 5 + "6"); // "12756"
```

### 3. Conversion from Number to String and Vice Versa

Converting between numbers and strings is often done in JavaScript.

**Number to String:**

```js
const num = 12;
console.log(String(num)); // "12"
console.log(num.toString()); // "12"
console.log(num + ""); // "12"
```

**String to Number:**

```js
const str = "12";
console.log(Number(str)); // 12
console.log(+str); // 12
console.log(parseInt(str)); // 12
```

### 4. Operating on Integer Numbers Outside the Range of JavaScript Numbers (BigInt)

BigInt allows you to perform operations on very large integers.

```js
const bigNum1 = 1526688934595n,
  bigNum2 = 256489246848n,
  num3 = 1562365;

const bigSum = bigNum1 + bigNum2;
const bigDiff = bigNum1 - bigNum2;
const total = bigNum1 + bigNum2 + BigInt(num3);

console.log(bigSum); // BigInt result
console.log(bigDiff); // BigInt result
console.log(total); // BigInt result
```

### 5. Usage of `||`, `&&`, `??`, and `!!`

#### Logical OR (`||`)

```js
console.log(true || false); // true
console.log(false || false); // false
console.log(false || 10); // 10
console.log(0 || 20); // 20
console.log("text" || true); // "text"
console.log(10 > 0 || 20 < 0); // true
```

#### Logical AND (`&&`)

```js
console.log(true && true); // true
console.log(true && false); // false
console.log(true && 10); // 10
console.log(10 && 20); // 20
console.log("text" && 10 + 20); // 30
console.log(10 > 0 && 20 < 0); // false
```

#### Nullish Coalescing (`??`)

```js
console.log(undefined ?? 10); // 10
console.log(null ?? 20); // 20
console.log(false ?? 10); // false
console.log(0 ?? 20); // 0
```

#### Double NOT (`!!`)

```js
console.log(!!10); // true
console.log(!!{}); // true
console.log(!!""); // false
console.log(!!0); // false
```

### 6. Common Methods on the `Number` Object

```js
console.log(Number.isInteger(1.5)); // false
console.log(Number.isInteger(-15)); // true

console.log(Number.parseInt("5.8")); // 5
console.log(Number.parseInt("123x")); // 123

console.log(Number.parseFloat("5.86")); // 5.86
console.log(Number.parseFloat("-12.69x")); // -12.69

console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN("text" - 10)); // true
console.log(Number.isNaN("text")); // false

console.log((56.369).toFixed(2)); // "56.37"
console.log((59).toFixed(3)); // "59.000"

console.log((32.458).toPrecision(3)); // "32.5"
console.log((98.1).toPrecision(1)); // "1e+2"
```

### 7. Polyfill for `Number.isNaN`

A polyfill for `Number.isNaN` would look like this:

```js
Number.isNaN =
  Number.isNaN ||
  function isNaN(input) {
    return typeof input === "number" && input !== input; // NaN is not equal to itself
  };
```

### 8. Common Methods on the `Math` Object

```js
console.log(Math.abs(-5)); // 5
console.log(Math.floor(1.6)); // 1
console.log(Math.ceil(2.4)); // 3
console.log(Math.round(3.8)); // 4
console.log(Math.max(-4, 5, 6)); // 6
console.log(Math.min(-7, -2, 3)); // -7
console.log(Math.sqrt(64)); // 8
console.log(Math.pow(5, 3)); // 125
console.log(Math.trunc(-6.3)); // -6
```

### 9. Handling the Comparison of `0.1 + 0.2 === 0.3`

Due to floating-point precision issues in JavaScript, the expression `0.1 + 0.2` will not exactly equal `0.3`. To solve this problem, you can use `Number.EPSILON`.

```js
console.log(0.1 + 0.2 - 0.3 < Number.EPSILON); // true
```

### 10. Iterating Over a String

You can iterate over a string in JavaScript using different methods:

**Using a for loop:**

```js
const str = "Hello";
for (let i = 0; i < str.length; i++) {
  console.log(str.charAt(i)); // Logs each character
}
```

**Using `for...in` loop:**

```js
for (let index in str) {
  console.log(str[index]); // Logs each character
}
```

**Using `for...of` loop:**

```js
for (let value of str) {
  console.log(value); // Logs each character
}
```

**Using spread syntax with `forEach`:**

```js
[...str].forEach((value) => console.log(value)); // Logs each character
```

Sure, let's break down each of the code examples and explanations you provided:

### 11. Template Literals with Expression Interpolation and Tagged Templates

#### Template Literals with Expression Interpolation

Template literals allow embedding expressions inside strings, using `${}` for expression interpolation.

```js
const num1 = 10,
  num2 = 20;
`The sum of ${num1} and ${num2} is ${num1 + num2}`; // "The sum of 10 and 20 is 30"
```

#### Tagged Templates

Tagged templates let you define a function to process the template literals. The function gets an array of string literals and the values inside `${}`.

```js
let person = "John";
let membership = [1, 3];

function myTag(strings, person, membership) {
  let communities = ["Java", "JavaScript", "TypeScript", "HTML", "CSS"];
  let str0 = strings[0]; // "Note:"
  let str1 = strings[1]; // "is a member of following communities:"

  let personCommunities = membership.map((index) => communities[index]);
  return `${str0}${person}${str1}${personCommunities}`;
}

myTag`Note: ${person} is a member of following communities: ${membership}`;
// "Note: John is a member of following communities: JavaScript,HTML"
```

### 12. `try...catch...finally`

The `try...catch...finally` construct is used to handle errors in JavaScript.

```js
try {
  callAPI(); // This will throw an error as callAPI is not defined
} catch (error) {
  throw new Error(error); // Throws a new error
} finally {
  console.log("I will execute no matter what happened in try or catch");
}
```

- **try**: Block of code where errors might occur.
- **catch**: Catches the error thrown in `try`.
- **finally**: Executes code that needs to run no matter what happens in the `try` or `catch` blocks.

### 13. Working with Symbols

Symbols are unique and immutable primitive values that can be used as object property keys.

```js
// New symbol
let symId = Symbol("id");

// Global symbol registry
let symUsername = Symbol.for("username");

// Retrieve symbol name
Symbol.keyFor(symUsername); // "username"
```

- Symbols are skipped in `for...in` loops and do not appear in object serialization.

### 1. Swap Two Integers Without Temporary Variable

You can use destructuring or arithmetic to swap values.

#### Destructuring Assignment:

```js
let num1 = 10,
  num2 = 20;
[num1, num2] = [num2, num1]; // num1 = 20, num2 = 10
```

#### Arithmetic Swap:

```js
let num1 = 10,
  num2 = 20;
num1 = num1 + num2;
num2 = num1 - num2;
num1 = num1 - num2; // num1 = 20, num2 = 10
```

### 2. Check if a Number is an Integer

You can use the modulus operator to check if a number is an integer.

```js
function isInt(value) {
  return value % 1 === 0;
}

console.log(isInt(4.0)); // true
console.log(isInt(12.2)); // false
```

### 3. Generate a Random Number in a Given Range

To generate a random number within a specific range:

```js
function randomNumberGeneratorInRange(rangeStart, rangeEnd) {
  return rangeStart + Math.round(Math.random() * (rangeEnd - rangeStart));
}

console.log(randomNumberGeneratorInRange(10, 50)); // Random number between 10 and 50
```

### 4. Reverse a String

You can reverse a string by splitting it into an array, reversing it, and joining it back.

```js
const str = "JavaScript is awesome";
let reversedString = str.split("").reverse().join(""); // "emosewa si tpircSavaJ"
```

### 5. Reverse a String by Words or Reverse Each Word

You can split the string by spaces and reverse the words.

#### Reverse Entire String by Words:

```js
const str = "JavaScript is awesome";
str.split(" ").reverse().join(" "); // "awesome is JavaScript"
```

#### Reverse Each Word:

```js
const str = "JavaScript is awesome";
str
  .split(" ")
  .map((word) => word.split("").reverse().join(""))
  .join(" "); // "tpircSavaJ si emosewa"
```

### 6. Reverse an Integer

You can reverse a number by repeatedly extracting digits using the modulo operator.

```js
let num = 3849;
let reversedNum = 0;
while (num !== 0) {
  reversedNum = reversedNum * 10 + (num % 10);
  num = Math.floor(num / 10);
}
console.log(reversedNum); // 9483
```

### 7. Replace All Spaces with Underscores

You can use `split` and `join`, or the `replaceAll` method to replace all spaces.

```js
const str = "I love JavaScript";
console.log(str.replaceAll(" ", "_")); // "I_love_JavaScript"
```

### 8. Convert 12-Hour Time Format to 24-Hour Format

Convert time in 12-hour format (AM/PM) to 24-hour format.

```js
function convertTo24HrsFormat(timeText) {
  var timeTextLower = timeText.toLowerCase();
  let [hours, mins] = timeTextLower.split(":");

  if (timeTextLower.endsWith("am")) hours = hours == 12 ? "0" : hours;
  else if (timeTextLower.endsWith("pm"))
    hours = hours == 12 ? hours : String(+hours + 12);

  return hours.padStart(2, 0) + ":" + mins.slice(0, -2).padStart(2, 0);
}
```

### 9. Count Characters Between First and Last 'X'

You can use `indexOf` and `lastIndexOf` to find the positions of the first and last 'X'.

```js
function getTheGapX(str) {
  if (!str.includes("X")) return -1;
  const firstIndex = str.indexOf("X");
  const lastIndex = str.lastIndexOf("X");
  return firstIndex === lastIndex ? -1 : lastIndex - firstIndex;
}
```

### 10. Truncate String to a Given Number of Characters

You can use `substr` to truncate the string.

```js
function truncateString(str, charCount) {
  if (str.length > charCount) {
    return str.substr(0, charCount - 3) + "...";
  } else {
    return str;
  }
}
```

### 11. Truncate String to a Given Number of Words

You can split the string by spaces, slice the array, and join the words back.

```js
const str = "JavaScript is simple but not easy to master";
str.split(" ").slice(0, 3).join(" "); // "JavaScript is simple"
```

### 12. Validate Indian Mobile Numbers

Use a regular expression to validate Indian mobile numbers.

```js
function validateMobile(str) {
  const regexMobile = /^(\+91|0)?\s?\d{10}$/;
  return regexMobile.test(str);
}
```

### 13. Find Elements with Digits in Strings

You can use a regular expression to match strings containing digits.

```js
function numInStr(mixArray) {
  return mixArray.filter((value) => /[0-9]/.test(value));
}
```

### 14. Validate Search Text in Names

Check if the search text appears at the beginning of either the first or second name using a regular expression.

```js
function validateName(str, searchText) {
  const regex = new RegExp("^(\\w*\\s)?" + searchText + "\\w*?", "i");
  return regex.test(str);
}
```

### 15. Chop String into Chunks of Given Length

Use `slice` or `match` to split the string into chunks.

```js
function stringChop(str, size = str.length) {
  const arr = [];
  let i = 0;
  while (i < str.length) {
    arr.push(str.slice(i, i + size));
    i = i + size;
  }
  return arr;
}
```

### 16. Remove All Vowels from a String

You can use `replace` with a regular expression to remove vowels.

```js
const str = "I love JavaScript";
str.replace(/[aeiou]/gi, ""); // " lv JvScrpt"
```

### 17. Generate Random Hex Color Code

Generate a random color code in hexadecimal format.

```js
function getHEXColorCode() {
  const rValue = Math.round(0xff * Math.random())
    .toString(16)
    .padStart(2, "0");
  const gValue = Math.round(0xff * Math.random())
    .toString(16)
    .padStart(2, "0");
  const bValue = Math.round(0xff * Math.random())
    .toString(16)
    .padStart(2, "0");
  return "#" + rValue + gValue + bValue;
}
```

### 18. Calculate Days Between Two Dates

To find the difference between two dates in

days, subtract their timestamps and convert the difference from milliseconds to days.

```js
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

function getDaysBetweenDates(dateText1, dateText2) {
  const date1 = new Date(dateText1);
  const date2 = new Date(dateText2);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / DAY_IN_MILLISECONDS);
  return diffDays;
}
```

Each of these code snippets demonstrates a unique JavaScript operation, such as handling strings, dates, numbers, and using regular expressions. Let me know if you need further clarification on any part!
