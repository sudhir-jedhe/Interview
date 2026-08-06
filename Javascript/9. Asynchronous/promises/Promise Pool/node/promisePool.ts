type F = () => Promise<any>;

function promisePool(functions: F[], n: number): Promise<[number[], number]> {
  const results: number[] = [];
  const inProgress = new Set<Promise<void>>();
  const queue = [...functions];
  const startTime = Date.now();

  return new Promise((resolve) => {
    const runTask = async () => {
      if (queue.length === 0 && inProgress.size === 0) {
        const totalTime = Date.now() - startTime;
        resolve([results, totalTime]);
        return;
      }

      while (queue.length > 0 && inProgress.size < n) {
        const task = queue.shift()!;
        const taskStartTime = Date.now();
        const promise = task().then(() => {
          const taskEndTime = Date.now() - taskStartTime;
          results.push(taskEndTime);
          inProgress.delete(promise);
          runTask();
        });
        inProgress.add(promise);
      }
    };

    runTask();
  });
}

// Test cases
async function runTestCase(functions: F[], n: number) {
  console.log(`Running test case with ${functions.length} functions and pool limit ${n}`);
  const [individualTimes, totalTime] = await promisePool(functions, n);
  console.log('Individual promise resolution times:', individualTimes);
  console.log('Total execution time:', totalTime);
  console.log('---');
}

// Example 1
const functions1 = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
];
runTestCase(functions1, 2);

// Example 2
const functions2 = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
];
runTestCase(functions2, 5);

// Example 3
const functions3 = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
];
runTestCase(functions3, 1);

