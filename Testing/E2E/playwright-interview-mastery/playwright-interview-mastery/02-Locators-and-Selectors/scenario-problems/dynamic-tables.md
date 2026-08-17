**Scenario:** Finding an element in a constantly shuffling data table.
**Implementation:** Never use `page.locator('tr:nth-child(3)')`. Always use `.filter({ hasText: 'Unique ID' })` to locate the exact row regardless of its physical position in the DOM.
