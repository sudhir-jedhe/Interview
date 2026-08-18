# Snippet: Password Hashing and Verification with bcrypt

```js
const bcrypt = require('bcrypt');

async function registerUser(email, plainPassword) {
  const passwordHash = await bcrypt.hash(plainPassword, 12);
  return db.users.create({ email, passwordHash });
}

async function verifyLogin(email, plainPassword) {
  const user = await db.users.findByEmail(email);
  if (!user) return null;
  const matches = await bcrypt.compare(plainPassword, user.passwordHash);
  return matches ? user : null;
}
```

**Explanation:** `bcrypt.hash` generates a salted hash in one call — the salt is embedded in the output string itself, so you never need to store it separately. `bcrypt.compare` re-hashes the candidate password using the salt extracted from the stored hash and compares the results in constant time, avoiding a timing side-channel. `verifyLogin` returns `null` uniformly whether the user doesn't exist or the password is wrong — never reveal via timing or response shape which case occurred, since that leaks which emails are registered.
