# Asynchronous Task Runner with Concurrency Control

This is a very common **Senior JavaScript / React interview** question.

### Problem

You have multiple async tasks:

```js
task1();
task2();
task3();
task4();
task5();
```

But only **N tasks** should run simultaneously.

Example:

```text
Concurrency = 2

Running:
✅ Task1
✅ Task2

Waiting:
⏳ Task3
⏳ Task4
⏳ Task5
```

When one running task completes, the next queued task should automatically start. This pattern is commonly described as a task runner or async queue with a concurrency limit. [\[blog.stackademic.com\]](https://blog.stackademic.com/top-javascript-interview-question-task-runner-with-concurrency-8b318d658034), [\[rowdycoders.com\]](https://www.rowdycoders.com/building-a-async-concurrency-controlled-task-manager-in-javascript/), [\[bigfrontend.dev\]](https://bigfrontend.dev/problem/async-task-queue)

***

# High-Level Design

```text
           addTask()
                 │
                 ▼
            ┌──────────┐
            │  Queue   │
            └────┬─────┘
                 │
                 ▼
        ┌────────────────┐
        │ Running Tasks  │
        │ Max = limit    │
        └────────────────┘
                 │
                 ▼
            Task Done
                 │
                 ▼
         Start Next Task
```

***

# Core Data Structures

```js
{
  queue: [],
  activeCount: 0,
  concurrency: 3
}
```

***

# Implementation

```js
class TaskRunner {
  constructor(concurrency) {
    this.concurrency =
      concurrency;

    this.queue = [];

    this.activeCount = 0;
  }

  add(task) {
    return new Promise(
      (resolve, reject) => {
        this.queue.push({
          task,
          resolve,
          reject,
        });

        this.runNext();
      }
    );
  }

  runNext() {
    if (
      this.activeCount >=
      this.concurrency
    ) {
      return;
    }

    if (
      this.queue.length === 0
    ) {
      return;
    }

    const {
      task,
      resolve,
      reject,
    } = this.queue.shift();

    this.activeCount++;

    Promise.resolve()
      .then(task)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.activeCount--;

        this.runNext();
      });
  }
}
```

This implementation follows the common pattern of tracking active tasks, queueing excess work, and starting queued tasks when active ones finish. [\[blog.stackademic.com\]](https://blog.stackademic.com/top-javascript-interview-question-task-runner-with-concurrency-8b318d658034), [\[rowdycoders.com\]](https://www.rowdycoders.com/building-a-async-concurrency-controlled-task-manager-in-javascript/)

***

# Usage

```js
const runner =
  new TaskRunner(2);

const createTask =
  (id, delay) =>
  () =>
    new Promise(resolve => {
      console.log(
        `Start ${id}`
      );

      setTimeout(() => {
        console.log(
          `End ${id}`
        );

        resolve(id);
      }, delay);
    });

runner.add(
  createTask(1, 3000)
);

runner.add(
  createTask(2, 1000)
);

runner.add(
  createTask(3, 2000)
);

runner.add(
  createTask(4, 500)
);
```

***

# Execution Flow

```text
Time 0

Running:
Task1
Task2

Waiting:
Task3
Task4

----------------

Task2 finishes

Running:
Task1
Task3

Waiting:
Task4

----------------

Task1 finishes

Running:
Task3
Task4
```

***

# Preserve Result Order (Interview Follow-Up)

Many interviewers ask:

```text
Return results
in task submission order
```

Input:

```js
[
 task1,
 task2,
 task3
]
```

Output:

```js
[
 result1,
 result2,
 result3
]
```

even if:

```text
task2
finishes first
```

### Solution

Store index:

```js
results[index] = value;
```

and return:

```js
Promise.all(...)
```

***

# Async Pool Function (LeetCode Style)

Sometimes asked as a function rather than a class.

```js
async function asyncPool(
  limit,
  tasks
) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const promise =
      Promise.resolve()
        .then(task);

    results.push(promise);

    if (
      limit <= tasks.length
    ) {
      const e =
        promise.then(
          () =>
            executing.splice(
              executing.indexOf(
                e
              ),
              1
            )
        );

      executing.push(e);

      if (
        executing.length >=
        limit
      ) {
        await Promise.race(
          executing
        );
      }
    }
  }

  return Promise.all(
    results
  );
}
```

***

# Production Enhancements

## Retry Support

```js
{
 retry: 3
}
```

***

## Priority Queue

```js
HIGH
MEDIUM
LOW
```

***

## Cancellation

```js
AbortController
```

***

## Timeout

```js
Task must finish
within 5 seconds
```

***

## Pause / Resume

```js
runner.pause();

runner.resume();
```

***

# Complexity

### Add Task

```text
O(1)
```

### Start Next Task

```text
O(1)
```

### Queue Size

```text
O(n)
```

where:

```text
n = waiting tasks
```

***

# Senior Interview Answer

> I would maintain a queue of pending tasks and an `activeCount` representing currently running tasks. When a task is added, it starts immediately if the concurrency limit has not been reached; otherwise it is queued. When a running task completes, I decrement the active count and automatically start the next queued task. This ensures FIFO processing while never exceeding the configured concurrency limit. [\[blog.stackademic.com\]](https://blog.stackademic.com/top-javascript-interview-question-task-runner-with-concurrency-8b318d658034), [\[rowdycoders.com\]](https://www.rowdycoders.com/building-a-async-concurrency-controlled-task-manager-in-javascript/), [\[bigfrontend.dev\]](https://bigfrontend.dev/problem/async-task-queue)
