# Problem: Implement a type guard function that narrows a union by discriminant

## Problem statement

Given a discriminated union `Notification` (`EmailNotification | SmsNotification | PushNotification`, each tagged with a `channel` literal), implement a reusable, generic user-defined type guard `isChannel` that narrows a `Notification` to a specific variant based on a `channel` argument, and use it to safely extract that branch's data with full type safety — no casts.

## Requirements

- Discriminated union `Notification` with three variants tagged by `channel: "email" | "sms" | "push"`.
- `function isChannel<C extends Notification["channel"]>(notification: Notification, channel: C): notification is Extract<Notification, { channel: C }>`
- A function `extractRecipient` that uses `isChannel` to return the correct recipient field per channel, fully typed.
- Must compile under `strict: true`, with zero use of `any`.

## Solution

```typescript
interface EmailNotification {
  channel: "email";
  to: string;
  subject: string;
}

interface SmsNotification {
  channel: "sms";
  to: string;
  body: string;
}

interface PushNotification {
  channel: "push";
  deviceToken: string;
  title: string;
}

type Notification = EmailNotification | SmsNotification | PushNotification;

function isChannel<C extends Notification["channel"]>(
  notification: Notification,
  channel: C,
): notification is Extract<Notification, { channel: C }> {
  return notification.channel === channel;
}

function extractRecipient(notification: Notification): string {
  if (isChannel(notification, "email")) {
    return notification.to; // narrowed to EmailNotification
  }
  if (isChannel(notification, "sms")) {
    return notification.to; // narrowed to SmsNotification
  }
  if (isChannel(notification, "push")) {
    return notification.deviceToken; // narrowed to PushNotification
  }
  // notification here has type `never` — every channel handled above
  throw new Error("Unknown notification channel");
}

const emailNotif: Notification = { channel: "email", to: "ada@example.com", subject: "Welcome" };
const pushNotif: Notification = { channel: "push", deviceToken: "abc123", title: "New message" };

console.log(extractRecipient(emailNotif)); // "ada@example.com"
console.log(extractRecipient(pushNotif));  // "abc123"
```

### Why this is the correct approach

`isChannel`'s return type predicate, `notification is Extract<Notification, { channel: C }>`, tells TypeScript exactly how to narrow `notification` after a truthy check — `Extract<Notification, { channel: C }>` filters the union down to whichever variant(s) have a `channel` matching the generic `C`, and since `C` is inferred from the literal string passed as the second argument (`"email"`, `"sms"`, or `"push"`), each call to `isChannel` produces a differently-narrowed result at each call site. This avoids the more brittle alternative of writing three separate hand-rolled type guard functions (`isEmailNotification`, `isSmsNotification`, `isPushNotification`) that all do the same `channel === "..."` check — `isChannel` is a single, reusable, fully generic guard that scales to any number of `Notification` variants without additional code.
