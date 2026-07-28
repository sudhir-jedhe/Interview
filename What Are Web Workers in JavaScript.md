### What Are Web Workers in JavaScript?

A **Web Worker** is a JavaScript feature that allows you to run scripts in the background on a separate thread from the main UI thread. This means that web workers can perform time-consuming tasks without blocking the main thread, which is responsible for rendering the user interface. By offloading complex operations to a worker, you can keep the user interface responsive and smooth, improving the overall user experience.

### How Web Workers Work

1. **Threading**: Web Workers run on a separate thread, independent of the main JavaScript thread (UI thread). This enables heavy computations to happen in the background, without affecting the UI's performance.

2. **Message Passing**: Communication between the main thread and the worker thread is done via message passing, using `postMessage` and event listeners. The main thread sends messages to the worker, and the worker sends messages back to the main thread.

3. **No DOM Access**: Workers do not have access to the DOM (Document Object Model), which means they cannot directly manipulate the page's content. They can, however, process data and perform calculations, which can then be communicated back to the main thread for rendering.

4. **Creating a Worker**:
   - You can create a Web Worker using the `Worker` constructor, passing the path to a JavaScript file that the worker will execute.
   - Inside the worker, you use `self` to refer to the worker's global context.

### Example: Basic Web Worker

#### Main Thread (UI Thread)

```javascript
// Create a new Worker
const worker = new Worker("worker.js");

// Send a message to the worker
worker.postMessage("Hello, Worker!");

// Listen for messages from the worker
worker.onmessage = function (event) {
  console.log("Message from Worker:", event.data);
};

// Handle any errors in the worker
worker.onerror = function (error) {
  console.log("Error in Worker:", error.message);
};
```

#### Worker Thread (worker.js)

```javascript
// Listen for messages from the main thread
onmessage = function (event) {
  console.log("Message from Main Thread:", event.data);

  // Send a message back to the main thread
  postMessage("Hello, Main Thread!");
};
```

### Benefits of Using Web Workers

1. **Improved Performance**:
   - Web Workers allow you to run computationally expensive tasks (e.g., image processing, data analysis, encryption, etc.) in the background. This prevents these operations from blocking the UI thread, ensuring that your website or application remains responsive to user input.
2. **Non-blocking UI**:
   - Since the worker runs on a separate thread, the main UI thread is free to handle user input, render updates, and manage animations. Without workers, long-running scripts would freeze the UI, making the page unresponsive until the operation is complete.

3. **Asynchronous Execution**:
   - Web Workers help execute code asynchronously. The results of the worker’s computations are communicated back to the main thread once completed, without interrupting the user experience.

4. **Offloading Heavy Computations**:
   - Web Workers are especially useful for offloading tasks such as:
     - Image processing (e.g., resizing, filters, and transformations)
     - Complex data processing (e.g., sorting, calculations, or data filtering)
     - Parsing large files (e.g., CSV, JSON)
     - Handling background tasks like polling APIs

5. **Avoiding UI Thread Blocking**:
   - JavaScript traditionally runs on a single thread (the UI thread). Any long-running task (such as loops or complex operations) could block the UI, resulting in a frozen or sluggish page. Web Workers help you avoid this problem by running the task in a different thread.

6. **Scalable for Multi-Core CPUs**:
   - Web Workers can take advantage of multi-core processors. Since each worker runs on its own thread, it’s possible to parallelize tasks across multiple cores, making them faster and more efficient.

### Web Worker Types

1. **Dedicated Web Workers**:
   - These workers are dedicated to a single main thread and communicate only with that thread.
   - They are created using the `Worker` constructor and operate as shown in the example above.

2. **Shared Workers**:
   - Shared Workers can be shared by multiple browser contexts (e.g., multiple tabs or windows) and can communicate with all the contexts that have access to the shared worker.
   - This is useful when you want to share state or resources (e.g., a WebSocket connection) across multiple tabs or windows.

   **Example of Shared Worker**:

   ```javascript
   const worker = new SharedWorker("sharedWorker.js");

   worker.port.postMessage("Hello, Shared Worker!");
   worker.port.onmessage = function (event) {
     console.log("Message from Shared Worker:", event.data);
   };
   ```

### Limitations of Web Workers

1. **No DOM Access**:
   - Web Workers cannot interact with the DOM directly. If you need to update the UI based on the worker’s output, you must send the data back to the main thread, which can then update the DOM.

2. **Limited API Access**:
   - Workers are restricted to certain APIs. For instance, they cannot access the `window` object, and cannot use things like `alert()`, `console.log()`, or `localStorage` directly. Instead, workers use `self` (instead of `window`).

3. **Data Passing Limitations**:
   - Workers communicate with the main thread using message passing. While you can pass objects, certain types of data (e.g., DOM elements, functions) cannot be transferred directly.
   - You can pass simple data (like strings or numbers) or structured objects (using the `structuredClone` algorithm), but passing large data structures can be inefficient unless you use techniques like transferring ownership of data.

4. **Overhead**:
   - Web Workers come with overhead. Creating and managing workers takes some time and resources. For small, quick tasks, the overhead may outweigh the benefits of using a worker.

### When to Use Web Workers

- **Heavy Computations**: Tasks like image/video processing, cryptography, complex data analysis, and heavy sorting algorithms can benefit from being offloaded to a Web Worker.
- **Large Data Processing**: If you are working with large datasets or files (e.g., large JSON files or CSV data), a Web Worker can process this data in the background while keeping the main thread free.
- **Background Tasks**: Tasks such as polling APIs for new data, file uploads/downloads, or background synchronization can be handled efficiently by workers.
- **Real-Time Applications**: For applications like gaming, animations, or real-time data processing (e.g., financial charts, live sports updates), using Web Workers can ensure smooth performance without lag.

### Conclusion

Web Workers in JavaScript are an essential tool for improving the performance and responsiveness of your web applications. By running expensive tasks on background threads, you can prevent the UI from freezing or becoming unresponsive. They are particularly useful for handling CPU-intensive computations, background tasks, and real-time updates, making your website more efficient and user-friendly. However, they come with some limitations, such as not having direct access to the DOM, so they should be used appropriately depending on the task at hand.

Here is a complete breakdown of when and how to use **Web Workers** in JavaScript, along with a real-world scenario and implementation code.

---

## Use Case Scenario: Offloading CPU-Intensive Tasks

JavaScript runs on a **single main thread**. If you perform expensive operations on the main thread—such as heavy mathematical calculations, processing large datasets/images, or parsing massive JSON files—the UI freezes, interactions lag, and the page becomes unresponsive.

### Scenario: Processing & Sorting Large Datasets (1,000,000+ Records)

Imagine a financial dashboard or analytics app where you need to calculate complex statistical metrics (mean, median, standard deviation, percentile bucketing) over a million rows of data when a user changes a filter.

- **Without Web Workers:** The browser thread locks up for several seconds, input fields stop working, and CSS animations freeze.
- **With Web Workers:** The computation runs completely in a background thread. The UI stays smooth and butter-60fps while the calculation happens in the background.

---

## Implementation Code

### Step 1: Create the Web Worker Script (`worker.js`)

The worker file listens for messages from the main thread using `onmessage`, performs the heavy computation, and sends the result back using `postMessage`.

```javascript
// worker.js (Runs in a separate background thread)

self.onmessage = function (event) {
  const { data } = event; // Receive data passed from main thread

  console.log("[Worker] Starting heavy computation on dataset...");
  const startTime = performance.now();

  // Heavy CPU computation: Sorting and calculating stats on large array
  const sortedData = [...data].sort((a, b) => a - b);

  const sum = sortedData.reduce((acc, val) => acc + val, 0);
  const mean = sum / sortedData.length;

  const mid = Math.floor(sortedData.length / 2);
  const median =
    sortedData.length % 2 !== 0
      ? sortedData[mid]
      : (sortedData[mid - 1] + sortedData[mid]) / 2;

  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(2);

  // Send the computed results back to the main thread
  self.postMessage({
    mean,
    median,
    min: sortedData[0],
    max: sortedData[sortedData.length - 1],
    executionTimeMs: executionTime,
  });
};
```

---

### Step 2: Integrate in the Main Application (`app.js`)

In your main script, instantiate the worker using `new Worker()`, listen for the computed result via `onmessage`, and pass data using `postMessage()`.

```javascript
// app.js (Main UI Thread)

// 1. Generate 2 million random numbers (Large Dataset)
const LARGE_DATASET = Array.from(
  { length: 2000000 },
  () => Math.random() * 100,
);

// 2. Instantiate the Web Worker
const statsWorker = new Worker("worker.js");

const calculateBtn = document.getElementById("calculate-btn");
const statusDiv = document.getElementById("status");

calculateBtn.addEventListener("click", () => {
  statusDiv.textContent = "Processing dataset in background worker...";

  // 3. Listen for response from worker
  statsWorker.onmessage = function (event) {
    const results = event.data;
    statusDiv.innerHTML = `
      <strong>Calculation Complete!</strong><br>
      Mean: ${results.mean.toFixed(2)}<br>
      Median: ${results.median.toFixed(2)}<br>
      Time Taken: ${results.executionTimeMs} ms
    `;
  };

  // Handle worker errors
  statsWorker.onerror = function (error) {
    console.error("[Worker Error]", error);
    statusDiv.textContent = "An error occurred during calculation.";
  };

  // 4. Send data to the worker (Starts execution)
  // Tip: You can pass transferable objects (like ArrayBuffer) for zero-copy memory transfers!
  statsWorker.postMessage(LARGE_DATASET);
});
```

---

## Important Rules & Limitations of Web Workers

| Web Workers Can                                             | Web Workers Cannot                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| ✅ Make HTTP/API requests using `fetch` or `XMLHttpRequest` | ❌ Access the DOM (`document`, `window`, elements)                   |
| ✅ Use `setTimeout`, `setInterval`, and WebSockets          | ❌ Direct access to parent page variables (must use `postMessage`)   |
| ✅ Spawn other sub-workers                                  | ❌ Read `localStorage` or `sessionStorage` (Use `IndexedDB` instead) |

---

## Other Popular Web Worker Use Cases

1. **Image & Video Processing:** Applying filters, resizing, or encoding canvas pixel data (`ImageData`).
2. **Text Parsing & Syntax Highlighting:** Parsing large CSV files or rendering markdown/syntax formatting in code editors (e.g., Monaco/VS Code web).
3. **Cryptography & Compression:** Encrypting/decrypting payloads or running ZIP/GZIP operations in the browser.
4. **Machine Learning in Browser:** Running lightweight TensorFlow.js models or background inference tasks.
