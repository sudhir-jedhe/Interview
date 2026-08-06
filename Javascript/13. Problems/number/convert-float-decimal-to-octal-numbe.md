```js
// Input: Number = 123.45, No. of decimal places (Precision): 5
// Output: 173.34631

// Input: 7.1234, No. of decimal places (Precision): 7
// Output: 7.0771344

// Consider a float number: 123.45

// At first, separate the integer and decimal parts.
// For the integer part:
// The integer part of 123 in base 10 is directly converted to base 8 for octal
// 123 (base 10) = 173 (base 8)
// For the fractional part:
// First iteration: 0.45*8 = 3.6. Hence, the first octal digit is ‘3’.
// Second iteration: 0.6* 8 = 4.8. The second digit is ‘4’.
// Combine these two calculations:
// 123.45 (base 10) = 173.34 (base 8) …(approximate value).

// javaScript code for the above approach
// Function to convert the integer part
function convertInteger(num) {
  let str = "";
  while (num > 0) {
    const rem = num % 8;
    str = rem.toString() + str;
    num = Math.floor(num / 8);
  }
  return str;
}

// Function to convert the fractional part
function convertFractional(num, p) {
  let str = ".";
  while (p > 0) {
    num *= 8;
    const integer = Math.floor(num);
    str += integer.toString();
    num -= integer;
    p--;
  }
  return str;
}

// Function to convert float decimal to octal
function decimalToOctal(num, p) {
  const integer = Math.floor(num);
  const dec = num - integer;
  const s1 = convertInteger(integer);
  const s2 = convertFractional(dec, p);
  return s1 + s2;
}

// Driver code
const num = 123.45;
const p = 2;
const ans = decimalToOctal(num, p);

// Output
console.log("Octal Number: " + ans);
