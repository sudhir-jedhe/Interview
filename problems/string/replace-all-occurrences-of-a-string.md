```js
// Origin String
const str = "Welcome GeeksforGeeks, Welcome geeks";

// Replace all occurrence of Welcome with Hello
const newString = str.replace(/Welcome/gi, "Hello");

// Display the result
console.log(newString); // Hello GeeksforGeeks, Hello geeks

/****************************************** */
// Original String
const str = "Welcome GeeksforGeeks, Welcome geeks";

// Replace all occurrence of Welcome with Hello
const newString = str.split("Welcome").join("Hello");

// Display the result
console.log(newString);

/********************************************************** */

// Original String
const str = "Welcome GeeksforGeeks, Welcome geeks";

// Replace all occurrences of Welcome with Hello
const newString = str.replaceAll("Welcome", "Hello");

// Display the result
console.log(newString);

/***************************************************** */
const str = "Welcome GeeksforGeeks, Welcome geeks";
const searchString = "Welcome";
const replacementString = "Hello";

let regex = new RegExp(searchString, "g");
let replacedString = str.replace(regex, replacementString);
console.log(replacedString);
