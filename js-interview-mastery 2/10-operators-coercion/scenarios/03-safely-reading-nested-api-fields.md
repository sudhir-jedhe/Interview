# Scenario: Safely reading deeply nested, possibly-missing API response fields

You're consuming a third-party API response where `response.data.user.profile.avatarUrl` might be missing at any level depending on the user's account state, and the old code (`response.data && response.data.user && response.data.user.profile && response.data.user.profile.avatarUrl`) is error-prone to extend and doesn't have a fallback. Rewrite it robustly.

**Approach:** Combine optional chaining with nullish coalescing for a concise, safe read with a fallback:

```js
const avatarUrl = response?.data?.user?.profile?.avatarUrl ?? "/default-avatar.png";
```

This short-circuits to `undefined` the instant any link in the chain is `null`/`undefined`, without throwing, and `??` supplies the fallback only for that genuinely-missing case — not for an intentionally empty string if the API ever returns `avatarUrl: ""` to mean "no avatar, explicitly." If an empty string *should* also trigger the fallback (common for image URLs, since `""` is not a usable src), you'd need `|| "/default-avatar.png"` instead, or an explicit check — worth clarifying against the API contract rather than guessing.
