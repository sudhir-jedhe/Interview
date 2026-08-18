# Rest in object destructuring to omit a key

```js
const fullRecord = { id: 1, name: 'Kim', password: 'secret' };
const { password, ...safeRecord } = fullRecord;
console.log(safeRecord);
// { id: 1, name: 'Kim' }
```
