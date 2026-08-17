# Design Patterns & Anti-Patterns

Good React code isn't about knowing every hook — it's about structuring components so state lives in the right place, JSX stays readable, and components stay small enough to reason about. This topic names the classic patterns worth recognizing (compound components, controlled/uncontrolled, container/presentational) and, more importantly, walks through the anti-patterns that show up constantly in real codebases and code review, each with a concrete before/after fix. The emphasis is on recognizing *why* something is a problem, since that's what interviewers are actually probing for.

## What's covered
- Compound components, controlled/uncontrolled components, container/presentational (and why the last one is less common post-hooks)
- Prop drilling vs composition/context
- Deeply nested ternaries in JSX
- Mutating state directly
- Using array index as key for dynamic lists
- Components that do too much
- Overusing `useEffect` for derivable values
- Fetching in every component instead of lifting/caching

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
