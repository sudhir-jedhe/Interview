/*
A hash table is a data structure that allows for efficient data retrieval using a key. 
One of the common issues with hash tables is dealing with collisions, where two keys hash 
to the same index in the table. To handle collisions, a common technique is “Separate Chaining.”
*/

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class SeparateChainingLinkedList {
  constructor(size) {
    this.table = new Array(size).fill(null);
  }

  hash(key) {
    // Calculate the hash code and map it to an index
    return key.length % this.table.length;
  }

  insert(key, value) {
    const index = this.hash(key);
    const newNode = new Node(key, value);
    if (!this.table[index]) {
      this.table[index] = newNode;
    } else {
      let current = this.table[index];
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  find(key) {
    const index = this.hash(key);
    let current = this.table[index];
    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }
    return undefined; // Key not found
  }
}

// Example usage
const hashTable = new SeparateChainingLinkedList(10);
hashTable.insert("name", "Bob");
hashTable.insert("age", 26);
console.log(hashTable.find("age"));

/***************************************************************************** */
class SeparateChainingArray {
  constructor(size) {
    this.table = new Array(size).fill(null).map(() => []);
  }

  hash(key) {
    // Calculate the hash code and map it to an index
    return key.length % this.table.length;
  }

  insert(key, value) {
    const index = this.hash(key);
    this.table[index].push({ key, value });
  }

  find(key) {
    const index = this.hash(key);
    const list = this.table[index];
    for (const pair of list) {
      if (pair.key === key) {
        return pair.value;
      }
    }
    return undefined; // Key not found
  }
}

// Example usage
const hashTable = new SeparateChainingArray(10);
hashTable.insert("name", "Alice");
hashTable.insert("age", 30);
console.log(hashTable.find("name"));

/**************************************************************** */
class SeparateChainingMap {
  constructor(size) {
    this.table = new Array(size).fill(null).map(() => new Map());
  }

  hash(key) {
    // Calculate the hash code and map it to an index
    return key.length % this.table.length;
  }

  insert(key, value) {
    const index = this.hash(key);
    this.table[index].set(key, value);
  }

  find(key) {
    const index = this.hash(key);
    const map = this.table[index];
    return map.get(key);
  }
}

// Example usage
const hashTable = new SeparateChainingMap(10);
hashTable.insert("name", "Alice");
hashTable.insert("age", 30);

console.log(hashTable.find("name"));
console.log(hashTable.find("age"));
