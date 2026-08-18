# Snippet: ReturnType and Parameters typing a retry wrapper

```typescript
// Wrap any function with retry logic without redeclaring its signature.

function chargeCard(cardId: string, amountCents: number): { success: boolean; txnId: string } {
  return { success: true, txnId: `txn_${cardId}_${amountCents}` };
}

function withRetry<F extends (...args: any[]) => any>(
  fn: F,
  maxAttempts: number
): (...args: Parameters<F>) => ReturnType<F> {
  return (...args: Parameters<F>): ReturnType<F> => {
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return fn(...args);
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError;
  };
}

const reliableCharge = withRetry(chargeCard, 3);
const result = reliableCharge("card_123", 4999); // typed as { success: boolean; txnId: string }
```
