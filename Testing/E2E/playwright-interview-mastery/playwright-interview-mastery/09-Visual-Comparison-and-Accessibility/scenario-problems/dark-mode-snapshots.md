**Scenario:** You need to ensure the application renders correctly in both Light and Dark themes.
**Implementation:** Use `test.use({ colorScheme: 'dark' })` in your test block to force the browser engine to emulate user OS dark mode preferences before taking the snapshot.
