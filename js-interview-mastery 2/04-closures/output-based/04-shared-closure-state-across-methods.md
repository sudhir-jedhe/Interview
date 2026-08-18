# Two Methods from the Same Factory Call Share One Closure

```js
function counterFactory() {
  let count = 0;
  return {
    increment: () => ++count,
    reset: () => { count = 0; }
  };
}
const counter = counterFactory();
counter.increment();
counter.increment();
counter.reset();
console.log(counter.increment());
```

**Answer:** `1`

**Why:** Both `increment` and `reset` close over the *same* `count` variable within one `counterFactory()` call, so mutations from one method are visible to the other. After two increments (`count` = 2) and a reset (`count` = 0), the next increment brings it to `1`.
