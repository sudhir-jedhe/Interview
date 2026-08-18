# Scenario: A modal that closes on outside click but not inside click

**You want a modal dialog that closes when the user clicks outside of it, but clicking inside the modal (including on buttons within it) should not close it.**

**Approach:**
Attach a click listener to a full-screen overlay behind the modal, and rely on the fact that a click on the modal content itself won't reach the overlay's listener *if* the modal stops propagation — or, more robustly, check whether the click's target is outside the modal element using `contains()`, which avoids relying on `stopPropagation` scattered across child components.

```js
const overlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");

overlay.addEventListener("click", (event) => {
  if (!modal.contains(event.target)) {
    closeModal();
  }
});
```

This approach is preferred over `stopPropagation()` on every interactive element inside the modal, because it centralizes the "am I inside or outside" logic in one place instead of requiring every button/link inside the modal to remember to stop propagation.
