# Snippet: import type keeping a types-only dependency out of the bundle

// models.ts
```typescript
export interface Invoice {
  id: string;
  totalCents: number;
}

export function createInvoice(id: string, totalCents: number): Invoice {
  return { id, totalCents };
}
```

// invoiceView.ts
```typescript
import type { Invoice } from "./models"; // erased entirely — zero runtime footprint
import { createInvoice } from "./models"; // real runtime import

function renderInvoice(invoice: Invoice): string {
  return `Invoice ${invoice.id}: $${(invoice.totalCents / 100).toFixed(2)}`;
}

renderInvoice(createInvoice("inv_1", 4999));
```
