```js
let num1 = parseFloat("10.547892");
let num2 = parseFloat("10.547892").toFixed(2);
console.log("Without using toFixed() method");
console.log(num1);
console.log("Using toFixed() method");
console.log(num2);
// Without using toFixed() method
// 10.547892
// Using toFixed() method
// 10.55

/********************************* */

function ParseFloat(str, val) {
  str = str.toString();
  str = str.slice(0, str.indexOf(".") + val + 1);
  return Number(str);
}
console.log(ParseFloat("10.547892", 2)); //10.54
