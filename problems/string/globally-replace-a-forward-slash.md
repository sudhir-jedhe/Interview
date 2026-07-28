```js
// Input string
let origString = "string / with some // slashes /";

// Display
console.log(origString);

// Replacement for slash
let replacementString = "*";

// Replaced string
let replacedString = origString.replace(/\//g, replacementString);

// Display output
console.log(replacedString);

/*************************** */

// Input String with slashes
let origString = "string / with some // slashes /";

// Display input string
console.log(origString);

// Replacement for slash
let replacementString = "*";

// Replaced String
let replacedString = origString.split("/").join(replacementString);

// Display output
console.log(replacedString);

/************************************* */
// Input string
let origString = "string / with some // slashes /";
// Display input string
console.log(origString);

// replacement cahracter
let replacementString = "*";

// Replace all slash using replaceAll method;
let replacedString = origString.replaceAll("/", "*");

// Display output
console.log(replacedString);
