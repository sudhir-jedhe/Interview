### Theory: Bypassing the UI for Login
Logging in via the UI before every test is slow and consumes backend resources. Playwright allows you to authenticate once, save the cookies and local storage to a file, and inject that state into all subsequent tests.
