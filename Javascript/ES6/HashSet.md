The code you've shared implements three different data structures in JavaScript:

1. **`MyHashSet`**: A custom hash set implementation that uses either an array or linked list to store values. It supports operations like `add`, `remove`, and `contains`.
2. **`MyHashSet` (with linked list)**: Another implementation of `MyHashSet` using linked lists for collision handling.
3. **`Store`**: A simple key-value store that allows setting, getting, and checking the existence of keys.

Let's go through them one by one and break down each solution:

---

### **1. `MyHashSet` (Array-based)**

This is an implementation of a hash set where elements are added using an array (`this.buckets`). When the set exceeds the load factor (`0.75`), the hash set is rehashed to double its capacity.

#### Key Methods:

- **`add(key)`**: Adds a key to the set if it does not already exist. If the set exceeds the load factor, it is rehashed to double the capacity.
- **`remove(key)`**: Removes a key from the set.
- **`contains(key)`**: Checks if a key is present in the set.
- **`rehash()`**: Doubles the capacity and rehashes all existing keys.
- **`hash(key)`**: A basic hash function to determine the index for a given key.

#### Example:

```js
class HashSet {
  constructor() {
    this.buckets = [];
    this.size = 0;
    this.capacity = 10; // Initial capacity
    this.loadFactor = 0.75;
  }

  add(key) {
    if (this.contains(key)) {
      return false; // Key already exists
    }

    if (this.size >= this.capacity * this.loadFactor) {
      this.rehash();
    }

    const index = this.hash(key);
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }
    this.buckets[index].push(key);
    this.size++;
    return true;
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    if (!bucket) {
      return false; // Key doesn't exist
    }
    const indexInBucket = bucket.indexOf(key);
    if (indexInBucket === -1) {
      return false; // Key doesn't exist
    }
    bucket.splice(indexInBucket, 1);
    this.size--;
    return true;
  }

  contains(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    return !!bucket && bucket.includes(key);
  }

  hash(key) {
    return key.charCodeAt(0) % this.capacity;
  }

  rehash() {
    this.capacity *= 2;
    const oldBuckets = this.buckets;
    this.buckets = [];
    this.size = 0;
    for (const bucket of oldBuckets) {
      if (bucket) {
        for (const key of bucket) {
          this.add(key);
        }
      }
    }
  }
}

// Usage example:
let myHashSet = new HashSet();
myHashSet.add(1);
myHashSet.add(2);
console.log(myHashSet.contains(1)); // true
myHashSet.remove(2);
console.log(myHashSet.contains(2)); // false
```

---

### **2. `MyHashSet` (Linked List-based)**

This implementation uses a linked list to handle collisions in the hash set, making it suitable for cases where multiple keys hash to the same index.

#### Key Methods:

- **`add(key)`**: Adds a key to the hash set, creating a new node if necessary.
- **`remove(key)`**: Removes a key from the hash set by manipulating the linked list.
- **`contains(key)`**: Checks if a key is present by traversing the linked list at the appropriate bucket.
- **`_hash(key)`**: Hash function to determine the index.

#### Example:

```js
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class MyHashSet {
  constructor() {
    this.size = 1000;
    this.buckets = new Array(this.size).fill(null);
  }

  _hash(key) {
    return key % this.size;
  }

  add(key) {
    const hashKey = this._hash(key);
    if (!this.buckets[hashKey]) {
      this.buckets[hashKey] = new ListNode(key);
      return;
    }
    let curr = this.buckets[hashKey];
    while (curr.next) {
      if (curr.val === key) {
        return;
      }
      curr = curr.next;
    }
    curr.next = new ListNode(key);
  }

  remove(key) {
    const hashKey = this._hash(key);
    if (!this.buckets[hashKey]) {
      return;
    }
    if (this.buckets[hashKey].val === key) {
      this.buckets[hashKey] = this.buckets[hashKey].next;
      return;
    }
    let prev = null;
    let curr = this.buckets[hashKey];
    while (curr) {
      if (curr.val === key) {
        prev.next = curr.next;
        return;
      }
      prev = curr;
      curr = curr.next;
    }
  }

  contains(key) {
    const hashKey = this._hash(key);
    let curr = this.buckets[hashKey];
    while (curr) {
      if (curr.val === key) {
        return true;
      }
      curr = curr.next;
    }
    return false;
  }
}

// Usage example:
const myHashSet = new MyHashSet();
myHashSet.add(1);
myHashSet.add(2);
console.log(myHashSet.contains(1)); // Output: true
console.log(myHashSet.contains(3)); // Output: false
myHashSet.remove(2);
console.log(myHashSet.contains(2)); // Output: false
```

---

### **3. `Store` (Simple Key-Value Store)**

This is a basic implementation of a key-value store with `set`, `get`, and `has` methods for storing and retrieving values.

#### Key Methods:

- **`set(key, value)`**: Adds a key-value pair to the store.
- **`get(key)`**: Retrieves the value for a given key.
- **`has(key)`**: Checks if a key exists in the store.

#### Example:

```js
const Store = function () {
  // store the data
  this.list = {};

  // set the key-value in list
  this.set = function (key, value) {
    this.list[key] = value;
  };

  // get the value of the given key
  this.get = function (key) {
    return this.list[key];
  };

  // check if key exists
  this.has = function (key) {
    return !!this.list[key];
  };
};

// Usage example:
const store = new Store();
store.set("a", 10);
store.set("b", 20);
store.set("c", 30);
console.log(store.get("b")); // Output: 20
console.log(store.has("c")); // Output: true
console.log(store.get("d")); // Output: undefined
console.log(store.has("e")); // Output: false
```

---

### Conclusion:

- **`HashSet`** provides a basic implementation of a hash set using arrays or linked lists. You can use this to store unique values and perform basic operations like add, remove, and check containment.
- **`Store`** is a simple key-value store implementation, ideal for storing arbitrary data and checking if a key exists.

These examples demonstrate how to work with common data structures in JavaScript. You can build more sophisticated versions of these by incorporating optimizations or additional features like resizing for hash sets.
