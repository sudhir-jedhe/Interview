When a CPU-intensive task runs on the main thread in Node.js, it blocks the single-threaded Event Loop. This prevents incoming network sockets, I/O callbacks, and other HTTP requests from being processed—causing latency to skyrocket across **all** API endpoints until the CPU task completes.

Here is how to systematically solve this issue, structured into **Immediate Mitigation**, **Architectural Fixes**, and **System-Level Offloading**.

---

## 1. Immediate Mitigation (Emergency Response)

If this is happening in production right now:

* **Shed Heavy Traffic / Rate Limit:** Apply edge rate limits (via Cloudflare, AWS WAF, or NGINX) specifically to the endpoint triggering the CPU-intensive operation to prevent complete service collapse.
* **Isolate Instances / Circuit Break:** Route requests to the CPU-bound endpoint away from general API pods, or return `HTTP 503 Service Unavailable` on that specific route temporarily to restore health for the rest of the application.
* **Horizontal Scaling:** Temporarily scale up your container pod count. While it won't fix Event Loop blocking on a per-pod basis, it increases the total pool of available Event Loops across nodes.

---

## 2. Code-Level & Architectural Fixes

### Option A: Offload to Worker Threads (In-Process Parallelism)

For CPU tasks that must execute as part of an API request flow (e.g., small-to-medium image manipulations, hashing, PDF compilation), offload the computation from the main Event Loop to a **Worker Thread Pool** using libraries like **Piscina**.

```text
Incoming HTTP Request ──► [ Main Event Loop ] ──(Delegate Task)──► [ Piscina Worker Pool ]
                                 │                                         │
                         (Free to handle                                 (Executes CPU
                         other requests)                                  heavy task)
                                 ▲                                         │
                                 └─────────────(Return Result)─────────────┘

```

**Implementation Example using Piscina:**

```typescript
import express from 'express';
import Piscina from 'piscina';
import path from 'path';

const app = express();

// Initialize worker pool (auto-sized to CPU core count)
const workerPool = new Piscina({
  filename: path.resolve(__dirname, 'workers/heavyTaskWorker.js'),
  maxThreads: Math.max(1, require('os').cpus().length - 1),
});

// CPU-Intensive Route
app.post('/api/v1/process-image', async (req, res, next) => {
  try {
    // Main thread stays non-blocking; work runs on background thread
    const result = await workerPool.run(req.body);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// Other routes remain fast and responsive!
app.get('/api/v1/health', (req, res) => res.send('OK'));

```

---

### Option B: Asynchronous Background Job Queue (Decoupled Worker Services)

For heavy CPU workloads (e.g., generating 100-page reports, processing bulk CSV imports, video transcoding), **never run them inside the HTTP request-response cycle**.

Convert the endpoint into an **Asynchronous Job Producer**:

1. **Accept Request:** Receive payload and push job metadata into a persistent Redis queue (using **BullMQ** or **RabbitMQ**).
2. **Immediate Response:** Return `HTTP 202 Accepted` with a `jobId` so the client can poll status or listen via WebSockets.
3. **Dedicated Workers:** Dedicated, isolated worker processes (running outside the API web tier) pull jobs from the queue and process them.

```text
Client ──► [ API Pod ] ──► Enqueue Job ──► [ Redis / BullMQ ]
               │                                   │
       (HTTP 202 Accepted)                         ▼
                                         [ Background Worker Pod ]
                                         (Runs CPU Task Independently)

```

---

### Option C: Task Chunking via `setImmediate()` (Cooperative Multitasking)

If the CPU task involves processing a large array or dataset in memory, break the computation into smaller execution chunks and yield control back to the Event Loop between chunks:

```javascript
// Non-blocking processing of a massive array
function processLargeArrayInChunks(array, processChunk, callback) {
  let index = 0;
  const chunkSize = 1000;

  function doChunk() {
    const end = Math.min(index + chunkSize, array.length);
    for (; index < end; index++) {
      processChunk(array[index]);
    }

    if (index < array.length) {
      // Yield control back to Event Loop to process incoming I/O
      setImmediate(doChunk);
    } else {
      callback();
    }
  }

  doChunk();
}

```

---

## 3. Microservice / Specialized Infrastructure Isolation

If the CPU task is inherently resource-heavy and language-bound (e.g., Machine Learning inference, heavy data processing):

* **Language Choice for Heavy Compute:** Move the heavy computation out of Node.js entirely into a service built with a language optimized for multi-threaded CPU concurrency (e.g., **Go**, **Rust**, or **Python** with multiprocessing).
* **Dedicated Compute Cluster:** Deploy the specialized service on dedicated high-CPU cloud instances (e.g., AWS `c6i` instances) separated completely from your API web servers.

---

## Summary Decision Matrix

| Scenario                                                                   | Recommended Strategy                                                        |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Short CPU tasks (< 500ms)** needed synchronously in HTTP response        | Use **Worker Threads (Piscina)** to unblock the main thread.                |
| **Long CPU tasks (> 1 second)** like report generation or video processing | Convert to **Async Queue (BullMQ/Redis)** with `HTTP 202 Accepted`.         |
| **Large array iterations/data transformations** in memory                  | Use **Task Chunking (`setImmediate`)** to yield to the Event Loop.          |
| **Heavy ML/Data Science workloads**                                        | Microservice isolation in **Go / Rust / Python** on separate compute nodes. |

Show me how to set up an asynchronous background task queue using BullMQ, Redis, and Express.js.

Here is a complete, production-grade guide to setting up an asynchronous background task queue using **BullMQ**, **Redis**, and **Express.js** with TypeScript.

This pattern converts long-running, CPU-intensive operations (such as generating reports, processing images, or sending bulk emails) into non-blocking background jobs.

---

### Folder Architecture

```text
bullmq-express-demo/
├── src/
│   ├── config/
│   │   └── redis.ts
│   ├── queues/
│   │   └── report.queue.ts
│   ├── workers/
│   │   └── report.worker.ts
│   └── app.ts
├── package.json
└── tsconfig.json

```

---

### Step 1: Install Dependencies

```bash
npm install express bullmq ioredis
npm install -D typescript @types/node @types/express ts-node

```

---

### Step 2: Shared Redis Connection Configuration (`src/config/redis.ts`)

BullMQ uses `ioredis` under the hood. Create a shared Redis connection configuration object.

```typescript
import { ConnectionOptions } from 'bullmq';

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  // maxRetriesPerRequest MUST be null for BullMQ workers
  maxRetriesPerRequest: null,
};

```

---

### Step 3: Define Queue Producer & Job Interface (`src/queues/report.queue.ts`)

Define the payload structure and export a dedicated `Queue` instance to add jobs from Express controllers.

```typescript
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export interface ReportJobData {
  userId: string;
  reportType: 'PDF' | 'CSV';
  filters: Record<string, any>;
}

export const REPORT_QUEUE_NAME = 'report-generation-queue';

// Create and export the Queue instance
export const reportQueue = new Queue<ReportJobData>(REPORT_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs up to 3 times
    backoff: {
      type: 'exponential', // Exponential backoff strategy
      delay: 5000,         // Initial delay 5 seconds
    },
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs in Redis
    removeOnFail: { count: 500 },     // Keep last 500 failed jobs for debugging
  },
});

```

---

### Step 4: Implement Worker Process (`src/workers/report.worker.ts`)

The worker process pulls jobs from Redis and executes the heavy processing. In production, this can run in a separate process or container to keep the Express server lightweight.

```typescript
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { REPORT_QUEUE_NAME, ReportJobData } from '../queues/report.queue';

/**
 * Simulated Heavy CPU/IO Operation
 */
async function processReport(job: Job<ReportJobData>): Promise<{ downloadUrl: string }> {
  const { userId, reportType } = job.data;
  
  console.log(`[Worker] Starting job ${job.id} for user ${userId} (${reportType})...`);

  // Update progress periodically (0% -> 100%)
  await job.updateProgress(10);

  // Simulate heavy processing delay (e.g., 8 seconds)
  await new Promise((resolve) => setTimeout(resolve, 4000));
  await job.updateProgress(50);

  await new Promise((resolve) => setTimeout(resolve, 4000));
  await job.updateProgress(100);

  console.log(`[Worker] Job ${job.id} completed successfully.`);

  return {
    downloadUrl: `https://storage.example.com/reports/${userId}_${job.id}.${reportType.toLowerCase()}`,
  };
}

// Create and start the Worker
export const reportWorker = new Worker<ReportJobData>(
  REPORT_QUEUE_NAME,
  async (job) => {
    return await processReport(job);
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 jobs concurrently on this worker
  }
);

// --- Event Listeners for Observability ---
reportWorker.on('completed', (job, result) => {
  console.log(` Job ${job.id} has completed! Result:`, result);
});

reportWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed with error: ${err.message}`);
});

reportWorker.on('progress', (job, progress) => {
  console.log(` Job ${job.id} progress: ${progress}%`);
});

```

---

### Step 5: Express API Application (`src/app.ts`)

The Express controller accepts the request, pushes a job into the queue, and immediately responds with `HTTP 202 Accepted` along with a `jobId` for status polling.

```typescript
import express, { Request, Response } from 'express';
import { reportQueue, ReportJobData } from './queues/report.queue';

// Import worker so it starts listening in the same app (or launch in separate process)
import './workers/report.worker';

const app = express();
app.use(express.json());

// --- ROUTE 1: Enqueue Asynchronous Job (Non-blocking: < 10ms response time) ---
app.post('/api/v1/reports/generate', async (req: Request, res: Response) => {
  const { userId, reportType, filters } = req.body;

  if (!userId || !reportType) {
    return res.status(400).json({ error: 'userId and reportType are required.' });
  }

  try {
    // Add job to BullMQ queue
    const job = await reportQueue.add(
      'generate-user-report', // Job name
      { userId, reportType, filters } as ReportJobData
    );

    // Immediately return HTTP 202 Accepted
    return res.status(202).json({
      message: 'Report generation queued successfully.',
      jobId: job.id,
      statusUrl: `/api/v1/reports/status/${job.id}`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 2: Poll Job Status & Progress ---
app.get('/api/v1/reports/status/:jobId', async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const job = await reportQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found or expired.' });
    }

    const state = await job.getState(); // 'active' | 'completed' | 'failed' | 'delayed' | 'waiting'
    const progress = job.progress;
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    return res.json({
      jobId: job.id,
      state,
      progress,
      result: state === 'completed' ? result : null,
      error: state === 'failed' ? failedReason : null,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on http://localhost:${PORT}`);
});

```

---

### Step 6: Test the Flow with Curl

#### 1. Enqueue Job

```bash
curl -X POST http://localhost:3000/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -d '{"userId": "usr_9988", "reportType": "PDF", "filters": {"year": 2026}}'

```

**Response ($< 10\text{ms}$):**

```json
{
  "message": "Report generation queued successfully.",
  "jobId": "1",
  "statusUrl": "/api/v1/reports/status/1"
}

```

#### 2. Poll Status During Execution

```bash
curl http://localhost:3000/api/v1/reports/status/1

```

**Response (In Progress):**

```json
{
  "jobId": "1",
  "state": "active",
  "progress": 50,
  "result": null,
  "error": null
}

```

**Response (After Completion):**

```json
{
  "jobId": "1",
  "state": "completed",
  "progress": 100,
  "result": {
    "downloadUrl": "https://storage.example.com/reports/usr_9988_1.pdf"
  },
  "error": null
}

```

---

### Production Best Practices for BullMQ

1. **Separate Web and Worker Processes:** Run `node dist/app.js` (Web API) and `node dist/workers/report.worker.js` (Worker Process) in distinct container instances/pods. This guarantees that background worker workloads will never starve Express API endpoints of CPU or memory.
2. **Handle Graceful Shutdown:** Listen to `SIGINT`/`SIGTERM` signals and call `await reportWorker.close()` before exiting processes so active jobs finish cleanly without getting orphaned.
3. **Use Bull-Board Dashboard:** Attach [@bull-board/express](https://github.com/felixmosh/bull-board) middleware to your Express app for a visual UI to monitor, retry, or purge jobs directly from your browser.

Show me how to attach the Bull-Board UI dashboard to Express to monitor and retry BullMQ jobs visually.

Attaching **Bull-Board** to your Express app provides a real-time, visual UI in your browser to inspect job statuses (Active, Waiting, Completed, Failed, Delayed), view error stack traces, inspect payload data, and manually trigger job retries or purges.

Here is a step-by-step guide using `@bull-board/express` and BullMQ with TypeScript.

---

### Step 1: Install Dependencies

Install the core Bull-Board package and its Express adapter:

```bash
npm install @bull-board/express @bull-board/api

```

---

### Step 2: Configure Bull-Board Adapter in Express (`src/app.ts`)

You create an `ExpressAdapter`, register your queues using `BullMQAdapter`, and mount the router onto a protected route path (such as `/admin/queues`).

```typescript
import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

// Import your existing queues
import { reportQueue } from './queues/report.queue';
// import { emailQueue } from './queues/email.queue'; // Add any other queues you have

const app = express();
app.use(express.json());

// 1. Create the Express Adapter for Bull-Board
const serverAdapter = new ExpressAdapter();

// Set the base path where the UI will be mounted
serverAdapter.setBasePath('/admin/queues');

// 2. Initialize Bull-Board with your registered queues
createBullBoard({
  queues: [
    new BullMQAdapter(reportQueue),
    // new BullMQAdapter(emailQueue), // Register multiple queues here
  ],
  serverAdapter: serverAdapter,
});

// 3. (Production Best Practice) Protect the admin UI route
const basicAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Replace with environment variables in production
  if (username === 'admin' && password === 'supersecret') {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials');
};

// 4. Mount Bull-Board router onto Express
app.use('/admin/queues', basicAuthMiddleware, serverAdapter.getRouter());

// --- YOUR EXISTING EXPRESS ROUTES BELOW ---
app.get('/api/v1/health', (req, res) => res.json({ status: 'OK' }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Bull-Board Dashboard available at http://localhost:${PORT}/admin/queues`);
});

```

---

### What You Get in the Bull-Board UI

Navigating to **`http://localhost:3000/admin/queues`** opens a dashboard that gives you full control over your background jobs:

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │  Bull-Board Dashboard                                                  │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Queues: [ report-generation-queue ]                                   │
 │                                                                        │
 │  Tabs: [ Latest ] [ Active (2) ] [ Waiting (0) ] [ Failed (1) ] ...   │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Job ID: #102                                                         │
 │  Name: generate-user-report                                            │
 │  Data: { "userId": "usr_9988", "reportType": "PDF" }                  │
 │  Progress: [████████████████████░░░░░░░░] 60%                          │
 │                                                                        │
 │  Actions: [ 🔄 Retry Job ]   [ 🗑️ Clean/Delete ]   [ ⏸️ Pause Queue ] │
 └────────────────────────────────────────────────────────────────────────┘

```

---

### Features & Capabilities Supported Out-of-the-Box

1. **Visual Job Retries:** Click the **Retry** button on any failed job to immediately re-enqueue it with its original payload data.
2. **Payload & Error Inspection:** Inspect raw JSON job arguments, view error messages, and trace back-end exception stack traces directly in the browser.
3. **Queue Controls:** Pause processing, resume queue workers, or clear accumulated completed/failed job logs in bulk.
4. **Search & Filter:** Filter jobs by job ID, state, or search for specific parameters inside the job payload.

---

### Production Best Practices

* **Always Protect the Dashboard Path:** Never expose the dashboard to the public internet without authentication (Basic Auth, OAuth, or an admin session check middleware) as it allows modifying or deleting database-backed queue data.
* **Read-Only Mode Option:** If you want non-admin engineers to view job status without the ability to trigger retries or deletions, you can configure Bull-Board with read-only settings:

```typescript
createBullBoard({
  queues: [new BullMQAdapter(reportQueue)],
  serverAdapter,
  options: {
    uiConfig: {
      boardTitle: 'Production Queue Monitor',
    },
  },
});

```

Show me how to stream BullMQ job progress updates to a React client in real time using Socket.io instead of polling.

Streaming job updates from **BullMQ** to a **React** client using **Socket.io** turns an asynchronous task into a real-time user experience. Instead of making the client poll the server repeatedly, the server pushes job status and progress events directly to the client over a persistent WebSocket connection.

---

### System Architecture Flow

```text
 React Client             Express + Socket.io             BullMQ Worker
      │                            │                            │
      │── 1. POST /api/reports ───►│                            │
      │   (Returns jobId)          │── 2. Add Job to Queue ────►│
      │                            │                            │
      │── 3. Join Socket Room ────►│                            │
      │   emit('joinJob', jobId)   │                            │
      │                            │◄── 4. Job Progress Event ──│
      │                            │    (job.progress = 50%)    │
      │◄── 5. Push Real-time ──────│                            │
      │    'jobProgress' (50%)     │                            │
      │                            │◄── 6. Job Completed ───────│
      │◄── 7. Push 'jobCompleted' ─│                            │

```

---

## 1. Backend Setup (Node.js, Express, Socket.io, BullMQ)

### Folder Architecture

```text
backend/
├── src/
│   ├── config/
│   │   └── redis.ts
│   ├── queues/
│   │   └── report.queue.ts
│   ├── workers/
│   │   └── report.worker.ts
│   ├── sockets/
│   │   └── jobSocket.ts
│   └── app.ts
├── package.json
└── tsconfig.json

```

### Step 1: Redis Configuration (`src/config/redis.ts`)

```typescript
import { ConnectionOptions } from 'bullmq';

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

```

### Step 2: Queue & Worker Setup (`src/queues/report.queue.ts` & `src/workers/report.worker.ts`)

Define the queue and worker. The worker updates job progress using `job.updateProgress(percent)`.

```typescript
// src/queues/report.queue.ts
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export interface ReportJobData {
  userId: string;
  reportType: string;
}

export const REPORT_QUEUE_NAME = 'report-stream-queue';

export const reportQueue = new Queue<ReportJobData>(REPORT_QUEUE_NAME, {
  connection: redisConnection,
});

```

```typescript
// src/workers/report.worker.ts
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { REPORT_QUEUE_NAME, ReportJobData } from '../queues/report.queue';

export const reportWorker = new Worker<ReportJobData>(
  REPORT_QUEUE_NAME,
  async (job: Job<ReportJobData>) => {
    // Step 1: Start
    await job.updateProgress(10);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Processing
    await job.updateProgress(50);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 3: Almost done
    await job.updateProgress(90);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 4: Complete
    await job.updateProgress(100);

    return {
      downloadUrl: `https://storage.example.com/reports/${job.data.userId}_${job.id}.pdf`,
    };
  },
  { connection: redisConnection }
);

```

### Step 3: Socket.io Integration & BullMQ Event Forwarding (`src/sockets/jobSocket.ts`)

Bind BullMQ worker events (`progress`, `completed`, `failed`) directly to Socket.io room broadcasts using `job.id` as the room topic.

```typescript
import { Server, Socket } from 'socket.io';
import { reportWorker } from '../workers/report.worker';

export function setupJobSocket(io: Server) {
  // 1. Client connects and joins a specific job room
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected to WebSocket: ${socket.id}`);

    socket.on('joinJob', (jobId: string) => {
      socket.join(`job:${jobId}`);
      console.log(`👤 Client ${socket.id} joined room for job:${jobId}`);
    });

    socket.on('leaveJob', (jobId: string) => {
      socket.leave(`job:${jobId}`);
      console.log(`👤 Client ${socket.id} left room for job:${jobId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // 2. Forward BullMQ Worker Events to Socket.io Rooms
  reportWorker.on('progress', (job, progress) => {
    io.to(`job:${job.id}`).emit('jobProgress', {
      jobId: job.id,
      progress,
    });
  });

  reportWorker.on('completed', (job, result) => {
    io.to(`job:${job.id}`).emit('jobCompleted', {
      jobId: job.id,
      result,
    });
  });

  reportWorker.on('failed', (job, err) => {
    if (job) {
      io.to(`job:${job.id}`).emit('jobFailed', {
        jobId: job.id,
        error: err.message,
      });
    }
  });
}

```

### Step 4: Express Server Entrypoint (`src/app.ts`)

Attach Express and Socket.io to a shared HTTP server.

```typescript
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { reportQueue } from './queues/report.queue';
import { setupJobSocket } from './sockets/jobSocket';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// Initialize Socket.io Server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // React Client Origin
    methods: ['GET', 'POST'],
  },
});

// Setup Socket logic
setupJobSocket(io);

// Enqueue Route
app.post('/api/v1/reports', async (req: Request, res: Response) => {
  const { userId, reportType } = req.body;

  const job = await reportQueue.add('generate-report', { userId, reportType });

  return res.status(202).json({
    message: 'Report job enqueued',
    jobId: job.id,
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
});

```

---

## 2. Frontend Setup (React + TypeScript + Socket.io Client)

### Step 1: Install `socket.io-client`

```bash
npm install socket.io-client

```

### Step 2: Real-time Job Progress React Component (`JobProgressTracker.tsx`)

This component enqueues a report via HTTP, joins the Socket.io room using the returned `jobId`, listens for progress and completion events, and automatically leaves the room when finished.

```tsx
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Shared socket instance
const socket: Socket = io('http://localhost:4000', {
  autoConnect: false,
});

export const JobProgressTracker: React.FC = () => {
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect socket on component mount
    socket.connect();

    // Listen for progress updates
    socket.on('jobProgress', (data: { jobId: string; progress: number }) => {
      console.log(`[Socket] Progress for ${data.jobId}: ${data.progress}%`);
      setProgress(data.progress);
    });

    // Listen for job completion
    socket.on('jobCompleted', (data: { jobId: string; result: { downloadUrl: string } }) => {
      console.log(`[Socket] Job ${data.jobId} completed!`, data.result);
      setStatus('completed');
      setProgress(100);
      setDownloadUrl(data.result.downloadUrl);
    });

    // Listen for job failure
    socket.on('jobFailed', (data: { jobId: string; error: string }) => {
      console.error(`[Socket] Job ${data.jobId} failed:`, data.error);
      setStatus('failed');
      setError(data.error);
    });

    return () => {
      socket.off('jobProgress');
      socket.off('jobCompleted');
      socket.off('jobFailed');
      socket.disconnect();
    };
  }, []);

  const handleStartReport = async () => {
    setStatus('processing');
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      // 1. Post request to enqueue the job
      const response = await fetch('http://localhost:4000/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr_4432', reportType: 'PDF' }),
      });

      const data = await response.json();
      const newJobId = data.jobId;

      setJobId(newJobId);

      // 2. Join the Socket.io room for this specific job
      socket.emit('joinJob', newJobId);
    } catch (err: any) {
      setStatus('failed');
      setError(err.message || 'Failed to start job');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '480px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Real-Time Report Generator</h2>

      {status === 'idle' && (
        <button onClick={handleStartReport} style={{ padding: '10px 16px', cursor: 'pointer' }}>
          Generate Report
        </button>
      )}

      {status === 'processing' && (
        <div>
          <p>Processing Job ID: <strong>{jobId}</strong></p>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', height: '20px' }}>
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: '#3b82f6',
                height: '100%',
                borderRadius: '4px',
                transition: 'width 0.3s ease-in-out',
              }}
            />
          </div>
          <p style={{ textAlign: 'right' }}>{progress}%</p>
        </div>
      )}

      {status === 'completed' && (
        <div style={{ color: 'green' }}>
          <h3>Report Ready!</h3>
          {downloadUrl && (
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              Download Report PDF
            </a>
          )}
          <br /><br />
          <button onClick={handleStartReport}>Generate Another</button>
        </div>
      )}

      {status === 'failed' && (
        <div style={{ color: 'red' }}>
          <h3>Job Failed</h3>
          <p>{error}</p>
          <button onClick={handleStartReport}>Try Again</button>
        </div>
      )}
    </div>
  );
};

```

---

### Key Production Enhancements

1. **Reconnection Recovery:** If a user temporarily loses connection or refreshes their browser, fetch the current state from the database or BullMQ (`queue.getJob(jobId)`) via a fallback REST endpoint upon initial load, then resume listening over Socket.io.
2. **Distributed Workers (Redis Pub/Sub):** If your Express WebSocket server and BullMQ workers run on separate container pods, use **`QueueEvents`** from BullMQ. `QueueEvents` listens to Redis Pub/Sub directly, enabling the API/Socket server to receive progress events from remote worker pods:

```typescript
import { QueueEvents } from 'bullmq';
import { redisConnection } from './config/redis';

const queueEvents = new QueueEvents(REPORT_QUEUE_NAME, { connection: redisConnection });

queueEvents.on('progress', ({ jobId, data }) => {
  io.to(`job:${jobId}`).emit('jobProgress', { jobId, progress: data });
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  io.to(`job:${jobId}`).emit('jobCompleted', { jobId, result: returnvalue });
});

```
