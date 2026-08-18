# Scenario: A 3-Person Startup Team Is Choosing State Management for an MVP

You're the first engineer at a pre-seed startup. The product is a small dashboard app — a handful of screens, a login flow, some settings, and a live-updating chart fed by a WebSocket. The team is 3 engineers, moving fast, and the biggest risk to the company is not shipping fast enough, not architectural purity. Someone on the team suggests "let's use Redux, it's the industry standard" out of habit from a previous job.

## Approach:

**1. Separate "industry standard" from "right for this app."** Push back gently: Redux being common at large companies doesn't make it the right default for a 3-person team building an MVP. The relevant question is what this app's state actually looks like, not what's most resume-recognizable.

**2. Categorize the state by type.** Most of the dashboard's data — user profile, settings, whatever the charts display — is server data being fetched and displayed, which argues for React Query or RTK Query regardless of what (if anything) is chosen for client state. The WebSocket-fed live chart data is genuinely client-side, frequently-updating state that needs a subscription mechanism, not a request/response cache.

**3. Recommend Zustand (or plain useState/Context) over Redux for the client-side pieces.** With 3 engineers, the "enforced conventions for many contributors" argument for Redux doesn't apply yet — everyone already talks to each other about how state is structured. Zustand's near-zero boilerplate (no Provider, no action-type ceremony) directly serves the team's actual constraint: ship fast. A `useWebSocketStore` (Zustand) that the chart component subscribes to, updated by the WebSocket's `onmessage` handler calling `set()` directly, is a handful of lines versus a thunk-orchestrated Redux slice with `connected`/`message`/`disconnected` action types.

**4. Use RTK Query or React Query for the server data regardless of the client-state decision.** This isn't really a "Redux vs alternatives" question at all — it's "don't hand-roll a cache," and it's true whether the rest of the app uses Redux, Zustand, or Context.

**5. Leave an explicit note for future-them.** Document the decision (in a README or ADR) as: "chose Zustand over Redux because team size and app complexity didn't justify the enforced-convention overhead; revisit if the team grows past ~8-10 engineers or state logic becomes complex enough that ad-hoc store organization becomes a liability." This makes the decision auditable and reversible rather than dogmatic — which is exactly the trade-off framing from `04-when-redux-still-wins.md`.

**Result:** the MVP ships faster with less boilerplate, server data gets proper caching/dedup behavior for free via a query library, and the team has an explicit, revisitable rationale rather than a cargo-culted default.
