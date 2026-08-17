# Output-Based Questions: Objects & Prototypes

## 1.

```js
const obj = {};
Object.defineProperty(obj, "x", { value: 10 });
obj.x = 20;
console.log(obj.x);
console.log(Object.keys(obj));
```

**Answer:** `10` then `[]`

**Why:** `Object.defineProperty` with only `value` set leaves `writable`, `enumerable`, and `configurable` all defaulting to `false`. The reassignment `obj.x = 20` silently fails in sloppy mode (no error, no effect), and since `enumerable` is `false`, `Object.keys` doesn't list `x` even though it exists on the object.

## 2.

```js
const parent = { greet() { return "parent"; } };
const child = Object.create(parent);
child.greet = () => "child";
delete child.greet;
console.log(child.greet());
delete child.greet;
console.log(child.greet());
```

**Answer:** `"child"` then `"parent"`

**Why:** Wait — trace carefully. `child.greet` is assigned an own arrow function, so the first call after assignment (before any delete) would be `"child"`, but the code deletes it *before* the first log. After the first `delete`, the own property is gone so lookup falls through to `parent.greet`, logging `"parent"` on the first `console.log`. The second `delete` does nothing (there's no own `greet` left to delete) and the second log is also `"parent"`. So the actual output is `"parent"` then `"parent"`.

## 3.

```js
const frozen = Object.freeze([1, 2, 3]);
frozen.push(4);
```

**Answer:** Throws `TypeError: Cannot add property 3, object is not extensible` (in strict mode / ES modules); silently fails otherwise but array stays `[1,2,3]`.

**Why:** Arrays are objects, so `Object.freeze` applies. `push` tries to add a new index and set `.length`, both of which are blocked by the frozen, non-extensible array. Array mutator methods run in strict mode internally in modern engines, so this throws.

## 4.

```js
function Foo() {}
Foo.prototype.value = 1;
const a = new Foo();
Foo.prototype = { value: 2 };
const b = new Foo();
console.log(a.value, b.value);
```

**Answer:** `1 2`

**Why:** `a` was created while `Foo.prototype` pointed to the original object, so `a`'s internal `[[Prototype]]` still links to that original object (`value: 1`) even after `Foo.prototype` is reassigned. `b` is created after the reassignment, so it links to the new object (`value: 2`). Reassigning `.prototype` never retroactively changes already-created instances.

## 5.

```js
const obj = { a: 1, b: 2 };
for (const key in obj) {
  if (key === "a") delete obj.a;
  console.log(key);
}
```

**Answer:** `"a"` then `"b"`

**Why:** `for...in` computes property visitation dynamically but engines generally handle deleting the *current* key mid-iteration safely — it just won't be revisited, and keys already yielded or not yet visited are unaffected as long as you don't add new keys. `a` is logged before being deleted, and `b` still gets visited normally afterward.

## 6.

```js
console.log(Object.getPrototypeOf({}) === Object.prototype);
console.log(Object.getPrototypeOf(Object.prototype));
console.log(typeof Object.prototype.__proto__);
```

**Answer:** `true`, `null`, `"object"`

**Why:** A plain object literal's prototype is `Object.prototype`. `Object.prototype` itself sits at the top of the chain, so its own prototype is `null`. `typeof null` is `"object"` (a famous JS quirk), which is what makes the third line's output `"object"` rather than `"null"` — that's the classic `typeof null` bug reappearing in a prototype context.

## 7.

```js
const a = { val: 1 };
const b = Object.assign({}, a, { val: 2 }, { extra: 3 });
console.log(a, b);
```

**Answer:** `{ val: 1 }` then `{ val: 2, extra: 3 }`

**Why:** `Object.assign` copies own enumerable properties from each source into the target (`{}` here) left to right, later sources overwriting earlier ones for the same key. `a` itself is never mutated because it's only used as a source, not the target.

## 8.

```js
const dict = Object.create(null);
dict.a = 1;
console.log(dict);
console.log(dict.hasOwnProperty("a"));
```

**Answer:** logs something like `[Object: null prototype] { a: 1 }`, then throws `TypeError: dict.hasOwnProperty is not a function`

**Why:** `Object.create(null)` produces an object with no prototype chain at all, so it has no inherited `hasOwnProperty`, `toString`, etc. Node's console specially labels such objects as "null prototype" to distinguish them from ordinary objects. To safely check ownership you'd need `Object.prototype.hasOwnProperty.call(dict, "a")`.
