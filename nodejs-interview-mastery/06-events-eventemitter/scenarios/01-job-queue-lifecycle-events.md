# Designing a Job Queue's Lifecycle Notifications with EventEmitter

**Scenario:** You're building a job queue where each `Job` needs to notify multiple independent parts of the system (logger, metrics, UI websocket) about progress, completion, and failure. How do you design this with EventEmitter?

**Approach:** Model `Job` as an `EventEmitter` subclass that emits distinct, well-named events at each lifecycle stage. Each independent consumer subscribes without knowing about the others — a clean decoupling.

```js
const { EventEmitter } = require('events');

class Job extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
  }

  async run(task) {
    try {
      this.emit('start', { id: this.id });
      const result = await task((pct) => this.emit('progress', { id: this.id, pct }));
      this.emit('complete', { id: this.id, result });
    } catch (err) {
      this.emit('error', err); // always attach an 'error' listener before running!
    }
  }
}

const job = new Job('job-1');
job.on('error', (err) => console.error('job failed:', err.message)); // required to avoid crash
job.on('progress', (data) => metricsClient.gauge('job.progress', data.pct));
job.on('complete', (data) => logger.info('job done', data));

job.run(async (onProgress) => {
  onProgress(50);
  return 'done';
});
```

Key point: attach the `'error'` listener before calling `.run()`, since `Job` extends EventEmitter and an unhandled `'error'` emission will crash the process.
