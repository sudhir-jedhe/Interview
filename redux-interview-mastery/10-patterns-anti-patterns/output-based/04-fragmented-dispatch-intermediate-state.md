## A `useEffect` fires between these two dispatches. What does it see, and is that a bug?

```javascript
// Component A, on form submit:
dispatch(setShippingAddress(address));
dispatch(setPaymentMethod(paymentMethod)); // separate dispatch, not batched together intentionally

// Component B, elsewhere in the tree, subscribed to the whole checkout slice:
function OrderSummaryBanner() {
  const checkout = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout.shippingAddress && !checkout.paymentMethod) {
      console.log('WARNING: shipping set but no payment method — showing incomplete banner');
    }
  }, [checkout]);

  return null;
}
```

**Answer:** Yes, this is a real, observable bug. Between the first dispatch (`setShippingAddress`) and the second (`setPaymentMethod`), React re-renders `OrderSummaryBanner` with `checkout.shippingAddress` set and `checkout.paymentMethod` still `null`, the `useEffect` condition is true, and the "incomplete banner" warning logs and (per the implied UI) briefly renders — even though from the user's perspective they just submitted a single, complete checkout form in one action.

**Why:** Fragmenting one logical operation ("submit checkout") into multiple separately-dispatched actions creates a real window — however brief — where state is in an intermediate, conceptually invalid combination that some other part of the app can observe and react to incorrectly. React 18's automatic batching can sometimes coalesce dispatches that happen within the same synchronous event handler or microtask into one render pass, which can mask this bug in some cases and make it appear intermittently — which is worse than a bug that fails consistently, because it becomes a "why does this only happen sometimes" investigation. The reliable fix isn't relying on batching behavior; it's not creating the intermediate state at all — combine `shippingAddress` and `paymentMethod` into one `checkoutSubmitted` action with both values in its payload, handled by one reducer case, so there is no dispatch between "before" and "after" during which `OrderSummaryBanner` (or anything else) can observe a half-updated checkout.
