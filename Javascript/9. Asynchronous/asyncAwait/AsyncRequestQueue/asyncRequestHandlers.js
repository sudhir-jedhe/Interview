const fetch = require('node-fetch');

class AsyncRequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(requestFunction) {
    return new Promise((resolve, reject) => {
      const request = { requestFunction, resolve, reject };
      this.queue.push(request);
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const { requestFunction, resolve, reject } = this.queue.shift();
      try {
        const result = await requestFunction();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    this.isProcessing = false;
  }
}

async function requestQueue(requests) {
  const results = [];

  for (const request of requests) {
    try {
      const result = await request();
      results.push(result);
    } catch (error) {
      results.push({ error: error.message });
    }
  }

  return results;
}

// Example usage of AsyncRequestQueue
console.log("AsyncRequestQueue Example:");
const queue = new AsyncRequestQueue();

const fetchData = (id) => {
  return async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch post ${id}`);
    return response.json();
  };
};

Promise.all([
  queue.enqueue(fetchData(1)),
  queue.enqueue(fetchData(2)),
  queue.enqueue(() => Promise.reject(new Error("Simulated error")))
]).then(results => {
  console.log("AsyncRequestQueue results:", results);
}).catch(error => {
  console.error("AsyncRequestQueue error:", error);
});

// Example usage of requestQueue
console.log("\nrequestQueue Example:");
const requests = [
  fetchData(1),
  fetchData(2),
  async () => { throw new Error("Simulated error"); }
];

requestQueue(requests)
  .then(results => {
    console.log("requestQueue results:", results);
  })
  .catch(error => {
    console.error("requestQueue error:", error);
  });