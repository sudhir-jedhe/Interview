# Scenario: validating that a plugin object implements a required interface

**Prompt:** You're loading third-party plugin objects into a system and need to verify each one implements a `render()` method and an `init()` method before registering it, without requiring plugins to extend a specific base class (since they're loaded dynamically and might come from different sources). How do you check this, and how does it relate to `instanceof`?

**Approach:** `instanceof` won't work here since plugins aren't guaranteed to share a common constructor — this calls for duck typing instead:

```js
function isValidPlugin(obj) {
  return obj !== null &&
    typeof obj === "object" &&
    typeof obj.render === "function" &&
    typeof obj.init === "function";
}

const plugin = { render() { /* ... */ }, init() { /* ... */ } };
console.log(isValidPlugin(plugin)); // true, regardless of what constructed it
```

This is the practical JS answer to "structural typing" — you check for shape (does it quack like a duck) rather than lineage (was it built by a specific class). `instanceof` is the right tool when you control the class hierarchy and want to test lineage; duck typing/interface-checking is right when objects can come from anywhere and only the shape matters.
