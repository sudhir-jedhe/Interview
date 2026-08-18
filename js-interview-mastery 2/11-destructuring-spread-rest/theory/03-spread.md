# Spread: Expanding

Spread takes an iterable (array, string, Map, Set, etc.) or, for objects, an object's own enumerable properties, and expands them in place:

```js
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];      // [1, 2, 3, 4]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, b: 99 };   // { a: 1, b: 99 } — later keys win

function sum(a, b, c) { return a + b + c; }
sum(...[1, 2, 3]);                 // 6
```

Object spread only copies **own enumerable** properties, and it does a **shallow copy**: nested objects/arrays are copied by reference, not cloned.

```js
const original = { a: 1, nested: { x: 1 } };
const copy = { ...original };
copy.nested.x = 99;
console.log(original.nested.x);    // 99 — same nested object!
```

For a real deep copy you need `structuredClone(obj)`, a recursive clone, or a library — spread alone is not enough for nested data.

## Object spread `{ ...obj }` vs `Object.assign({}, obj)`

| Aspect | Object Spread | `Object.assign` |
|---|---|---|
| Syntax | Declarative literal syntax | Function call |
| Getters | Evaluates the source's getter once and copies the resulting value | Same behavior |
| Mutating an existing target | Always creates a brand-new object | Can mutate an existing target (`Object.assign(target, ...)`) |
| Readability | Cleaner for merging into a new literal | More flexible, but easy to misuse |

In modern engines both behave equivalently for own-enumerable-property copying; the practical difference is that `Object.assign` can mutate an existing object in place (`Object.assign(target, src)`), whereas spread always creates a brand-new object. The common mistake is using `Object.assign(target, src)` intending an immutable update but forgetting it mutates `target` too.
