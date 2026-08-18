# Snippet: Accidental global variable (non-strict mode)

```js
function leaky() {
  accidentalGlobal = "I forgot let/const"; // no declaration keyword
}
leaky();
console.log(typeof globalThis.accidentalGlobal); // "string" -- leaked onto the global object

function safe() {
  "use strict";
  try {
    trulyUndeclared = "nope";
  } catch (e) {
    console.log(e instanceof ReferenceError); // true -- strict mode prevents the leak
  }
}
safe();
```
