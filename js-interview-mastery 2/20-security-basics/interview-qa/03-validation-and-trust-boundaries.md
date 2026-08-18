# Interview Q&A: Validation & Trust Boundaries

**Q: Why is client-side validation never sufficient on its own?**
Anything running in the browser is fully controllable by the end user — they can disable JavaScript, edit the DOM/form attributes via DevTools, or bypass the browser entirely by sending crafted requests directly to the API with tools like `curl` or Postman. Client-side checks are valuable for instant UX feedback, but every check that actually matters for security, data integrity, or business rules must be independently enforced on the server, which is the only party the client can't tamper with.
