```js
let str = "Welcome to GeeksforGeeks";

let index = 11;

let ctr = str.charAt(index);

console.log("Character at " + index + "th position is: " + ctr); // G

/************************************** */
let str = "Welcome to GeeksforGeeks";

let index = 11;

let ctr = str.substr(index, 1);

console.log("Character at " + index + "th position is: " + ctr);

/********************************** */
let str = "Welcome to GeeksforGeeks";

let index = 11;

let ctr = str[index];

console.log("Character at " + index + "th position is: " + ctr);
/********************************************* */
let str = "Welcome to GeeksforGeeks";
let index = 11;
let character = str.slice(index, index + 1);

console.log(character);
