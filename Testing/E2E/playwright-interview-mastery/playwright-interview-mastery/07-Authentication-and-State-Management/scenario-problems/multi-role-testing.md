**Scenario:** You need to test that an Admin can see the delete button, but a Viewer cannot.
**Implementation:** Generate two different storage state files (`adminState.json` and `viewerState.json`). Use `test.use({ storageState: 'viewerState.json' })` at the top of the relevant test blocks.
