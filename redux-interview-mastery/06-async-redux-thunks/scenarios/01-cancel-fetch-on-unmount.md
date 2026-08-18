# Scenario: "Can't Perform a State Update on an Unmounted Component"

A product details page fetches product data on mount via a thunk. QA reports intermittent React warnings — "Can't perform a state update on an unmounted component" — when users navigate away quickly (e.g., clicking a product, then immediately clicking "back" before the page finishes loading). Occasionally this also manifests as stale data flashing onto the *next* product's page for a split second.

**Approach:** Thread an `AbortController` through the fetch, tied to the component's mount lifetime, and abort it in the `useEffect` cleanup function — then have the thunk treat an `AbortError` as a silent cancellation, not a real failure.

```javascript
// productThunks.js
export function fetchProduct(id, { signal } = {}) {
  return async (dispatch, getState) => {
    dispatch({ type: 'product/pending', payload: { id } });
    try {
      const res = await fetch(`/api/products/${id}`, { signal });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      // guard: don't apply a response for a product the user has since navigated away from
      if (getState().product.currentId !== id) return;
      dispatch({ type: 'product/fulfilled', payload: data });
    } catch (err) {
      if (err.name === 'AbortError') {
        // expected — the component unmounted or the id changed; not a user-facing error
        return;
      }
      dispatch({ type: 'product/rejected', payload: err.message });
    }
  };
}
```

```jsx
// ProductPage.jsx
function ProductPage({ productId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'product/currentIdSet', payload: productId }); // record which id is "current"
    dispatch(fetchProduct(productId, { signal: controller.signal }));

    return () => controller.abort(); // fires on unmount AND whenever productId changes
  }, [productId, dispatch]);

  // ...render using useSelector
}
```

Two mechanisms are doing complementary work here, and it's worth being explicit about why both are needed rather than picking just one: the `AbortController` actually cancels the underlying network request (saving bandwidth and avoiding a wasted server-side response), while the `currentId` state guard inside the thunk is a belt-and-braces check for the case where the response arrives just barely before the abort takes effect, or in any similar race — even a "successfully" resolved fetch shouldn't be applied to state if the user has since navigated to a different product. Relying on `AbortController` alone is usually sufficient for the unmount case, but the state guard also correctly handles fast id-changes *without* full unmounts (e.g., clicking between two product recommendations on the same page, where the `useEffect` cleanup fires and a new effect runs with a new `productId`, but there's a brief window where an old request could still resolve).
