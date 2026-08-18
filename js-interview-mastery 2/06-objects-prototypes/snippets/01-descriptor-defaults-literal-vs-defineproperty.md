# Snippet: default descriptor attributes differ between literal and defineProperty

```js
const literal = { a: 1 };
console.log(Object.getOwnPropertyDescriptor(literal, "a"));
// { value: 1, writable: true, enumerable: true, configurable: true }

const defined = {};
Object.defineProperty(defined, "a", { value: 1 });
console.log(Object.getOwnPropertyDescriptor(defined, "a"));
// { value: 1, writable: false, enumerable: false, configurable: false }
```

A property created via a literal or plain assignment gets all three booleans defaulted to `true`. The exact same property created via `Object.defineProperty` with only `value` specified defaults every omitted attribute to `false` instead — an asymmetry worth memorizing.
