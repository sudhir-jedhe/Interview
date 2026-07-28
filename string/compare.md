```js
const sameStrings = (inputString1, inputString2) => {
  return inputString1.localeCompare(inputString2) === 0;
};
console.log(sameStrings("Geeks", "Geeks"));

// /************************************* */
// const stringsSame = (inputString1, inputString2) => {
//   return (
//     inputString1.startsWith(inputString2) && inputString2.endsWith(inputString1)
//   );
// };
// console.log(stringsSame("Geeks", "Geeks"));

// /***************************************************************** */
// const sameString = (inputString1, inputString2) => {
//   return inputString1.match(new RegExp(`^${inputString2}$`)) !== null;
// };
// console.log(sameString("geeks", "geeks"));

// /*********************************** */
// const sameString = (inputString1, inputString2) => {
//   return (
//     Array.from(inputString1).join("") === Array.from(inputString2).join("")
//   );
// };
// console.log(sameString("geeks", "geeks"));

let a = "2";
let b = 2;
let c = "2";

console.log(a.localeCompare(b));
console.log(a.localeCompare(c));


0: If both the strings are equal.
1: If first string is smaller than second string in sorted order.
-1: It it is greater than second string.
```
