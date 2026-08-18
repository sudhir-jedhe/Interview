# Shallow copy caveat: nested reference is shared

```js
const state = { count: 0, meta: { tags: ['a'] } };
const next = { ...state, count: 1 };
next.meta.tags.push('b');
console.log(state.meta.tags);
// [ 'a', 'b' ]  <- mutated through the shared reference
```
