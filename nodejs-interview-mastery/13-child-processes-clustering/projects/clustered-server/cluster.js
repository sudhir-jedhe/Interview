// cluster.js — primary process: forks one worker per CPU core, restarts crashed workers
const cluster = require('cluster');
const os = require('os');

const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`[primary ${process.pid}] starting ${numCPUs} workers on port ${PORT}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`[primary] worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`[primary] worker ${worker.process.pid} died (code=${code}, signal=${signal}) — restarting`);
    cluster.fork();
  });
} else {
  // Each worker runs the actual HTTP server.
  require('./server');
}
