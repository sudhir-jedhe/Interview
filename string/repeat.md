```js
/****************************How to implement String.prototype.repeat********************* */
String.prototype.myRepeat = function (count) {
  if (typeof count !== "number" || count < 0) {
    throw new Error("Count must be a non-negative number.");
  }

  let repeatedString = "";

  for (let i = 0; i < count; i++) {
    repeatedString += this;
  }

  return repeatedString;
};

// Example usage:
const originalString = "Hello, ";
const repeatedString = originalString.myRepeat(3);

console.log(repeatedString);
// Output: 'Hello, Hello, Hello, '
```
