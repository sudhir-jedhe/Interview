Building a real-time dashboard capable of handling high-frequency data updates requires an architecture that decouples **network ingestion** from **React’s rendering pipeline**. Pushing fast incoming messages directly into React state will lock the main thread, cause layout thrashing, and drop frame rates.

Here is an architectural breakdown and code implementation for building a resilient real-time dashboard.

---

### 1. Architectural Strategy & Design Choices

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      REAL-TIME STREAMING ARCHITECTURE                  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────┐                            ┌──────────────────────┐
│  HTTP / REST (Init)  │                            │  WebSocket Connection│
│  • Historical Snapshot│                            │  • High-frequency    │
│  • Initial Cache Load│                            │    delta stream      │
└──────────┬───────────┘                            └──────────┬───────────┘
           │                                                   │
           └─────────────────────────┬─────────────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ In-Memory Mutable Buffer (16ms / RAF)│
                  └──────────────────┬──────────────────┘
                                     │ Batch Flush (10 FPS)
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ Normalized Client Store (Zustand)   │
                  └──────────────────┬──────────────────┘
                                     │ Selective Atomic Subscriptions
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ Virtualized Dashboard Widgets       │
                  └─────────────────────────────────────┘

```

#### WebSockets vs. Polling Matrix

* **Polling (Short/Long):** Best for low-frequency updates ($>10\text{s}$) or static catalog data. At scale, HTTP overhead ($1\text{KB}+$ headers per request) strains backend infrastructure.
* **WebSockets:** Ideal for bidirectional, high-frequency ($100\text{ms}\text{--}1\text{s}$) data feeds (e.g., stock tickers, system metrics). Established over a single TCP connection, eliminating HTTP handshake overhead.
* **SSE (Server-Sent Events):** Best for unidirectional text/event streams (e.g., AI token generation, live news feeds) with native auto-reconnection built into the browser `EventSource` API.

#### State Management & Caching

* **Decoupled Ingestion Buffer:** incoming socket messages are collected in a mutable buffer (`useRef` or in-memory array) outside the React render lifecycle.
* **Batch Flushing:** A timer or `requestAnimationFrame` flushes the accumulated updates into state at fixed intervals (e.g., every $100\text{ms}$ or $10\text{ FPS}$).
* **Atomic Subscriptions:** State is stored in a normalized structure (`Record<string, Metric>`). Widgets subscribe only to their relevant key to prevent cross-widget re-renders.

#### Error Handling & Reconnection

* **Exponential Backoff with Jitter:** Prevents connection "thundering herd" issues on the backend when recovering from micro-outages.
* **Heartbeat Ping/Pong:** Detects silently dropped TCP connections ("zombie sockets").
* **Sequence Numbers / Gap Detection:** Detects missed messages during brief disconnections and triggers a delta catch-up fetch via REST.

---

### 2. State Store Setup (Zustand with Atomic Selectors)

Create an atomic store that holds normalized metric entries.

```typescript
// stores/useDashboardStore.ts
import { create } from 'zustand';

export interface MetricData {
  id: string;
  name: string;
  value: number;
  change: number;
  timestamp: number;
}

interface DashboardState {
  metrics: Record<string, MetricData>;
  connectionStatus: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';
  setConnectionStatus: (status: DashboardState['connectionStatus']) => void;
  updateBatchMetrics: (updates: MetricData[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: {},
  connectionStatus: 'DISCONNECTED',

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  // Atomic batch merge operation
  updateBatchMetrics: (updates) =>
    set((state) => {
      const nextMetrics = { ...state.metrics };
      for (let i = 0; i < updates.length; i++) {
        const item = updates[i];
        nextMetrics[item.id] = item;
      }
      return { metrics: nextMetrics };
    }),
}));

```

---

### 3. Production WebSocket Client (Resilient Reconnection Engine)

This hook manages heartbeats, exponential backoff reconnects, message buffering, and batch updates.

```typescript
// hooks/useRealtimeStream.ts
import { useEffect, useRef } from 'react';
import { useDashboardStore, MetricData } from '../stores/useDashboardStore';

interface UseRealtimeOptions {
  url: string;
  flushIntervalMs?: number; // Batch interval (default: 100ms)
  heartbeatIntervalMs?: number; // Ping interval (default: 30000ms)
}

export function useRealtimeStream({
  url,
  flushIntervalMs = 100,
  heartbeatIntervalMs = 30000,
}: UseRealtimeOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const bufferRef = useRef<MetricData[]>([]);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateBatchMetrics = useDashboardStore((s) => s.updateBatchMetrics);
  const setConnectionStatus = useDashboardStore((s) => s.setConnectionStatus);

  useEffect(() => {
    let isComponentMounted = true;

    // 1. Buffer Flush Loop: Flushes queue into Zustand at fixed 100ms budget
    flushTimerRef.current = setInterval(() => {
      if (bufferRef.current.length > 0) {
        const batch = [...bufferRef.current];
        bufferRef.current = []; // Clear local buffer
        updateBatchMetrics(batch);
      }
    }, flushIntervalMs);

    function connect() {
      if (!isComponentMounted) return;

      setConnectionStatus(
        reconnectAttemptsRef.current === 0 ? 'CONNECTING' : 'RECONNECTING'
      );

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isComponentMounted) return;
        setConnectionStatus('CONNECTED');
        reconnectAttemptsRef.current = 0; // Reset backoff count
        startHeartbeat();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Handle server ping response
          if (message.type === 'PONG') return;

          if (message.type === 'METRIC_UPDATE') {
            // Push directly to buffer (NO React state update triggered here!)
            bufferRef.current.push(message.payload);
          }
        } catch (err) {
          console.error('Failed to parse socket payload:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
      };

      ws.onclose = (event) => {
        if (!isComponentMounted) return;
        stopHeartbeat();
        setConnectionStatus('DISCONNECTED');

        // Execute Exponential Backoff Reconnection with Random Jitter
        const maxAttempts = 5;
        if (reconnectAttemptsRef.current < maxAttempts) {
          reconnectAttemptsRef.current += 1;
          const baseDelay = Math.pow(2, reconnectAttemptsRef.current) * 1000;
          const jitter = Math.random() * 1000;
          const delay = baseDelay + jitter;

          console.warn(`Socket closed. Reconnecting in ${Math.round(delay)}ms...`);
          setTimeout(connect, delay);
        } else {
          console.error('Max connection attempts reached. Manual refresh required.');
        }
      };
    }

    // Heartbeat ping mechanism to detect stale dead connections
    function startHeartbeat() {
      stopHeartbeat();
      heartbeatTimerRef.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'PING' }));
        }
      }, heartbeatIntervalMs);
    }

    function stopHeartbeat() {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    }

    connect();

    // Clean up connections and timers on unmount
    return () => {
      isComponentMounted = false;
      stopHeartbeat();
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, flushIntervalMs, heartbeatIntervalMs, updateBatchMetrics, setConnectionStatus]);
}

```

---

### 4. Optimized Widget Component (Isolated Re-renders)

Wrap child widgets in `React.memo` and subscribe **atomically** to single keys inside the Zustand store.

```tsx
// components/MetricWidget.tsx
import React from 'react';
import { useDashboardStore, MetricData } from '../stores/useDashboardStore';

interface WidgetProps {
  metricId: string;
}

export const MetricWidget: React.FC<WidgetProps> = React.memo(({ metricId }) => {
  // ATOMIC SELECTOR: Component re-renders ONLY when metrics[metricId] changes!
  const metric = useDashboardStore(
    (state) => state.metrics[metricId] as MetricData | undefined
  );

  if (!metric) {
    return (
      <div className="p-4 border rounded-lg bg-slate-800 text-slate-400 animate-pulse">
        Initializing {metricId}...
      </div>
    );
  }

  const isPositive = metric.change >= 0;

  return (
    <div className="p-4 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 shadow-md">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {metric.name}
      </div>
      <div className="text-2xl font-bold font-mono my-1">
        ₹{metric.value.toFixed(2)}
      </div>
      <div
        className={`text-xs font-semibold ${
          isPositive ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {isPositive ? '▲' : '▼'} {Math.abs(metric.change).toFixed(2)}%
      </div>
    </div>
  );
});

MetricWidget.displayName = 'MetricWidget';

```

---

### 5. Main Dashboard Container Page

```tsx
// pages/LiveDashboard.tsx
import React from 'react';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { useDashboardStore } from '../stores/useDashboardStore';
import { MetricWidget } from '../components/MetricWidget';

const WATCHLIST_METRICS = [
  'INFY',
  'TCS',
  'RELIANCE',
  'HDFCBANK',
  'TATAMOTORS',
  'WIPRO',
];

export const LiveDashboard: React.FC = () => {
  // Initialize stream
  useRealtimeStream({ url: 'wss://api.your-domain.com/v1/stream' });

  const status = useDashboardStore((s) => s.connectionStatus);

  const getStatusBadge = () => {
    switch (status) {
      case 'CONNECTED':
        return <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20">● Live</span>;
      case 'CONNECTING':
      case 'RECONNECTING':
        return <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/20">⏳ Connecting...</span>;
      default:
        return <span className="bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full text-xs font-medium border border-rose-500/20">✕ Offline</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold">System Health & Telemetry</h1>
          <p className="text-xs text-slate-400 mt-0.5">High-frequency realtime dashboard</p>
        </div>
        <div>{getStatusBadge()}</div>
      </header>

      {/* Grid of Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {WATCHLIST_METRICS.map((id) => (
          <MetricWidget key={id} metricId={id} />
        ))}
      </div>
    </div>
  );
};

```

---

### Performance Checklist

1. **No Inline Object Values in Context:** Bypassed Context API completely for fast dynamic data; used Zustand atomic selectors.
2. **Batching:** Flushes ingestion queue every $100\text{ms}$ to match browser paint budgets without dropping frame rates.
3. **Connection Safety:** Integrated heartbeat ping/pong to identify stale TCP sessions and exponential backoff retry logic to safeguard server infrastructure during network recovery.
