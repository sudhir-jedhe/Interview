# Snippet: bind's this is permanent and can't be overridden by a later call/apply

```js
function whoAmI() { return this.label; }
const boundToA = whoAmI.bind({ label: 'A' });
console.log(boundToA.call({ label: 'B' })); // 'A' — call() cannot override an existing bind
```

Once `whoAmI` has been bound to `{ label: 'A' }`, no subsequent `call`, `apply`, or additional `bind` can change that `this` — the binding is permanent for the life of the returned function.
