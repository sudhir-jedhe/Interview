# Output-Based: Expired Token Handling

```js
const jwt = require('jsonwebtoken');

const token = jwt.sign({ sub: 'user1' }, 'secret', { expiresIn: '1ms' });

setTimeout(() => {
  try {
    const payload = jwt.verify(token, 'secret');
    console.log('payload:', payload);
  } catch (err) {
    console.log('error name:', err.name, '| message:', err.message);
  }
}, 50);
```

**Answer:** `error name: TokenExpiredError | message: jwt expired`

**Why:** `jwt.verify` checks the `exp` claim against the current time as part of verification, not just the signature. Even though the signature is perfectly valid (nothing was tampered with), an expired token still fails verification — `TokenExpiredError` is a distinct error type from `JsonWebTokenError` (bad signature/malformed), which matters if your middleware wants to give a specific "please refresh your token" response versus a generic "invalid token, log in again" response.
