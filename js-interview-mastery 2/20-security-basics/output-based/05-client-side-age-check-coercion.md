# Output: A client-side age check relies on loose-comparison coercion (and is bypassable regardless)

```js
function validateAge(age) {
  return age >= 18;
}

// Client-side form check:
if (validateAge(document.getElementById("age").value)) {
  submitOrder();
}
```

**Answer:**
(No single deterministic console output — this traces a reasoning question.)

**Why:** `document.getElementById("age").value` is always a **string**, so `age >= 18` relies on JavaScript's loose comparison coercing the string to a number (`"20" >= 18` is `true`), which happens to work for well-formed input but silently misbehaves for edge cases (`"" >= 18` is `false` since `Number("")` is `0`, but `"18abc" >= 18` is `false` too since `Number("18abc")` is `NaN`, and `NaN` comparisons are always `false`). More importantly, this check runs entirely in the browser and can be bypassed by disabling JS or calling the server API directly — it provides no actual security guarantee regardless of whether the coercion logic is correct.
