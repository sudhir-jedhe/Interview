# Promise Scheduler (Concurrency Control)

A **Promise Scheduler** limits how many async tasks run simultaneously.

This is a common **JavaScript / React Senior Interview** question because browsers and APIs have concurrency limits.

***

## Problem

Given:

```js
const tasks = [
  () => fetch("/api/1"),
  () => fetch("/api/2"),
  () => fetch("/api/3"),
  () => fetch("/api/4"),
];
```

Run only **2 requests at a time**:

```text
Start: 1,2
Finish: 1
Start: 3
Finish: 2
Start: 4
```

***

# Implementation

```js
class PromiseScheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      const runTask = async () => {
        this.running++;

        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.next();
        }
      };

      if (this.running < this.limit) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }

  next() {
    if (
      this.queue.length > 0 &&
      this.running < this.limit
    ) {
      const task = this.queue.shift();
      task();
    }
  }
}
```

***

# Usage

```js
const scheduler =
  new PromiseScheduler(2);

function createTask(id, delay) {
  return () =>
    new Promise(resolve => {
      console.log(
        `Task ${id} started`
      );

      setTimeout(() => {
        console.log(
          `Task ${id} finished`
        );

        resolve(id);
      }, delay);
    });
}

scheduler.add(
  createTask(1, 3000)
);

scheduler.add(
  createTask(2, 2000)
);

scheduler.add(
  createTask(3, 1000)
);

scheduler.add(
  createTask(4, 1500)
);
```

Output:

```text
Task 1 started
Task 2 started

Task 2 finished
Task 3 started

Task 1 finished
Task 4 started

Task 3 finished
Task 4 finished
```

***

# LeetCode Machine Coding Version

```js
const scheduler =
  new PromiseScheduler(2);

Promise.all([
  scheduler.add(task1),
  scheduler.add(task2),
  scheduler.add(task3),
  scheduler.add(task4),
]).then(console.log);
```

***

# Priority Promise Scheduler

Sometimes tasks have priorities.

```js
scheduler.add(task, 100);
scheduler.add(task, 10);
```

Higher priority should execute first.

```js
class PriorityScheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      const wrappedTask =
        async () => {
          this.running++;

          try {
            const result =
              await task();

            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            this.running--;
            this.next();
          }
        };

      this.queue.push({
        priority,
        task: wrappedTask,
      });

      this.queue.sort(
        (a, b) =>
          b.priority -
          a.priority
      );

      this.next();
    });
  }

  next() {
    while (
      this.running <
        this.limit &&
      this.queue.length
    ) {
      const item =
        this.queue.shift();

      item.task();
    }
  }
}
```

Usage:

```js
scheduler.add(
  fetchProfile,
  100
);

scheduler.add(
  fetchAnalytics,
  10
);
```

Execution:

```text
Profile
Permissions
Notifications
Analytics
```

***

# Retry Support

```js
async function retry(
  fn,
  retries = 3
) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    return retry(
      fn,
      retries - 1
    );
  }
}
```

Inside scheduler:

```js
const result =
  await retry(task);
```

***

# React Hook Version

```js
function usePromiseScheduler(
  limit = 5
) {
  const scheduler =
    useRef(
      new PromiseScheduler(
        limit
      )
    );

  return scheduler.current;
}
```

Usage:

```js
const scheduler =
  usePromiseScheduler(3);

scheduler.add(() =>
  fetchUsers()
);
```

***

# Real-World Use Cases

### Infinite Scroll

```text
User scrolls fast
↓
20 requests generated
↓
Scheduler runs only 3
at a time
```

***

### Bulk File Upload

```text
100 images
↓
Upload max 5
simultaneously
```

***

### Dashboard Loading

```text
Profile API
Permissions API
Notifications API
Analytics API
Recommendations API
```

Scheduler:

```text
Limit = 2

Profile
Permissions

Notifications
Analytics

Recommendations
```

***

# Complexity

### Add Task

```text
O(1)
```

### Execute Task

```text
O(1)
```

### Space

```text
O(queue size)
```

***

# Senior Interview Discussion

A strong answer includes:

✅ Concurrency control

✅ Priority queue support

✅ Retry mechanism

✅ Cancellation (`AbortController`)

✅ Request deduplication

✅ Rate limiting

✅ Backpressure handling

✅ Progress tracking

### Architecture

```text
Task Producer
      │
      ▼
Promise Scheduler
      │
      ├── Running Tasks
      └── Waiting Queue
             │
             ▼
         Async APIs
```

This is the level of implementation and discussion typically expected in a **Senior React / JavaScript interview** for a Promise Scheduler or Request Queue problem.
