/**
 * Minimal sanity check (no test framework dependency) — run with `npm test`.
 * Verifies: results resolve in the correct per-task order, concurrency is
 * never exceeded, and a rejected task doesn't break the rest of the queue.
 */
const assert = require('assert');
const { TaskQueue } = require('./index');

function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function testResolvesWithCorrectValues() {
  const queue = new TaskQueue({ concurrency: 2 });
  const results = await Promise.all([
    queue.add(() => delay(30, 'a')),
    queue.add(() => delay(10, 'b')),
    queue.add(() => delay(20, 'c')),
  ]);
  assert.deepStrictEqual(results, ['a', 'b', 'c']); // each promise resolves with its OWN task's value
  console.log('ok — resolves with correct per-task values');
}

async function testNeverExceedsConcurrency() {
  const concurrency = 3;
  const queue = new TaskQueue({ concurrency });
  let active = 0;
  let maxActive = 0;

  const tasks = Array.from({ length: 10 }, () =>
    queue.add(async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await delay(20);
      active--;
    })
  );

  await Promise.all(tasks);
  assert.ok(maxActive <= concurrency, `expected max concurrency <= ${concurrency}, got ${maxActive}`);
  console.log(`ok — never exceeded concurrency (peak was ${maxActive})`);
}

async function testRejectionDoesNotBreakQueue() {
  const queue = new TaskQueue({ concurrency: 2 });
  const outcomes = await Promise.allSettled([
    queue.add(() => delay(10, 'ok-1')),
    queue.add(() => Promise.reject(new Error('boom'))),
    queue.add(() => delay(10, 'ok-2')),
  ]);
  assert.strictEqual(outcomes[0].status, 'fulfilled');
  assert.strictEqual(outcomes[1].status, 'rejected');
  assert.strictEqual(outcomes[2].status, 'fulfilled');
  console.log('ok — a rejected task does not block the rest of the queue');
}

async function main() {
  await testResolvesWithCorrectValues();
  await testNeverExceedsConcurrency();
  await testRejectionDoesNotBreakQueue();
  console.log('\nAll checks passed.');
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
