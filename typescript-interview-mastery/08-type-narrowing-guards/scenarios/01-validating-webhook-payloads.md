# Validating untrusted webhook payloads before processing

Your service receives webhooks from a third-party payment provider. The request body arrives as `unknown` (or, realistically, whatever `JSON.parse` gives you, which TypeScript can't verify), and it can represent several different event types — `payment.succeeded`, `payment.failed`, `refund.issued` — each with a different shape. Processing a malformed or unexpected payload must fail loudly and early, not partway through business logic with a confusing runtime error.

**Approach:** Combine a user-defined type guard (to validate the payload is *some* recognized webhook shape at all) with a discriminated union and an exhaustive switch (to safely branch on the specific event type once validated). This two-layer structure separates "is this data trustworthy at all" from "given trustworthy data, which specific thing do I do."

```typescript
type WebhookEvent =
  | { type: "payment.succeeded"; amount: number; currency: string }
  | { type: "payment.failed"; reason: string }
  | { type: "refund.issued"; amount: number };

function isWebhookEvent(value: unknown): value is WebhookEvent {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.type !== "string") return false;

  switch (v.type) {
    case "payment.succeeded":
      return typeof v.amount === "number" && typeof v.currency === "string";
    case "payment.failed":
      return typeof v.reason === "string";
    case "refund.issued":
      return typeof v.amount === "number";
    default:
      return false;
  }
}

function assertNever(x: never): never {
  throw new Error(`Unhandled webhook type: ${JSON.stringify(x)}`);
}

function handleWebhook(rawBody: unknown): string {
  if (!isWebhookEvent(rawBody)) {
    throw new Error("Malformed or unrecognized webhook payload");
  }

  switch (rawBody.type) {
    case "payment.succeeded":
      return `Recorded payment of ${rawBody.amount} ${rawBody.currency}`;
    case "payment.failed":
      return `Payment failed: ${rawBody.reason}`;
    case "refund.issued":
      return `Refund of ${rawBody.amount} processed`;
    default:
      return assertNever(rawBody);
  }
}
```

`isWebhookEvent` is where all the "untrusted input" risk is concentrated — everything past that check is fully typed and exhaustively verified by the compiler. The `assertNever` default branch inside `handleWebhook` also guards against a subtler bug: if a new event type is added to `WebhookEvent` but `handleWebhook`'s switch isn't updated to match, the code fails to compile at exactly that point — separate from, and in addition to, `isWebhookEvent`'s runtime validation, which is checking a different thing (is this specific object well-formed) than the exhaustiveness check (have all known variants been handled in code).
