The relationship between **CPU cores** and a **Node.js process** is one of the most fundamental concepts in Node.js architecture.

A single Node.js process does not automatically utilize all available CPU cores on a multi-core machine. By default, **one Node.js process runs its main execution code on a single thread on a single CPU core**, though it uses hidden background threads for certain tasks.

---

### 1. The Single-Threaded Nature (Main Thread)

* When you run `node app.js`, Node.js spins up an OS process.
* JavaScript execution, the **V8 Engine**, and the **Event Loop** all run on **one single thread** (the main thread).
* This means your application code (routing, data transformation, business logic) executes on **one CPU core at a time**.
* If a server has 8 CPU cores and you run a standard Node.js script, **7 cores remain mostly idle** while 1 core handles the execution.

---

### 2. The Hidden Threads: `libuv` Thread Pool

While your JS execution is single-threaded, Node.js uses **`libuv`** under the hood for asynchronous I/O:

* **Network I/O:** Handled asynchronously by OS primitives (`epoll`, `kqueue`, `IOCP`), requiring very little CPU intervention.
* **File System & Crypto & Compression:** Handled by a hidden background thread pool (default **4 threads**).
* If you run heavy hashing (`crypto.pbkdf2`) or large file operations, `libuv` distributes these tasks across its background threads, which can temporarily engage multiple CPU cores.
* You can adjust the size of this pool via environment variable:

```bash
UV_THREADPOOL_SIZE=8 node app.js

```

---

### 3. How to Utilize All CPU Cores

To fully exploit a multi-core system, you must scale horizontally by spawning multiple instances of Node.js:

| Method                                         | Mechanism                                                                                             | Best Use Case                                                |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Cluster Module** (`node:cluster`)            | Spawns multiple child processes that share the same server port (round-robin routing on Linux/macOS). | In-app native clustering without external tools.             |
| **Process Managers (PM2)**                     | Runs and monitors multiple independent processes across all cores in "cluster mode".                  | Production web apps & APIs (recommended standard).           |
| **Worker Threads** (`node:worker_threads`)     | Runs separate JS execution threads within the *same* process, sharing memory (`SharedArrayBuffer`).   | CPU-intensive algorithms (image processing, data crunching). |
| **Container / Pod Orchestration (K8s/Docker)** | Spawns multiple single-core container replicas behind an external load balancer (NGINX, AWS ALB).     | Cloud-native microservices architecture.                     |

---

### 4. Implementation Examples

#### A. Node.js Native Cluster Module

```javascript
import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary master ${process.pid} is running. Forking for ${numCPUs} CPUs...`);

  // Fork a worker process for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Spawning replacement...`);
    cluster.fork();
  });
} else {
  // Workers share the same TCP connection / port
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Handled by worker ${process.pid}\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}

```

#### B. PM2 Cluster Mode (Production Standard)

Instead of writing cluster boilerplate in your code, PM2 handles process management automatically:

```bash
# Spawns instances equal to the number of available CPU cores
pm2 start app.js -i max

```

#### C. Worker Threads (For CPU-Bound Tasks)

```javascript
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

if (isMainThread) {
  // Spawn worker thread on another core
  const worker = new Worker(new URL(import.meta.url), { workerData: 40 });
  worker.on('message', (result) => console.log('Result:', result));
} else {
  // Heavy CPU work inside thread
  function fibonacci(n) {
    return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
  }
  parentPort.postMessage(fibonacci(workerData));
}

```

---

### Core Takeaway

* **1 Node.js Process** $\approx$ **1 CPU Core** for JS execution.
* For **I/O-heavy workloads** (typical REST APIs, chat apps, database querying), a single core handles thousands of concurrent requests due to non-blocking I/O.
* For **CPU-heavy workloads** or high-throughput production servers, run **1 process per CPU core** using PM2 or native clustering to maximize hardware utilization.
