# Own vs inherited properties

`"speak" in dog` returns `true` because `in` checks the whole prototype chain. `dog.hasOwnProperty("speak")` returns `false` because it only checks own properties. This distinction matters constantly when iterating with `for...in`, which (unlike `Object.keys`) also walks inherited enumerable properties.

```js
function Car() {}
Car.prototype.wheels = 4;
const car = new Car();
car.color = "red";

console.log("color" in car);               // true
console.log("wheels" in car);              // true (inherited)
console.log(car.hasOwnProperty("color"));  // true
console.log(car.hasOwnProperty("wheels")); // false
```

## `hasOwnProperty` vs `in`

| Aspect | `obj.hasOwnProperty(key)` | `key in obj` |
|---|---|---|
| Checks inherited properties | No | Yes |
| Works on `Object.create(null)` objects | No (throws, no method) | Yes (safe, it's an operator) |
| Typical use | Filtering `for...in` results to own keys | Checking existence anywhere in the chain, including built-ins |

Use `in` when you genuinely want to know if a property is reachable at all (including via prototype, like checking for a method); use `hasOwnProperty` (or `Object.hasOwn(obj, key)` in modern JS) when you specifically care about the object's own data. `Object.hasOwn` is the modern, safer alternative to `.hasOwnProperty()` since it works correctly even on objects with no prototype, where calling `.hasOwnProperty` directly throws:

```js
const dict = Object.create(null);
dict.a = 1;
console.log(Object.hasOwn(dict, "a"));               // true — safe on null-prototype objects
console.log(dict.hasOwnProperty);                    // undefined — no inherited method to call
```

The common mistake is using `in` inside an existence check and getting `true` for inherited methods like `"toString" in obj`, wrongly assuming the object itself defines it.

## `for...in` vs `Object.keys`

`Object.keys` returns only an object's own enumerable string-keyed properties. `for...in` additionally walks up the prototype chain and includes inherited enumerable properties. In practice this rarely matters with plain objects because built-in prototype methods are non-enumerable, but it becomes a footgun with custom prototypes that add enumerable properties — which is why many style guides recommend guarding `for...in` bodies with a `hasOwnProperty` check, or just avoiding `for...in` in favor of `Object.keys`/`Object.entries`.

```js
const obj = { a: 1, b: 2 };
for (const key in obj) {
  if (key === "a") delete obj.a;
  console.log(key);
}
// "a" then "b" — engines handle deleting the *current* key mid-iteration safely;
// it just won't be revisited, and other keys are unaffected.
```
