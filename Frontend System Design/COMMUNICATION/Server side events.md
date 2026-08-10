Here is the English translation of the explanation on Server-Sent Events (SSE) in Front-End System Design:

---

# Server-Sent Events (SSE) in Front-End System Design: Unidirectional Server Push for Seamless Real-Time Updates

**Server-Sent Events (SSE)** is an exceptionally clean and lightweight protocol used in front-end system design for **unidirectional (one-way) real-time communication**.

When an application requires continuous data streaming from the server to the client (browser)—such as live news feeds, stock tickers, social media timelines, or notification alerts—without requiring the client to send data back over the same channel, SSE serves as the ideal architecture.

---

## 1. What are Server-Sent Events (SSE)?

* **Continuous HTTP Connection:** SSE operates over a standard **HTTP connection**. The client initiates a single HTTP request, and the server keeps that connection open indefinitely, streaming text data chunks (Event Streams) down to the client as they occur.
* **Simplicity:** Unlike WebSockets, SSE is much simpler to implement because it relies directly on standard HTTP (`Content-Type: text/event-stream`) without requiring specialized server upgrade protocols.
* **One-Way Communication:** Data flows strictly **from server to client**. If the client needs to transmit messages back to the server, it handles those mutations via standard HTTP POST or Fetch API requests.

---

## 2. Key Architectural Features of SSE

1. **Built-In Automatic Reconnection:** If network connectivity drops, the browser's native `EventSource` API automatically attempts to reconnect to the server behind the scenes. In contrast, WebSocket reconnections require custom logic implementation.
2. **Text-Based Event Streams:** Data is transmitted as UTF-8 encoded plain text streams structured with fields like `data:`, `event:`, and `id:`.
3. **Firewall and Proxy Friendly:** Because SSE runs natively over standard HTTP, it easily bypasses corporate firewalls and strict proxy configurations that occasionally block or restrict WebSocket connections.

---

## 3. Code Example: Front-End SSE Client Manager (Vanilla TypeScript / JavaScript)

Modern browsers provide the native **`EventSource`** API for handling SSE. Here is a production-grade manager implementation:

```typescript
class SSEManager {
  private eventSource: EventSource | null = null;

  constructor(
    private streamUrl: string,
    private onMessageReceived: (data: any, eventType: string) => void,
    private onErrorOccurred?: (error: Event) => void
  ) {}

  public connect(): void {
    if (this.eventSource) {
      return;
    }

    // Establish connection via EventSource
    this.eventSource = new EventSource(this.streamUrl, {
      withCredentials: true // Include if cookies or auth headers are required
    });

    // Triggered when connection successfully opens
    this.eventSource.onopen = () => {
      console.log('SSE connection established successfully.');
    };

    // Triggered upon receiving default unnamed messages
    this.eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        this.onMessageReceived(parsedData, 'message');
      } catch (err) {
        // Fallback if data is raw plain text
        this.onMessageReceived(event.data, 'message');
      }
    };

    // Listen for custom named events sent by the server
    this.eventSource.addEventListener('price_update', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.onMessageReceived(data, 'price_update');
    });

    // Triggered on connection drop or error
    this.eventSource.onerror = (error) => {
      console.warn('SSE connection encountered an error or dropped. Browser will auto-reconnect...', error);
      if (this.onErrorOccurred) {
        this.onErrorOccurred(error);
      }
      
      // Note: EventSource automatically attempts recovery, 
      // but custom monitoring can be added via eventSource.readyState if needed.
    };
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('SSE connection closed intentionally.');
    }
  }
}

// --- Usage Example ---
const stockStreamer = new SSEManager(
  'https://api.example.com/stocks/live-feed',
  (data, eventType) => {
    console.log(`[${eventType}] Live stream data received:`, data);
    // Update application UI state here
  },
  (err) => {
    console.error('SSE stream error:', err);
  }
);

// Connect the stream
stockStreamer.connect();

// Disconnect when component unmounts
// stockStreamer.disconnect();

```

---

## 4. WebSockets vs. Server-Sent Events (SSE)

| Feature                     | Server-Sent Events (SSE)                                | WebSockets                                                        |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| **Communication Direction** | Unidirectional (Server $\rightarrow$ Client only)       | Full-Duplex / Bidirectional (Client $\longleftrightarrow$ Server) |
| **Underlying Protocol**     | Standard HTTP                                           | WebSocket Protocol (`ws://` / `wss://`)                           |
| **Auto-Reconnection**       | **Built-in** (Handled natively by the browser)          | Manual (Requires custom backoff implementation)                   |
| **Data Format**             | Text-based event streams                                | Binary and text framing                                           |
| **Ideal Use Cases**         | Live feeds, notifications, dashboard stats, live scores | Real-time chat apps, multiplayer gaming, collaborative tools      |
