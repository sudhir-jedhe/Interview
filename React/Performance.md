React.js Performance Patterns

🔹 1. Bundling, Compiling, Minifying and Tree-Shaking
👉 Cleans and shrinks code by removing unused parts for faster production builds.
👉 Ideal for production to speed up app load times.
👉 Improves Time to First Byte and initial render performance.

🔹 2. Static Import
👉 Immediately loads essential files when the app starts.
👉 Best for UI parts like headers and navbars that should appear instantly.
👉 Ensures key components are ready as soon as the page loads.

🔹 3. Dynamic Import
👉 Loads code only when triggered by user actions.
👉 Great for optional elements like modals or filters.
👉 Reduces initial load by deferring non-essential content.

🔹 4. Import on Visibility
👉 Loads components only when they enter the viewport.
👉 Useful for deferred content like charts, images, or videos.
👉 Spreads loading over time to keep performance smooth.

🔹 5. Route-based Splitting
👉 Splits code by route so each page loads only what's needed.
👉 Keeps app fast by reducing unnecessary code per page.
👉 Ideal for multi-page apps like dashboards or e-commerce sites.

🔹 6. Browser Hints
👉 Use <link> tags to preload critical assets early.
👉 Preload fonts or assets needed for the current page.
👉 Prefetch next-page resources to speed up navigation.
