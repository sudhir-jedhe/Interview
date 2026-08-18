# Object Destructuring

Object destructuring unpacks by property name, not position. You can rename while extracting, supply defaults, and nest arbitrarily deep:

```js
const user = { id: 1, profile: { name: 'Ada', age: 30 } };

const { id: userId, profile: { name, age = 18 } } = user;
// userId = 1, name = 'Ada', age = 30
```

The `key: newName` syntax is a rename, not a type annotation (a common confusion for TypeScript newcomers). If you destructure a property that doesn't exist, you get `undefined` unless a default is provided — it never throws, *unless* the object itself is `null`/`undefined`, in which case destructuring throws a `TypeError` because you can't read properties off `null`.

## Destructuring in function parameters

This is extremely common for options objects:

```js
function createUser({ name, role = 'guest', permissions = [] } = {}) {
  return `${name} (${role})`;
}
createUser({ name: 'Bo' }); // "Bo (guest)"
createUser();               // works only because of `= {}` fallback
```

Without the `= {}` default on the parameter itself, calling `createUser()` with no arguments throws, because you'd be destructuring `undefined`.
