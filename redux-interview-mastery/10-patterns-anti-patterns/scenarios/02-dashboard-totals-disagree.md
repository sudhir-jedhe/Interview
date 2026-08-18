# Scenario: Two Parts of a Dashboard Disagree About the Same Total

A finance dashboard shows an invoice's `totalAmount` in two places: the invoice detail header, and a summary sidebar. A support ticket reports the two numbers sometimes disagree for the same invoice, and the discrepancy appears to correlate with recently editing a line item's quantity.

## Approach:

**1. Locate every place `totalAmount` is written, not just read.** Grep the codebase for `totalAmount =` (assignment, not just usage). The finding: `totalAmount` is a stored field, updated inside three different reducer cases (`lineItemAdded`, `lineItemQuantityChanged`, `lineItemRemoved`) plus a fourth, less obvious path — a bulk "apply discount" thunk that directly sets `state.totalAmount = newDiscountedTotal` without going through the same recalculation logic as the other three.

**2. Confirm the hypothesis: this is stored derived data, and one of its four write sites has drifted.** The detail header reads `state.invoice.totalAmount` directly; the sidebar, it turns out, computes its own total independently from `state.invoice.lineItems` via a different, ad-hoc calculation — which is *also* wrong in its own way (it's not applying the discount at all). Two independent, duplicated implementations of "compute the total," both capable of being wrong in different ways, is exactly the failure mode `totalAmount`-as-derived-data warns about.

**3. Fix by deleting `totalAmount` as a stored field, and deleting the sidebar's separate ad-hoc calculation.** Replace both with one memoized selector, `selectInvoiceTotal`, that computes the total from `lineItems` and the applied discount every time, used by both the header and the sidebar.

```javascript
const selectLineItems = (state) => state.invoice.lineItems;
const selectDiscount = (state) => state.invoice.discount;
const selectInvoiceTotal = createSelector(
  [selectLineItems, selectDiscount],
  (lineItems, discount) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal * (1 - discount);
  }
);
```

**4. Verify the fix eliminates the bug class, not just this instance.** Because there is now exactly one function that computes the total, and both UI locations call it, they cannot disagree — there's no second implementation to drift out of sync with the first. Confirm by re-running the exact repro from the support ticket (add a line item, change its quantity, apply a discount) and checking both UI locations read identical values at every step.

**5. Generalize the finding for the team.** Any field name that reads like a *computation over other fields* (`totalAmount`, `itemCount`, `isValid`, `remainingBudget`) is a candidate for this exact bug class and should be scrutinized in review — the fix is nearly always "delete the field, add a memoized selector."

**Result:** the two-different-numbers bug is fixed at its root (one derivation, not two), and the team gains a concrete example to point to in future code reviews when a new PR proposes storing a computed field.
