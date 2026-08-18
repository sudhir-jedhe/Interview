# Problem: A Task Queue That Spawns a Child Process Per Job, With a Concurrency Limit

## Problem statement

Implement a `TaskQueue` class that accepts jobs (each job is a shell command + args to run via `child_process`), runs them by spawning a child process per job, but never runs more than `concurrency` jobs at the same time — additional jobs wait in an internal queue until a running slot frees up.

## Requirements

- `queue.add(command, args)` returns a Promise that resolves with `{ stdout, code }` when that job's child process exits, or rejects if the process errors/exits non-zero.
- No more than `concurrency` child processes should be running simultaneously, regardless of how many jobs are added at once.
- Use `spawn` (not `exec`) so output is streamed and large output doesn't hit a buffer cap.
- The queue should keep pulling the next waiting job as soon as a running slot frees up, until the queue is empty.

## Solution

```js
// task-queue.js
const { spawn } = require('child_process');

class TaskQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.pending = []; // { command, args, resolve, reject }
  }

  add(command, args = []) {
    return new Promise((resolve, reject) => {
      this.pending.push({ command, args, resolve, reject });
      this._drain();
    });
  }

  _drain() {
    while (this.running < this.concurrency && this.pending.length > 0) {
      const job = this.pending.shift();
      this._runJob(job);
    }
  }

  _runJob({ command, args, resolve, reject }) {
    this.running++;

    const proc = spawn(command, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk) => { stdout += chunk; });
    proc.stderr.on('data', (chunk) => { stderr += chunk; });

    proc.on('error', (err) => {
      this.running--;
      reject(err); // e.g. command not found
      this._drain(); // free slot — try the next queued job
    });

    proc.on('close', (code) => {
      this.running--;
      if (code === 0) {
        resolve({ stdout, code });
      } else {
        reject(new Error(`"${command} ${args.join(' ')}" exited with code ${code}: ${stderr}`));
      }
      this._drain(); // free slot — try the next queued job
    });
  }
}

module.exports = TaskQueue;
```

```js
// demo.js — 6 jobs, only 2 run at once
const TaskQueue = require('./task-queue');

const queue = new TaskQueue(2);

const jobs = Array.from({ length: 6 }, (_, i) =>
  queue
    .add('node', ['-e', `setTimeout(() => console.log('job ${i} done'), 300)`])
    .then((result) => console.log(`job ${i} resolved:`, result.stdout.trim()))
    .catch((err) => console.error(`job ${i} failed:`, err.message))
);

Promise.all(jobs).then(() => console.log('all jobs finished'));
```

**How it works:** `add()` pushes the job description onto `pending` and immediately tries to `_drain()` the queue. `_drain()` keeps starting jobs from `pending` as long as `running < concurrency`; once that cap is hit, further jobs simply wait in the array. Each job's `spawn`ed process streams its stdout/stderr into local buffers (avoiding `exec`'s buffer-size limit), and on `close` or `error` the job's Promise settles, `running` is decremented, and `_drain()` is called again — which is what lets the next waiting job start as soon as a slot opens up, rather than only when the whole batch completes.
