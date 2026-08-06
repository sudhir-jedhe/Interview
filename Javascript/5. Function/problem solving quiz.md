Here's how you can implement the different concepts and problems mentioned:

---

### 1. **Closures: Create a Counter Function Using Closures**

A closure is a function that has access to its own scope, the outer function's variables, and the global variables.

#### Example:

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: function () {
      count++;
      return count;
    },
    decrement: function () {
      count--;
      return count;
    },
    getCount: function () {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

---

### 2. **Memoization: Memoize Function to Cache Expensive Results**

Memoization stores the result of expensive function calls and returns the cached result when the same inputs occur again.

#### Example:

```javascript
function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      console.log("Fetching from cache");
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const expensiveFunction = (num) => {
  console.log("Calculating...");
  return num * 2;
};

const memoizedFunction = memoize(expensiveFunction);
console.log(memoizedFunction(5)); // Calculating... 10
console.log(memoizedFunction(5)); // Fetching from cache 10
```

---

### 3. **Polyfills: Implement Array.prototype.map, reduce, and Function.prototype.bind Polyfills**

#### `map` Polyfill:

```javascript
if (!Array.prototype.map) {
  Array.prototype.map = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      result.push(callback(this[i], i, this));
    }
    return result;
  };
}
```

#### `reduce` Polyfill:

```javascript
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < this.length; i++) {
      accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
  };
}
```

#### `bind` Polyfill:

```javascript
if (!Function.prototype.bind) {
  Function.prototype.bind = function (context, ...args) {
    const fn = this;
    return function (...innerArgs) {
      return fn.apply(context, [...args, ...innerArgs]);
    };
  };
}
```

---

### 4. **Asynchronous Programming: Fetch with Retry**

The `fetchWithRetry` function tries fetching a URL and retries if it fails (up to a maximum number of retries).

#### Example:

```javascript
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Request failed");
    } catch (error) {
      attempt++;
      if (attempt < retries) {
        console.log(`Retrying... Attempt ${attempt}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error(`Failed after ${retries} attempts`);
      }
    }
  }
}

fetchWithRetry("https://api.example.com/data")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

---

### 5. **PromiseAll: Implement a `promiseAll` Function**

The `promiseAll` function waits for all promises to resolve or any of them to reject.

#### Example:

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let completed = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

promiseAll([p1, p2, p3]).then((results) => console.log(results)); // [1, 2, 3]
```

---

### 6. **Debounce: Debounce Function**

Debouncing limits the rate at which a function is invoked. It's useful for optimizing input-heavy operations, like search.

#### Example:

```javascript
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const handleInputChange = debounce((event) => {
  console.log("Input value:", event.target.value);
}, 500);

document.querySelector("input").addEventListener("input", handleInputChange);
```

---

### 7. **Event Loop: Simulate Output of Event Loop Scenario**

The event loop is responsible for executing asynchronous code, events, and messages in the JavaScript runtime.

#### Example:

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

#### Output:

```
Start
End
Promise
Timeout
```

Explanation:

- `console.log('Start')` and `console.log('End')` run first, as they are synchronous.
- The `setTimeout` is placed in the event queue, but with a 0ms delay, so it is executed after the synchronous code.
- The `Promise.resolve().then()` is placed in the microtask queue and executed before the event queue, hence `'Promise'` logs before `'Timeout'`.

---

### 8. **Array Rotation: Rotate an Array by k Positions**

Rotate an array by `k` positions (to the right).

#### Example:

```javascript
function rotateArray(arr, k) {
  const n = arr.length;
  k = k % n; // Handle cases where k > n
  return [...arr.slice(n - k), ...arr.slice(0, n - k)];
}

console.log(rotateArray([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]
```

---

### 9. **Max Subarray Sum: Kadane’s Algorithm**

Kadane's algorithm is used to find the maximum sum of a subarray in an array.

#### Example:

```javascript
function maxSubArraySum(arr) {
  let maxSum = arr[0];
  let currentSum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    currentSum = Math.max(arr[i], currentSum + arr[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

console.log(maxSubArraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
```

---

### 10. **Two-Pointer: Find All Pairs in an Array That Sum Up to a Specific Target**

#### Example:

```javascript
function findPairs(arr, target) {
  let pairs = [];
  let left = 0;
  let right = arr.length - 1;

  arr.sort((a, b) => a - b); // Sort the array first

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      pairs.push([arr[left], arr[right]]);
      left++;
      right--;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return pairs;
}

console.log(findPairs([1, 2, 3, 4, 5], 5)); // [[1, 4], [2, 3]]
```

---

Here are the solutions for each of the problems you mentioned:

---

### **1. Sort 0s, 1s, 2s: Sort an Array of 0s, 1s, and 2s Without Extra Space**

This is often called the Dutch National Flag Problem. The idea is to sort the array with three pointers, without using extra space.

#### Example:

```javascript
function sortColors(arr) {
  let low = 0,
    mid = 0,
    high = arr.length - 1;

  while (mid <= high) {
    if (arr[mid] === 0) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]]; // swap low and mid
      low++;
      mid++;
    } else if (arr[mid] === 1) {
      mid++;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]]; // swap mid and high
      high--;
    }
  }
  return arr;
}

console.log(sortColors([2, 0, 1, 2, 0, 1])); // [0, 0, 1, 1, 2, 2]
```

---

### **2. Sliding Window: Find the Longest Substring Without Repeating Characters**

In this problem, we use a sliding window approach to keep track of characters and ensure there are no repeats within the window.

#### Example:

```javascript
function lengthOfLongestSubstring(s) {
  let start = 0,
    maxLength = 0;
  let charMap = new Map();

  for (let end = 0; end < s.length; end++) {
    if (charMap.has(s[end])) {
      start = Math.max(charMap.get(s[end]) + 1, start); // Move start to avoid repetition
    }
    charMap.set(s[end], end); // Update the last seen index of the character
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3 (abc)
```

---

### **3. Max Subarray Sum (k): Find the Maximum Sum of a Subarray of Size k**

This is a sliding window problem to find the maximum sum of a subarray of a fixed size `k`.

#### Example:

```javascript
function maxSubArraySum(arr, k) {
  if (arr.length < k) return null; // If the array is smaller than k

  let maxSum = 0,
    windowSum = 0;

  // Calculate the sum of the first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  maxSum = windowSum;

  // Slide the window to the right
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // Subtract the element leaving the window, add the new element
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

console.log(maxSubArraySum([2, 1, 5, 1, 3, 2], 3)); // 9 (subarray: [5, 1, 3])
```

---

### **4. Anagram Check: Check if a String is a Valid Anagram of Another String**

This can be done by checking if the two strings have the same character counts.

#### Example:

```javascript
function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  let count = {};

  for (let char of str1) {
    count[char] = (count[char] || 0) + 1;
  }

  for (let char of str2) {
    if (!count[char]) return false;
    count[char]--;
  }

  return true;
}

console.log(isAnagram("listen", "silent")); // true
```

---

### **5. First Non-Repeating Character: Find the First Non-Repeating Character in a String**

This can be solved by counting the frequency of each character and then finding the first character that appears only once.

#### Example:

```javascript
function firstUniqChar(s) {
  let count = {};

  for (let char of s) {
    count[char] = (count[char] || 0) + 1;
  }

  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) {
      return s[i];
    }
  }

  return null;
}

console.log(firstUniqChar("leetcode")); // 'l'
```

---

### **6. Longest Palindromic Substring: Find the Longest Palindromic Substring**

We can expand around the center for each character and pair of characters to find the longest palindrome.

#### Example:

```javascript
function longestPalindrome(s) {
  if (s.length < 1) return "";

  let maxPalindrome = "";

  function expandFromCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return s.slice(left + 1, right);
  }

  for (let i = 0; i < s.length; i++) {
    let oddPalindrome = expandFromCenter(i, i);
    let evenPalindrome = expandFromCenter(i, i + 1);

    let longest =
      oddPalindrome.length > evenPalindrome.length
        ? oddPalindrome
        : evenPalindrome;

    if (longest.length > maxPalindrome.length) {
      maxPalindrome = longest;
    }
  }

  return maxPalindrome;
}

console.log(longestPalindrome("babad")); // "bab" or "aba"
```

---

### **7. Rearranged Palindrome: Check if a String Can Be Rearranged into a Palindrome**

A string can be rearranged into a palindrome if at most one character has an odd count.

#### Example:

```javascript
function canFormPalindrome(str) {
  let count = {};

  for (let char of str) {
    count[char] = (count[char] || 0) + 1;
  }

  let oddCount = 0;
  for (let char in count) {
    if (count[char] % 2 !== 0) {
      oddCount++;
    }
  }

  return oddCount <= 1;
}

console.log(canFormPalindrome("civic")); // true
console.log(canFormPalindrome("ivicc")); // true
console.log(canFormPalindrome("hello")); // false
```

---

### **8. Deep Cloning: Implement a Deep Clone Function for a Nested Object**

Deep cloning means creating a copy of an object that doesn’t share references with the original object.

#### Example:

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  let clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}

const original = { a: 1, b: { c: 2 } };
const clone = deepClone(original);
clone.b.c = 3;

console.log(original); // { a: 1, b: { c: 2 } }
console.log(clone); // { a: 1, b: { c: 3 } }
```

---

### **9. Flattening Objects: Flatten a Deeply Nested Object into a Single-Level Object**

Flatten a nested object into a single-level object by using dot notation for keys.

#### Example:

```javascript
function flattenObject(obj, prefix = "") {
  let result = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

const nestedObj = { a: { b: { c: 1 } }, d: 2 };
console.log(flattenObject(nestedObj)); // { 'a.b.c': 1, d: 2 }
```

---

### **10. Frequency Count: Count the Frequency of Characters or Elements in an Array or String**

#### Example:

```javascript
function frequencyCount(arr) {
  let count = {};
  for (let elem of arr) {
    count[elem] = (count[elem] || 0) + 1;
  }
  return count;
}

console.log(frequencyCount([1, 2, 2, 3, 3, 3])); // { 1: 1, 2: 2, 3: 3 }
```

---

### **Practical Applications**

#### 1. **Pagination: Write a Function to Paginate an Array Based on Page Number and Size**

```javascript
function paginate(arr, page, size) {
  const start = (page - 1) * size;
  const end = start + size;
  return arr.slice(start, end);
}

console.log(paginate([1, 2, 3, 4, 5, 6, 7, 8, 9], 2, 3)); // [4, 5, 6]
```

#### 2. **Debouncing: Implement a Debounce Function to Optimize Search Inputs**

```javascript
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
```

#### 3. **Throttling: Implement a Throttle Function to Limit API Calls**

```javascript
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
}
```

---

Here are solutions for the problems you've listed:

---

### **1. DOM Serialization: Serialize and Deserialize a DOM Tree Structure**

Serialization of a DOM tree involves converting the DOM into a string that can be saved or transferred, and deserialization involves converting it back to a DOM tree.

#### Example:

```javascript
// Serialize a DOM tree (Convert it to a string)
function serializeNode(node) {
  let obj = {
    nodeName: node.nodeName,
    nodeType: node.nodeType,
    nodeValue: node.nodeValue,
    children: [],
  };

  for (let child of node.childNodes) {
    obj.children.push(serializeNode(child));
  }

  return obj;
}

// Deserialize a DOM tree (Convert it back to a node)
function deserializeNode(obj) {
  let node = document.createElement(obj.nodeName);
  node.nodeValue = obj.nodeValue;

  for (let child of obj.children) {
    node.appendChild(deserializeNode(child));
  }

  return node;
}

// Usage
let rootNode = document.getElementById("root");
let serializedNode = serializeNode(rootNode);
console.log(serializedNode);

let deserializedNode = deserializeNode(serializedNode);
document.body.appendChild(deserializedNode);
```

---

### **2. Event Delegation: Handle Clicks on Dynamically Added List Items**

Event delegation allows you to attach a single event listener to a parent element to handle events for child elements that might not exist yet.

#### Example:

```javascript
// Assuming there is an element with id 'list'
let list = document.getElementById("list");

// Event delegation for dynamically added list items
list.addEventListener("click", function (event) {
  if (event.target && event.target.matches("li")) {
    alert("List item clicked: " + event.target.textContent);
  }
});

// Dynamically add new list item
let newItem = document.createElement("li");
newItem.textContent = "New Item";
list.appendChild(newItem);
```

In this example, we use event delegation to handle clicks on dynamically added list items. The parent `list` listens for clicks and checks if the event target matches an `li` element.

---

### **3. LRU Cache: Implement an LRU (Least Recently Used) Cache Using JavaScript Map**

LRU Cache is used to store a fixed number of elements, and when it reaches the limit, it removes the least recently used item.

#### Example:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1; // Return -1 if key doesn't exist
    }
    // Move the accessed item to the end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // Delete the old value and set the new one
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove the first (least recently used) entry
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}

// Usage
let cache = new LRUCache(3);
cache.put(1, "A");
cache.put(2, "B");
cache.put(3, "C");
console.log(cache.get(2)); // 'B'
cache.put(4, "D"); // LRU 1 is removed
console.log(cache.get(1)); // -1 (not found)
```

---

### **4. Custom Promise: Create a Custom Promise Class with `then`, `catch`, and `resolve`**

Here's an implementation of a simplified custom Promise class that supports `then`, `catch`, and `resolve` methods.

#### Example:

```javascript
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = null;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.callbacks.forEach((callback) => callback.onFulfilled(value));
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.value = reason;
        this.callbacks.forEach((callback) => callback.onRejected(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleCallback = () => {
        if (this.state === "fulfilled") {
          try {
            resolve(onFulfilled ? onFulfilled(this.value) : this.value);
          } catch (error) {
            reject(error);
          }
        } else if (this.state === "rejected") {
          try {
            reject(onRejected ? onRejected(this.value) : this.value);
          } catch (error) {
            reject(error);
          }
        } else {
          this.callbacks.push({ onFulfilled, onRejected });
        }
      };
      handleCallback();
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}

// Usage
let p = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("Success!"), 1000);
});

p.then((value) => {
  console.log(value); // 'Success!'
}).catch((error) => {
  console.error(error);
});
```

---

### **5. Module Bundler: Write a Dependency Graph Resolver for JavaScript Modules**

A simple module bundler resolves JavaScript module dependencies. Here's a basic example using `require`-like syntax:

#### Example:

```javascript
// Module 1 (module1.js)
module.exports = {
  greet: function (name) {
    return `Hello, ${name}!`;
  },
};

// Module 2 (module2.js)
const module1 = require("./module1");
console.log(module1.greet("John"));

// Simple `require` function
function require(modulePath) {
  const module = {};

  if (modulePath === "./module1") {
    module.exports = {
      greet: function (name) {
        return `Hello, ${name}!`;
      },
    };
  }

  return module.exports;
}
```

In a more complex bundler, you'd build a dependency graph where each module’s imports are resolved and combined into a final bundle. A tool like Webpack does this automatically.
