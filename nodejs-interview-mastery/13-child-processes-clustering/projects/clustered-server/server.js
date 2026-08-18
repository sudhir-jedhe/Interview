// server.js — the actual HTTP server, run once per cluster worker
const http = require('http');

const PORT = process.env.PORT || 3000;

// In-memory counter to make it obvious different workers hold different state
// (proving there's no shared memory between cluster workers).
let requestsHandledByThisWorker = 0;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
    return;
  }

  if (req.url === '/crash') {
    // Simulate a worker crash on demand, to demonstrate cluster.js auto-restarting it.
    console.log(`[worker ${process.pid}] simulating crash`);
    res.writeHead(200);
    res.end('crashing this worker now...\n');
    setTimeout(() => process.exit(1), 50); // exit after flushing the response
    return;
  }

  requestsHandledByThisWorker++;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      message: 'Hello from a clustered Node server',
      handledByPid: process.pid,
      requestsHandledByThisWorker,
    })
  );
});

server.listen(PORT, () => {
  console.log(`[worker ${process.pid}] listening on :${PORT}`);
});
