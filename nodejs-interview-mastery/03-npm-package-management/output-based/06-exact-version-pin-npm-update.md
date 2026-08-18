# Version Pinned with No Range Operator

```json
{ "dependencies": { "moment": "2.29.4" } }
```

A teammate runs `npm update` hoping to get the latest `2.x` patch release. What happens?

**Answer:** Nothing changes — `moment` stays at exactly `2.29.4`.

**Why:** With no `^` or `~` prefix, the version string is treated as an **exact pin** — npm will never install a different version via `npm update`, even a patch release, unless the `package.json` range itself is edited or `npm install moment@latest` is run explicitly.
