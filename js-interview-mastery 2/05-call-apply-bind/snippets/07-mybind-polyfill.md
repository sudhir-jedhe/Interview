# Snippet: a minimal myBind polyfill in action

```js
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this;
  return function(...callArgs) {
    return fn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};

function add(a, b, c) { return a + b + c + (this.offset || 0); }
const bound = add.myBind({ offset: 100 }, 1, 2);
console.log(bound(3)); // 1 + 2 + 3 + 100 = 106
```

`fn` captures the original function via closure (`this` inside `myBind` is whatever function it was called as a method on). The returned function merges the pre-bound arguments (`1, 2`) with any new ones (`3`) and invokes the original via `apply`, forcing the desired `this`. See `problems/01-polyfills-mycall-myapply-mybind.md` for a fuller, `new`-aware version.
