Here are clear, detailed answers with code examples for the Node.js interview questions from your screenshots.

---

### **Q1: What npm is used for?**

**npm** (Node Package Manager) is the default package manager for Node.js. It allows developers to install, share, and manage third-party dependencies and run project scripts.

```bash
# Initialize a new project package.json
npm init -y

# Install a package locally
npm install express

# Run custom scripts defined in package.json
npm start

```

---

### **Q2: Why does Node.js prefer Error-First Callback?**

An **Error-First Callback** pattern passes an error object as the first argument, followed by the result data. Node.js uses this because asynchronous operations execute out-of-order, making standard synchronous `try/catch` blocks ineffective.

```javascript
const fs = require("fs");

// Error is always the first argument
fs.readFile("file.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File Content:", data);
});
```

---

### **Q3 & Q23: What is V8 and its relationship with Node.js?**

**V8** is Google's open-source JavaScript and WebAssembly engine written in C++.

- **Relationship:** Node.js wraps the V8 engine and provides server-side C++ bindings (file system, network sockets, OS API wrappers) that JavaScript running in a standard web browser cannot access.

---

### **Q4 & Q95: What is `libuv` and how does it work under the hood?**

`libuv` is a multi-platform C library that handles Node.js asynchronous I/O operations.

- **Mechanism:** It provides an abstraction over OS non-blocking network calls (epoll/kqueue) and manages a default **Thread Pool** (4 threads by default) to handle heavy file or DNS operations off the main thread.

---

### **Q5 & Code Challenge Q9: What does Promisifying technique mean in Node.js?**

Promisification converts legacy error-first callback-based functions into modern functions that return a `Promise`.

```javascript
const fs = require("fs");
const util = require("util");

// Convert fs.readFile callback function into a Promise-returning function
const readFilePromise = util.promisify(fs.readFile);

async function run() {
  try {
    const data = await readFilePromise("file.txt", "utf-8");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
run();
```

---

### **Q7: What's the difference between `process.cwd()` vs `__dirname`?**

- **`process.cwd()`:** Returns the current working directory from where the Node.js process was initiated in the terminal.
- **`__dirname`:** Returns the absolute directory path of the source file currently being executed.

```javascript
// Running `node app.js` from `/Users/project`:
console.log(process.cwd()); // /Users/project
console.log(__dirname); // /Users/project/src/controllers
```

---

### **Q9: Difference between returning a callback vs calling a callback**

- **Calling a callback:** Executes the function, but execution of the current function continues to the next lines below unless explicitly interrupted.
- **Returning a callback:** Executes the callback **and immediately exits** the current function execution block.

```javascript
function processUser(user, callback) {
  if (!user) {
    return callback("User required"); // Good: Stops execution early!
  }
  // This code will not run if user was null
  callback(null, user.name);
}
```

---

### **Q10: Local vs Global npm package installation**

- **Local (`npm install pkg`):** Saved inside `./node_modules` of the current project directory and listed in `package.json`.
- **Global (`npm install -g pkg`):** Installed globally on the OS environment path (used for command-line tools like `nodemon`, `pm2`, or `typescript`).

---

### **Q11: Why require modules at the top of a file? Can we require inside functions?**

- **Top of file:** Synchronous module loading happens once during application initialization, avoiding runtime latency and ensuring dependencies are clear.
- **Inside functions:** Yes, you can dynamically `require()` inside functions for lazy-loading heavy modules on-demand.

```javascript
function generatePDF() {
  // Dynamically required only when function is called
  const pdf = require("pdfkit");
  return new pdf();
}
```

---

### **Q13: Built-in Globals in Node.js**

Node.js provides several global identifiers accessible anywhere without requiring them:

- `global`: The global namespace object.
- `process`: Provides information about the running Node process.
- `Buffer`: Handles raw binary data streams.
- `__dirname`, `__filename`: File path utilities (CommonJS).
- `setTimeout`, `setInterval`, `setImmediate`.

---

### **Q18 & Code Challenge Q7: What does `module.exports` vs `exports` do?**

- **`module.exports`:** The actual object returned when another file uses `require()`.
- **`exports`:** A short reference pointer initialized to `module.exports`. If you reassign `exports = ...`, it breaks the reference pointer!

```javascript
// math.js
function add(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
}

// Recommended: Export an object on module.exports
module.exports = { add, sub };
```

---

### **Q20, Q41 & Q98: How Node.js handles threads & Worker Threads**

Node.js runs JavaScript code on a **single main event-loop thread**. However, heavy CPU-bound tasks can block this thread. Node provides the **`worker_threads`** module to spawn true parallel threads sharing memory.

```javascript
// main.js
const { Worker } = require("worker_threads");

const worker = new Worker("./workerTask.js", { workerData: { num: 40 } });
worker.on("message", (result) => console.log("Result from thread:", result));
```

---

### **Q21 & Q68: `require()` (CommonJS) vs `import` (ES6 ESM)**

| Feature     | `require()` (CommonJS)            | `import` (ES6 Module)                          |
| ----------- | --------------------------------- | ---------------------------------------------- |
| **Loading** | Synchronous & Dynamic (Run-time). | Asynchronous & Static (Compile-time).          |
| **Syntax**  | `const fs = require('fs');`       | `import fs from 'fs';`                         |
| **Scope**   | Default in Node.js (`.js` files). | Requires `"type": "module"` in `package.json`. |

---

### **Q28 & Q56: What are Streams and Stream Chaining?**

**Streams** process data piece-by-piece (in chunks) without buffering the whole file in memory.

- **4 Stream Types:** `Readable`, `Writable`, `Duplex`, `Transform`.

**Stream Chaining Example (Gzip Compression):**

```javascript
const fs = require("fs");
const zlib = require("zlib");

// Stream chain: Read -> Compress -> Write
fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("input.txt.gz"));
```

---

### **Q31, Q37, Q55 & Q75: Are EventEmitters Synchronous or Asynchronous?**

**EventEmitters execute listeners SYNCHRONOUSLY** in the order they were registered.

```javascript
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("event", () => console.log("First listener"));
myEmitter.on("event", () => console.log("Second listener"));

console.log("Before emit");
myEmitter.emit("event"); // Synchronous execution!
console.log("After emit");

// Output Order:
// Before emit -> First listener -> Second listener -> After emit
```

---

### **Q33, Q58: What's the Event Loop in Node.js?**

The **Event Loop** is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It offloads tasks to the system kernel or `libuv` thread pool and polls for finished callbacks across distinct phases:

1. **Timers:** Executes callbacks scheduled by `setTimeout()` and `setInterval()`.
2. **Pending Callbacks:** Executes I/O callbacks deferred to the next loop iteration.
3. **Poll Phase:** Retrieves new I/O events and executes their callbacks.
4. **Check Phase:** Executes `setImmediate()` callbacks.
5. **Close Callbacks:** Executes close handlers (e.g., `socket.on('close')`).

---

### **Q46 & Q94: `process.nextTick()` vs `setImmediate()` vs `setTimeout(fn, 0)**`

- **`process.nextTick()`:** Microtask queue. Executes **immediately** right after the current operation completes, before the Event Loop advances to the next phase.
- **`setImmediate()`:** Executes during the **Check Phase** of the Event Loop.
- **`setTimeout(fn, 0)`:** Executes during the **Timers Phase** after a minimum threshold timer expires.

```javascript
setImmediate(() => console.log("1. setImmediate"));
process.nextTick(() => console.log("2. nextTick"));

// Output:
// 2. nextTick
// 1. setImmediate
```

---

### **Q51 & Q77: What are Buffers in Node.js?**

A **Buffer** is a global memory allocation outside the V8 heap used to store raw, unencoded binary data streams directly.

```javascript
// Create a buffer from a string
const buf = Buffer.from("Hello", "utf-8");
console.log(buf); // Output: <Buffer 48 65 6c 6c 6f>
console.log(buf.toString("hex")); // 48656c6c6f
```

---

### **Q63: How to gracefully shutdown a Node.js server?**

Intercept termination signals (`SIGINT`, `SIGTERM`), stop accepting new incoming requests, complete existing processing, close database connections, and exit the process.

```javascript
const express = require("express");
const app = express();
const server = app.listen(3000);

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");

  server.close(() => {
    console.log("HTTP server closed.");
    // Close DB connections here
    process.exit(0);
  });
});
```

---

### **Q65 & Q66: Difference between `exec`, `spawn`, and `fork` in `child_process**`

| Function      | Execution Method               | Buffer / Stream                                     | Best Use Case                                              |
| ------------- | ------------------------------ | --------------------------------------------------- | ---------------------------------------------------------- |
| **`exec()`**  | Runs command in a shell.       | **Buffered** (Stores output in memory up to limit). | Quick small commands (e.g., `ls`, `git status`).           |
| **`spawn()`** | Launches new process directly. | **Streamed** (Data chunks piped directly).          | Large data output, video encoding, long tasks.             |
| **`fork()`**  | Spawns a new Node.js instance. | IPC Communication channel built-in.                 | Running heavy JavaScript tasks in separate Node processes. |

```javascript
const { spawn } = require("child_process");
const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => console.log(`stdout: ${data}`));
```

---

### **Q84: What is Piping in Node.js?**

**Piping** attaches a Readable stream output directly into a Writable stream destination, automatically managing backpressure so memory consumption remains low.

```javascript
const fs = require("fs");

const readStream = fs.createReadStream("largeInput.mp4");
const writeStream = fs.createWriteStream("outputCopy.mp4");

// Pipe streams together safely
readStream.pipe(writeStream);
```

---

### **Q86: `dependencies` vs `devDependencies` vs `peerDependencies**`

- **`dependencies`:** Packages essential to run the production application (`express`, `mongoose`).
- **`devDependencies`:** Tools needed exclusively during development/testing (`jest`, `nodemon`, `eslint`).
- **`peerDependencies`:** Libraries your package expects the consuming host application to install (`react` when building a custom React UI library component).

---

### **Q92: Usage of `NODE_ENV**`

`NODE_ENV` is an environment variable used to set the application operating mode (typically `'development'`, `'production'`, or `'test'`).

```javascript
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  // Enable minification and production error logging
} else {
  app.use(morgan("dev")); // Verbose debug logs in dev
}
```

---

### **Q107: Why separate Express `app` and `server`?**

Separating `app.js` (Express application configuration) from `server.js` (where `app.listen(PORT)` is called) decouples application setup from network port listening.

- **Benefit:** Allows running integration API tests with Supertest (`supertest(app)`) without binding to an actual network port during test runs.

---

### **Q109: `pm2` vs `pm2-runtime**`

- **`pm2`:** Designed for standard virtual machines or bare-metal servers. It runs as a background daemon.
- **`pm2-runtime`:** Designed for **Docker containers**. It runs in the foreground as PID 1 to prevent Docker containers from exiting immediately.

---

## **Code Challenges**

### **Code Challenge Q1: Read files in parallel**

```javascript
const fs = require("fs/promises");

async function readFilesInParallel(filePaths) {
  try {
    const promises = filePaths.map((path) => fs.readFile(path, "utf-8"));
    const results = await Promise.all(promises); // Executes concurrently
    console.log("Parallel contents:", results);
  } catch (err) {
    console.error("Error reading files:", err);
  }
}

readFilesInParallel(["file1.txt", "file2.txt"]);
```

---

### **Code Challenge Q2: Read files in sequence**

```javascript
const fs = require("fs/promises");

async function readFilesInSequence(filePaths) {
  for (const path of filePaths) {
    try {
      const data = await fs.readFile(path, "utf-8"); // Waits for each before starting next
      console.log(`Content of ${path}:`, data);
    } catch (err) {
      console.error(err);
    }
  }
}

readFilesInSequence(["file1.txt", "file2.txt"]);
```

---

### **Code Challenge Q3 & Q4: What is wrong with `async/await` inside `forEach`? Fix it.**

- **The Bug:** `Array.prototype.forEach` does NOT await promises returned by its callback function. Iterations execute concurrently, ignoring sequencing.

```javascript
// BAD:
files.forEach(async (file) => {
  await fs.readFile(file);
}); // Doesn't wait!

// FIX 1: Use for...of loop for sequential execution
async function fixSequential(files) {
  for (const file of files) {
    await fs.readFile(file);
  }
}

// FIX 2: Use Promise.all with .map for parallel execution
async function fixParallel(files) {
  await Promise.all(files.map((file) => fs.readFile(file)));
}
```
