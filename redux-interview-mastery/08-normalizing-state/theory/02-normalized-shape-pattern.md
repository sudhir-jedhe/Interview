# The Normalized Shape Pattern

Normalization borrows an idea straight from relational database design: store each type of entity exactly once, in a flat lookup table keyed by ID, and reference related entities by ID instead of nesting them inline. In Redux this is almost always expressed as a pair of fields per entity type — a lookup object and an ordered list of keys.

## The canonical shape

```javascript
const state = {
  posts: {
    byId: {
      p1: { id: 'p1', title: 'Redux tips', authorId: 'u1', commentIds: ['c1', 'c2'] },
      p2: { id: 'p2', title: 'Normalizing 101', authorId: 'u2', commentIds: ['c3'] },
    },
    allIds: ['p1', 'p2'],
  },
  comments: {
    byId: {
      c1: { id: 'c1', text: 'Nice!', authorId: 'u1' },
      c2: { id: 'c2', text: 'Thanks', authorId: 'u2' },
      c3: { id: 'c3', text: 'Clear writeup', authorId: 'u1' },
    },
    allIds: ['c1', 'c2', 'c3'],
  },
  authors: {
    byId: {
      u1: { id: 'u1', name: 'Ada' },
      u2: { id: 'u2', name: 'Grace' },
    },
    allIds: ['u1', 'u2'],
  },
};
```

`byId` (Redux Toolkit's `createEntityAdapter` calls this `entities`) gives you O(1) lookup by ID — no `.find()`, no scanning. `allIds` (RTK calls this `ids`) preserves ordering, since object key order isn't a safe thing to rely on for rendering and JavaScript engines don't guarantee iteration order the way you'd want for a list that can be re-sorted or paginated.

## Why the pair, and not just an object?

You could store entities as `{ p1: {...}, p2: {...} }` alone, but then rendering an ordered list requires `Object.keys(byId)`, which doesn't guarantee order and can't represent a custom sort (newest first, alphabetical, etc.) independent of insertion. `allIds` is the source of truth for "what exists and in what order"; `byId` is the source of truth for "what does entity X currently look like." Keeping them separate means reordering (drag-and-drop, re-sort) only touches the array, and editing a field only touches one key in the object — neither operation disturbs the other.

## Updating one entity becomes trivial

Compare this to the nested `.map`-inside-`.map` from the previous file:

```javascript
function commentsReducer(state, action) {
  switch (action.type) {
    case 'comments/textEdited':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            text: action.payload.text,
          },
        },
      };
    default:
      return state;
  }
}
```

No traversal, no `.map`, no knowledge of which post the comment belongs to. The reducer only needs the comment's own ID. This also means a component subscribed to `state.comments.byId.c1` via a memoized selector re-renders only when `c1` changes — not when any other comment or any post changes. See `03-normalizing-relational-data.md` for converting a full nested API payload into this shape, and `04-create-entity-adapter.md` for how RTK generates this boilerplate for you.

## Trade-off: indirection

Normalization isn't free. Rendering a post with its author's name now requires two lookups (`posts.byId[id].authorId` → `authors.byId[authorId]`) instead of reading `post.author.name` directly. You're trading a small amount of read-side indirection (usually handled once, in a memoized selector) for a large reduction in write-side complexity and duplication risk. For state that's read constantly but rarely mutated in nested ways, denormalized can be fine. For anything with relational data that gets edited (todo apps, comment threads, chat, CRUD dashboards), normalized wins decisively.
