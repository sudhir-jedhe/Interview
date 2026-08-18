# Narrowing object unions with in

```typescript
// No shared discriminant field, so `in` checks for a distinguishing property
interface EmailContact { email: string }
interface PhoneContact { phone: string }

function contactLine(c: EmailContact | PhoneContact): string {
  if ("email" in c) return `Email: ${c.email}`;
  return `Phone: ${c.phone}`;
}

console.log(contactLine({ phone: "555-0100" }));
```
