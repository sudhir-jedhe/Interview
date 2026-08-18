# Converting Object Methods to Arrow Functions Breaks `this`

**Scenario:** A junior engineer converts an object literal's methods from `function` to arrow functions across the codebase "for consistency," and now several object methods silently break (`this.someProperty` becomes `undefined`). How do you explain the root cause and set a team guideline?

**Approach:** Arrow functions have no `this` of their own — they capture whatever `this` was in scope at the point the arrow function was *defined*, not where it's called. For an object literal's method, that enclosing scope is usually the module or file's top level, not the object itself.

```js
// Broken:
const api = {
  baseUrl: 'https://api.example.com',
  getUrl: (path) => `${this.baseUrl}${path}`, // `this` here is NOT `api`
};
console.log(api.getUrl('/users')); // 'undefined/users'

// Correct:
const api2 = {
  baseUrl: 'https://api.example.com',
  getUrl(path) { return `${this.baseUrl}${path}`; }, // shorthand method syntax, proper `this`
};
console.log(api2.getUrl('/users')); // 'https://api.example.com/users'
```

Team guideline: use regular functions (or ES6 method shorthand) for any object or class method that needs to reference `this` as the object/instance itself. Reserve arrow functions for (a) callbacks nested inside a method where you deliberately want to inherit the outer `this`, and (b) standalone functions/utilities that don't use `this` at all. "Arrow functions everywhere" is not a safe blanket rule — it's specifically wrong for object/class methods.
