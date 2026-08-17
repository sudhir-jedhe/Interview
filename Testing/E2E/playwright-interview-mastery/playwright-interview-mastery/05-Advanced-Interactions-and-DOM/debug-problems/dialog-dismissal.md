**Problem:** The test freezes and times out because a browser `window.alert()` or `window.confirm()` popped up.
**Solution:** Playwright auto-dismisses dialogs by default. To accept them, you must add an event listener before triggering the dialog: `page.on('dialog', dialog => dialog.accept());`.
