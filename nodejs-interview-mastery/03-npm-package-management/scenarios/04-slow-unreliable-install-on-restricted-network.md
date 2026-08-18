# A New Engineer's npm install Takes 10 Minutes and Fails on a Restricted Network

Onboarding docs say "just run `npm install`" but it's slow and occasionally fails outright on the new hire's restricted network.

**Approach:** Since a full `package-lock.json` already exists and pins exact versions, recommend `npm ci` instead of `npm install` — it skips redundant version-resolution network calls (registry metadata lookups for ranges) since every version is already pinned, generally making it noticeably faster and more deterministic. For proxy/network issues specifically, configure npm's registry/proxy settings explicitly rather than relying on inherited environment config:

```bash
npm config set proxy http://corporate-proxy:8080
npm config set https-proxy http://corporate-proxy:8080
npm config set registry https://registry.npmjs.org/
```

If the org has an internal registry mirror (Verdaccio, Artifactory, etc.), point `.npmrc` at it for both speed and reliability, and commit a project-level `.npmrc` with the registry setting so every developer/CI machine gets the same configuration without manual setup. See `../theory/03-package-lock-and-reproducibility.md` for why `npm ci` is faster when a valid lock file already exists.
