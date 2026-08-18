# `call`/`apply`/`bind` Explicitly Set `this`

```js
function introduce() { return `I'm ${this.name}`; }
const person = { name: 'Grace' };

console.log(introduce.call(person));    // "I'm Grace"
console.log(introduce.apply(person));   // "I'm Grace"
const bound = introduce.bind(person);
console.log(bound());                   // "I'm Grace" — permanently bound
```
