Between the DOM updating and the browser painting, there is a window which many React developers don't know if that exists. This is where useLayoutEffect lives. Here's how 👇

𝗧𝘄𝗼 𝘁𝗵𝗶𝗻𝗴𝘀 𝗵𝗮𝗽𝗽𝗲𝗻 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗽𝗵𝗮𝘀𝗲, 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗼𝗿𝗱𝗲𝗿:

𝟭. 𝗥𝗲𝗳 𝗮𝘁𝘁𝗮𝗰𝗵𝗺𝗲𝗻𝘁𝘀

- Refs are attached to their corresponding DOM nodes here.
- After this step, ref.current reliably points to the correct updated DOM element.
  This is why reading a ref during the Render Phase is unreliable because the DOM may not exist yet.
- The Layout Phase is when ref.current becomes accurate

𝟮. 𝘂𝘀𝗲𝗟𝗮𝘆𝗼𝘂𝘁𝗘𝗳𝗳𝗲𝗰𝘁 𝗰𝗮𝗹𝗹𝗯𝗮𝗰𝗸𝘀

- Cleanup functions from the previous render run first, then the new useLayoutEffect callbacks fire synchronously.
- They run in child-first, parent-last order i.e children complete their layout work before parents measure or adjust based on them.
- This timing makes useLayoutEffect the right choice for DOM measurements, layout calculations, and imperative DOM updates that must be invisible to the user.

𝗢𝗻𝗲 𝗶𝗺𝗽𝗼𝗿𝘁𝗮𝗻𝘁 𝗻𝗼𝘁𝗲: The Layout Phase is blocking. It must finish before the browser paints.

- Heavy work inside useLayoutEffect directly delays what the user sees.

- useLayoutEffect should only be used when its synchronous timing is genuinely necessary

- For everything else like data fetching, subscriptions, logging, useEffect is the right choice (more on this in the next post).

𝗧𝗵𝗲 𝘀𝗶𝗺𝗽𝗹𝗲 𝘄𝗮𝘆 𝘁𝗼 𝗿𝗲𝗺𝗲𝗺𝗯𝗲𝗿 𝗶𝘁:
𝘂𝘀𝗲𝗟𝗮𝘆𝗼𝘂𝘁𝗘𝗳𝗳𝗲𝗰𝘁: DOM updated, before paint, synchronous, blocking
𝘂𝘀𝗲𝗘𝗳𝗳𝗲𝗰𝘁: DOM updated, after paint, asynchronous, non-blocking

𝗪𝗵𝘆 𝘁𝗵𝗶𝘀 𝗺𝗮𝘁𝘁𝗲𝗿𝘀:

- Now you know why useLayoutEffect can cause visible delays if misused.
- Why ref.current is only reliable after the Layout Phase, not during render.
- Why useLayoutEffect is the right tool for tooltip positioning, scroll adjustments and DOM measurements but wrong for almost everything else.

![alt text](image-2.png)
**`useLayoutEffect`** is a specialized version of `useEffect` that fires **synchronously** right after React has calculated the DOM mutations, but **before** the browser has had a chance to paint those changes onto the screen.

Because it blocks the browser from painting until the Effect finishes executing, it can hurt performance if misused. However, it is essential for preventing visual flickers when you need to make immediate DOM measurements.

Here is a detailed breakdown of its API, usage scenarios, and troubleshooting.

---

## 1. Reference

### `useLayoutEffect(setup, dependencies?)`

- **`setup`**: The function containing your effect logic. It can optionally return a cleanup function.
- **`dependencies` (Optional)**: An array of reactive values referenced inside the setup function. The effect will re-run when these values change.

### ⚠️ Pitfall: Performance Impact

Unlike `useEffect` (which runs *after* the browser paints, ensuring the UI feels fast and responsive), `useLayoutEffect` runs *before* the paint. If your setup code performs heavy calculations or slow logic, it will freeze the user's screen and cause noticeable UI stuttering. **Always prefer standard `useEffect` unless you are actively preventing a visual flicker.**

---

## 2. Usage Scenario: Measuring Layout Before Paint

### The problem with `useEffect` for measurements

If you want to position a tooltip or a dropdown menu dynamically based on the width or height of another element, using `useEffect` creates a visible glitch:

1. React renders the tooltip in its default position.
2. The browser paints the screen (user sees the tooltip in the wrong spot).
3. `useEffect` fires, measures the element, and updates the state.
4. React re-renders, and the browser paints again (user sees the tooltip jump to the correct spot).
*This results in an annoying visual flicker.*

### The solution with `useLayoutEffect`

By using `useLayoutEffect`, React suppresses the browser's paint until the measurement and state update have completed in a single synchronous cycle. The user never sees the intermediate wrong state.

```jsx
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const ref = useRef(null);

  // Runs synchronously before the browser paints the screen
  useLayoutEffect(() => {
    if (ref.current) {
      const height = ref.current.getBoundingClientRect().height;
      setTooltipHeight(height); // Updates state immediately before paint
    }
  }, []);

  return (
    <div ref={ref} style={{ position: 'absolute', top: -tooltipHeight }}>
      This is a perfectly positioned tooltip!
    </div>
  );
}

```

---

## 3. Troubleshooting

### I’m getting an error: “useLayoutEffect does nothing on the server”

**Cause:** Server-Side Rendering (SSR) environments (like Node.js or Next.js running on a server) do not have a browser, do not have a DOM, and do not "paint" screens. Because `useLayoutEffect` is specifically designed to synchronize with browser painting layouts, it cannot execute on the server. React throws a warning when it encounters `useLayoutEffect` during SSR because the server cannot measure DOM nodes that don't exist yet.

**The Fix:**

1. **Prefer `useEffect`:** If your component doesn't strictly require pre-paint DOM measurements, change `useLayoutEffect` to `useEffect`. Standard `useEffect` safely skips execution during server rendering.
2. **Suppress or Move Logic:** If you are building a custom Hook that needs to run on both client and server, you can conditionally switch between `useEffect` (on the server) and `useLayoutEffect` (on the client), or check if `typeof window !== 'undefined'` before running DOM measurements.
