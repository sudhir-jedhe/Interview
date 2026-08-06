Here are JavaScript implementations for some common data structures and algorithms (DSA) tasks:

### 1. **Reverse a Linked List**
```javascript
function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}
```

### 2. **Find the Middle Element of a Linked List**
```javascript
function findMiddle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

### 3. **Implement a Stack Using Arrays**
```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
```

### 4. **Implement a Queue Using Arrays**
```javascript
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    this.items.push(element);
  }
  dequeue() {
    return this.items.shift();
  }
  front() {
    return this.items[0];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
```

### 5. **Find the Factorial of a Number Using Recursion**
```javascript
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}
```

### 6. **Implement Binary Search in an Array**
```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

### 7. **Find the Largest/Smallest Element in an Array**
```javascript
function findLargest(arr) {
  return Math.max(...arr);
}

function findSmallest(arr) {
  return Math.min(...arr);
}
```

### 8. **Implement Merge Sort**
```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  
  return result.concat(left.slice(i), right.slice(j));
}
```

### 9. **Implement Quick Sort**
```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

### 10. **Detect a Cycle in a Linked List**
```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

### 11. **Find the Intersection Point of Two Linked Lists**
```javascript
function getIntersectionNode(headA, headB) {
  let a = headA;
  let b = headB;
  
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}
```

### 12. **Check if a Binary Tree is a Binary Search Tree (BST)**
```javascript
function isBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  
  if (root.val <= min || root.val >= max) return false;
  
  return isBST(root.left, min, root.val) && isBST(root.right, root.val, max);
}
```

### 13. **Print All Leaf Nodes of a Binary Tree**
```javascript
function printLeafNodes(root) {
  if (!root) return;
  
  if (!root.left && !root.right) {
    console.log(root.val);
  }
  
  printLeafNodes(root.left);
  printLeafNodes(root.right);
}
```

### 14. **Reverse a Binary Tree**
```javascript
function reverseBinaryTree(root) {
  if (!root) return null;
  
  let temp = root.left;
  root.left = root.right;
  root.right = temp;
  
  reverseBinaryTree(root.left);
  reverseBinaryTree(root.right);
}
```

### 15. **Find the Height of a Binary Tree**
```javascript
function heightOfTree(root) {
  if (!root) return 0;
  
  return Math.max(heightOfTree(root.left), heightOfTree(root.right)) + 1;
}
```

### 16. **Implement Depth-First Search (DFS) on a Graph**
```javascript
function dfs(graph, node, visited = new Set()) {
  if (!node) return;
  
  console.log(node);
  visited.add(node);
  
  graph[node].forEach(neighbor => {
    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
  });
}
```

### 17. **Implement Breadth-First Search (BFS) on a Graph**
```javascript
function bfs(graph, start) {
  let visited = new Set();
  let queue = [start];
  
  while (queue.length) {
    let node = queue.shift();
    
    if (!visited.has(node)) {
      console.log(node);
      visited.add(node);
      
      queue.push(...graph[node]);
    }
  }
}
```

### 18. **Check if a Graph is Connected**
```javascript
function isConnected(graph) {
  let visited = new Set();
  
  function dfs(node) {
    visited.add(node);
    graph[node].forEach(neighbor => {
      if (!visited.has(neighbor)) dfs(neighbor);
    });
  }
  
  dfs(Object.keys(graph)[0]);
  
  return Object.keys(graph).length === visited.size;
}
```

### 19. **Implement Dijkstra's Algorithm for Shortest Path**
```javascript
function dijkstra(graph, start) {
  let distances = {};
  let pq = new PriorityQueue();
  
  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
  });
  distances[start] = 0;
  
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    let currentNode = pq.dequeue().element;
    
    graph[currentNode].forEach(neighbor => {
      let newDist = distances[currentNode] + graph[currentNode][neighbor];
      
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.enqueue(neighbor, distances[neighbor]);
      }
    });
  }
  
  return distances;
}
```

Here are JavaScript implementations for more advanced algorithms and data structures (DSA):

### 20. **Implement Prim's Algorithm for Minimum Spanning Tree**
```javascript
function prim(graph) {
  const visited = new Set();
  const edges = [];
  
  // Initial node is the first node in the graph
  const startNode = Object.keys(graph)[0];
  visited.add(startNode);
  
  while (visited.size < Object.keys(graph).length) {
    let minEdge = null;
    
    for (let node of visited) {
      for (let neighbor in graph[node]) {
        if (!visited.has(neighbor)) {
          if (!minEdge || graph[node][neighbor] < minEdge.weight) {
            minEdge = { from: node, to: neighbor, weight: graph[node][neighbor] };
          }
        }
      }
    }
    
    edges.push(minEdge);
    visited.add(minEdge.to);
  }
  
  return edges;
}
```

### 21. **Implement Kruskal's Algorithm for Minimum Spanning Tree**
```javascript
function kruskal(graph) {
  const edges = [];
  for (let node in graph) {
    for (let neighbor in graph[node]) {
      edges.push({ from: node, to: neighbor, weight: graph[node][neighbor] });
    }
  }
  
  edges.sort((a, b) => a.weight - b.weight);
  
  const parent = {};
  const rank = {};
  
  function find(node) {
    if (parent[node] === undefined) parent[node] = node;
    if (parent[node] !== node) parent[node] = find(parent[node]);
    return parent[node];
  }
  
  function union(node1, node2) {
    const root1 = find(node1);
    const root2 = find(node2);
    
    if (root1 !== root2) {
      if (rank[root1] > rank[root2]) {
        parent[root2] = root1;
      } else if (rank[root1] < rank[root2]) {
        parent[root1] = root2;
      } else {
        parent[root2] = root1;
        rank[root1]++;
      }
    }
  }
  
  const mst = [];
  for (let edge of edges) {
    if (find(edge.from) !== find(edge.to)) {
      mst.push(edge);
      union(edge.from, edge.to);
    }
  }
  
  return mst;
}
```

### 22. **Find the Longest Common Subsequence of Two Strings**
```javascript
function longestCommonSubsequence(str1, str2) {
  const dp = Array(str1.length + 1).fill().map(() => Array(str2.length + 1).fill(0));
  
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[str1.length][str2.length];
}
```

### 23. **Find the Longest Increasing Subsequence of an Array**
```javascript
function longestIncreasingSubsequence(arr) {
  const dp = Array(arr.length).fill(1);
  
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}
```

### 24. **Implement the Knuth-Morris-Pratt (KMP) Algorithm for String Matching**
```javascript
function KMP(pattern, text) {
  const lps = buildLPS(pattern);
  let i = 0, j = 0;
  
  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    
    if (j === pattern.length) {
      console.log(`Pattern found at index ${i - j}`);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
}

function buildLPS(pattern) {
  const lps = Array(pattern.length).fill(0);
  let length = 0;
  let i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        length = lps[length - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  
  return lps;
}
```

### 25. **Implement the Rabin-Karp Algorithm for String Matching**
```javascript
function rabinKarp(pattern, text) {
  const prime = 101; // A prime number to reduce hash collision
  const m = pattern.length;
  const n = text.length;
  const patternHash = hash(pattern, m);
  let textHash = hash(text.substring(0, m), m);
  
  for (let i = 0; i <= n - m; i++) {
    if (patternHash === textHash && text.substring(i, i + m) === pattern) {
      console.log(`Pattern found at index ${i}`);
    }
    
    if (i < n - m) {
      textHash = recalculateHash(text, i, textHash, m, prime);
    }
  }
}

function hash(str, m) {
  let hashVal = 0;
  for (let i = 0; i < m; i++) {
    hashVal = (hashVal * 256 + str.charCodeAt(i)) % 101;
  }
  return hashVal;
}

function recalculateHash(text, i, oldHash, m, prime) {
  let newHash = oldHash - text.charCodeAt(i);
  newHash = (newHash * 256 + text.charCodeAt(i + m)) % prime;
  return newHash;
}
```

### 26. **Check if a String is a Palindrome**
```javascript
function isPalindrome(str) {
  const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleanedStr === cleanedStr.split('').reverse().join('');
}
```

### 27. **Check if Two Strings Are Anagrams of Each Other**
```javascript
function areAnagrams(str1, str2) {
  return str1.split('').sort().join('') === str2.split('').sort().join('');
}
```

### 28. **Find the Next Greater Element in an Array**
```javascript
function nextGreaterElement(arr) {
  const stack = [];
  const result = [];
  
  for (let i = arr.length - 1; i >= 0; i--) {
    while (stack.length && stack[stack.length - 1] <= arr[i]) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      result[i] = -1;
    } else {
      result[i] = stack[stack.length - 1];
    }
    
    stack.push(arr[i]);
  }
  
  return result;
}
```

### 29. **Find the kth Smallest/Largest Element in an Array**
```javascript
function kthSmallest(arr, k) {
  arr.sort((a, b) => a - b);
  return arr[k - 1];
}

function kthLargest(arr, k) {
  arr.sort((a, b) => b - a);
  return arr[k - 1];
}
```

### 30. **Find the Median of Two Sorted Arrays**
```javascript
function findMedianSortedArrays(nums1, nums2) {
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const mid = Math.floor(merged.length / 2);
  
  if (merged.length % 2 === 0) {
    return (merged[mid - 1] + merged[mid]) / 2;
  } else {
    return merged[mid];
  }
}
```

Here are JavaScript implementations for the next set of algorithms and data structures (DSA):

### 31. **Implement a Trie (Prefix Tree)**
```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let currentNode = this.root;
    for (let char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNode();
      }
      currentNode = currentNode.children[char];
    }
    currentNode.isEndOfWord = true;
  }

  search(word) {
    let currentNode = this.root;
    for (let char of word) {
      if (!currentNode.children[char]) {
        return false;
      }
      currentNode = currentNode.children[char];
    }
    return currentNode.isEndOfWord;
  }

  startsWith(prefix) {
    let currentNode = this.root;
    for (let char of prefix) {
      if (!currentNode.children[char]) {
        return false;
      }
      currentNode = currentNode.children[char];
    }
    return true;
  }
}
```

### 32. **Find All Subsets of a Set**
```javascript
function subsets(nums) {
  const result = [];
  
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(0, []);
  return result;
}
```

### 33. **Find All Permutations of a String**
```javascript
function permute(str) {
  const result = [];
  
  function backtrack(start) {
    if (start === str.length) {
      result.push(str);
      return;
    }
    
    for (let i = start; i < str.length; i++) {
      str = swap(str, start, i);
      backtrack(start + 1);
      str = swap(str, start, i);
    }
  }

  function swap(str, i, j) {
    const arr = str.split('');
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return arr.join('');
  }

  backtrack(0);
  return result;
}
```

### 34. **Implement the Josephus Problem**
```javascript
function josephus(n, k) {
  let people = Array.from({ length: n }, (_, i) => i + 1);
  let index = 0;

  while (people.length > 1) {
    index = (index + k - 1) % people.length;
    people.splice(index, 1);
  }
  
  return people[0];
}
```

### 35. **Implement an LRU (Least Recently Used) Cache**
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size === this.capacity) this.cache.delete(this.cache.keys().next().value);
    
    this.cache.set(key, value);
  }
}
```

### 36. **Find the Longest Palindrome Substring in a String**
```javascript
function longestPalindrome(str) {
  let longest = '';
  
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      const substring = str.slice(i, j);
      if (substring === substring.split('').reverse().join('') && substring.length > longest.length) {
        longest = substring;
      }
    }
  }
  
  return longest;
}
```

### 37. **Implement a Priority Queue**
```javascript
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element, priority) {
    const newElement = { element, priority };
    let added = false;
    
    for (let i = 0; i < this.queue.length; i++) {
      if (newElement.priority < this.queue[i].priority) {
        this.queue.splice(i, 0, newElement);
        added = true;
        break;
      }
    }
    
    if (!added) {
      this.queue.push(newElement);
    }
  }

  dequeue() {
    return this.queue.shift();
  }

  front() {
    return this.queue[0];
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}
```

### 38. **Implement a Hashmap (Dictionary)**
```javascript
class HashMap {
  constructor(size) {
    this.size = size;
    this.map = new Array(size);
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  set(key, value) {
    const index = this.hash(key);
    if (!this.map[index]) {
      this.map[index] = [];
    }
    this.map[index].push([key, value]);
  }

  get(key) {
    const index = this.hash(key);
    if (!this.map[index]) return null;
    for (let [k, v] of this.map[index]) {
      if (k === key) return v;
    }
    return null;
  }
}
```

### 39. **Count the Number of Inversions in an Array**
```javascript
function countInversions(arr) {
  let count = 0;

  function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
  }

  function merge(left, right) {
    const merged = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        count += left.length - i;
        j++;
      }
    }

    return [...merged, ...left.slice(i), ...right.slice(j)];
  }

  mergeSort(arr);
  return count;
}
```

### 40. **Find the Shortest Path in a Maze**
```javascript
function shortestPathInMaze(maze, start, end) {
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set();

  visited.add(`${start[0]}-${start[1]}`);

  while (queue.length > 0) {
    const [x, y, dist] = queue.shift();
    
    if (x === end[0] && y === end[1]) {
      return dist;
    }

    for (let [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < maze.length && newY >= 0 && newY < maze[0].length && maze[newX][newY] === 0 && !visited.has(`${newX}-${newY}`)) {
        visited.add(`${newX}-${newY}`);
        queue.push([newX, newY, dist + 1]);
      }
    }
  }

  return -1; // No path found
}
```

These are common data structure and algorithm tasks implemented in JavaScript. Let me know if you would like further explanations or modifications!