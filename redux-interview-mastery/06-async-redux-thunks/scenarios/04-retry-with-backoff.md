# Scenario: A Flaky Third-Party API Needs Automatic Retries With Backoff

Your app calls a third-party shipping-rate API from a thunk when a user reaches the checkout shipping step. The API is known to intermittently return 503s under load — not a real failure, just transient unavailability — and currently every 503 immediately surfaces as "Could not calculate shipping, please try again," causing unnecessary support tickets and cart abandonment for what's usually a self-resolving blip.

**Approach:** Implement retry-with-exponential-backoff *inside* the thunk for a small, fixed number of attempts, only for retryable error conditions (5xx/network errors — never for 4xx client errors, which retrying won't fix), dispatching a visible "retrying..." state so the UI can show useful feedback instead of a silent multi-second pause.

```javascript
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error) {
  // retry on network failures and 5xx server errors; never on 4xx client errors
  return error.name === 'TypeError' || (error.status >= 500 && error.status < 600);
}

export function fetchShippingRates(cartId, { maxAttempts = 3 } = {}) {
  return async (dispatch, getState) => {
    dispatch({ type: 'shipping/pending' });

    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch(`/api/shipping-rates?cartId=${cartId}`);
        if (!res.ok) {
          const error = new Error(`Shipping rate request failed: ${res.status}`);
          error.status = res.status;
          throw error;
        }
        const rates = await res.json();
        dispatch({ type: 'shipping/fulfilled', payload: rates });
        return; // success — stop retrying
      } catch (err) {
        lastError = err;

        if (!isRetryable(err) || attempt === maxAttempts) {
          break; // either a permanent error, or we're out of attempts
        }

        const backoffMs = 300 * 2 ** (attempt - 1); // 300ms, 600ms, 1200ms, ...
        dispatch({ type: 'shipping/retrying', payload: { attempt, nextDelayMs: backoffMs } });
        await sleep(backoffMs);
      }
    }

    dispatch({ type: 'shipping/rejected', payload: lastError.message });
  };
}
```

```jsx
function ShippingStep() {
  const status = useSelector((s) => s.shipping.status); // 'loading' | 'retrying' | 'succeeded' | 'failed'
  const attempt = useSelector((s) => s.shipping.retryAttempt);

  if (status === 'retrying') return <p>Having trouble reaching our shipping partner, retrying (attempt {attempt})...</p>;
  // ...
}
```

The key design choices worth naming in review: retries are capped (`maxAttempts`) and only applied to genuinely transient-looking failures (`isRetryable`) — retrying a 400 (bad request) or 401 (unauthorized) would just waste time and repeat a failure that backoff can't fix. The backoff dispatches a distinct `retrying` status rather than staying silently on `loading`, because from the user's perspective "still loading, first try" and "we're on attempt 3 because something's flaky" are different situations worth different UI treatment (and different support-ticket triage, if this state is logged). This logic lives entirely inside the thunk — no changes to the reducer's core shape were needed beyond adding the `retrying` status and `retryAttempt` field, which is the kind of scoped, additive change retry logic should require.
