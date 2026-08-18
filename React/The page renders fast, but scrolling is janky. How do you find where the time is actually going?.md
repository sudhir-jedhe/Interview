When a page renders fast initially but stutters during scrolling (dropping frames below 60fps/120fps), the bottleneck is almost always occurring in one of three stages of the **pixel rendering pipeline**:

$$\text{JavaScript (Event Handlers)} \longrightarrow \text{Style \& Layout (Reflow)} \longrightarrow \text{Paint \& Composite}$$

Here is the systematic workflow to pinpoint the exact source of scroll jank.

---

### Step 1: Profile the Scroll in Chrome DevTools Performance Panel

1. Open Chrome DevTools (`F12` / `Cmd + Option + I`) $\rightarrow$ **Performance** tab.
2. Click **Record** (or `Cmd + E`), continuously scroll the janky section for 3–5 seconds, and click **Stop**.
3. Inspect the **Frames Track** at the top:

* Look for **red-topped frame bars** (dropped/long frames $>16.6\text{ms}$).
* Click a dropped frame and inspect the **Main Thread Flame Chart** directly below it.

---

### Step 2: Classify the Flame Chart by Color

The flame chart colors indicate where the browser spends frame budget during scrolling:

| Dominant Color | Pipeline Phase                   | Common Culprit                                                                                                                |
| -------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Yellow**     | **JavaScript Execution**         | Heavy scroll/wheel listeners, non-passive event handlers, synchronous state updates.                                          |
| **Purple**     | **Style Recalculation & Layout** | Forced Synchronous Layouts (layout thrashing), CSS selector bloat, animating geometry properties (`height`, `top`, `margin`). |
| **Green**      | **Paint & Rasterization**        | Large paint areas, heavy CSS filters (`backdrop-filter`, `box-shadow`), un-promoted scrolling layers.                         |

---

### Step 3: Deep-Dive into the Culprits

#### 1. If Yellow (JavaScript Bottlenecks)

* **Check for Non-Passive Scroll Listeners:**
* Open DevTools **Console** $\rightarrow$ look for violations: `[Violation] Added non-passive event listener to a scroll-blocking <some> event`.
* *Fix:* Pass `{ passive: true }` so the browser compositor thread scrolls without waiting for JS execution:

```javascript
window.addEventListener('scroll', handleScroll, { passive: true });

```

* **Check for Synchronous State Updates on Scroll:**
* If a scroll listener triggers `setState()` or updates Redux/Zustand on every pixel, it causes continuous React reconciliation passes.
* *Fix:* Throttle updates or decouple logic via `requestAnimationFrame` or `IntersectionObserver`.

#### 2. If Purple (Forced Reflows / Layout Thrashing)

* In the flame chart, look for **red warning triangles** labeled **"Forced Reflow"** or **"Recalculate Style"**.
* Click the warning to view the exact source line in your code.
* *Cause:* Alternating between DOM writes and DOM reads inside scroll handlers or loop iterations:

```javascript
// ❌ Layout Thrash: Reading layout immediately after writing
element.style.width = '100px'; 
const height = element.offsetHeight; // Forces layout recalculation!

```

#### 3. If Green (Paint & Composite Overload)

* Press `Cmd + Shift + P` (or `Ctrl + Shift + P`) $\rightarrow$ type **"Show Rendering"**.
* Enable these live debugging overlays:

1. **Paint Flashing:** Highlights repainted regions in **green**. If the whole screen flashes green while scrolling, the entire document is being repainted each frame.
2. **Scrolling Performance Issues:** Highlights elements that block asynchronous scrolling with an overlay labeled **"Repaints on scroll"** or **"Non-passive listener"**.
3. **Layer Borders:** Shows compositor layer boundaries in orange/blue.

* *Fix:* Offload animations to the GPU using `transform` and `opacity` with `will-change: transform`.

---

### Step 4: Inspect Compositor vs. Main Thread Decoupling

Open the **Layers** panel in DevTools (`Cmd + Shift + P` $\rightarrow$ "Show Layers"):

1. Verify if large scrolling sub-containers (e.g., overflow lists) have their own compositor layers.
2. Check the **Paint Count** column. If paint counts continually increment as you scroll, the GPU is re-rasterizing bitmaps on every frame.
3. Add `will-change: scroll-position` or `transform: translateZ(0)` to promote the container to its own hardware-accelerated compositor layer.

---

### Diagnostic Summary Checklist

```
[Start Profiling]
       │
       ├─► Check Rendering Tab: Is "Paint Flashing" lighting up the whole page?
       │     └─► YES: Heavy CSS properties (box-shadow, filters, borders) or unpromoted layers.
       │
       ├─► Check Flame Chart: Are there red triangles on purple "Layout" blocks?
       │     └─► YES: Forced Synchronous Layout / Layout Thrashing in JS.
       │
       └─► Check Event Listeners: Are scroll/wheel handlers missing `{ passive: true }`?
             └─► YES: Main thread is blocking the compositor thread from scrolling smoothly.

```
