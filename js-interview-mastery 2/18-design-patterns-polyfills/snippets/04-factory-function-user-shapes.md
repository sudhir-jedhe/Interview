# Snippet: Factory function producing different object shapes from one entry point

```js
function createUser(role) {
  const base = { role, createdAt: Date.now() };
  if (role === "admin") return { ...base, permissions: ["read", "write", "delete"] };
  return { ...base, permissions: ["read"] };
}

console.log(createUser("admin").permissions); // ["read", "write", "delete"]
console.log(createUser("guest").permissions); // ["read"]
```
