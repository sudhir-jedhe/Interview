# Strict Mode Changes Default Binding to `undefined`

```js
function greet() {
  'use strict';
  console.log(this);
}
greet();
```

**Answer:** `undefined`

**Why:** With `'use strict'` active, the default binding rule for a plain function call sets `this` to `undefined` instead of falling back to the global object. This is one of strict mode's deliberate safety improvements — it prevents accidental mutation of global state via an unintended `this`.
