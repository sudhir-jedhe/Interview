## Components & Props

Function components are the unit of composition in React: plain JavaScript functions that accept a single `props` object and return JSX. This topic covers how props flow one-way from parent to child, why they're treated as read-only, the special `children` prop and composition patterns it enables, the prop-drilling problem that emerges in deeper trees, and practical patterns for default values and composing smaller components into larger ones. It also draws the line between "controlled" components (driven entirely by props/state from above) and "presentational" ones (pure rendering, no own logic), which is a distinction that comes up constantly in real code reviews and architecture discussions.

**What's covered:**
- Function components and the props object
- Props as read-only / immutable
- `props.children` and composition
- Prop drilling and why it becomes a problem
- Default prop values
- Composing components (building larger UI from smaller pieces)
- Controlled vs. presentational component thinking
- PropTypes vs. TypeScript for prop validation (brief mention)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
