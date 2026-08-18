/**
 * TaskQueue — a Promise-based task queue with a concurrency limit.
 *
 * Usage:
 *   const queue = new TaskQueue({ concurrency: 3 });
 *   const result = await queue.add(() => fetch('/api/thing'));
 *
 * At most `concurrency` tasks run at once; anything added beyond that
 * is queued and started as soon as a running slot frees up.
 */
class TaskQueue {
  constructor({ concurrency = 3 } = {}) {
    if (concurrency < 1) throw new Error('concurrency must be at least 1');
    this.concurrency = concurrency;
    this.running = 0; // number of tasks currently in flight
    this.queue = []; // pending { task, resolve, reject } entries, FIFO
  }

  /**
   * Add an async task (a zero-argument function returning a Promise) to the queue.
   * Returns a Promise that resolves/rejects with the task's own outcome.
   */
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._processQueue();
    });
  }

  /** Number of tasks still waiting for a free slot (not counting ones already running). */
  get pending() {
    return this.queue.length;
  }

  _processQueue() {
    // Keep pulling from the queue as long as we have a free slot and pending work.
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;

      Promise.resolve()
        .then(task) // run the task; Promise.resolve().then() also safely catches sync throws
        .then(resolve, reject)
        .finally(() => {
          this.running--;
          this._processQueue(); // a slot just freed up — try to start the next queued task
        });
    }
  }
}

module.exports = { TaskQueue };
