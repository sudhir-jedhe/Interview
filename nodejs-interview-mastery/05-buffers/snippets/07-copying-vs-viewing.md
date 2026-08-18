# Copying vs Viewing — Avoiding Accidental Mutation

`subarray()` returns a view over the same memory; `Buffer.from(view)` creates an independent copy. Mixing these up is the most common Buffer aliasing bug.

```js
const source = Buffer.from('hello world');
const view = source.subarray(0, 5);   // view, shares memory
const copy = Buffer.from(view);       // independent copy

view[0] = 0x48; // mutates source too
console.log(source.toString());       // "Hello world"
console.log(copy.toString());         // "hello" (unaffected)
```

`copy` was snapshotted before `view` was mutated, so it retains the original lowercase `"hello"` even after `source` changes.
