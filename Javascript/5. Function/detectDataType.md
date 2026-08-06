```js
function detectType(data) {
  if (data instanceof FileReader) return "object";
  return Object.prototype.toString
    .call(data)
    .slice(1, -1)
    .split(" ")[1]
    .toLowerCase();
}

```
```js
function detectType(data) {
  // your code here
  if (data instanceof FileReader) return typeof data;
  return typeof data === "object"
    ? data === null
      ? "null"
      : data.constructor.name.toLowerCase()
    : typeof data;
}

/********************************** */

/**
 * @param {any} data
 * @return {string}
 */

let mapTypeToName = new Map([
  [Map, "map"],
  [Array, "array"],
  [ArrayBuffer, "arraybuffer"],
  [Set, "set"],
  [Date, "date"],
  [Function, "function"],
  [Number, "number"],
  [String, "string"],
  [Boolean, "boolean"],
]);

function detectType(data) {
  if (typeof data !== "object") {
    return typeof data;
  } else {
    if (data === null) return "null";
    for ([type, name] of mapTypeToName) {
      if (data instanceof type) return name;
    }
    return "object";
  }
}

/************************************************* */

/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
  let dataT = data;
  if (dataT === null) return "null";
  if (dataT === undefined) return "undefined";
  if (dataT.constructor && dataTypes[dataT.constructor.name])
    return dataTypes[dataT.constructor.name];
  // your code here
}

const dataTypes = {
  Number: "number",
  Map: "map",
  Set: "set",
  Array: "array",
  Date: "date",
  Function: "function",
  ArrayBuffer: "arraybuffer",
  String: "string",
  Boolean: "boolean",
  Symbol: "symbol",
  FileReader: "object",
  BigInt: "bigint",
};

/***************************** */

/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
  if (typeof data == FileReader) return "object ";
  return Object.prototype.toString
    .call(data)
    .slice(1, -1)
    .split(" ")[1]
    .toLowerCase();
}

// you can use constructor.name to print the constructor of the data but it has below issue

class ExampleClass {
  constructor() {
    // constructor logic
  }
}

const exampleObj = new ExampleClass();
const myData = "Hello";

console.log(myData.constructor.name.toLowerCase()); // string ✅ but below is incorrect,
console.log(exampleObj.constructor.name.toLowerCase()); // exampleclass ❌, logging constructor class
console.log(detectType(exampleObj)); // 'object' ✅



/**
 * @param {any} data
 * @return {string}
 */
const dataTypes = {
  Number: "number",
  Map: "map",
  Set: "set",
  Array: "array",
  Date: "date",
  Function: "function",
  ArrayBuffer: "arraybuffer",
  String: "string",
  Boolean: "boolean",
  Symbol: "symbol",
  FileReader: "object",
  BigInt: "bigint",
};

function detectType(data) {
  // Check for null explicitly
  if (data === null) return "null";
  
  // Check for undefined explicitly
  if (data === undefined) return "undefined";
  
  // Use constructor name for known types
  if (data.constructor && dataTypes[data.constructor.name]) {
    return dataTypes[data.constructor.name];
  }

  // Use toString for types like Object, ArrayBuffer, etc.
  return Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase();
}

// Examples:

console.log(detectType("Hello")); // string
console.log(detectType(100)); // number
console.log(detectType([1, 2, 3])); // array
console.log(detectType({ a: 1 })); // object
console.log(detectType(null)); // null
console.log(detectType(undefined)); // undefined
console.log(detectType(new Map())); // map
console.log(detectType(new Set())); // set
console.log(detectType(new Date())); // date
console.log(detectType(new FileReader())); // object
console.log(detectType(BigInt(10))); // bigint
console.log(detectType(function () {})); // function
console.log(detectType(Symbol('foo'))); // symbol
console.log(detectType(new ExampleClass())); // object
