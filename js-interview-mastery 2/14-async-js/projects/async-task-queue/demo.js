const { TaskQueue } = require('./index');

// Simulates a fake API call that takes a random amount of time and occasionally fails.
function fakeApiCall(id) {
  const durationMs = 200 + Math.random() * 600;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.15) {
        reject(new Error(`request ${id} failed`));
      } else {
        resolve({ id, durationMs: Math.round(durationMs) });
      }
    }, durationMs);
  });
}

async function main() {
  const queue = new TaskQueue({ concurrency: 3 });
  console.log(`Processing 10 fake API calls with concurrency = ${queue.concurrency}\n`);

  const startedAt = Date.now();
  let activeCountLog = 0;

  const tasks = Array.from({ length: 10 }, (_, i) => {
    const id = i + 1;
    return queue
      .add(() => {
        activeCountLog++;
        console.log(`[${elapsed(startedAt)}ms] started  task ${id}  (queue.pending=${queue.pending}, running=${queue.running})`);
        return fakeApiCall(id);
      })
      .then((result) => {
        console.log(`[${elapsed(startedAt)}ms] finished task ${id}  (took ~${result.durationMs}ms)`);
        return result;
      })
      .catch((err) => {
        console.log(`[${elapsed(startedAt)}ms] FAILED   task ${id}  (${err.message})`);
        return { id, error: err.message };
      });
  });

  const results = await Promise.all(tasks);

  console.log('\nAll tasks settled:');
  console.table(results);
}

function elapsed(start) {
  return Date.now() - start;
}

main();
