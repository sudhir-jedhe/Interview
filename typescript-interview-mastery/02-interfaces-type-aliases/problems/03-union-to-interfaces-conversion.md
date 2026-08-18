# Problem: Convert a type-alias union to interfaces where possible, and explain where it's not possible

## Problem statement

Given a type-alias union describing a notification payload — `type Notification = EmailNotification | SmsNotification | PushNotification` where each variant is an object shape — convert as much of this to `interface` declarations as TypeScript allows, and clearly explain the parts of the original design that fundamentally cannot be expressed with `interface` alone.

## Requirements

- Original: a `type` alias union of three object-shaped variants, each with a discriminant field.
- Convert each individual variant to an `interface`.
- Attempt to convert the union itself and explain precisely why `interface` cannot express it.
- Show the correct hybrid solution: `interface` for each variant, `type` for the union that combines them.
- Must compile under `strict: true`.

## Solution

```typescript
// --- Original: everything expressed as type aliases ---
type EmailNotificationAlias = { channel: "email"; to: string; subject: string };
type SmsNotificationAlias = { channel: "sms"; to: string; body: string };
type PushNotificationAlias = { channel: "push"; deviceToken: string; title: string };
type NotificationAlias = EmailNotificationAlias | SmsNotificationAlias | PushNotificationAlias;

// --- Step 1: each individual variant CAN become an interface ---
// Each one is a plain object shape — interfaces handle this identically to type aliases.
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

// --- Step 2: the union itself CANNOT become an interface ---
// There is no `interface Notification = EmailNotification | SmsNotification | PushNotification`.
// Interfaces describe a single object shape (or extend/merge with others) — they cannot
// represent "one of several alternative shapes." A union is fundamentally a `type`-only concept.
type Notification = EmailNotification | SmsNotification | PushNotification;

function send(notification: Notification): string {
  switch (notification.channel) {
    case "email":
      return `Emailing ${notification.to}: ${notification.subject}`;
    case "sms":
      return `Texting ${notification.to}: ${notification.body}`;
    case "push":
      return `Pushing to ${notification.deviceToken}: ${notification.title}`;
  }
}

console.log(send({ channel: "email", to: "ada@example.com", subject: "Welcome" }));
```

### Why this is the correct approach, and where conversion is impossible

Each individual variant is a plain object shape, so it converts cleanly to `interface` with zero loss of meaning — `interface` and `type` are interchangeable for single object shapes, as covered in `theory/01-interface-vs-type-alias-syntax.md`. The union itself is where conversion is fundamentally impossible: `interface` syntax has no notation for "this is A or B or C" — it can only describe a single, mergeable object contract (or extend other single shapes). The discriminated union pattern (a shared `channel` literal field enabling exhaustive `switch` narrowing, covered fully in `04-union-intersection-types`) *requires* a `type` alias for the top-level union, even when every individual member is comfortably expressed as an `interface`. The correct real-world pattern, shown above, is exactly this hybrid: `interface` for each concrete variant (getting the benefit of potential future extension/merging per-variant), `type` for the union that ties them together (the only construct capable of expressing "one of these alternatives").
