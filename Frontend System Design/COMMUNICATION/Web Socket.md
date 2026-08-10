**WebSocket** is a advanced computer communications protocol that provides a **persistent, full-duplex (bidirectional) communication channel over a single TCP connection** between a client (browser) and a server.

Unlike traditional HTTP requests (which follow a strict request-response lifecycle where the client must always initiate communication), a WebSocket connection remains open continuously. This allows either the client or the server to send data to the other party at any moment without overhead or delay.

---

## 1. How WebSockets Work (The Handshake & Protocol)

1. **The Handshake:** A WebSocket connection starts life as a standard HTTP request. The client sends an HTTP request to the server with special headers (`Upgrade: websocket` and `Connection: Upgrade`).
2. **Protocol Switch:** If the server supports WebSockets, it responds with a `101 Switching Protocols` status code.
3. **Persistent Channel:** The HTTP connection is instantly upgraded to a persistent **WebSocket connection (`ws://` or secure `wss://`)**. From this point forward, communication bypasses HTTP overhead and communicates directly via lightweight TCP frames.

---

## 2. Why WebSockets Matter in Front-End System Design

In modern front-end architectures, WebSockets are the gold standard for real-time applications (e.g., live chat, collaborative document editing, real-time sports tickers, stock trading dashboards, and multiplayer gaming).

### Key Architectural Advantages

* **True Real-Time Updates (Low Latency):** Eliminates the polling delay of short or long polling. Data is pushed by the server the exact microsecond it becomes available.
* **Massive Bandwidth Savings:** Traditional HTTP requests require sending heavy headers (cookies, user-agents, auth tokens) with *every single request*. WebSockets send tiny frames (as small as 2–10 bytes), drastically reducing network payload.
* **Full-Duplex Communication:** Both the client and server can send and receive data simultaneously without blocking each other.

---

## 3. Production-Grade Code Example: WebSocket Manager with Heartbeat & Auto-Reconnect

In a production front-end system, network drops, proxy timeouts, and silent disconnections are common. A robust WebSocket manager must implement **automatic reconnection with exponential backoff**, **heartbeat pings** to keep the connection alive, and **message queuing** when offline.

```typescript
class WebSocketManager {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: number | null = null;
  private isIntentionalClose = false;

  constructor(
    private url: string,
    private onMessage: (data: any) => void,
    private onConnectionChange?: (status: 'connected' | 'disconnected' | 'connecting') => void
  ) {}

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isIntentionalClose = false;
    this.onConnectionChange?.('connecting');
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connected successfully.');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.onConnectionChange?.('connected');
      this.startHeartbeat();
    };

    this.socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        // Ignore server pong responses
        if (parsedData.type === 'pong') return;
        this.onMessage(parsedData);
      } catch (err) {
        console.error('Failed to parse incoming WebSocket message:', err);
      }
    };

    this.socket.onclose = (event) => {
      this.stopHeartbeat();
      this.onConnectionChange?.('disconnected');

      if (!this.isIntentionalClose) {
        console.warn(`WebSocket closed unexpectedly (code: ${event.code}). Attempting reconnect...`);
        this.handleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket encountered an error:', error);
      this.socket?.close();
    };
  }

  public send(payload: object): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
      return true;
    }
    console.warn('WebSocket is not open. Message queued or dropped.');
    return false;
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max WebSocket reconnection attempts reached. Giving up.');
      return;
    }

    this.reconnectAttempts++;
    const jitter = Math.random() * 500; // Prevent thundering herd problem
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000) + jitter;

    console.log(`Reconnecting in ${Math.round(delay)}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    // Send a ping frame every 30 seconds to prevent proxies/load balancers from timing out idle connections
    this.heartbeatInterval = window.setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public disconnect(): void {
    this.isIntentionalClose = true;
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close(1000, 'Client closed connection intentionally');
      this.socket = null;
    }
    this.onConnectionChange?.('disconnected');
  }
}

// --- Usage Example ---
const chatSocket = new WebSocketManager(
  'wss://stream.example.com/chat-room',
  (incomingMessage) => {
    console.log('Real-time message broadcasted from server:', incomingMessage);
  },
  (status) => {
    console.log(`Connection state changed: ${status}`);
  }
);

// Establish connection
chatSocket.connect();

// Send data to server
// chatSocket.send({ action: 'sendMessage', text: 'Hello Front-End System Design!' });

// Disconnect on component unmount
// chatSocket.disconnect();

```
