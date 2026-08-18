# Factory Pattern

A function that creates and returns objects without requiring `new` or exposing the concrete class being instantiated. Useful when object creation involves branching logic or you want to hide implementation details behind a simple creation API.

```js
function createShape(type, size) {
  switch (type) {
    case "circle": return { type, area: () => Math.PI * size ** 2 };
    case "square": return { type, area: () => size ** 2 };
    default: throw new Error(`Unknown shape: ${type}`);
  }
}

createShape("circle", 2).area(); // 12.566...
```

**What's the difference between the factory pattern and just calling `new SomeClass()` directly?**
A factory function centralizes and hides the logic of *which* concrete object to construct, letting callers ask for what they want conceptually ("give me a shape") without knowing the underlying class hierarchy. Calling `new` directly requires the caller to know and import the specific class, coupling the caller to implementation details a factory would hide.

See `../problems/03-shape-factory.md` for a fuller worked example with more shape types and shared behavior.
