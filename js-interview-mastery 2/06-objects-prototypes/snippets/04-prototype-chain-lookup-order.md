# Snippet: prototype chain lookup order

```js
const base = { greet() { return "hi from base"; } };
const mid = Object.create(base);
const top = Object.create(mid);
top.greet = function () { return "hi from top"; };

console.log(top.greet());              // "hi from top" (own property wins)
delete top.greet;
console.log(top.greet());              // "hi from base" (falls through to base)
```

Property lookup always checks the object itself first, then walks `[[Prototype]]` links one at a time until it finds a match or reaches `null`. Deleting the own `greet` on `top` doesn't affect `mid` or `base` — it just means the lookup continues past `top` next time.
