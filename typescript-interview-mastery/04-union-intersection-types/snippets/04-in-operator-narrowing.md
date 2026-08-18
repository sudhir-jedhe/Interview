# Snippet: Narrowing a union of interfaces with `in`

Shows the `in` operator distinguishing two object shapes with no shared discriminant field.

```typescript
interface EmailContact {
  email: string;
}

interface PhoneContact {
  phoneNumber: string;
}

function contactLabel(contact: EmailContact | PhoneContact): string {
  if ("email" in contact) {
    return `Email: ${contact.email}`;
  }
  return `Phone: ${contact.phoneNumber}`;
}

console.log(contactLabel({ email: "ada@example.com" }));
console.log(contactLabel({ phoneNumber: "555-0100" }));
```
