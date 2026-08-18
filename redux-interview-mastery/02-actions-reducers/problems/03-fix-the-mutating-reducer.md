# Problem: Fix a Reducer That Mutates State Directly

## Task

The reducer below is used in production. QA reports that a "toggle favorite" star icon sometimes doesn't visually update on the first click — it takes two clicks, or occasionally never updates at all, even though the feature "works" when inspected via `console.log(store.getState())`. Find the bug, explain precisely why it causes this exact symptom, and fix it.

## Given (buggy) code

```javascript
const initialState = {
  products: [
    { id: 1, name: 'Book', favorited: false },
    { id: 2, name: 'Pen', favorited: false },
  ],
};

function productsReducer(state = initialState, action) {
  switch (action.type) {
    case 'product/favoriteToggled': {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        product.favorited = !product.favorited; // mutating the object in the array
      }
      return { ...state }; // "new" top-level object, but products array/items untouched
    }
    default:
      return state;
  }
}
```

## Diagnosis

1. `state.products.find(...)` returns a *reference* to the actual object living inside the current `state.products` array — not a copy.
2. `product.favorited = !product.favorited` mutates that object in place. The array `state.products` still contains the exact same references it did before (just with different internal field values), and `state.products` itself is untouched.
3. `return { ...state }` creates a new top-level object, but `newState.products` is the *same array reference* as `state.products` (a shallow copy only copies one level deep), and every product object inside it is untouched by the spread as well — meaning the specific product object a component might be tracking is byte-for-byte the same reference as before the "update."
4. Symptom explanation: a component doing `useSelector((state) => state.products)` sees a *new* top-level state reference each time (because of the outer spread) — so it re-renders. But a component doing something more targeted, like `useSelector((state) => state.products.find((p) => p.id === productId))`, gets back the *same* object reference every time (since that specific object was mutated, not replaced), so it does *not* re-render on the first dispatch. If some other, unrelated dispatch later happens to also change the top-level `products` array reference (e.g., a different action that legitimately rebuilds the array), that incidental re-render is what makes the star "catch up" on a second click, or after some unrelated interaction — which is why QA sees an inconsistent, timing-dependent symptom rather than a clean "always broken."

## Fixed code

```javascript
function productsReducer(state = initialState, action) {
  switch (action.type) {
    case 'product/favoriteToggled':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload ? { ...p, favorited: !p.favorited } : p
        ),
      };
    default:
      return state;
  }
}
```

Now every level that changes gets a new reference: the toggled product is a new object, the `products` array is a new array (via `.map`), and `state` itself is a new object — while untouched products keep their original references (so `.map` returning the *same* object for non-matching items, as written here via the ternary's `else` branch implicitly returning `p` unchanged, preserves reference equality for anything that wasn't toggled).

## `createSlice` equivalent (for comparison)

```javascript
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    favoriteToggled(state, action) {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) product.favorited = !product.favorited; // safe here — Immer draft
    },
  },
});
```

Note this is the *exact same line* that was buggy in the classic version — it's only safe here because `createSlice` wraps `state` in an Immer draft; the takeaway isn't "mutation is always fine" but "mutation is only safe inside Immer's producer, never in a hand-written reducer."

## Interview follow-ups this problem invites

- "Why did `console.log(store.getState())` show the correct data even though the UI didn't update?" Because logging reads whatever the mutated object currently contains — the data itself *is* correct after the mutation, only the reference tracking that `useSelector` relies on is broken. This gap between "the data is right" and "the reference changed" is exactly what makes mutation bugs so confusing to debug without knowing to check for it specifically.
- "Would `redux-immutable-state-invariant` (bundled in Redux Toolkit's default middleware) have caught this in development?" Yes — it deep-compares state before and after each dispatch and throws if it detects a mutation, specifically to surface bugs like this immediately during development rather than as a mysterious "click twice" UI report from QA weeks later.
