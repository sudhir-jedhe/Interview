# Never Trust Client-Side Validation Alone

Client-side validation (JS form checks, HTML5 `required`/`pattern`) exists purely for UX — instant feedback without a round trip. It provides zero security, because anyone can bypass it: disable JavaScript, edit the DOM via DevTools, or send a crafted request directly to the API with `curl`/Postman, skipping the browser entirely. Every check that matters for security or data integrity must be re-enforced on the server, the only party the client can't tamper with.

This isn't a hypothetical risk to hedge against — it's guaranteed. A pentest or security review that flags bypassable client-side checks isn't reporting a bug in the validation logic itself; it's confirming the expected, unavoidable limit of anything that runs in a browser the user fully controls. The correct response is never "make the client-side check harder to bypass" (that's not achievable) but "ensure the server independently re-implements and enforces every check that actually matters."

See `../problems/03-input-validation-and-sanitization.md` for a concrete client + server validation pair for a form handling untrusted text.
