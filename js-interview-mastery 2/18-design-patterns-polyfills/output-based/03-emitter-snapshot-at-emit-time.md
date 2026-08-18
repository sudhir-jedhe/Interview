# Output: Emitter listeners snapshot at emit time

```js
function createEmitter() {
  const listeners = [];
  return {
    on(cb) { listeners.push(cb); },
    emit(x) { listeners.forEach(cb => cb(x)); },
  };
}

const bus = createEmitter();
bus.on((x) => console.log("A:", x));
bus.on((x) => console.log("B:", x));
bus.emit(1);
bus.on((x) => console.log("C:", x));
bus.emit(2);
```

**Answer:**
```
A: 1
B: 1
A: 2
B: 2
C: 2
```

**Why:** Each `emit` call snapshots the *current* `listeners` array at the time `forEach` runs. Listener "C" was registered after the first `emit(1)`, so it only receives the second emission. This demonstrates that the array is mutated in place, and new subscribers only get events emitted after they subscribed.
