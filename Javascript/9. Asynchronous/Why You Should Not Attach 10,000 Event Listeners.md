## Why You Should Not Attach 10,000 Event Listeners

**No, absolutely not.** Attaching an individual event listener to each of the 10,000 buttons is a major anti-pattern.

Doing so causes severe performance issues:

* **High Memory Overhead:** Each event listener consumes memory. Having 10,000 distinct listeners will bloat memory usage and slow down the browser.
* **Slow Initialization:** Binding 10,000 listeners at once can freeze or lag the UI during page load or table rendering.
* **Maintenance Nightmare:** If rows are dynamically added, removed, or re-rendered, you have to constantly attach and clean up listeners.

---

### The Solution: Event Delegation

Instead, you should use **Event Delegation**.

Because of a mechanism called **Event Bubbling**, when you click a button inside a table, the click event doesn't just stay on the button—it bubbles up through its parent elements (the `<td>`, the `<tr>`, the `<tbody>`, and finally the `<table>`).

Instead of 10,000 listeners, you attach **just one single event listener** to the parent table (or tbody) and check which button was clicked using `event.target`.

---

### Implementation Example (JavaScript)

```javascript
// 1. Attach a single event listener to the parent table container
const tableBody = document.getElementById('table-body');

tableBody.addEventListener('click', (event) => {
    // 2. Check if the clicked element is actually a button
    const button = event.target.closest('button');
    
    if (!button) return; // If clicked elsewhere in the row, ignore
    
    // 3. Extract data from the clicked button
    const rowId = button.dataset.id;
    console.log(`Action triggered for row: ${rowId}`);
    
    // Perform your specific logic here (e.g., delete, edit, view)
});

```

---

### Key Benefits of Event Delegation

* **Massive Performance Boost:** Only 1 event listener exists in memory instead of 10,000.
* **Dynamic-Friendly:** If you add or remove rows/buttons dynamically via pagination or infinite scroll, you **do not** need to re-bind listeners. The parent will automatically handle clicks for any new buttons.
