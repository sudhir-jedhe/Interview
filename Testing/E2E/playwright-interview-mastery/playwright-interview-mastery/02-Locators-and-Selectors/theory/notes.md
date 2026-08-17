### Theory: Resilient Locators
Playwright enforces "User-Facing Locators." Relying on CSS classes (`.btn-primary`) or XPaths makes tests brittle. You should select elements the way a user sees them: by their accessible role, text, or label.
