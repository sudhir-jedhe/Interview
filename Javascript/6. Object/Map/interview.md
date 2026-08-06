
### 29. What is a `WeakMap` in JavaScript, and how does it differ from a regular `Map`?

A **WeakMap** stores key-value pairs where the keys are objects and are held **weakly**. This means the keys can be garbage collected if there are no other references to them. In contrast, keys in a regular `Map` prevent garbage collection.
