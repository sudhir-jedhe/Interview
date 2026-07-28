```js
// Input String
let str = "GeeksforGeeks";

// Getting last character using char at
let res = str.charAt(str.length - 1);

// Display output
console.log(res);

/********************************************** */
// Input string
let str = "GeeksforGeeks";

// Getting last character using slice method
let res = str.slice(-1);

// Display output
console.log(res);

/********************************************** */
// Input string
let str = "GeeksforGeeks";

// Getting last character using substr method
let res = str.substr(-1);

// Display Output
console.log(res);

/****************************************** */
// Input string
let str = "GeeksforGeeks";

// Getting last character using str.length
let res = str[str.length - 1];

// Display output
console.log(res);

/******************************** */
// Input string
let str = "GeeksforGeeks";

// Getting last character using string.at method
let res = str.at(-1);

// Display output
console.log(res);
/****************************** */
// Input string
let str = "GeeksforGeeks";

// Getting last charcter using match method
let res = str.match(/.$/g);

// Display output
console.log(res);
