# Snippet: `localStorage` persists strings only — objects must be serialized

*(Browser-only — run in a browser console on a real page.)*

```js
localStorage.setItem("user", JSON.stringify({ name: "Ana", age: 30 }));
const raw = localStorage.getItem("user");
console.log(typeof raw, raw);
// "string" '{"name":"Ana","age":30}'

const user = JSON.parse(raw);
console.log(user.name);
// "Ana"
```
