```js
// remove all occurrence of specific character
let str = "Hello World";
let charToRemove = "l";
let output = str.replace(/l/g, "");
/************************** */
// remove character at given index
let originalString = "Hello World";
let indexRemove = 3;
let output =
  originalString.slice(0, indexRemove) + originalString.slice(indexRemove + 1);

// remove non-numeric character

let originalString = "Hello123World";
let output = originalString.replace(/\D/g, "");

// remove  character at given index , stored in new variable,
let originalString = "Hello World";
let indexRemove = 3;
let removedCharacter = originalString.charAt(indexRemove);
let output = originalString.replace(removedCharacter, "T");
```
