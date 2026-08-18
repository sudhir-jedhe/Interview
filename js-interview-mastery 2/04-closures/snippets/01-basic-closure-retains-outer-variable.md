# Basic Closure: Inner Function Retains Access to Outer Variable

```js
function makeGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}
const sayHello = makeGreeter('Hello');
console.log(sayHello('Sam')); // 'Hello, Sam!' — greeting still accessible
```
