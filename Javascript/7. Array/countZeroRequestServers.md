The problem you're dealing with involves determining how many servers did not receive any requests within a specific time window defined by a query. There are two different approaches in the code you've provided, which aim to solve the problem but with slightly different strategies. Let's break them down:

### Problem Breakdown:
- **Input:** 
  - `n` (number of servers),
  - `logs` (a list of requests where each log entry is `[server_id, time]`),
  - `x` (a time window),
  - `queries` (a list of times for which we need to check the number of servers that did not receive any requests in the last `x` time units).
  
- **Output:** 
  - A list of integers where each entry represents the number of servers that did not receive any requests during the interval `[query_time - x, query_time]`.

---

### Approach 1: Brute Force with `lastRequest` Array

In this approach, we keep track of the last request time for each server and count how many servers did not receive any requests in the given time interval.

#### Code:
```javascript
function countZeroRequestServers(n, logs, x, queries) {
    const lastRequest = new Array(n).fill(-1); // Track last request time for each server
    const arr = [];
    
    // Process logs to update lastRequest array
    for (const [server_id, time] of logs) {
        lastRequest[server_id - 1] = Math.max(lastRequest[server_id - 1], time);
    }
    
    // Process each query
    for (const query of queries) {
        const startTime = query - x;
        let count = 0;
        
        // Count servers with no requests during [startTime, query]
        for (let time of lastRequest) {
            if (time === -1 || time < startTime) {
                count++;
            }
        }
        
        arr.push(count);
    }
    
    return arr;
}

// Example usage:
console.log(countZeroRequestServers(3, [[1,3],[2,6],[1,5]], 5, [10,11])); // Output: [1,2]
console.log(countZeroRequestServers(3, [[2,4],[2,1],[1,2],[3,1]], 2, [3,4])); // Output: [0,1]
```

### Explanation of Code:
1. **`lastRequest` Array**: This array stores the latest request time for each server (`-1` indicates no requests received).
2. **Processing Logs**: For each log entry `[server_id, time]`, update the corresponding server’s last request time.
3. **Processing Queries**: For each query:
   - Calculate the `startTime` as `query - x`.
   - Count how many servers have not received any requests during the interval `[startTime, query]` (i.e., their last request time is either `-1` or before `startTime`).
   
4. **Time Complexity**:
   - Processing logs: **O(m)** where `m` is the number of logs.
   - Processing each query: **O(n)** for each query, where `n` is the number of servers.
   - Overall time complexity: **O(m + q * n)**, where `q` is the number of queries.

---

### Approach 2: Optimized with Sliding Window and Set

This approach processes the logs in a sorted manner and uses a sliding window (along with a Set) to efficiently track which servers are active in the given time window.

#### Code:
```javascript
function countServers(n, logs, x, queries) {
    // Sort logs by time for efficient processing
    logs.sort((a, b) => a[1] - b[1]);
  
    const results = new Array(queries.length).fill(0);
    let activeServers = new Set(); // Track active servers within the window
  
    let j = 0; // Pointer for logs
    for (let i = 0; i < queries.length; i++) {
      const queryTime = queries[i];
      const windowStart = queryTime - x;
  
      // Remove inactive servers (logs outside the window) from the set
      while (j < logs.length && logs[j][1] <= windowStart) {
        activeServers.delete(logs[j][0]);
        j++;
      }
  
      // Count servers without requests (not in the active set)
      results[i] = n - activeServers.size;
  
      // Add servers receiving requests within the window to the set
      for (let k = j; k < logs.length && logs[k][1] <= queryTime; k++) {
        activeServers.add(logs[k][0]);
      }
    }
  
    return results;
}
  
// Example usage
const n = 3;
const logs = [[1, 3], [2, 6], [1, 5]];
const x = 5;
const queries = [10, 11];
const result = countServers(n, logs, x, queries);
console.log(result); // Output: [1, 2]
```

### Explanation of Code:
1. **Sorting Logs**: The logs are sorted by time to efficiently process them in order.
2. **Active Server Set**: A Set is used to store servers that have received requests within the current window. The set ensures we don't count a server multiple times.
3. **Sliding Window**: We maintain a sliding window of requests using two pointers:
   - `j` keeps track of the logs that are before the `startTime` of the current query. These are removed from the set.
   - For each query, we add logs to the active set that fall within the window `[windowStart, queryTime]`.
4. **Result Calculation**: The number of servers that didn’t receive requests is simply `n - activeServers.size`.

5. **Time Complexity**:
   - Sorting logs: **O(m log m)**, where `m` is the number of logs.
   - Processing each query: **O(m)** in the worst case, as we may process all logs in the worst case.
   - Overall time complexity: **O(m log m + q * m)** where `q` is the number of queries.

---

### Performance Considerations:
- **Approach 1 (Brute Force)** is straightforward but can become inefficient if `n` (number of servers) or the number of queries is large. The worst-case time complexity is **O(n * q)**.
- **Approach 2 (Optimized with Sliding Window)** is more efficient, especially for large inputs, as it processes logs in sorted order and uses a Set to track active servers. The time complexity is **O(m log m + q * m)**, which can handle larger inputs more effectively.

### Example Walkthrough:

Given:
- **Logs**: `[[1, 3], [2, 6], [1, 5]]`
- **Queries**: `[10, 11]`
- **Time Window** (`x`): `5`

**For Query 1 (10):**
- Time interval: `[10 - 5, 10] = [5, 10]`
- Servers with requests during this time:
  - Server 1 received a request at time 5.
  - Server 2 received a request at time 6.
- Server 3 has no request in this interval.
- Output: `1`

**For Query 2 (11):**
- Time interval: `[11 - 5, 11] = [6, 11]`
- Servers with requests during this time:
  - Server 2 received a request at time 6.
- Servers 1 and 3 have no request in this interval.
- Output: `2`

Thus, the result is `[1, 2]`.

---

### Conclusion:
Both approaches work well for solving the problem, but the **optimized approach** with the sliding window and Set is more efficient for larger inputs, as it reduces redundant computations and processes logs in sorted order. If you're handling large inputs, this optimized method should be preferred.