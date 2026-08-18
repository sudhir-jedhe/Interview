// A plain, non-memoized selector — just a named, reusable function of `state`.
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectIsLoggedIn = (state) => state.auth.token !== null;

// Usage with react-redux's useSelector:
// const items = useSelector(selectCartItems);
// const count = useSelector(selectCartItemCount);

// Selectors are trivially testable without a store or components:
if (require.main === module) {
  const fakeState = { cart: { items: [{ id: 1 }, { id: 2 }] }, auth: { token: 'abc' } };
  console.log(selectCartItemCount(fakeState)); // 2
  console.log(selectIsLoggedIn(fakeState)); // true
}
