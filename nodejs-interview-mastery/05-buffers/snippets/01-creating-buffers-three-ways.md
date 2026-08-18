# Creating Buffers Three Ways

Demonstrates the three main construction paths and how their contents differ immediately after allocation.

```js
const fromStr = Buffer.from('abc');
const zeroed = Buffer.alloc(4);
const unsafe = Buffer.allocUnsafe(4);
console.log(fromStr, zeroed, unsafe.length); // unsafe contents are unpredictable
```

`fromStr` is initialized from real data. `zeroed` is guaranteed to be all zero bytes. `unsafe` has the right length (4) but its byte contents are whatever was previously in that memory slot — never log or send `unsafe`'s raw contents before writing to every byte.
