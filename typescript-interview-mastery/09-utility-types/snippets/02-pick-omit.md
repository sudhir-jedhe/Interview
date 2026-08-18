# Snippet: Pick and Omit deriving two views of the same type

```typescript
// Derive a summary view and a full-minus-secret view from one source type.

interface Invoice {
  id: string;
  customerName: string;
  amountCents: number;
  internalCostBasis: number;
  issuedAt: Date;
}

type InvoiceSummary = Pick<Invoice, "id" | "customerName" | "amountCents">;
type CustomerFacingInvoice = Omit<Invoice, "internalCostBasis">;

function toSummary(invoice: Invoice): InvoiceSummary {
  const { id, customerName, amountCents } = invoice;
  return { id, customerName, amountCents };
}

function toCustomerFacing(invoice: Invoice): CustomerFacingInvoice {
  const { internalCostBasis, ...rest } = invoice;
  return rest;
}
```
