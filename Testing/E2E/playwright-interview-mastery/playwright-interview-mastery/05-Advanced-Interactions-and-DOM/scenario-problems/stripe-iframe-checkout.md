**Scenario:** Automating a payment flow where the credit card inputs are hosted on a third-party Stripe iframe.
**Implementation:** Use `frameLocator` combined with `getByPlaceholder` to securely target the cross-origin elements without violating browser security policies.
