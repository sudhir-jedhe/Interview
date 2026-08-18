# Fixing Lost `this` in a Class Event Handler

**Scenario:** You have a class-based component (or any class with methods) where you pass `this.handleClick` as a callback to an event listener, and inside the method `this` is `undefined`. How do you fix it, and what are three different valid approaches?

**Approach:** The problem is that passing `this.handleClick` as a bare function reference detaches it from `this` — by the time the event fires and calls it, there's no implicit binding, so `this` defaults to `undefined` (strict mode, which class bodies always use).

```js
class Toggle {
  constructor() {
    this.on = false;
    // Fix 1: bind in the constructor
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.on = !this.on;
    console.log(this.on);
  }
}
const t = new Toggle();
button.addEventListener('click', t.handleClick); // works — bound in constructor
```

**Fix 2 — class field arrow function** (auto-binds per instance, no constructor code needed):

```js
class Toggle2 {
  on = false;
  handleClick = () => {
    this.on = !this.on;
    console.log(this.on);
  };
}
```

**Fix 3 — wrap in an arrow function at the call site** (no change to the class needed, but re-binds on every render/registration, which matters in frameworks that re-run render functions):

```js
button.addEventListener('click', () => t.handleClick());
```

Tradeoffs: constructor `.bind()` and class fields both create a new function per instance (memory cost scales with instance count, but that's usually negligible); the call-site arrow wrapper is convenient but, in UI frameworks, creates a new function identity on every render, which can defeat referential-equality optimizations (e.g. `React.memo`). For most real code, class field arrow functions are the cleanest default.
