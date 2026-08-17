# HOCs & Render Props

Before hooks existed, higher-order components (HOCs) and render props were the two standard patterns for sharing stateful logic between components — both still show up in older codebases and some libraries, so recognizing and reading them is a practical skill even though you'll rarely write new ones. This topic walks through a full `withLoading` HOC and an equivalent render-props component side by side, explains precisely why hooks superseded both (composability without wrapper hell, no prop-naming collisions between multiple enhancers), and identifies the narrow cases — mostly third-party library integration — where a HOC is still the right tool today.

## What's covered
- Higher-order components: definition, a full `withLoading` example
- Render props pattern: a full worked example
- Why hooks replaced both patterns (composability, wrapper hell, naming collisions)
- Remaining legitimate use cases for HOCs today

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
