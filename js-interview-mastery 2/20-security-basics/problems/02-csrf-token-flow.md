# Problem: A basic CSRF-token check flow

**Task:** Implement CSRF token generation, attaching it to a form, and server-side verification — as a small, dependency-free simulation with plain functions (no real Express/Node server required to understand the flow).

## Full simulation

```js
// --- crypto-quality randomness (browser or Node >= 19 both have crypto.randomUUID) ---
function generateCsrfToken() {
  return crypto.randomUUID();
}

// --- "server-side" in-memory session store (a real app would use a proper session store) ---
const sessionStore = new Map(); // sessionId -> { csrfToken, userId }

function createSession(userId) {
  const sessionId = crypto.randomUUID();
  const csrfToken = generateCsrfToken();
  sessionStore.set(sessionId, { csrfToken, userId });
  return { sessionId, csrfToken };
}

// --- "server" endpoint: renders a form, embedding the current session's CSRF token ---
function renderTransferForm(sessionId) {
  const session = sessionStore.get(sessionId);
  if (!session) throw new Error("Not authenticated");

  // In a real server this would be interpolated into actual HTML;
  // here we just return the data a template would use.
  return {
    html: `<form>
  <input type="hidden" name="csrfToken" value="${session.csrfToken}" />
  <input name="amount" />
  <button type="submit">Transfer</button>
</form>`,
    csrfToken: session.csrfToken, // what the legitimate page embeds
  };
}

// --- "server" endpoint: handles the state-changing POST, must verify the token ---
function handleTransferRequest(sessionId, submittedCsrfToken, amount) {
  const session = sessionStore.get(sessionId);
  if (!session) {
    return { status: 401, body: "Not authenticated" };
  }
  if (submittedCsrfToken !== session.csrfToken) {
    return { status: 403, body: "Invalid CSRF token" };
  }
  // Token matched -- this request definitely originated from a page that could
  // read the legitimate session's embedded token, which a cross-origin
  // attacker page cannot do (same-origin policy blocks reading it).
  return { status: 200, body: `Transferred $${amount}` };
}

// --- Demo: legitimate flow ---
const { sessionId, csrfToken } = createSession("user-42");
const form = renderTransferForm(sessionId);
console.log(form.html);

// The legitimate page submits using the token it was actually given:
const legitimateResult = handleTransferRequest(sessionId, form.csrfToken, 100);
console.log(legitimateResult); // { status: 200, body: "Transferred $100" }

// --- Demo: forged request from an "attacker" page ---
// The attacker's page can trigger a POST to /transfer (the browser will attach
// cookies automatically), but it has NO way to read form.csrfToken from the
// legitimate page (same-origin policy blocks that), so it can only guess or omit it.
const forgedResult = handleTransferRequest(sessionId, "guessed-or-missing-token", 9999);
console.log(forgedResult); // { status: 403, body: "Invalid CSRF token" }
```

## What each piece maps to in a real app

- `generateCsrfToken` → a cryptographically random, unguessable value (never a predictable sequence).
- `sessionStore` → your real session store (Redis, a signed cookie, a DB-backed session).
- `renderTransferForm` → a server route that renders a page/form, embedding the token as a hidden input (or a response header/meta tag for JS-driven `fetch` calls).
- `handleTransferRequest` → the state-changing endpoint (`POST /transfer`), which must reject the request if the submitted token doesn't exactly match the one issued for that session.

## Why this actually stops CSRF

An attacker's cross-origin page can cause the victim's browser to *send* a request to your `/transfer` endpoint (that's the "forgery" part — cookies get attached automatically), but same-origin policy prevents the attacker's JavaScript from *reading* the legitimate page's HTML/response to extract a valid `csrfToken`. Without the correct token, `handleTransferRequest` rejects the forged request — the cookie alone is not enough to authorize the action. See `../theory/03-cross-site-request-forgery-csrf.md` for how this compares to (and pairs with) the `SameSite` cookie defense.
