# Output-Based: httpOnly Cookie Inaccessible to JS — Verifying the XSS Mitigation

```js
// server sets: res.cookie('token', jwtToken, { httpOnly: true });

// in the browser console, on the same page:
console.log(document.cookie);
```

**Answer:** The output does not include the `token` cookie at all (other non-httpOnly cookies, if any, would still show).

**Why:** `httpOnly` cookies are deliberately excluded from `document.cookie` and any other JS-accessible API — the browser enforces this at the API level regardless of same-origin status. That's precisely the XSS mitigation: even if an attacker injects a malicious script into your page, that script cannot read the token. It's still sent automatically by the browser on matching requests, which is why CSRF protections (`SameSite`, CSRF tokens) are the complementary concern.
