## What is a Custom Hook?

A Custom Hook is a JavaScript function whose name starts with use and that can call other React hooks (like useState, useEffect, useRef, etc.) []. [1, 2, 3, 4, 5]
It allows you to abstract and extract complex component logic (such as fetching data, handling form state, or tracking window dimensions) into a single, reusable function []. [6, 7, 8, 9, 10]

- Logic Reuse: Share the exact same stateful logic across multiple entirely different components without duplicating code []. [11, 12, 13]
- Separation of Concerns: Keep your visual JSX components clean by offloading complex operations and state management into external hook files []. [14, 15]
- Isolated State: Every time you call a custom hook, all state and effects inside it are completely isolated []. Two components using the same custom hook do not share the same data state; they only share the logic []. [16, 17, 18]

---

## How to Create a Custom Hook

To create a custom hook, you follow three basic steps:

1.  Define a regular JavaScript function starting with the lowercase prefix use [].
2.  Move your React state (useState) and side-effects (useEffect) inside this function [].
3.  Return the exact data or functions your components will need to interact with []. [19, 20, 21, 22, 23]

## Example: Building a useWindowSize Hook

Imagine you want to monitor the browser window size to dynamically alter your layouts. Instead of writing window resize listeners inside every component, you can isolate that logic here: [24]

import { useState, useEffect } from 'react';
// 1. Name must start with 'use'export function useWindowSize() {
// 2. Define your internal states
const [windowSize, setWindowSize] = useState({
width: typeof window !== 'undefined' ? window.innerWidth : 0,
height: typeof window !== 'undefined' ? window.innerHeight : 0,
});

// 3. Perform your side effects
useEffect(() => {
function handleResize() {
setWindowSize({
width: window.innerWidth,
height: window.innerHeight,
});
}

    // Set up window listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);

}, []); // Empty array ensures this runs only once on mount

// 4. Return what the consuming component needs
return windowSize;
}

---

## How to Use a Custom Hook

Using a custom hook is exactly like using React's built-in hooks (like useState). You must call it at the top level of your functional components []. [25, 26, 27, 28]
Here is how you use the newly created useWindowSize hook inside two separate components:

## Responsive Component Example:

import React from 'react';import { useWindowSize } from './useWindowSize'; // Import your hook
export function ResponsiveNavbar() {
// Call the hook at the top level
const { width } = useWindowSize();

return (

<nav>
{width < 768 ? (
<button aria-label="Open Menu">☰ Mobile Menu</button>
) : (
<div className="desktop-links">
<a href="/home">Home</a>
<a href="/about">About</a>
</div>
)}
</nav>
);
}

## Analytical Component Example:

import React from 'react';import { useWindowSize } from './useWindowSize';
export function ScreenDebugger() {
// Calls the hook again. This creates a brand new, isolated instance of the state!
const size = useWindowSize();

return (

<div className="debugger-panel">
<h3>Screen Dimensions</h3>
<p>Width: {size.width}px</p>
<p>Height: {size.height}px</p>
</div>
);
}

---

## Strict Rules for Custom Hooks

When building or employing custom hooks, you must rigorously respect the standard Rules of Hooks: [29]

- Must start with use: React's linting tools look specifically for the use prefix to ensure hooks follow safety patterns []. [30, 31, 32]
- Call only at the top level: Do not call custom hooks inside conditional loops, if statements, or nested functions []. They must execute in the exact same order on every single render []. [33, 34, 35, 36, 37]
- Call only from React functions: You can call custom hooks from inside standard functional components or other custom hooks []. You cannot call them from plain JavaScript helper files []. [38, 39, 40, 41]

---

If you would like to expand on this topic, let me know if I should:

- Write a useFetch hook with full loading, error, and caching capabilities.
- Show you how to test custom hooks using React Testing Library.
- Convert a legacy Class Component into a modern functional component using hooks. [42, 43, 44, 45, 46]

[1] [https://www.turing.com](https://www.turing.com/blog/custom-react-js-hooks-how-to-use)
[2] [https://www.robinwieruch.de](https://www.robinwieruch.de/react-custom-hook/)
[3] [https://dev.to](https://dev.to/spukas/react-hooks-creating-custom-state-hook-300c)
[4] [https://blogs.purecode.ai](https://blogs.purecode.ai/blogs/react-custom-hooks)
[5] [https://www.hackerone.com](https://www.hackerone.com/blog/implementing-custom-react-hook-best-practices-and-practical-example)
[6] [https://oneuptime.com](https://oneuptime.com/blog/post/2026-02-02-react-custom-hooks/view)
[7] [https://github.com](https://github.com/sergeyleschev/react-custom-hooks)
[8] [https://www.codewithharry.com](https://www.codewithharry.com/tutorial/writing-custom-hooks)
[9] [https://namastedev.com](https://namastedev.com/blog/advanced-react-hooks-explained-6/)
[10] [https://www.getfishtank.com](https://www.getfishtank.com/insights/using-custom-hooks-to-efficiently-handle-forms-in-nextjs)
[11] [https://dev.to](https://dev.to/gboladetrue/react-custom-hooks-crafting-reusable-and-clean-code-like-a-pro-3kol)
[12] [https://blog.nonstopio.com](https://blog.nonstopio.com/custom-hooks-in-react-when-and-how-to-use-them-effectively-f0c4a2c1b436)
[13] [https://www.codecademy.com](https://www.codecademy.com/article/how-to-use-hooks-in-react-js-with-examples)
[14] [https://blogs.purecode.ai](https://blogs.purecode.ai/blogs/react-custom-hooks)
[15] [https://medium.com](https://medium.com/@bauhausk/building-modular-frontends-a-poc-with-react-and-next-js-332f94a19a78)
[16] [https://legacy.reactjs.org](https://legacy.reactjs.org/docs/hooks-custom.html)
[17] [https://react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks)
[18] [https://www.locofy.ai](https://www.locofy.ai/blog/custom-hooks-in-react)
[19] [https://www.geeksforgeeks.org](https://www.geeksforgeeks.org/reactjs/how-to-use-usereducer-within-a-custom-hook/)
[20] [https://www.jackfranklin.co.uk](https://www.jackfranklin.co.uk/blog/refactoring-to-react-hooks/)
[21] [https://dev.to](https://dev.to/abhisheknaiidu/10-react-hooks-explained-3ino)
[22] [https://daveceddia.com](https://daveceddia.com/custom-hooks/)
[23] [https://www.naukri.com](https://www.naukri.com/code360/library/introduction-to-react-hooks)
[24] [https://www.codewithseb.com](https://www.codewithseb.com/blog/advanced-react-hooks-best-practices-in-react-with-nextjs-and-remix)
[25] [https://medium.com](https://medium.com/@xiaominghu19922/custom-hooks-in-react-cb9e42b3296)
[26] [https://blog.nonstopio.com](https://blog.nonstopio.com/custom-hooks-in-react-when-and-how-to-use-them-effectively-f0c4a2c1b436)
[27] [https://legacy.reactjs.org](https://legacy.reactjs.org/docs/hooks-overview.html)
[28] [https://pieces.app](https://pieces.app/blog/creating-custom-hooks-reactjs)
[29] [https://oneuptime.com](https://oneuptime.com/blog/post/2026-02-02-react-custom-hooks/view)
[30] [https://www.dhiwise.com](https://www.dhiwise.com/post/crafting-clear-code-with-react-hooks-naming-convention)
[31] [https://ja.react.dev](https://ja.react.dev/reference/eslint-plugin-react-hooks)
[32] [https://www.patterns.dev](https://www.patterns.dev/react/hooks-pattern/)
[33] [https://blog.nonstopio.com](https://blog.nonstopio.com/custom-hooks-in-react-when-and-how-to-use-them-effectively-f0c4a2c1b436)
[34] [https://legacy.reactjs.org](https://legacy.reactjs.org/docs/hooks-overview.html)
[35] [https://academind.com](https://academind.com/articles/react-hooks-introduction)
[36] [https://blogs.purecode.ai](https://blogs.purecode.ai/blogs/react-custom-hooks)
[37] [https://dev.to](https://dev.to/austinwdigital/mastering-custom-react-hooks-best-practices-for-clean-scalable-code-40b1)
[38] [https://www.ltvco.com](https://www.ltvco.com/engineering/how-to-write-custom-react-hook/)
[39] [https://intellipaat.com](https://intellipaat.com/blog/react-hooks/)
[40] [https://www.netguru.com](https://www.netguru.com/blog/react-hooks-examples)
[41] [https://www.naukri.com](https://www.naukri.com/code360/library/introduction-to-react-hooks)
[42] [https://namastedev.com](https://namastedev.com/blog/creating-custom-hooks-for-api-calls/)
[43] [https://medium.com](https://medium.com/@fxdemir99/react-swr-and-custom-swr-hook-for-filtering-ae7c73c25161)
[44] [https://medium.com](https://medium.com/@tanveer.singh926/custom-react-hooks-vs-tanstack-query-for-fetching-073954af54f4)
[45] [https://www.instagram.com](https://www.instagram.com/p/Da1qX2cAhhZ/)
[46] [https://medium.com](https://medium.com/@ignatovich.dm/using-a-custom-hooks-logic-in-a-class-component-with-hoc-in-react-d684dc5f3556)
