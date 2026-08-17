### Theory: The Auto-Waiting Engine
Before Playwright performs an action (like `.click()`), it automatically waits for the element to pass actionable checks: it must be Attached, Visible, Stable (not animating), Receives Events, and Enabled.
