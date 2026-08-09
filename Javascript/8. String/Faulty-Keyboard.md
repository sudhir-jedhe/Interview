   1. Faulty Keyboard
      Description
      Your laptop keyboard is faulty, and whenever you type a character 'i' on it, it reverses the string that you have written. Typing other characters works as expected.

You are given a 0-indexed string s, and you type each character of s using your faulty keyboard.

Return the final string that will be present on your laptop screen.

Example 1:

Input: s = "string"
Output: "rtsng"
Explanation:
After typing first character, the text on the screen is "s".
After the second character, the text is "st".
After the third character, the text is "str".
Since the fourth character is an 'i', the text gets reversed and becomes "rts".
After the fifth character, the text is "rtsn".
After the sixth character, the text is "rtsng".
Therefore, we return "rtsng".
Example 2:

Input: s = "poiinter"
Output: "ponter"
Explanation:
After the first character, the text on the screen is "p".
After the second character, the text is "po".
Since the third character you type is an 'i', the text gets reversed and becomes "op".
Since the fourth character you type is an 'i', the text gets reversed and becomes "po".
After the fifth character, the text is "pon".
After the sixth character, the text is "pont".
After the seventh character, the text is "ponte".
After the eighth character, the text is "ponter".
Therefore, we return "ponter".

Constraints:

1 <= s.length <= 100
s consists of lowercase English letters.
s[0] != 'i'
Solutions
Solution 1: Simulation

We directly simulate the keyboard input process, using a character array
to record the text on the screen, initially
is empty.

For each character
in string
, if
is not the character
, then we add
to the end of
; otherwise, we reverse all characters in
.

The final answer is the string composed of characters in
.

The time complexity is
, and the space complexity is
, where
is the length of string
.

```js
function finalString(s: string): string {
    const t: string[] = [];
    for (const c of s) {
        if (c === 'i') {
            t.reverse();
        } else {
            t.push(c);
        }
    }
    return t.join('');
}

All Problems
```

For **LeetCode 2810: Faulty Keyboard**, the simulation approach using an array `.reverse()` works well because $N \le 100$, leading to at most $O(N^2)$ worst-case time complexity.

However, you can optimize this to **$O(N)$ time** using a **Double-Ended Queue (Deque)**.

---

### Optimal $O(N)$ Solution: Deque / Two-Pointer State Toggle

#### Concept

Instead of physically reversing the array every time an `'i'` is encountered—which takes $O(K)$ time per reverse—we can maintain a **boolean flag (`isReversed`)** that tracks our current typing direction:

1. Maintain a **Deque** (or double-ended array).
2. Maintain `isReversed = false`.
3. Iterate through string `s`:

* If character is `'i'`: Toggle `isReversed = !isReversed`.
* If character is not `'i'`:
* If `!isReversed`: Append character to the **back** (`push`).
* If `isReversed`: Prepend character to the **front** (`unshift` / prepend).

1. At the end, if `isReversed` is `true`, reverse the final result once.

This ensures every character addition takes $O(1)$ time, yielding **$O(N)$ total time complexity**.

---

### Code Implementations

#### 1. Simulation Approach (Your Provided Solution — $O(N^2)$ Time, $O(N)$ Space)

Clean and ideal for small string constraints ($N \le 100$):

```typescript
function finalString(s: string): string {
    const res: string[] = [];

    for (const char of s) {
        if (char === 'i') {
            res.reverse();
        } else {
            res.push(char);
        }
    }

    return res.join('');
}

```

---

#### 2. Optimal Deque Approach ($O(N)$ Time, $O(N)$ Space)

```typescript
function finalStringOptimal(s: string): string {
    const front: string[] = [];
    const back: string[] = [];
    let isReversed = false;

    for (const char of s) {
        if (char === 'i') {
            isReversed = !isReversed;
        } else {
            if (isReversed) {
                front.push(char); // Acts as prepending to front
            } else {
                back.push(char);  // Acts as appending to back
            }
        }
    }

    // Combine front (reversed) and back
    const result = front.reverse().concat(back);
    
    // If the net state is reversed at the end, reverse the combined result
    return isReversed ? result.reverse().join('') : result.join('');
}

// Verification
console.log(finalStringOptimal("string"));   // "rtsng"
console.log(finalStringOptimal("poiinter")); // "ponter"

```

---

### Walkthrough of Deque Approach (`s = "string"`)

| Char  | `isReversed` | `front`      | `back`            | Description                                        |
| ----- | ------------ | ------------ | ----------------- | -------------------------------------------------- |
| `'s'` | `false`      | `[]`         | `['s']`           | Normal push to back                                |
| `'t'` | `false`      | `[]`         | `['s', 't']`      | Normal push to back                                |
| `'r'` | `false`      | `[]`         | `['s', 't', 'r']` | Normal push to back                                |
| `'i'` | `true`       | `[]`         | `['s', 't', 'r']` | Toggle `isReversed = true`                         |
| `'n'` | `true`       | `['n']`      | `['s', 't', 'r']` | `isReversed` is true $\rightarrow$ push to `front` |
| `'g'` | `true`       | `['n', 'g']` | `['s', 't', 'r']` | `isReversed` is true $\rightarrow$ push to `front` |

* **Combine:** `front.reverse()` $\rightarrow$ `['g', 'n']` concatenated with `back` $\rightarrow$ `['g', 'n', 's', 't', 'r']`
* **Final Net Flip (`isReversed = true`):** Reverse entire combined array $\rightarrow$ `['r', 't', 's', 'n', 'g']` $\rightarrow$ `"rtsng"`

---

### Complexity Comparison

| Solution                            | Time Complexity | Auxiliary Space | Best For                          |
| ----------------------------------- | --------------- | --------------- | --------------------------------- |
| **Array `.reverse()` (Simulation)** | $O(N^2)$        | $O(N)$          | Short strings ($N \le 100$)       |
| **Deque / Pointer Toggle**          | **$O(N)$**      | **$O(N)$**      | Large scale inputs ($N \ge 10^5$) |

In **LeetCode 988: Smallest String Starting From Leaf**, you are given the root of a binary tree where each node contains an integer from `0` to `25` representing characters `'a'` through `'z'` (`0 -> 'a'`, `1 -> 'b'`, ..., `25 -> 'z'`).

You need to find the **lexicographically smallest string** that starts at any leaf node and ends at the root.

---

### Key Difference: Root-to-Leaf vs. Leaf-to-Root

* Standard tree paths go **Root $\rightarrow$ Leaf** (e.g., `"ab"` vs `"ba"`).
* Here, strings are constructed **Leaf $\rightarrow$ Root**.
* Because strings are built backwards, a smaller character at the leaf produces a lexicographically smaller result overall.
* **Important:** If one path is a prefix of another (e.g., `"ab"` vs `"aba"`), the shorter string `"ab"` is lexicographically smaller.

---

### DFS Depth-First Search Solution ($O(N \cdot H)$ Time)

We traverse the tree from root to leaf using Depth-First Search (DFS). At each step:

1. Convert the node's integer value to its character representation using `String.fromCharCode(97 + val)`.
2. Prepend the current character to our path accumulator string (`char + currentPath`).
3. When reaching a **leaf node** (both `left` and `right` are `null`), compare the leaf-to-root path string against our global minimum string and update it.

#### JavaScript / TypeScript Implementation

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {string}
 */
function smallestFromLeaf(root) {
  let smallest = null;

  function dfs(node, currentPath) {
    if (!node) return;

    // Convert node value (0-25) to character ('a'-'z')
    const char = String.fromCharCode(97 + node.val);
    
    // Construct path from Leaf -> Root by prepending
    const newPath = char + currentPath;

    // If it's a leaf node, compare with global smallest
    if (!node.left && !node.right) {
      if (smallest === null || newPath < smallest) {
        smallest = newPath;
      }
      return;
    }

    // Traverse left and right children
    dfs(node.left, newPath);
    dfs(node.right, newPath);
  }

  dfs(root, "");
  return smallest;
}

```

---

### Example Walkthrough

Consider a tree structured as:

```
      2 (c)
     /   \
   1(b)   0(a)
   / \    / \
 0(a) 1(b) 0(a) 1(b)

```

1. **Leaf `0` (leftmost):** Path built = `'a'` $\rightarrow$ `'b'` $\rightarrow$ `'c'` = `"abc"`
2. **Leaf `1` (second):** Path built = `'b'` $\rightarrow$ `'b'` $\rightarrow$ `'c'` = `"bbc"`
3. **Leaf `0` (third):** Path built = `'a'` $\rightarrow$ `'a'` $\rightarrow$ `'c'` = `"aac"`
4. **Leaf `1` (rightmost):** Path built = `'b'` $\rightarrow$ `'a'` $\rightarrow$ `'c'` = `"bac"`

**Comparison:** `"aac"` < `"abc"` < `"bac"` < `"bbc"`

**Result:** `"aac"`

---

### Memory-Optimized DFS with Array & Backtracking

If $N$ is large, string prepending `char + currentPath` creates a new string at every node, using $O(H^2)$ memory per path where $H$ is tree height.

We can pass an array, push characters going down, and reverse the path only at leaf nodes:

```javascript
function smallestFromLeafOptimized(root) {
  let smallest = null;

  function dfs(node, path) {
    if (!node) return;

    path.push(String.fromCharCode(97 + node.val));

    // If leaf node, reverse current path to get Leaf -> Root
    if (!node.left && !node.right) {
      const leafToRoot = [...path].reverse().join('');
      if (smallest === null || leafToRoot < smallest) {
        smallest = leafToRoot;
      }
    } else {
      dfs(node.left, path);
      dfs(node.right, path);
    }

    // Backtrack
    path.pop();
  }

  dfs(root, []);
  return smallest;
}

```

---

### Complexity Analysis

| Metric               | Complexity               | Explanation                                                                                                                                                           |
| -------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Time Complexity**  | $\mathcal{O}(N \cdot H)$ | We visit all $N$ nodes. At each of the $L$ leaf nodes, string construction/comparison takes $O(H)$ time where $H$ is the tree height ($\log N$ balanced, $N$ skewed). |
| **Space Complexity** | $\mathcal{O}(H)$         | Call stack depth equals tree height $H$.                                                                                                                              |

In **LeetCode 129: Sum Root to Leaf Numbers**, you are given the root of a binary tree containing digits from `0` to `9`. Each root-to-leaf path represents a number (for example, the path `1 -> 2 -> 3` represents `123`). You need to return the **total sum of all root-to-leaf numbers**.

---

### Key Concept: Positional Number Accumulation

As you move down the tree from parent to child, you shift the current accumulated number to the left by multiplying by `10` and adding the child's value:

$$\text{currentNum} = \text{currentNum} \times 10 + \text{node.val}$$

For example, along the path `1 -> 2 -> 3`:

1. **At Node `1`:** $\text{currentNum} = 1$
2. **At Node `2`:** $\text{currentNum} = 1 \times 10 + 2 = 12$
3. **At Node `3`:** $\text{currentNum} = 12 \times 10 + 3 = 123$

---

### Method 1: Recursive DFS (Cleanest & Most Intuitive)

We pass the running sum down the recursion stack. When we reach a leaf node (both `left` and `right` are `null`), we return the accumulated number for that path.

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {number}
 */
function sumNumbers(root) {
  function dfs(node, currentSum) {
    if (!node) return 0;

    // Calculate current running number for this path
    currentSum = currentSum * 10 + node.val;

    // If it's a leaf node, return the completed number
    if (!node.left && !node.right) {
      return currentSum;
    }

    // Otherwise, sum up results from left and right subtrees
    return dfs(node.left, currentSum) + dfs(node.right, currentSum);
  }

  return dfs(root, 0);
}

```

---

### Method 2: Iterative BFS (Using Queue)

If you want to avoid potential call stack overflow on deeply skewed trees, use Breadth-First Search (BFS) with a queue. Each queue entry stores `[node, currentSum]`:

```javascript
function sumNumbersBFS(root) {
  if (!root) return 0;

  let totalSum = 0;
  const queue = [[root, root.val]];

  while (queue.length > 0) {
    const [node, currentSum] = queue.shift();

    // If it's a leaf node, add path value to total sum
    if (!node.left && !node.right) {
      totalSum += currentSum;
    }

    if (node.left) {
      queue.push([node.left, currentSum * 10 + node.left.val]);
    }
    if (node.right) {
      queue.push([node.right, currentSum * 10 + node.right.val]);
    }
  }

  return totalSum;
}

```

---

### Example Walkthrough

Consider this binary tree:

```
    4
   / \
  9   0
 / \
5   1

```

1. **Path `4 -> 9 -> 5`:** $4 \rightarrow 49 \rightarrow 495$
2. **Path `4 -> 9 -> 1`:** $4 \rightarrow 49 \rightarrow 491$
3. **Path `4 -> 0`:** $4 \rightarrow 40$

$$\text{Total Sum} = 495 + 491 + 40 = 1026$$

---

### Complexity Analysis

| Metric               | Complexity       | Explanation                                                                                       |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| **Time Complexity**  | $\mathcal{O}(N)$ | We visit every node in the binary tree exactly once.                                              |
| **Space Complexity** | $\mathcal{O}(H)$ | Recursive call stack uses space equal to tree height $H$ ($\log N$ for balanced, $N$ for skewed). |

In **LeetCode 112** and **LeetCode 113**, you are given the root of a binary tree and a `targetSum`. Both problems ask you to find root-to-leaf paths whose node values sum up to `targetSum`.

* **LeetCode 112 (Path Sum):** Return `true` if **at least one** root-to-leaf path equals `targetSum`, otherwise return `false`.
* **LeetCode 113 (Path Sum II):** Return **all** root-to-leaf paths where the sum equals `targetSum`.

---

## LeetCode 112: Path Sum (Boolean Check)

### Strategy: Subtraction DFS

As you traverse down the tree, subtract the current node's value from `targetSum`. When you reach a leaf node (`!node.left && !node.right`), check if the remaining `targetSum` equals `node.val`.

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
function hasPathSum(root, targetSum) {
  if (!root) return false;

  // Base Case: Reached a leaf node
  if (!root.left && !root.right) {
    return targetSum === root.val;
  }

  // Subtract current node value and recurse on children
  const remainingSum = targetSum - root.val;
  return hasPathSum(root.left, remainingSum) || hasPathSum(root.right, remainingSum);
}

```

---

## LeetCode 113: Path Sum II (Return All Paths)

### Strategy: DFS with Backtracking

Traverse the tree while maintaining a `currentPath` array and a running sum. When you reach a leaf node whose sum equals `targetSum`, save a copy of `currentPath` into your `result` array. Use **backtracking** (`currentPath.pop()`) so the array can be reused across recursive calls.

```javascript
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
function pathSum(root, targetSum) {
  const result = [];

  function dfs(node, remainingSum, currentPath) {
    if (!node) return;

    // Choose: Add current node value to path
    currentPath.push(node.val);

    // Base Case: Leaf node check
    if (!node.left && !node.right && remainingSum === node.val) {
      result.push([...currentPath]); // Push a shallow copy of the valid path
    } else {
      // Recurse on children
      dfs(node.left, remainingSum - node.val, currentPath);
      dfs(node.right, remainingSum - node.val, currentPath);
    }

    // Backtrack: Remove current node before returning up the call stack
    currentPath.pop();
  }

  dfs(root, targetSum, []);
  return result;
}

```

---

## Example Walkthrough (LeetCode 113)

Given `targetSum = 22` and the tree:

```
      5
     / \
    4   8
   /   / \
  11  13  4
 /  \    / \
7    2  5   1

```

1. Path `[5, 4, 11, 2]`: Sum = $5 + 4 + 11 + 2 = 22$ $\rightarrow$ Valid! Added to `result`.
2. Path `[5, 8, 4, 5]`: Sum = $5 + 8 + 4 + 5 = 22$ $\rightarrow$ Valid! Added to `result`.

**Output:** `[[5, 4, 11, 2], [5, 8, 4, 5]]`

---

## Complexity Analysis

| Problem          | Time Complexity          | Space Complexity | Reason                                                                             |
| ---------------- | ------------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **LeetCode 112** | $\mathcal{O}(N)$         | $\mathcal{O}(H)$ | Visits each node once. Stack space is equal to tree height $H$.                    |
| **LeetCode 113** | $\mathcal{O}(N \cdot H)$ | $\mathcal{O}(H)$ | Visits each node once. Copying a valid path at a leaf takes $\mathcal{O}(H)$ time. |

In **LeetCode 437: Path Sum III**, you are given the root of a binary tree and a `targetSum`. You need to find the number of paths where the sum of the values along the path equals `targetSum`.

Unlike LeetCode 112 and 113, the path **does not need to start at the root** or **end at a leaf**, but it must go downwards (parent to child).

---

### Key Intuition: Prefix Sums on Trees

A **Prefix Sum** represents the sum of node values from the root down to the current node.

If $P_A$ is the prefix sum from the root to node $A$, and $P_B$ is the prefix sum from the root to an ancestor node $B$, then the sum of the path between $B$ and $A$ is:

$$\text{Path Sum} = P_A - P_B$$

To find a path that sums to `targetSum`:

$$P_A - P_B = \text{targetSum} \implies P_B = P_A - \text{targetSum}$$

While running a DFS traversal:

1. Maintain a running `currentSum` (prefix sum from root to current node).
2. Look up in a Hash Map (`prefixMap`) how many times `currentSum - targetSum` has appeared above us in the current tree branch.
3. Record `currentSum` in the map, recurse down to children, and **backtrack** (decrement count in map) when returning up the call stack so paths from other branches don't interfere.

---

### Step-by-Step JavaScript Implementation

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
function pathSum(root, targetSum) {
  // Map stores { prefixSum: count }
  const prefixMap = new Map();
  
  // Base case: A prefix sum of 0 has occurred once (represents a path starting directly at root)
  prefixMap.set(0, 1);

  function dfs(node, currentSum) {
    if (!node) return 0;

    // Update running prefix sum
    currentSum += node.val;

    // Count paths that end at the current node and sum to targetSum
    const neededPrefixSum = currentSum - targetSum;
    let validPaths = prefixMap.get(neededPrefixSum) || 0;

    // Add current prefix sum to the hash map for child nodes to use
    prefixMap.set(currentSum, (prefixMap.get(currentSum) || 0) + 1);

    // Recursively count paths in left and right subtrees
    validPaths += dfs(node.left, currentSum);
    validPaths += dfs(node.right, currentSum);

    // Backtrack: Remove current prefix sum so it doesn't affect parallel branches
    prefixMap.set(currentSum, prefixMap.get(currentSum) - 1);

    return validPaths;
  }

  return dfs(root, 0);
}

```

---

### Visualizing the Prefix Sum Lookup

Consider path `10 -> 5 -> 3`:

```
       10  (Prefix Sum = 10)
      /
     5     (Prefix Sum = 15)
    /
   3       (Prefix Sum = 18)

```

* At Node `3` (`currentSum = 18`), if `targetSum = 8`:
* We check for `neededPrefixSum = 18 - 8 = 10`.
* `prefixMap` contains `10` (from node `10`), so the path `5 -> 3` equals `8`!

---

### Complexity Analysis

| Approach                  | Time Complexity      | Space Complexity     | Explanation                                              |
| ------------------------- | -------------------- | -------------------- | -------------------------------------------------------- |
| **Naive Double DFS**      | $\mathcal{O}(N^2)$   | $\mathcal{O}(H)$     | Starts a new DFS traversal at every node.                |
| **Prefix Sum + Hash Map** | **$\mathcal{O}(N)$** | **$\mathcal{O}(N)$** | Visits each node once with $\mathcal{O}(1)$ map lookups. |

* **Time Complexity:** $\mathcal{O}(N)$ because every node is visited exactly once, and map operations take constant time.
* **Space Complexity:** $\mathcal{O}(N)$ worst-case for the hash map and recursion stack (skewed tree), or $\mathcal{O}(H)$ for balanced trees.
q

To build a **high-performance Deque** in JavaScript/TypeScript, you must avoid using `Array.prototype.shift()` or `Array.prototype.unshift()`. Standard array prepending operations take $\mathcal{O}(N)$ time because every subsequent element must be re-indexed in memory.

A production-ready Deque achieves **true $\mathcal{O}(1)$ time complexity** for all push and pop operations at both ends using a **Circular Ring Buffer** backed by fixed-size array chunks.

---

### Key Architectural Concepts

1. **Circular Ring Buffer:** Wraps `head` and `tail` pointers around a fixed-capacity buffer using bitwise modulo indexing (`index & (capacity - 1)`).
2. **Dynamic Resizing (Power-of-Two Capacity):** Keeping the capacity as a power of 2 ($16, 32, 64, \dots$) allows bitwise masking (`i & (mask)`) instead of slow modulo arithmetic (`i % capacity`).
3. **Double-Ended Access:** Supports `pushFront`, `popFront`, `pushBack`, and `popBack` in amortized $\mathcal{O}(1)$ time.

---

### High-Performance TypeScript Implementation

```typescript
export class Deque<T> {
  private buffer: (T | undefined)[];
  private head: number = 0;
  private tail: number = 0;
  private capacity: number;
  private mask: number;

  constructor(initialCapacity: number = 16) {
    // Round capacity up to the nearest power of 2
    let cap = 1;
    while (cap < Math.max(16, initialCapacity)) {
      cap <<= 1;
    }
    this.capacity = cap;
    this.mask = cap - 1;
    this.buffer = new Array(cap);
  }

  /** Current number of elements in the deque */
  get size(): number {
    return (this.tail - this.head) & this.mask;
  }

  /** Checks if the deque is empty */
  get isEmpty(): boolean {
    return this.head === this.tail;
  }

  /** Adds an element to the back (right) - O(1) */
  pushBack(item: T): void {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) & this.mask;
    if (this.tail === this.head) {
      this.resize(this.capacity << 1);
    }
  }

  /** Adds an element to the front (left) - O(1) */
  pushFront(item: T): void {
    this.head = (this.head - 1) & this.mask;
    this.buffer[this.head] = item;
    if (this.head === this.tail) {
      this.resize(this.capacity << 1);
    }
  }

  /** Removes and returns the element from the front (left) - O(1) */
  popFront(): T | undefined {
    if (this.isEmpty) return undefined;

    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined; // Help Garbage Collection
    this.head = (this.head + 1) & this.mask;

    // Shrink buffer if usage drops below 25% to save memory
    if (this.size < (this.capacity >> 2) && this.capacity > 16) {
      this.resize(this.capacity >> 1);
    }

    return item;
  }

  /** Removes and returns the element from the back (right) - O(1) */
  popBack(): T | undefined {
    if (this.isEmpty) return undefined;

    this.tail = (this.tail - 1) & this.mask;
    const item = this.buffer[this.tail];
    this.buffer[this.tail] = undefined; // Help Garbage Collection

    // Shrink buffer if usage drops below 25%
    if (this.size < (this.capacity >> 2) && this.capacity > 16) {
      this.resize(this.capacity >> 1);
    }

    return item;
  }

  /** Inspects the front element without removing it */
  peekFront(): T | undefined {
    return this.isEmpty ? undefined : this.buffer[this.head];
  }

  /** Inspects the back element without removing it */
  peekBack(): T | undefined {
    return this.isEmpty ? undefined : this.buffer[(this.tail - 1) & this.mask];
  }

  /** Clears the deque */
  clear(): void {
    this.head = 0;
    this.tail = 0;
    this.buffer.fill(undefined);
  }

  /** Internal method to re-allocate buffer when full/empty */
  private resize(newCapacity: number): void {
    const currentSize = this.size;
    const newBuffer = new Array<T | undefined>(newCapacity);

    for (let i = 0; i < currentSize; i++) {
      newBuffer[i] = this.buffer[(this.head + i) & this.mask];
    }

    this.buffer = newBuffer;
    this.head = 0;
    this.tail = currentSize;
    this.capacity = newCapacity;
    this.mask = newCapacity - 1;
  }
}

```

---

### Performance Comparison

| Operation                   | Standard JS Array (`shift` / `unshift`)        | Circular Ring Buffer Deque                       |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| **`pushBack` / `push**`     | Amortized $\mathcal{O}(1)$                     | Amortized $\mathcal{O}(1)$                       |
| **`popBack` / `pop**`       | $\mathcal{O}(1)$                               | $\mathcal{O}(1)$                                 |
| **`pushFront` / `unshift**` | **$\mathcal{O}(N)$** (Re-indexes entire array) | **$\mathcal{O}(1)$** (Bitwise pointer decrement) |
| **`popFront` / `shift**`    | **$\mathcal{O}(N)$** (Re-indexes entire array) | **$\mathcal{O}(1)$** (Bitwise pointer increment) |

---

### Usage Example

```typescript
const deque = new Deque<number>();

deque.pushBack(10);
deque.pushBack(20);
deque.pushFront(5);  // Deque state: [5, 10, 20]

console.log(deque.peekFront()); // 5
console.log(deque.peekBack());  // 20

console.log(deque.popFront());  // 5
console.log(deque.popBack());   // 20
console.log(deque.popFront());  // 10
console.log(deque.isEmpty);     // true

```
