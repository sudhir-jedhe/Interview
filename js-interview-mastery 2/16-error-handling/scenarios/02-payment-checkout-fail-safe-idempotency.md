**You have a checkout flow where a payment API call must either fully succeed or leave the system in a state the user can recover from — no half-charged, half-failed orders. How do you structure the error handling?**

**Approach:**
Treat this as fail-fast at the point of ambiguity: if you can't confirm the outcome, don't assume success or silently retry a payment (that risks double-charging). Use a `try`/`catch` around the charge call, log the raw error with context (order id, amount) for support/ops, and surface a clear "we couldn't confirm this succeeded, do not resubmit" state to the user rather than a generic error. Idempotency keys on the payment request are the real fix — they let a safe retry be distinguished from a duplicate charge.

```js
async function charge(order) {
  try {
    const result = await paymentApi.charge({
      amount: order.total,
      idempotencyKey: order.id, // same order retried == same charge, not double-charged
    });
    return { status: "success", result };
  } catch (err) {
    logPaymentError(order.id, err); // for ops/support to investigate
    if (err.code === "NETWORK_TIMEOUT") {
      // Ambiguous outcome — do NOT retry blindly, do NOT assume failure
      return { status: "unknown", message: "Please check your order status before retrying." };
    }
    return { status: "failed", message: "Payment was declined." };
  }
}
```
