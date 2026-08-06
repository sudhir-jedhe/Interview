```js
export function longestWorkingEmployee(logs) {
  let maxLeaveTime = 0;
  let employeeID = Infinity;

  for (const [id, leaveTime] of logs) {
    if (
      leaveTime > maxLeaveTime ||
      (leaveTime === maxLeaveTime && id < employeeID)
    ) {
      maxLeaveTime = leaveTime;
      employeeID = id;
    }
  }

  return employeeID;
}

import { longestWorkingEmployee } from "./longestWorkingEmployee.js";

const logs = [
  [1, 5],
  [2, 7],
  [3, 5],
  [4, 8],
];
console.log(longestWorkingEmployee(logs)); // Output: 4
```

This query refers to the popular LeetCode problem: **LeetCode 2432 — "The Employee That Worked on the Longest Task"**.

---

### Problem Overview

You are given $n$ employees (with IDs from $0$ to $n - 1$) and a 2D array `logs`, where `logs[i] = [id, leaveTime]`:

- `id` is the ID of the employee who worked on the $i$-th task.
- `leaveTime` is the timestamp when that task was finished.
- Task $0$ starts at time $0$, and each subsequent task starts immediately after the previous task finishes.

**Goal:** Return the `id` of the employee who worked on the **longest single task**. If there is a tie, return the **smallest employee ID**.

---

### Key Intuition

1. **Calculate Task Duration**:

- For the first task (`i = 0`), duration = `logs[0][1]`.
- For any task `i > 0`, duration = `logs[i][1] - logs[i - 1][1]`.

2. **Track the Best Employee**:

- Maintain the maximum duration seen so far (`maxDuration`) and the best candidate ID (`ansId`).
- Update if `duration > maxDuration`.
- If `duration == maxDuration`, update if `id < ansId`.

---

### Solution Implementation (JavaScript / TypeScript)

```javascript
/**
 * @param {number} n
 * @param {number[][]} logs
 * @return {number}
 */
function hardestWorker(n, logs) {
  let maxDuration = 0;
  let ansId = Infinity;
  let lastTime = 0;

  for (const [id, leaveTime] of logs) {
    const duration = leaveTime - lastTime;

    if (duration > maxDuration) {
      maxDuration = duration;
      ansId = id;
    } else if (duration === maxDuration) {
      ansId = Math.min(ansId, id);
    }

    lastTime = leaveTime; // Update the finish time for the next task
  }

  return ansId;
}

// Example 1:
console.log(
  hardestWorker(10, [
    [0, 3],
    [2, 5],
    [0, 9],
    [1, 15],
  ]),
);
// Output: 1 (Task 3 ran from 9 to 15 -> duration = 6)

// Example 2 (Tie Breaker):
console.log(
  hardestWorker(2, [
    [0, 10],
    [1, 20],
  ]),
);
// Output: 0 (Both duration 10, tie broken by smaller ID)
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(m)$ where $m$ is the number of logs (single pass through the `logs` array).
- **Space Complexity:** $\mathcal{O}(1)$ constant extra space.
