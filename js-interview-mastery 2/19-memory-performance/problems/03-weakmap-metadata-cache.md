# Problem: A WeakMap-based cache for associating metadata with objects

**Task:** Implement a small cache that lets you attach arbitrary metadata (e.g., "has this object already been validated / rendered / logged?") to any object, without preventing that object from being garbage collected — and explain concretely why a regular `Map` would leak in this exact use case.

## Full solution

```js
const validationCache = new WeakMap();

function validateExpensively(record) {
  // Pretend this does real, costly work (schema checks, cross-field rules, etc.)
  console.log("running expensive validation for", record.id);
  return { valid: record.value != null, checkedAt: Date.now() };
}

function getValidation(record) {
  if (validationCache.has(record)) {
    return validationCache.get(record); // skip re-running expensive work
  }
  const result = validateExpensively(record);
  validationCache.set(record, result);
  return result;
}

let record = { id: 1, value: "ok" };
getValidation(record); // runs expensive validation, caches result
getValidation(record); // cache hit -- no log line, returns cached result

record = null;
// The original {id: 1, value: "ok"} object is no longer referenced by
// anything in this program. Because validationCache is a WeakMap, its entry
// for that object does NOT keep it alive -- both the object and the cache
// entry become eligible for garbage collection together, automatically.
```

## Why a regular `Map` would leak here

```js
const leakyValidationCache = new Map(); // <-- the only change

let record = { id: 1, value: "ok" };
leakyValidationCache.set(record, { valid: true });
record = null;
// leakyValidationCache still holds a STRONG reference to the original object
// as a key. Even though `record` (the local variable) is null, the object it
// used to point to is still reachable via leakyValidationCache -> its keys.
// It can NEVER be garbage collected until something explicitly calls
// leakyValidationCache.delete(thatObject) -- which requires still having a
// reference to it, which is exactly the problem: you've lost your only
// reference, yet the Map keeps the object alive forever anyway.
```

With a `Map`, the cache itself becomes the thing keeping every object it has ever seen alive, for as long as the `Map` exists — in a long-running app (e.g., a server processing millions of records, or a browser tab open for hours), this cache would grow without bound and would prevent the garbage collector from ever reclaiming any object that was ever validated, even long after every other part of the program is done with it.

## Key takeaway

Use `WeakMap` (or `WeakSet`, for a simple membership check without a value) any time the cache's job is "remember something about objects that are otherwise owned/managed elsewhere" rather than "own and keep alive a curated collection of objects" — the former is a `WeakMap` use case, the latter is a regular `Map`/array use case. See `../theory/05-weakmap-and-weakset.md` for the underlying `Map` vs `WeakMap` comparison.
