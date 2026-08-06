// String specifications among programming languages vary, however most languages treat them as reference types. But strings in JavaScript are different. They are immutable primitives. This means that the characters within them may not be changed and that any operations on strings actually create new strings.

```js
const x = "type";
x[1] = "a"; // Nothing happens, doesn't throw an error
console.log(x); // LOGS: 'type'
```
