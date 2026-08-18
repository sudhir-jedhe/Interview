# for-in on an array includes inherited enumerable properties

```js
Array.prototype.customHelper = 'oops';
const arr = ['a', 'b'];
for (const key in arr) {
  console.log(key);
}
delete Array.prototype.customHelper; // clean up
// 0
// 1
// customHelper
```
