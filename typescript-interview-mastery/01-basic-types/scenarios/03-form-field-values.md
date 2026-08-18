# Scenario: Typing a dynamic form's field values

You're building a checkout form where field values come from various `<input>` elements. Some fields are always present (`email`, `cardNumber`), one is genuinely optional (`promoCode`), and the whole form payload arrives as an event target you don't control the shape of ahead of time.

**Approach:** Distinguish between values you own the shape of (annotate precisely, use `?` for optional fields) and values arriving from the DOM/browser (treat as `unknown` until read and coerced). Avoid `any` for the DOM event, since it would silently permit typos like `event.target.vlaue`.

```typescript
interface CheckoutFormValues {
  email: string;
  cardNumber: string;
  promoCode?: string; // genuinely optional — user may not have one
}

function readFormValues(form: HTMLFormElement): CheckoutFormValues {
  const formData = new FormData(form);

  // FormData.get() returns `FormDataEntryValue | null` — narrow before use
  const email = formData.get("email");
  const cardNumber = formData.get("cardNumber");
  const promoCode = formData.get("promoCode");

  if (typeof email !== "string" || typeof cardNumber !== "string") {
    throw new Error("Missing required form fields");
  }

  return {
    email,
    cardNumber,
    promoCode: typeof promoCode === "string" && promoCode.length > 0 ? promoCode : undefined,
  };
}

function submitCheckout(values: CheckoutFormValues): void {
  console.log(`Charging card ending in ${values.cardNumber.slice(-4)}`);
  if (values.promoCode) {
    console.log(`Applying promo: ${values.promoCode}`);
  }
}
```

The `promoCode?: string` optional property (rather than `string | undefined` required) correctly models "this key might not even be relevant to think about" versus "this key exists but its value might be absent" — for a form-values object being spread or serialized, an optional property keeps `JSON.stringify` output clean by omitting the key entirely when there's no promo code, rather than emitting `"promoCode": null` or forcing every caller to check for both `undefined` and missing keys.
