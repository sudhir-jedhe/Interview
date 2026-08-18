# Private State via Closure (Module Pattern)

```js
function createStack() {
  const items = [];
  return {
    push: (x) => items.push(x),
    pop: () => items.pop(),
    size: () => items.length
  };
}
const stack = createStack();
stack.push(1);
stack.push(2);
console.log(stack.size()); // 2
console.log(stack.pop());  // 2
console.log(stack.items);  // undefined — no direct access
```
