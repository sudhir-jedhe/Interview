# Snippets: Objects & Prototypes

## 1. Default descriptor attributes differ between literal and defineProperty

```js
const literal = { a: 1 };
console.log(Object.getOwnPropertyDescriptor(literal, "a"));
// { value: 1, writable: true, enumerable: true, configurable: true }

const defined = {};
Object.defineProperty(defined, "a", { value: 1 });
console.log(Object.getOwnPropertyDescriptor(defined, "a"));
// { value: 1, writable: false, enumerable: false, configurable: false }
```

## 2. Non-enumerable properties are invisible to common iteration

```js
const obj = { visible: 1 };
Object.defineProperty(obj, "hidden", { value: 2, enumerable: false });

console.log(Object.keys(obj));          // ["visible"]
console.log(JSON.stringify(obj));       // {"visible":1}
console.log(obj.hidden);                // 2 (still directly accessible)
```

## 3. Freeze is shallow

```js
const config = Object.freeze({ retries: 3, limits: { max: 10 } });
config.retries = 99;
config.limits.max = 9999;
console.log(config.retries, config.limits.max); // 3 9999
```

## 4. Prototype chain lookup order

```js
const base = { greet() { return "hi from base"; } };
const mid = Object.create(base);
const top = Object.create(mid);
top.greet = function () { return "hi from top"; };

console.log(top.greet());              // "hi from top" (own property wins)
delete top.greet;
console.log(top.greet());              // "hi from base" (falls through to base)
```

## 5. Object.create(null) has no inherited methods

```js
const dict = Object.create(null);
dict.toString = "not a function anymore, just a key";
console.log(dict.toString);            // "not a function anymore, just a key"
console.log(Object.prototype.toString.call(dict)); // "[object Object]"
```

## 6. hasOwnProperty vs `in`

```js
function Car() {}
Car.prototype.wheels = 4;
const car = new Car();
car.color = "red";

console.log("color" in car);            // true
console.log("wheels" in car);           // true (inherited)
console.log(car.hasOwnProperty("color"));  // true
console.log(car.hasOwnProperty("wheels")); // false
```

## 7. Shallow spread vs structuredClone for nested data

```js
const original = { user: { name: "Ana" }, tags: ["a", "b"] };

const shallow = { ...original };
shallow.user.name = "Bea";
console.log(original.user.name);        // "Bea" (shared reference, mutated!)

const deep = structuredClone(original);
deep.user.name = "Cid";
console.log(original.user.name);        // still "Bea", unaffected by deep clone
```
