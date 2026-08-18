# Scenario: Incident Response After a Plaintext Password Breach

Your team stores plaintext passwords in the database "temporarily, we'll fix it later" — a breach just happened and you're doing incident response. You need to migrate every user to hashed passwords, force credential resets where necessary, and prevent this from recurring.

**Approach:**
Immediately hash all existing plaintext passwords with bcrypt in a one-time migration, invalidate all active sessions/tokens (force re-login everywhere), and require affected users to reset their password (since the plaintext was already exposed in the breach, hashing it now doesn't undo the exposure — only a reset with a new password does).

```js
const bcrypt = require('bcrypt');

async function migratePasswords() {
  const users = await db.users.findAllWithPlaintextPasswords();
  for (const user of users) {
    const hash = await bcrypt.hash(user.plaintextPassword, 12);
    await db.users.update(user.id, { passwordHash: hash, plaintextPassword: null });
  }
}

// force logout everywhere by bumping a global or per-user token version
await db.users.updateAll({ tokenVersion: db.raw('tokenVersion + 1') });

// send a mandatory password-reset email to every affected user
await notifyUsersOfBreachAndForceReset(users);
```
Going forward, add a code-review/lint check (or a schema constraint disallowing a `password` column entirely, only `passwordHash`) and document that credential handling always goes through bcrypt via a single shared utility — never reimplemented per-feature.
