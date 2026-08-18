WebHooks allow the server to notify the client when there's new data available. The client registers a callback URL with the server and the server sends a message to that URL when there is data to send.

With WebHooks, the client sends requests as usual, but can also listen for and receive requests like a server.

Using the restaurant analogy, when the guest orders a meal, they give the waiter a bell (analogous to the callback URL). The waiter goes to the kitchen and rings the bell as soon as the meal is ready. This allows the client to know, in real-time, about the progress of his order.

WebHooks are superior to polling because you get real-time updates from the server once something changes, without having to make frequent, wasteful requests to the server about that change.

They're also superior to long polling because long polling can consume more client and server resources as it involves keeping connections open, potentially resulting in many open connections.

### Webhooks in React JS

Webhooks are a way for applications to send real-time data to other applications when a specific event occurs. In the context of **React JS**, webhooks are typically used to notify your React app about events that occur in another system, such as a server, a third-party service, or an API. For example, a webhook can notify your React app when a new user registers or when a payment is made.

Webhooks themselves are typically implemented on the server-side, but you can use them effectively in your React application by listening for those events, updating the UI, or taking some action based on the received data.

---

### **How Webhooks Work**

1. **Event Occurrence**: An event happens in an external system, such as a payment gateway processing a payment.
2. **Webhook Trigger**: The external system triggers a webhook request to a specific URL.
3. **Webhook Delivery**: The data (usually in the form of a POST request) is delivered to a configured endpoint (usually a server-side URL).
4. **React App Action**: The server processes the webhook request and sends data to the React application, either directly or via a backend API.

---

### **How to Implement Webhooks in React JS**

Although React is a frontend library and cannot directly listen to webhooks (since they are typically sent to a server), you can set up your server to handle webhooks and then push the data to your React app using something like **WebSockets** or **Server-Sent Events (SSE)**. Here's how you can do it:

---

#### **Step 1: Set Up the Backend to Receive Webhooks**

1. **Install the necessary packages for your backend (Node.js Example)**:
   - Install **express** to set up an HTTP server.
   - Optionally, use **body-parser** to handle incoming JSON requests.

```bash
npm install express body-parser
```

2. **Create a Webhook Endpoint in Node.js**:

```javascript
// server.js (Node.js backend)

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Webhook endpoint that will receive events from an external service
app.post("/webhook", (req, res) => {
  const webhookData = req.body;
  console.log("Webhook received:", webhookData);

  // Process the webhook data (e.g., store it in a database or notify the frontend)

  // Send a response to acknowledge receipt of the webhook
  res.status(200).send("Webhook received successfully");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

In this example:

- **`/webhook`** is the endpoint that the external service will call when an event occurs.
- The **`req.body`** contains the data sent by the external service.

---

#### **Step 2: Push Data from Backend to React Using WebSockets**

To send real-time updates to your React app, we can use **WebSockets**. This allows the server to push data to the React app as soon as the webhook is received.

1. **Install `socket.io` in Node.js**:

```bash
npm install socket.io
```

2. **Modify the Backend to Use WebSockets**:

```javascript
// server.js (Node.js backend)

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// Webhook endpoint that will receive events from an external service
app.post("/webhook", (req, res) => {
  const webhookData = req.body;
  console.log("Webhook received:", webhookData);

  // Emit the webhook data to all connected clients (React app)
  io.emit("webhookEvent", webhookData);

  res.status(200).send("Webhook received successfully");
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

Here, we use **`socket.io`** to emit the `webhookEvent` to all connected clients.

---

#### **Step 3: Set Up the React App to Listen for WebSocket Messages**

1. **Install `socket.io-client` in React**:

```bash
npm install socket.io-client
```

2. **Connect React App to WebSocket**:

```javascript
// WebhookListener.js (React component)

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const WebhookListener = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server (Node.js)
    const socket = io("http://localhost:5000");

    // Listen for 'webhookEvent' from the server
    socket.on("webhookEvent", (data) => {
      console.log("Received webhook data:", data);
      setMessage(data);
    });

    return () => {
      // Clean up the WebSocket connection on component unmount
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Webhook Listener</h1>
      <div>
        {message ? (
          <pre>{JSON.stringify(message, null, 2)}</pre>
        ) : (
          <p>Waiting for webhook data...</p>
        )}
      </div>
    </div>
  );
};

export default WebhookListener;
```

In this example:

- The React component **`WebhookListener`** connects to the Node.js backend using **WebSocket** (`socket.io-client`).
- It listens for events (`'webhookEvent'`) and updates the state when a new message is received.

---

#### **Step 4: Test the Webhook**

1. **Start your Node.js server**:

```bash
node server.js
```

2. **Start your React app**:

```bash
npm start
```

3. **Simulate a Webhook Event**:
   - Use a tool like **Postman** or **curl** to send a POST request to the `/webhook` endpoint with some mock data.

```bash
curl -X POST http://localhost:5000/webhook -H "Content-Type: application/json" -d '{"event": "user_registered", "user": "John Doe"}'
```

4. **React App**: The React app will now receive the webhook data in real time and display it.

---

### **Summary**

- **Backend (Node.js)**: Handles receiving webhook data and sends updates to React via WebSockets.
- **Frontend (React)**: Listens for real-time updates and reacts to the data received.

Webhooks are great for real-time communication between systems. This setup can be extended to handle more complex use cases such as payment notifications, user actions, or any other event that your backend system might want to notify the frontend about.

Webhooks are **server-to-server** communication mechanisms. A backend server (like Stripe, GitHub, or Shopify) sends an HTTP POST payload to a target URL whenever an event occurs (e.g., `payment_intent.succeeded`).

Because Webhooks require a public, always-available HTTP endpoint to receive incoming POST requests, **you cannot receive Webhooks directly inside a client-side React app**.

---

## Why Webhooks Don't Work directly in React Client Code

1. **Client Security:** Browsers do not expose a public server port or URL to accept incoming HTTP POST requests from external services.
2. **Secret Keys:** Webhooks use secret signatures (like HMAC-SHA256) to verify that the request actually came from the provider. Storing Webhook secrets in React exposes them to anyone inspecting the frontend.
3. **App Lifecycles:** Users open and close browser tabs. If a user closes your React app, the Webhook payload would be lost forever.

---

## The Standard Architecture

To handle Webhooks in a React application, you set up a **Backend Server** (Node.js, Next.js API Routes, Express, AWS Lambda, etc.) to listen for the event, verify its authenticity, update your database, and then inform your React app.

```
[ External Service ] ──(1. Webhook POST)──► [ Backend Server / API Route ]
  (e.g., Stripe)                                     │
                                            (2. Process & Update DB)
                                                     │
                                                     ▼
[ React Frontend ]   ◄──(3. Real-Time Update)── [ Database ]

```

---

## Complete End-to-End Example (React + Node.js/Next.js)

### Step 1: Handle Webhook on the Backend (Node.js/Express)

```javascript
// server.js (Node.js / Express Backend)
const express = require('express');
const app = express();

// Stripe Webhook Endpoint Example
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // 1. Verify webhook signature using backend secret
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Handle the specific event type
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`Payment Succeeded for ID: ${paymentIntent.id}`);

      // Update database status (e.g., set order status to 'PAID')
      await updateOrderStatus(paymentIntent.metadata.orderId, 'PAID');
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // 3. Acknowledge receipt to the webhook sender
  res.json({ received: true });
});

app.listen(4000, () => console.log('Webhook server running on port 4000'));

```

---

### Step 2: Notify the React Frontend

Once your backend receives the Webhook and updates your database, there are **three common ways** to get that updated state into your React application:

#### Strategy A: Real-Time WebSockets / Server-Sent Events (Best UX)

When the backend receives the Webhook, it pushes a real-time event to the active React client using WebSockets (Socket.io) or SSE.

```jsx
// React Component (WebSocket listener)
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function PaymentStatus({ orderId }) {
  const [status, setStatus] = useState("PROCESSING");

  useEffect(() => {
    // Listen for real-time payment updates triggered by the backend webhook handler
    socket.on(`order-updated:${orderId}`, (data) => {
      setStatus(data.status); // Updates UI to 'PAID' automatically
    });

    return () => socket.off(`order-updated:${orderId}`);
  }, [orderId]);

  return (
    <div>
      <h3>Order Status: {status}</h3>
      {status === "PROCESSING" && <p>Waiting for payment confirmation...</p>}
      {status === "PAID" && <p>Payment confirmed! Thank you.</p>}
    </div>
  );
}

export default PaymentStatus;
```

---

#### Strategy B: Polling (Simplest)

Your React component queries your backend API periodically until the Webhook updates the database.

```jsx
// React Component (Polling Example)
import React, { useEffect, useState } from "react";

function OrderConfirmation({ orderId }) {
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    // Poll the backend every 3 seconds to check if the Webhook has updated the order
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (data.status === "PAID") {
        setStatus("PAID");
        clearInterval(interval); // Stop polling when payment is confirmed
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return <div>Order Status: {status}</div>;
}
```

---

#### Strategy C: Full-Stack React Frameworks (Next.js API Routes)

If you use Next.js, Remix, or React Router v7, you can write Webhook API endpoints directly inside your React project repository:

```typescript
// app/api/webhooks/route.ts (Next.js App Router Webhook Handler)
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  // Process Webhook payload...
  console.log("Webhook received in Next.js backend route:", payload);

  return NextResponse.json({ success: true }, { status: 200 });
}
```

---

## Local Development: Testing Webhooks with React

During local development, your backend runs on `localhost` (e.g., `http://localhost:4000`), which external services like Stripe or GitHub cannot reach.

To test Webhooks locally:

1. Use **`ngrok`** or **`localtunnel`** to expose your local port:

```bash
npx ngrok http 4000

```

2. Copy the generated HTTPS URL (e.g., `[https://a1b2c3.ngrok-free.app/api/webhooks/stripe](https://a1b2c3.ngrok-free.app/api/webhooks/stripe)`).
3. Paste that public URL into your provider's Webhook configuration dashboard.
