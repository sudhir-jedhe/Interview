```typescript
abstract class PaymentMethod {
  abstract charge(amount: number): void;
}

const generic: PaymentMethod = new PaymentMethod();
```

Does this compile?

**Answer:** No. `new PaymentMethod()` fails with "Cannot create an instance of an abstract class."

**Why:** The whole point of `abstract` is to make a class instantiable only through a concrete subclass that fills in every abstract member — the compiler statically forbids `new` directly on an abstract class, regardless of whether you assign the result to a variable typed as the abstract class. Note that the *variable type* `PaymentMethod` is perfectly valid on its own (you can hold a reference typed as an abstract class, e.g. `const generic: PaymentMethod = new CreditCardPayment()`), it's specifically the `new PaymentMethod()` expression that's rejected. This is different from an interface, which was never instantiable in the first place and wouldn't even offer `new` as a legal expression to attempt.
