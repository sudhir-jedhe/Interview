```js
function rgbToHex(r, g, b) {
  // DO NOT REMOVE
  "use strict";

  function getHexCode(integer) {
    if (typeof integer !== "number") throw TypeError("please pass number");
    //code to limit the number till 255 only;
    const clamInteger = Math.min(Math.max(0, integer), 255); // Math.min() gives the minimum number between 255;
    return clamInteger.toString(16).toUpperCase().padStart(2, "0");
    // console.log(clamInteger)
  }

  // write your code below

  return `#${getHexCode(r)}${getHexCode(g)}${getHexCode(b)}`;
}
```
