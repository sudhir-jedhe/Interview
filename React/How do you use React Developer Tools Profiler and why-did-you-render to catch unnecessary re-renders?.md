Catching and fixing unnecessary re-renders in React requires measuring **when** and **why** a component renders. Two primary tools are used for this:

1. **React Developer Tools Profiler** (Native browser extension — Visual & Graphical analysis)
2. **`why-did-you-render` (WDYR)** (npm library — Console-based automated detection)

---

### Part 1: React Developer Tools Profiler

The React Profiler records performance metrics for every component render in a recorded session.

#### Step 1: Enable Render Reason Tracking

Before profiling, you must turn on reason recording in the extension settings:

1. Open Chrome DevTools $\rightarrow$ Select the **⚛️ Profiler** tab.
2. Click the **Gear/Settings icon** (⚙️) in the top right.
3. Check **"Record why each component rendered while profiling."**

```text
⚙️ Settings ──► Profiling Tab ──► Check "Record why each component rendered"

```

#### Step 2: Record a Session

1. Click the **Blue Record Button** (⏺️).
2. Perform the UI interaction causing lag (e.g., typing in a text field, toggling a checkbox).
3. Click the **Record Button** again to stop.

#### Step 3: Analyze the Flamegraph & Commit Chart

```text
┌────────────────────────────────────────────────────────┐
│ PROFILER FLAMEGRAPH VIEW                               │
├────────────────────────────────────────────────────────┤
│ Commit Bar Chart:  | | █ | | |  (Tall/Yellow = Slow)  │
│                                                        │
│ [ ParentComponent ] (Yellow = Re-rendered)             │
│   ├── [ UnnecessaryChild ] (Grey = Did not render)     │
│   └── [ LaggyComponent ]   (Yellow = Rendered)          │
│         └── "Why did this render?"                     │
│             ↳ Hook 1 changed                           │
│             ↳ Props changed: { onClick: f }            │
└────────────────────────────────────────────────────────┘

```

* **Color Codes:**
* **Grey:** Component did not re-render during this commit.
* **Blue/Green:** Re-rendered quickly.
* **Yellow/Orange:** Took longer to render.

* **Inspect the Right Sidebar ("Why did this render?"):**
Click on any yellow component box. The sidebar will tell you the exact cause:
* *"Props changed: [onClick]"* $\rightarrow$ Means a callback prop lost its reference (needs `useCallback`).
* *"Parent component rendered"* $\rightarrow$ Component isn't memoized (needs `React.memo`).
* *"Hook 2 changed"* $\rightarrow$ A local state or context updated.

---

### Part 2: `why-did-you-render` (WDYR)

While the Profiler requires manual visual inspection, `why-did-you-render` monkey-patches React in development mode and logs **unnecessary re-renders directly into the browser console** whenever a component re-renders with identical props/state.

#### Step 1: Install WDYR

```bash
npm install --save-dev @welldone-software/why-did-you-render

```

#### Step 2: Initialize WDYR (`src/wdyr.js`)

Create a `wdyr.js` file and import it at the **very top** of your entry file (`index.js` or `main.jsx`), before importing React:

```javascript
/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true, // Automatically tracks all React.memo components
    trackHooks: true,             // Tracks hook state/context changes
    logOwnerReasons: true,
  });
}

```

#### Step 3: Track Specific Components

You can enable tracking for individual components by attaching `whyDidYouRender = true`:

```jsx
import React from 'react';

const HeavyChart = ({ data, onClick }) => {
  return <div>{/* Chart UI */}</div>;
};

// Enable WDYR tracking on this specific component
HeavyChart.whyDidYouRender = true;

export default React.memo(HeavyChart);

```

#### Step 4: Interpret Console Warnings

When `HeavyChart` re-renders unnecessarily, WDYR outputs a detailed table in the browser console:

```text
[why-did-you-render] HeavyChart Re-rendered!
  Reason: Props change on key "onClick"
  
  Prev prop: onClick = f () { ... } (different reference)
  Next prop: onClick = f () { ... } (different reference)
  
  👉 Both functions have the exact same body, but different references!

```

---

### Comparison & Best Practices

| Feature              | React Profiler                              | why-did-you-render (WDYR)                      |
| -------------------- | ------------------------------------------- | ---------------------------------------------- |
| **Interface**        | Visual Flamegraph UI (Browser DevTools)     | Console Log Messages                           |
| **Detection Method** | Manual recording & inspection               | Automated log on wasteful renders              |
| **Best Used For**    | Measuring render times & full-tree analysis | Catching unstable function/object references   |
| **Setup Cost**       | Zero setup (built-in extension)             | Requires npm package & `wdyr.js` configuration |

#### Production Workflow Strategy

1. Use **WDYR** during feature development to get real-time console warnings when passing inline functions or un-memoized object literals.
2. Use **React Profiler** before releases to record user interactions, identify the tallest (slowest) yellow flamegraph bars, and apply `React.memo`, `useCallback`, or `useMemo` where impact is highest.
