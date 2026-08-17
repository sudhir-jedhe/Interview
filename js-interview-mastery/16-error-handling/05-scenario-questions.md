# Scenario Questions: Error Handling

## 1. You're building a function that fetches a user profile from an API. If the network fails, you want to retry twice with a delay before giving up and showing a fallback UI. How do you implement this, and what edge cases matter?

**Approach:**
Wrap the fetch in a retry loop with `try/catch` around each `await`, and only propagate the error after retries are exhausted. Edge cases: distinguishing a network failure from a valid-but-error HTTP response (fetch doesn't reject on 404/500 — you must check `res.ok`), avoiding infinite retries, and not retrying on errors that won't be fixed by retrying (e.g., a 400 Bad Request).

```js
async function fetchWithRetry(url, retries = 2, delayMs = 500) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // Only retry on server errors; don't retry client errors like 400/404
        if (res.status >= 500 && attempt < retries) {
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }
        throw new Error(`Request failed: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err; // exhausted retries, propagate
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}
```

## 2. You have a checkout flow where a payment API call must either fully succeed or leave the system in a state the user can recover from — no half-charged, half-failed orders. How do you structure the error handling?

**Approach:**
Treat this as fail-fast at the point of ambiguity: if you can't confirm the outcome, don't assume success or silently retry a payment (that risks double-charging). Use a `try/catch` around the charge call, log the raw error with context (order id, amount) for support/ops, and surface a clear "we couldn't confirm this succeeded, do not resubmit" state to the user rather than a generic error. Idempotency keys on the payment request are the real fix — they let a safe retry be distinguished from a duplicate charge.

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

## 3. Your app has a background sync feature using `setInterval` that pushes local changes to a server every 30 seconds. Occasionally it throws and silently kills future syncs. How do you make it resilient?

**Approach:**
The core bug is usually that an uncaught throw inside the interval's callback doesn't stop `setInterval` itself, but if the callback is `async` and rejects, nothing observes it — and if a synchronous throw happens before an internal state flag resets, subsequent ticks can get stuck. Wrap each tick's logic in `try/catch`, ensure a `finally` resets any in-flight flags, and add a global `unhandledrejection` listener as a safety net for anything that slips through.

```js
let syncing = false;

async function syncTick() {
  if (syncing) return; // avoid overlapping ticks
  syncing = true;
  try {
    await pushLocalChanges();
  } catch (err) {
    console.error("sync failed, will retry next tick:", err);
    reportToMonitoring(err);
  } finally {
    syncing = false; // always released, even after an error
  }
}

setInterval(syncTick, 30000);

window.addEventListener("unhandledrejection", (event) => {
  console.error("unexpected unhandled rejection:", event.reason);
  reportToMonitoring(event.reason);
});
```

## 4. You're writing a form validation library used by other teams. Validators can throw for many different reasons (missing field, wrong type, custom business rule). How do you design the error types so consumers can handle specific cases without fragile string matching?

**Approach:**
Define a small hierarchy of custom `Error` subclasses with a stable `name`/`code`, so callers can branch with `instanceof` or a `code` property instead of parsing `message` text (which is for humans and may change wording).

```js
class ValidationError extends Error {
  constructor(message, code, field) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
    this.field = field;
  }
}

class RequiredFieldError extends ValidationError {
  constructor(field) {
    super(`${field} is required`, "REQUIRED_FIELD", field);
    this.name = "RequiredFieldError";
  }
}

function validateAge(value) {
  if (value == null) throw new RequiredFieldError("age");
  if (typeof value !== "number") {
    throw new ValidationError("age must be a number", "WRONG_TYPE", "age");
  }
}

try {
  validateAge(null);
} catch (err) {
  if (err instanceof RequiredFieldError) {
    console.log(`Please fill in ${err.field}`);
  } else if (err instanceof ValidationError) {
    console.log(`Invalid value for ${err.field}: ${err.code}`);
  } else {
    throw err; // not ours, don't swallow unknown errors
  }
}
```
