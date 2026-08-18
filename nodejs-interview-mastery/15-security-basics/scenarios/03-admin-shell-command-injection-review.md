# Scenario: A code review turns up a "quick" admin feature that runs a shell command based on a filename from the request body

You're reviewing a PR that adds an endpoint letting admins trigger a backup script: `exec(\`./backup.sh ${req.body.filename}\`)`. It works in testing, but you flag it before merge.

**Approach:** Point out this is command injection even for "trusted" admin users — admin accounts get compromised too, and defense-in-depth matters. Rewrite to avoid the shell entirely and validate the filename against a strict pattern:

```js
const { execFile } = require('child_process');
const path = require('path');

app.post('/admin/backup', requireAdmin, (req, res) => {
  const { filename } = req.body;

  // allowlist: alphanumeric, dash, underscore, single extension — no path traversal, no shell metacharacters
  if (!/^[\w-]+\.tar$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const safePath = path.join('/backups', filename); // still ensure it resolves inside /backups
  execFile('./backup.sh', [safePath], (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Backup failed' });
    res.json({ ok: true, output: stdout });
  });
});
```

Even with `execFile` (no shell), still validate the filename — an unchecked value could otherwise be used for path traversal (`../../etc/passwd`) inside the script itself.
