# Labeled continue skips the OUTER loop's current iteration

```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer;
    console.log(`i=${i} j=${j}`);
  }
}
// i=0 j=0
// i=1 j=0
// i=2 j=0
```
