class QueryBatcher {
  constructor(queryMultiple, throttleTime) {
    this.queryMultiple = queryMultiple;
    this.throttleTime = throttleTime;
    this.queue = [];
    this.lastQueryTime = 0;
    this.pendingPromise = null;
  }

  async getValue(key) {
    return new Promise((resolve) => {
      this.queue.push({ key, resolve });
      this.scheduleQuery();
    });
  }

  scheduleQuery() {
    const now = Date.now();
    if (this.pendingPromise) return;

    if (now - this.lastQueryTime >= this.throttleTime) {
      this.executeQuery();
    } else {
      const delay = this.throttleTime - (now - this.lastQueryTime);
      this.pendingPromise = setTimeout(() => {
        this.pendingPromise = null;
        this.executeQuery();
      }, delay);
    }
  }

  async executeQuery() {
    const batch = this.queue;
    this.queue = [];
    this.lastQueryTime = Date.now();

    const keys = batch.map(item => item.key);
    const results = await this.queryMultiple(keys);

    batch.forEach((item, index) => {
      item.resolve(results[index]);
    });
  }
}

// Test function
async function runTest(queryMultiple, throttleTime, calls) {
  const batcher = new QueryBatcher(queryMultiple, throttleTime);
  const results = [];
  const startTime = Date.now();

  const promises = calls.map(({ key, time }) =>
    new Promise(resolve => {
      setTimeout(async () => {
        const value = await batcher.getValue(key);
        const resolvedTime = Date.now() - startTime;
        resolve({ resolved: value, time: resolvedTime });
      }, time);
    })
  );

  results.push(...(await Promise.all(promises)));
  return results;
}

// Test cases
async function runTests() {
  console.log("Test Case 1:");
  const queryMultiple1 = async (keys) => keys.map(key => key + '!');
  const result1 = await runTest(queryMultiple1, 100, [
    { key: "a", time: 10 },
    { key: "b", time: 20 },
    { key: "c", time: 30 }
  ]);
  console.log(JSON.stringify(result1, null, 2));

  console.log("\nTest Case 2:");
  const queryMultiple2 = async (keys) => {
    await new Promise(res => setTimeout(res, 100));
    return keys.map(key => key + '!');
  };
  const result2 = await runTest(queryMultiple2, 100, [
    { key: "a", time: 10 },
    { key: "b", time: 20 },
    { key: "c", time: 30 }
  ]);
  console.log(JSON.stringify(result2, null, 2));

  console.log("\nTest Case 3:");
  const queryMultiple3 = async (keys) => {
    await new Promise(res => setTimeout(res, keys.length * 100));
    return keys.map(key => key + '!');
  };
  const result3 = await runTest(queryMultiple3, 100, [
    { key: "a", time: 10 },
    { key: "b", time: 20 },
    { key: "c", time: 30 },
    { key: "d", time: 40 },
    { key: "e", time: 250 },
    { key: "f", time: 300 }
  ]);
  console.log(JSON.stringify(result3, null, 2));
}

runTests();