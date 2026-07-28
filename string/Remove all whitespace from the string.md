```js
let text = "   Learnersbucket    ";
text = text.replace(/^\s+|\s+$/g, "");

console.log(text);
// "Learnersbucket"

let text = "\n\n Learnersbucket  \n \n";
text = text.replace(/^\s+|\s+$/g, "");

console.log(text);
// "Learnersbucket"
```
