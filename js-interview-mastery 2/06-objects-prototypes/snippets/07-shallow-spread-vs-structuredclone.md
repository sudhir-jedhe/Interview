# Snippet: shallow spread vs structuredClone for nested data

```js
const original = { user: { name: "Ana" }, tags: ["a", "b"] };

const shallow = { ...original };
shallow.user.name = "Bea";
console.log(original.user.name);        // "Bea" (shared reference, mutated!)

const deep = structuredClone(original);
deep.user.name = "Cid";
console.log(original.user.name);        // still "Bea", unaffected by deep clone
```

Spread only copies the top-level keys; `shallow.user` and `original.user` point to the *same* nested object, so mutating one mutates both. `structuredClone` recursively creates independent copies of every nested object, so mutating `deep.user` never touches `original.user`.
