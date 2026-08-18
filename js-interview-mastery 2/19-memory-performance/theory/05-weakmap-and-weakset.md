# WeakMap and WeakSet

`WeakMap` and `WeakSet` hold **weak references** to their keys (WeakMap) or values (WeakSet): if the only remaining reference to an object is as a WeakMap key, the garbage collector can still reclaim it, and the entry is automatically removed. This makes them ideal for associating metadata with an object (like DOM nodes) without that association itself keeping the object alive forever.

```js
const cache = new WeakMap();
let el = document.querySelector("#widget");
cache.set(el, { clicks: 0 });
el = null; // if no other references exist, the DOM node AND its WeakMap entry
           // become eligible for garbage collection -- a regular Map would leak it
```

Neither is iterable (no `.keys()`, `.forEach()`, `.size`) precisely because their contents can vanish at any time via garbage collection, which would make iteration order/results nondeterministic.

## `Map`/`Set` vs. `WeakMap`/`WeakSet`

| Aspect | `Map` / `Set` | `WeakMap` / `WeakSet` |
|---|---|---|
| Reference strength to keys/values | Strong — prevents garbage collection | Weak — does not prevent garbage collection |
| Iterable / has `.size` | Yes | No |
| Key types allowed | Any value | Objects only (and registered symbols), no primitives |
| Typical use | General-purpose collections you need to inspect/iterate | Attaching private metadata to objects (e.g., DOM nodes) without leaking |

Use `WeakMap`/`WeakSet` specifically when the key's lifetime should be controlled by the rest of your program, not by the map itself — e.g., caching computed data per DOM node. The common mistake is using a regular `Map` for this and creating a slow, silent memory leak because entries are never removed even after their key object is otherwise gone. A full worked example and explanation of *why* a regular `Map` would leak is in `../problems/03-weakmap-metadata-cache.md`.
