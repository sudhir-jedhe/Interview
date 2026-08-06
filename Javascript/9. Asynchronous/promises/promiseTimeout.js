// Basic timeout utility
class Timeout {
  constructor() {
    this.ids = new Set();
  }

  // Create a timeout promise
  set = (delay, reason) =>
    new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        if (reason === undefined) resolve();
        else reject(reason);
        this.clear(id);
      }, delay);
      this.ids.add(id);
      return id;
    });

  // Wrap a promise with a timeout
  wrap = (promise, delay, reason) =>
    Promise.race([promise, this.set(delay, reason)]);

  // Clear specific timeouts or all if no ids provided
  clear = (...ids) => {
    if (ids.length === 0) {
      this.ids.forEach(id => clearTimeout(id));
      this.ids.clear();
      return;
    }

    ids.forEach(id => {
      if (this.ids.has(id)) {
        clearTimeout(id);
        this.ids.delete(id);
      }
    });
  };
}

// Test cases
async function runTests() {
  console.log("Test 1: Basic timeout resolution");
  const timeout1 = new Timeout();
  console.time("timeout1");
  await timeout1.set(1000);
  console.timeEnd("timeout1");
  console.log("Timeout resolved after ~1000ms\n");

  console.log("Test 2: Timeout with rejection");
  const timeout2 = new Timeout();
  try {
    console.time("timeout2");
    await timeout2.set(1000, new Error("Timeout occurred"));
    console.timeEnd("timeout2");
  } catch (error) {
    console.timeEnd("timeout2");
    console.log("Caught error:", error.message, "\n");
  }

  console.log("Test 3: Wrapping a fast promise");
  const timeout3 = new Timeout();
  const fastPromise = Promise.resolve("Fast result");
  try {
    const result = await timeout3.wrap(fastPromise, 1000, new Error("Timeout"));
    console.log("Result:", result, "\n");
  } catch (error) {
    console.log("Should not reach here:", error, "\n");
  }

  console.log("Test 4: Wrapping a slow promise");
  const timeout4 = new Timeout();
  const slowPromise = new Promise(resolve => setTimeout(() => resolve("Slow result"), 2000));
  try {
    console.time("timeout4");
    await timeout4.wrap(slowPromise, 1000, new Error("Timeout occurred"));
    console.timeEnd("timeout4");
  } catch (error) {
    console.timeEnd("timeout4");
    console.log("Caught error:", error.message, "\n");
  }

  console.log("Test 5: Clearing timeouts");
  const timeout5 = new Timeout();
  const id1 = timeout5.set(1000).then(() => console.log("Should not see this 1"));
  const id2 = timeout5.set(2000).then(() => console.log("Should not see this 2"));
  timeout5.clear(); // Clear all timeouts
  console.log("All timeouts cleared\n");

  console.log("Test 6: Multiple concurrent timeouts");
  const timeout6 = new Timeout();
  Promise.all([
    timeout6.set(1000).then(() => console.log("1000ms passed")),
    timeout6.set(2000).then(() => console.log("2000ms passed")),
    timeout6.set(3000).then(() => console.log("3000ms passed"))
  ]).then(() => console.log("\nAll concurrent timeouts completed"));
}

// Run all tests
runTests().catch(console.error);

// Example of practical usage
async function fetchWithTimeout(url, timeout = 5000) {
  const timeoutController = new Timeout();
  try {
    const response = await timeoutController.wrap(
      fetch(url),
      timeout,
      new Error(`Request to ${url} timed out after ${timeout}ms`)
    );
    return response;
  } finally {
    timeoutController.clear(); // Clean up any remaining timeouts
  }
}