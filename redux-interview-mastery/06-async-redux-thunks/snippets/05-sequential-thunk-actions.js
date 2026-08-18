// A thunk that dispatches multiple actions in sequence, each step able to fail independently.
export function checkout(cart) {
  return async function (dispatch, getState) {
    dispatch({ type: 'checkout/started' });

    let paymentResult;
    try {
      paymentResult = await api.charge(cart.total, cart.paymentMethodId);
      dispatch({ type: 'checkout/paymentSucceeded', payload: paymentResult });
    } catch (err) {
      dispatch({ type: 'checkout/paymentFailed', payload: err.message });
      return; // stop the sequence — don't attempt to create an order without payment
    }

    let order;
    try {
      order = await api.createOrder({ cart, paymentId: paymentResult.id });
      dispatch({ type: 'checkout/orderCreated', payload: order });
    } catch (err) {
      dispatch({ type: 'checkout/orderFailed', payload: err.message });
      // payment already succeeded but order creation failed — surface this distinctly
      // so support/ops can reconcile, rather than silently losing the charge
      return;
    }

    try {
      await api.clearCart(cart.id);
      dispatch({ type: 'checkout/cartCleared' });
    } catch (err) {
      // non-critical failure — order succeeded, so don't roll anything back,
      // just log/report and let the cart clear on next load
      dispatch({ type: 'checkout/cartClearFailed', payload: err.message });
    }

    dispatch({ type: 'checkout/completed', payload: order });
  };
}
