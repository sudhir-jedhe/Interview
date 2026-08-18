# Scenario: Optimistic "Add to Cart" That Must Roll Back on Failure

A shopping cart feature needs to feel instant: clicking "Add to Cart" should update the UI immediately, not after a network round-trip. But the add can fail (item just went out of stock, session expired), and when it does, the item needs to disappear from the cart again and the user needs to see why.

**Approach:** Update the slice optimistically inside the component/thunk dispatch *before* the request resolves, then use `createAsyncThunk`'s `rejected` case to roll back precisely the optimistic change — not a blanket "refetch everything," which would be slower and defeats the point of optimism.

```javascript
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
    const res = await fetch('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id }),
    });
    if (!res.ok) {
      const body = await res.json();
      return rejectWithValue({ reason: body.message, optimisticId: product.optimisticId });
    }
    return { serverItem: await res.json(), optimisticId: product.optimisticId };
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], lastError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        // optimistic insert, tagged with a temp id so we can find it again
        const optimisticId = nanoid();
        action.meta.arg.optimisticId = optimisticId; // stash it for pending/rejected to share
        state.items.push({
          id: optimisticId,
          productId: action.meta.arg.id,
          name: action.meta.arg.name,
          price: action.meta.arg.price,
          pending: true,
        });
        state.lastError = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // swap the optimistic placeholder for the real server-confirmed item
        const idx = state.items.findIndex((i) => i.id === action.payload.optimisticId);
        if (idx !== -1) state.items[idx] = { ...action.payload.serverItem, pending: false };
      })
      .addCase(addToCart.rejected, (state, action) => {
        // roll back — remove exactly the optimistic item that failed, nothing else
        state.items = state.items.filter((i) => i.id !== action.payload?.optimisticId);
        state.lastError = action.payload?.reason ?? 'Could not add item to cart';
      });
  },
});

export default cartSlice.reducer;
```

Two design decisions matter here for a senior review: first, tagging the optimistic item with a locally-generated `optimisticId` (rather than trying to match by `productId`, which breaks if the same product is added twice in quick succession) makes the rollback precise instead of "remove the last item that looks like this one," which is fragile under concurrent adds. Second, `lastError` is surfaced in state rather than thrown/alerted directly from the thunk, so the UI can render a dismissible toast/inline message driven by the same predictable state → reducer → view flow as everything else, instead of an imperative side-channel notification that's invisible to DevTools and hard to test.
