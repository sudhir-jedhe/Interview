# Implicit Binding vs Losing It When Extracted

```js
const user = {
  name: 'Ada',
  greet() { return `Hi, ${this.name}`; }
};
console.log(user.greet());        // 'Hi, Ada' — this === user

const detached = user.greet;
console.log(typeof detached());   // this.name is undefined; returns 'Hi, undefined' in non-strict
```
