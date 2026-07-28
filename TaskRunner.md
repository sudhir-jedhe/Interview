To implement an asynchronous task runner with concurrency control, we need to ensure that we limit the number of tasks that run concurrently while managing the tasks in a queue. Here's how the `TaskRunner` class can be structured:

### Key Requirements:

1. **Concurrency Limit**: You can specify the maximum number of tasks that can run concurrently.
2. **Task Queue**: If the number of concurrent tasks exceeds the limit, the remaining tasks should wait in a queue until space becomes available.
3. **Task Execution**: When a task finishes, the next task in the queue should start automatically if there is space for it.

### Approach:

- We need a queue (`waitingList`) to store tasks that are waiting to be executed.
- We need a counter (`runningCount`) to track the number of currently running tasks.
- We should process each task one by one, ensuring that no more than the specified number of tasks run concurrently.

Here's the full implementation:

```javascript
class TaskRunner {
  constructor(concurrency) {
    this.concurrency = concurrency; // Max number of tasks that can run concurrently
    this.runningCount = 0; // Number of currently running tasks
    this.waitingList = []; // Queue for waiting tasks
  }

  // Method to push a task into the queue
  async push(task) {
    // If there is room to run a task (runningCount < concurrency), start executing it
    if (this.runningCount < this.concurrency) {
      await this.execute(task);
    } else {
      // Otherwise, add the task to the queue to wait for an available slot
      this.waitingList.push(task);
    }
  }

  // Method to execute a task
  async execute(task) {
    // Increment the running task count since a task is being executed
    this.runningCount++;

    try {
      // Execute the task
      await task();
    } catch (err) {
      // If there's an error, it will be caught here (optional)
      console.error(err);
    } finally {
      // After execution, decrement the running task count
      this.runningCount--;

      // If there are tasks in the waiting list and we have available slots,
      // process the next task from the waiting list
      if (this.waitingList.length > 0 && this.runningCount < this.concurrency) {
        // Remove the next task from the queue and process it
        const nextTask = this.waitingList.shift();
        await this.execute(nextTask);
      }
    }
  }
}

// Simulated async task with delay (for demonstration purposes)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Example usage
const ex = new TaskRunner(3);

// Simulated async tasks
const t1 = async () => {
  console.log("t1 started");
  await delay(2000);
  console.log("t1 finished");
};
const t2 = async () => {
  console.log("t2 started");
  await delay(10000);
  console.log("t2 finished");
};
const t3 = async () => {
  console.log("t3 started");
  await delay(1500);
  console.log("t3 finished");
};
const t4 = async () => {
  console.log("t4 started");
  await delay(1000);
  console.log("t4 finished");
};
const t5 = async () => {
  console.log("t5 started");
  await delay(500);
  console.log("t5 finished");
};

// Add tasks to the executor
ex.push(t1); // Starts immediately
ex.push(t2); // Starts immediately
ex.push(t3); // Starts immediately
ex.push(t4); // Waits until at least one task finishes
ex.push(t5); // Waits until another task finishes
```

### Explanation:

1. **`constructor(concurrency)`**: The constructor initializes the concurrency limit (`this.concurrency`), the count of currently running tasks (`this.runningCount`), and a queue to hold waiting tasks (`this.waitingList`).
2. **`push(task)`**: The `push` method is used to add tasks. If the number of currently running tasks is less than the concurrency limit, the task is executed immediately. Otherwise, it is added to the queue (`waitingList`) to be executed later.

3. **`execute(task)`**: This method manages the execution of tasks:
   - It increments the running task count (`this.runningCount`).
   - After executing the task, it checks if there are any waiting tasks and if the concurrency limit has been reached. If so, it starts executing the next task from the queue.

4. **Simulated Async Tasks**: `t1`, `t2`, `t3`, `t4`, and `t5` are asynchronous tasks that simulate delays.

### Example Scenario:

1. **Tasks `t1`, `t2`, and `t3`** start immediately because the concurrency limit is 3.
2. **Task `t4`** waits until one of the running tasks (`t1`, `t2`, or `t3`) finishes.
3. Once **`t1` finishes**, **task `t4`** starts executing.
4. **Task `t5`** waits for the next available slot after `t2` or `t3` finishes.

### Output:

```plaintext
t1 started
t2 started
t3 started
t1 finished
t4 started
t4 finished
t2 finished
t5 started
t5 finished
t2 finished
t3 finished
```

In this implementation:

- At most 3 tasks are running concurrently.
- If there is space, the next task from the queue is executed as soon as a task finishes.

This approach ensures that no more than the specified number of tasks run at the same time, while others are queued and run when a slot is available.

It looks like your text cut off right before the implementation details! Here is a complete, production-ready `TaskRunner` class in JavaScript that handles concurrency control and task queueing.

---

### Implementation

```javascript
class TaskRunner {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.queue = [];
    this.activeCount = 0;
  }

  /**
   * Adds an asynchronous task (a function returning a Promise) to the runner.
   * @param {() => Promise<any>} task
   * @returns {Promise<any>} Resolves or rejects when the task completes execution.
   */
  push(task) {
    return new Promise((resolve, reject) => {
      // Enqueue the task wrapped with its Promise triggers
      this.queue.push({ task, resolve, reject });
      this._next();
    });
  }

  /**
   * Internal worker method to process queue items within concurrency limits.
   */
  async _next() {
    // Return early if we hit the limit or if there are no queued tasks remaining
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.activeCount++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.activeCount--;
      this._next(); // Trigger execution of the next queued task
    }
  }
}
```

---

### Example Usage

```javascript
// Helper function to simulate async network requests
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const runner = new TaskRunner(2); // Max 2 tasks running concurrently

const createTask = (id, duration) => async () => {
  console.log(`Task ${id} started`);
  await delay(duration);
  console.log(`Task ${id} finished`);
  return `Result ${id}`;
};

// Queue 5 tasks
runner.push(createTask(1, 1000)).then(console.log);
runner.push(createTask(2, 500)).then(console.log);
runner.push(createTask(3, 300)).then(console.log);
runner.push(createTask(4, 400)).then(console.log);
runner.push(createTask(5, 200)).then(console.log);

/*
Execution Flow:
- Tasks 1 & 2 start immediately (Active: 2, Limit: 2).
- Task 2 completes at 500ms -> Task 3 starts immediately.
- Task 3 completes at 800ms -> Task 4 starts immediately.
- Task 1 completes at 1000ms -> Task 5 starts immediately.
*/
```

---

### Key Features of this Design:

1. **Promise Wrapping:** Every task pushed returns a individual `Promise` to the caller, allowing `await runner.push(...)` or `.then()` chaining.
2. **Error Isolation:** If one task throws an exception or rejects, its promise rejects individually without crashing the queue or stopping subsequent tasks.
3. **Recursive Drain:** The `finally` block ensures that whenever a slot frees up (`activeCount--`), `_next()` is invoked to pull the next pending task from the queue.
