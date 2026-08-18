# Scenario: Typing an i18n translation dictionary

You're loading a translations JSON file where keys are translation keys (`"checkout.title"`, `"cart.empty"`, etc.) determined by content editors, not known statically, and values are always strings. You need to type this dictionary while being honest about the fact that a lookup for a nonexistent key is a real possibility (a typo in a component, or a translation not yet added for a new locale).

**Approach:** Use an index signature for the dictionary shape, but pair it with `noUncheckedIndexedAccess`-aware handling (or a defensive lookup helper) so missing keys don't silently produce `undefined` typed as `string`.

```typescript
interface TranslationDictionary {
  [key: string]: string;
}

const enTranslations: TranslationDictionary = {
  "checkout.title": "Checkout",
  "cart.empty": "Your cart is empty",
};

// Defensive lookup: treat the index signature's promise as unverified,
// and fall back explicitly rather than trusting `string` blindly.
function translate(dictionary: TranslationDictionary, key: string, fallback = key): string {
  const value = dictionary[key];
  return typeof value === "string" ? value : fallback;
}

console.log(translate(enTranslations, "checkout.title"));      // "Checkout"
console.log(translate(enTranslations, "checkout.missingKey")); // fallback: "checkout.missingKey"
```

The `typeof value === "string"` check inside `translate` looks redundant given `TranslationDictionary`'s index signature already claims every value is a `string` — but that claim is unchecked at runtime for keys that were never actually set (see `output-based/05-index-signature-arbitrary-access.md`). Writing the guard anyway makes `translate` safe regardless of whether `noUncheckedIndexedAccess` is enabled project-wide, which matters because translation dictionaries are exactly the kind of data (loaded from JSON, edited by non-engineers, prone to missing keys) where this soundness gap causes real production bugs — a missing key silently rendering `undefined` in the UI instead of a readable fallback string.
