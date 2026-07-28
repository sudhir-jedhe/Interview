// Left substring generator
// Using a for...in loop, we can iterate over the string, and yield each substring, starting at the beginning. We can use String.prototype.slice() to get the substring. In order to terminate early, we can use String.prototype.length to check if the string is empty.

```js
const leftSubstrGenerator = function* (str) {
  if (!str.length) return;
  for (let i in str) yield str.slice(0, i + 1);
};

[...leftSubstrGenerator("hello")];
// [ 'h', 'he', 'hel', 'hell', 'hello' ]
// Right substring generator
// The exact same technique with a for...in loop can be used when starting at the end of the string. Same as before, albeit with a slight modification, we can use String.prototype.slice() to get the substring. And again, we use String.prototype.length to terminate early if the string is empty.

const rightSubstrGenerator = function* (str) {
  if (!str.length) return;
  for (let i in str) yield str.slice(-i - 1);
};

[...rightSubstrGenerator("hello")];
// [ 'o', 'lo', 'llo', 'ello', 'hello' ]
```
