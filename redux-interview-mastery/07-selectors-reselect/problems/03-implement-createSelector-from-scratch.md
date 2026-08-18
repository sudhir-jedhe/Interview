# Problem 3: Implement a Simplified `createSelector` From Scratch

## Task

Implement a `myCreateSelector(inputSelectors, resultFn)` function that:

- Accepts an array of input selector functions and a result function.
- Returns a new selector function that, when called with `(...args)`, runs each input selector against `args`, and only re-invokes `resultFn` if at least one input's output differs (by `===`) from the previous call's corresponding input.
- Otherwise returns the cached previous result.
- Cache size of 1 (only remembers the most recent call), matching `reselect`'s default behavior.

## Reference solution

```javascript
function myCreateSelector(inputSelectors, resultFn) {
  let lastArgs = null;       // the last computed set of input values
  let lastResult = null;     // the last computed result
  let hasRun = false;        // has this selector ever been called successfully

  return function memoizedSelector(...args) {
    const newArgs = inputSelectors.map((inputSelector) => inputSelector(...args));

    const inputsChanged =
      !hasRun ||
      newArgs.length !== lastArgs.length ||
      newArgs.some((value, index) => value !== lastArgs[index]);

    if (inputsChanged) {
      lastResult = resultFn(...newArgs);
      lastArgs = newArgs;
      hasRun = true;
    }

    return lastResult;
  };
}

export default myCreateSelector;
```

## Verification

```javascript
const selectItems = (state) => state.items;
const selectQuery = (state) => state.query;

let computeCount = 0;
const selectFiltered = myCreateSelector(
  [selectItems, selectQuery],
  (items, query) => {
    computeCount++;
    return items.filter((i) => i.includes(query));
  }
);

const state1 = { items: ['apple', 'banana', 'cherry'], query: 'a' };
const r1 = selectFiltered(state1);
console.log(r1); // ['apple', 'banana']
console.log(computeCount); // 1

const r2 = selectFiltered(state1); // identical state object, same input references
console.log(r2 === r1); // true — cache hit, no recompute
console.log(computeCount); // still 1

const state2 = { items: state1.items, query: state1.query }; // different outer object, same inner refs
const r3 = selectFiltered(state2);
console.log(r3 === r1); // true — inputs are still === to last time
console.log(computeCount); // still 1

const state3 = { items: [...state1.items], query: 'a' }; // new array reference, same contents
const r4 = selectFiltered(state3);
console.log(r4 === r1); // false — items reference changed, recomputed
console.log(computeCount); // 2

console.log(r4); // ['apple', 'banana'] — same VALUE as r1, but a different array instance
```

## Notes on what's deliberately simplified vs. real `reselect`

Real `reselect` additionally supports: configurable cache sizes greater than 1 (via `lruMemoize`/`weakMapMemoize`), custom equality functions per input (via `createSelectorCreator`), automatic memoization of the input-selector array itself (so passing a new *array literal* of the same selector functions each call doesn't break anything), and detection/warnings for common misuse (e.g., an input selector that returns a new object every call, or forgetting to provide any input selectors). The core mechanism this exercise reproduces — compare each input by reference, skip recomputation if none changed, otherwise recompute and cache — is genuinely the heart of what makes `createSelector` work, and is exactly what's being tested when an interviewer asks "how would you implement this yourself?"
