# Problem 2: Update One Normalized Entity Without Touching Others

## Task

Given the normalized `comments` slice shape `{ byId: {...}, allIds: [...] }`, write a plain (non-RTK, no Immer) reducer `commentsReducer(state, action)` that handles a `comments/textEdited` action with `payload: { id, text }`. Requirements:

1. It must not mutate the input `state`.
2. Only the edited comment's object reference may change — every other comment object in `byId` must be the *same reference* as before (`===`) so that components subscribed to those other comments do not re-render.
3. If the `id` in the payload doesn't exist in `byId`, return `state` unchanged (same reference).

Then explain, in one or two sentences, why requirement #2 is what actually makes this "efficient" from a re-render perspective — efficiency here isn't about CPU time, it's about what `useSelector` reference-equality checks will do.

## Solution

```javascript
function commentsReducer(state, action) {
  switch (action.type) {
    case 'comments/textEdited': {
      const { id, text } = action.payload;
      if (!state.byId[id]) return state; // requirement 3: unknown id is a no-op

      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: { ...state.byId[id], text }, // only this key gets a new object
        },
        // allIds is untouched — order/membership didn't change
      };
    }
    default:
      return state;
  }
}

// Verify requirement 2:
const state0 = {
  byId: { c1: { id: 'c1', text: 'old' }, c2: { id: 'c2', text: 'unrelated' } },
  allIds: ['c1', 'c2'],
};
const state1 = commentsReducer(state0, { type: 'comments/textEdited', payload: { id: 'c1', text: 'new' } });

console.assert(state1.byId.c1.text === 'new', 'c1 should be updated');
console.assert(state1.byId.c2 === state0.byId.c2, 'c2 reference must be untouched');
console.assert(state1.allIds === state0.allIds, 'allIds reference must be untouched');

const state2 = commentsReducer(state0, { type: 'comments/textEdited', payload: { id: 'ghost', text: 'x' } });
console.assert(state2 === state0, 'unknown id should be a true no-op, same reference');
console.log('All assertions passed.');
```

## Why requirement #2 is the point

`useSelector(state => selectCommentById(state, 'c2'))` compares the previously selected value to the newly selected value by `===`. Because `state1.byId.c2` is the *exact same object reference* as `state0.byId.c2`, that comparison is `true` (no change detected) and the component rendering comment `c2` skips its re-render — even though a sibling reducer branch touched the same `byId` table. This is only possible because the reducer rebuilds the minimum set of ancestor objects (`state` and `byId`, since their contents changed) while explicitly reusing every untouched leaf object (`c2`) by reference. This is the concrete mechanism behind "normalization avoids unnecessary re-renders" — it's not automatic, it's a direct consequence of writing the update this way instead of, say, mapping over `Object.values(byId)` and rebuilding every entry.
