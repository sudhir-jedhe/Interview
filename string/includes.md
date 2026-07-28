```js
String.prototype.myIncludes = function (substring, fromIndex = 0) {
  for (let i = fromIndex; i < this.length; i++) {
    if (this.slice(i, i + substring.length) === substring) {
      return true;
    }
  }
  return false;
};
```
