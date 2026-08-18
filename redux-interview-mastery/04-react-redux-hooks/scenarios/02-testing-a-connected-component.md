# Scenario: Writing a test for a component that uses `useSelector`/`useDispatch`

**Problem:** A new engineer tries to unit-test `CartBadge` (which uses `useSelector` internally) by rendering it directly with React Testing Library, and gets the "could not find react-redux context value" error immediately — they assume Redux-connected components can't be unit tested without a complex mocking setup.

**Approach:**
1. Clarify the misconception: the error is simply `Provider` being required, per `theory/04-provider.md` — it's not evidence that testing connected components is inherently hard, just that the test needs to supply a real (if minimal) store, the same way the actual app does.
2. Build a small test-utility wrapper that renders any component inside a `<Provider>` backed by a real Redux store, configured with whatever `preloadedState` the specific test needs — no mocking of `useSelector`/`useDispatch` themselves required:
   ```jsx
   // test-utils.jsx
   import { render } from '@testing-library/react';
   import { Provider } from 'react-redux';
   import { configureStore } from '@reduxjs/toolkit';
   import rootReducer from '../rootReducer';

   export function renderWithStore(ui, { preloadedState, store = configureStore({ reducer: rootReducer, preloadedState }) } = {}) {
     return { store, ...render(<Provider store={store}>{ui}</Provider>) };
   }
   ```
3. Write the actual test using real store state and real dispatched actions, asserting on rendered output — treating the component as a black box that reads from and writes to a real (test-scoped) store, exactly like it does in production:
   ```jsx
   test('shows the correct item count and clears the cart on click', () => {
     const preloadedState = { cart: { items: [{ id: 1, name: 'Book' }, { id: 2, name: 'Pen' }] } };
     const { getByText, store } = renderWithStore(<CartBadge />, { preloadedState });

     expect(getByText('2')).toBeInTheDocument();

     fireEvent.click(getByText('Clear cart'));

     expect(store.getState().cart.items).toHaveLength(0);
   });
   ```
4. Point out the payoff: because the test uses a real store (not a mocked `useSelector`), it exercises the actual reducer logic too — if `clearCart`'s reducer case has a bug, this test catches it, whereas a test that mocked `useSelector`/`useDispatch` directly would only verify the component calls the right functions, not that the underlying state logic is actually correct.

This scenario reinforces a key theme from `04-provider.md`: because `Provider` is "just Context," swapping in a fresh, test-scoped store is straightforward and doesn't require special Redux-specific testing infrastructure beyond a thin `renderWithStore` helper most teams write once and reuse everywhere.
