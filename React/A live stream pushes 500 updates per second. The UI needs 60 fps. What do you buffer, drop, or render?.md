At **500 updates/second** ($2\text{ ms}$ interval) on a **$60\text{ fps}$** display ($16.67\text{ ms}$ frame budget), the browser receives roughly **8 to 9 updates per render frame**.

Attempting to process each update individually in React or the DOM will saturate the JavaScript event loop, block the main thread, and drop frame rates below $15\text{ fps}$.

The strategy depends entirely on the **semantic type of data**:

---

### 1. The Strategy by Data Category

| Data Type                         | Example                                             | Action                             | Strategy                                                                                                                            |
| --------------------------------- | --------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Current State (Overwrite)**     | Stock prices, live coordinates, speedometer, gauges | **Drop Intermediate States** (LWW) | Overwrite an in-memory mutable slot. Render only the latest value at $60\text{ fps}$.                                               |
| **Cumulative Series (Telemetry)** | Live charts, CPU/memory graphs, financial depth     | **Aggregate / Downsample**         | Bucket incoming points per $16.6\text{ ms}$ frame into $\text{Min/Max/Avg}$ or $\text{OHLCV}$ candles.                              |
| **Log / Feed (Append-Only)**      | Live chat, transaction logs, audit trails           | **Batch & Window**                 | Queue incoming items into an array; flush to state at a clamped rate (e.g., $4\text{–}10\text{ Hz}$); cap list size and virtualize. |

---

### 2. Architecture: Concurrency & Decoupled Animation Loop

Decouple the **network ingestion rate** ($500\text{ Hz}$) from the **DOM paint cycle** ($60\text{ Hz}$) using an in-memory buffer synced via `requestAnimationFrame` (rAF):

```
WebSocket / SSE Stream (500 updates/sec)
                  │
                  ▼
       [ In-Memory Mutable Buffer / Queue ]   <-- No React setState here!
                  │
                  │ (Pulls once every 16.67ms)
                  ▼
     requestAnimationFrame (rAF) Loop
                  │
                  ├── LWW Data ────> Writes directly to DOM refs or batches state
                  ├── Chart Data ──> Draws to <canvas> / WebGL
                  └── Feed Data ───> Flushes throttled batches to Virtualized List

```

---

### 3. Concrete Implementations

#### A. Latest-Value-Wins (State Metrics & Gauges)

Never call `setState` on every message. Store the latest value in a mutable reference (`useRef` or class field) and synchronize via `requestAnimationFrame`.

```typescript
import { useEffect, useRef } from 'react';

export function useLiveMetricStream(socket: WebSocket) {
  const latestValueRef = useRef<number>(0);
  const displayElementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 1. Ingestion: 500 Hz updates write to memory only (0 React renders)
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      latestValueRef.current = data.price;
    };

    socket.addEventListener('message', handleMessage);

    // 2. Render Loop: Clamped to 60 fps (16.6ms)
    let animationFrameId: number;
    let lastRenderedValue: number | null = null;

    const renderLoop = () => {
      const current = latestValueRef.current;
      // Skip DOM mutation if value hasn't changed
      if (current !== lastRenderedValue && displayElementRef.current) {
        displayElementRef.current.textContent = current.toFixed(2);
        lastRenderedValue = current;
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      socket.removeEventListener('message', handleMessage);
      cancelAnimationFrame(animationFrameId);
    };
  }, [socket]);

  return displayElementRef;
}

```

---

#### B. High-Frequency Time Series & Charts (Aggregate / Downsample)

Pushing 500 DOM/SVG nodes per second will crash SVG renderers.

* **Canvas / WebGL:** Use HTML5 `<canvas>` or WebGL (e.g., PixiJS, WebGL chart engines like SciChart or uPlot).
* **Frame Downsampling:** In each $16.6\text{ ms}$ bucket, downsample the 8–9 points using Largest-Triangle-Three-Buckets (LTTB) or min/max aggregation into a single line segment.

```typescript
// Inside the rAF render step for a Canvas chart:
function renderChartFrame(ctx: CanvasRenderingContext2D, incomingQueue: Point[]) {
  if (incomingQueue.length === 0) return;

  // Drain the in-memory queue collected over the last 16.6ms
  const batch = incomingQueue.splice(0, incomingQueue.length);

  // Compute min/max or average of the batch to plot a single point/candle
  const avgY = batch.reduce((sum, p) => sum + p.y, 0) / batch.length;
  const latestX = batch[batch.length - 1].x;

  drawPoint(ctx, latestX, avgY);
}

```

---

#### C. Live Event Feeds / Chat (Batching & Virtualization)

Humans cannot read 500 messages per second. Rendering at $60\text{ fps}$ is unnecessary for text streams.

* **Throttled Batching:** Accumulate items in an array buffer and flush to React state every **$100\text{–}250\text{ ms}$** ($4\text{–}10\text{ Hz}$).
* **Fixed Buffer Limit:** Cap the maximum items in memory (e.g., keep the last 500–1,000 items; drop the oldest).
* **Virtualization:** Use `@tanstack/react-virtual` so only the 20–30 items visible on screen exist in the DOM.

```typescript
useEffect(() => {
  let pendingBuffer: Message[] = [];

  const handleMessage = (e: MessageEvent) => {
    pendingBuffer.push(JSON.parse(e.data));
  };

  socket.addEventListener('message', handleMessage);

  // Flush buffer to React state at 5 Hz (every 200ms)
  const intervalId = setInterval(() => {
    if (pendingBuffer.length === 0) return;

    const newBatch = pendingBuffer;
    pendingBuffer = [];

    setMessages((prev) => {
      const combined = [...prev, ...newBatch];
      // Bound memory: Retain only the most recent 1,000 messages
      return combined.length > 1000 ? combined.slice(combined.length - 1000) : combined;
    });
  }, 200);

  return () => {
    socket.removeEventListener('message', handleMessage);
    clearInterval(intervalId);
  };
}, [socket]);

```

---

### 4. Offloading to Web Workers (Data Ingestion Pipeline)

To keep the browser's UI thread entirely free for gestures and layout:

1. **Web Worker** owns the WebSocket connection.
2. The worker parses JSON, filters irrelevant messages, and performs min/max downsampling.
3. The worker posts batched data to the main thread via `postMessage` (or draws directly using `OffscreenCanvas`) once every $16\text{ ms}$.

```
[WebSocket] ──(500 msg/s)──> [Web Worker: JSON parse + Downsample]
                                     │
                             (Transferable / 60Hz)
                                     ▼
                        [Main Thread / OffscreenCanvas]

```

---

### Summary Rule of Thumb

* **Buffer:** Keep raw streams in mutable JavaScript memory/Worker arrays, not in React component state.
* **Drop:** Discard obsolete intermediate states (LWW) and prune items outside the sliding history window.
* **Render:** Batch and throttle paint operations to **$60\text{ fps}$** (via `requestAnimationFrame`) for animations/metrics and **$4\text{–}10\text{ fps}$** for human-readable text feeds.
