# Scenario: Normalizing data points that arrive in two different tuple shapes

A charting library gives you an array of data points as `[timestamp, value, metadata]` tuples, but 80% of call sites only care about `timestamp` and `value` and ignore `metadata`. You also occasionally get legacy 2-element tuples without metadata. Write a normalization step that's robust to both shapes.

**Approach:**
```js
function normalizePoint([timestamp, value, metadata = {}]) {
  return { timestamp, value, metadata };
}

console.log(normalizePoint([1000, 42]));
// { timestamp: 1000, value: 42, metadata: {} }

console.log(normalizePoint([1000, 42, { source: 'sensorA' }]));
// { timestamp: 1000, value: 42, metadata: { source: 'sensorA' } }
```
Destructuring directly in the parameter list handles both tuple shapes in one line: the default `= {}` on `metadata` only fires because array destructuring yields `undefined` for a missing index (index 2 on a 2-element array), exactly the same rule as object destructuring defaults. This avoids manual `arr.length === 3 ? arr[2] : {}` branching entirely.
