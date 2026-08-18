# Scenario: Unauthorized account actions after users click links from suspicious emails

**Your app's login form sets a session cookie, and users have reported unauthorized actions happening on their accounts after clicking links from suspicious emails. What's the likely vulnerability, and how do you fix it?**

**Approach:**
This is a classic CSRF pattern: the session cookie is being automatically attached by the browser to requests triggered from a malicious external page/email, and the server has no way to distinguish a legitimate same-site request from a forged cross-site one. Fix it in layers: set `SameSite=Lax` (or `Strict` for highly sensitive actions) on the session cookie so the browser won't send it on cross-site requests, and add CSRF tokens to state-changing forms/requests as defense-in-depth, validated server-side against the user's session.

```js
// Server: setting the session cookie
res.cookie("session", token, { httpOnly: true, secure: true, sameSite: "lax" });

// Server: issuing and validating a CSRF token for sensitive forms
app.get("/transfer-form", (req, res) => {
  const csrfToken = generateCsrfToken(req.session);
  res.render("transfer", { csrfToken });
});

app.post("/transfer", (req, res) => {
  if (req.body.csrfToken !== req.session.csrfToken) {
    return res.status(403).send("Invalid CSRF token");
  }
  performTransfer(req.body);
});
```

See `../problems/02-csrf-token-flow.md` for a full generate/attach/verify simulation.
