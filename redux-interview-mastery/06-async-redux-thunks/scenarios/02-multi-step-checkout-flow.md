# Scenario: A Checkout Flow Where Step 2 Failing Shouldn't Undo Step 1

An e-commerce checkout needs to: (1) charge the customer's card, (2) create the order record, (3) send a confirmation email, (4) clear the cart. Each step is a separate API call. The current implementation is one giant `try/catch` around all four calls, and support has flagged a nasty failure mode: when step 3 (email) times out, the whole `catch` block fires a generic "Checkout failed, please try again" message and re-enables the "Place Order" button — so customers who were already successfully charged and had an order created sometimes click it again, get charged a second time, and open a duplicate order.

**Approach:** Treat each step as independently fallible with its own dispatched outcome, and make the thunk's logic explicit about which failures are "fatal, stop everything" versus "non-critical, continue and just report it" — payment and order creation are fatal-if-failed-but-must-not-retry-blindly; email and cart-clearing are non-critical.

```javascript
export function checkout(cart, paymentMethodId) {
  return async (dispatch, getState) => {
    dispatch({ type: 'checkout/started' });

    // Step 1: payment — fatal if it fails, and safe to let the user retry
    let payment;
    try {
      payment = await api.chargeCard(cart.total, paymentMethodId);
      dispatch({ type: 'checkout/paymentSucceeded', payload: payment });
    } catch (err) {
      dispatch({ type: 'checkout/paymentFailed', payload: err.message });
      dispatch({ type: 'checkout/canRetry', payload: true }); // nothing charged/created yet
      return;
    }

    // Step 2: order creation — fatal if it fails, but must NOT allow a blind retry,
    // because the card has already been charged
    let order;
    try {
      order = await api.createOrder({ cart, paymentId: payment.id });
      dispatch({ type: 'checkout/orderCreated', payload: order });
    } catch (err) {
      dispatch({ type: 'checkout/orderCreationFailed', payload: err.message });
      // do NOT set canRetry — the UI must show "contact support," not "try again",
      // to avoid a second charge for the same order
      dispatch({ type: 'checkout/canRetry', payload: false });
      dispatch({ type: 'checkout/needsSupportIntervention', payload: { paymentId: payment.id } });
      return;
    }

    // Step 3: confirmation email — non-critical, order already exists and is valid
    try {
      await api.sendConfirmationEmail(order.id);
      dispatch({ type: 'checkout/emailSent' });
    } catch (err) {
      dispatch({ type: 'checkout/emailFailed', payload: err.message }); // logged, not fatal
    }

    // Step 4: clear cart — non-critical, order already exists and is valid
    try {
      await api.clearCart(cart.id);
      dispatch({ type: 'checkout/cartCleared' });
    } catch (err) {
      dispatch({ type: 'checkout/cartClearFailed', payload: err.message }); // logged, not fatal
    }

    dispatch({ type: 'checkout/completed', payload: order });
  };
}
```

The core fix has nothing to do with async mechanics and everything to do with correctly modeling which failures are recoverable-by-retry versus which represent a state (money already moved) that makes a naive retry actively dangerous. A single blanket `try/catch` collapses that distinction into one undifferentiated "failed" bucket. Splitting each step into its own try/catch with a distinct dispatched outcome lets the reducer (and the UI reading `canRetry`/`needsSupportIntervention`) make the correct decision per failure mode — "let them click again" only when nothing irreversible has happened yet, and "route to support, don't show a retry button" once a charge exists.
