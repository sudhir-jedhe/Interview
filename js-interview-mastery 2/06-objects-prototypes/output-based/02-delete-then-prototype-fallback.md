# Output: delete then falling back to the prototype chain

```js
const parent = { greet() { return "parent"; } };
const child = Object.create(parent);
child.greet = () => "child";
delete child.greet;
console.log(child.greet());
delete child.greet;
console.log(child.greet());
```

**Answer:** `"parent"` then `"parent"`

**Why:** Trace carefully — `child.greet` is assigned an own arrow function first, but it's deleted *before* the first `console.log`. After the first `delete`, the own property is gone, so lookup falls through to `parent.greet`, logging `"parent"` on the first line. The second `delete` does nothing (there's no own `greet` left to delete), so the second log is also `"parent"`.
