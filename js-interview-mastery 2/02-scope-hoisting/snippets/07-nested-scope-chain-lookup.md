# Nested Scope Chain Lookup (Lexical Scoping)

```js
const level0 = 'global';
function level1() {
  const level1Var = 'level1';
  function level2() {
    console.log(level0, level1Var); // 'global' 'level1' — walks up the chain
  }
  level2();
}
level1();
```
