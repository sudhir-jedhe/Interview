# Snippet: Minimal pub-sub event emitter

```js
function createEmitter() {
  const listeners = new Map();
  return {
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(cb);
    },
    emit(event, payload) {
      listeners.get(event)?.forEach(cb => cb(payload));
    },
  };
}

const emitter = createEmitter();
emitter.on("greet", (name) => console.log(`Hello, ${name}`));
emitter.emit("greet", "world"); // "Hello, world"
```
