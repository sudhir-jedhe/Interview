# Function Declarations Are Fully Hoisted; Function Expressions Are Not

```js
console.log(declared()); // 'declared works' — full hoist, callable before definition

try {
  expressed();
} catch (e) {
  console.log(e.message); // 'expressed is not a function'
}

function declared() { return 'declared works'; }
var expressed = function() { return 'expressed works'; };
```
