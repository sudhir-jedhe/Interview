```js
const str = "Hello World";

str.replaceAll("o", "x"); // 'Hellx Wxrld'

/****************************************** */

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replaceAll = (str, subStr, newSubStr) =>
  str.replace(new RegExp(escapeRegExp(subStr), "g"), newSubStr);

const str = "Hello World";

replaceAll(str, "o", "x"); // 'Hellx Wxrld'
```
