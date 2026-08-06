// Priority Queue is a commonly used data structure in algorithm problem.
// Especially useful for Top K problem with a huge amount of input data, since
// it could avoid sorting the whole but keep a fixed-length sorted portion of
// it.

/**
 * https://bigfrontend.dev/problem/create-a-priority-queue-in-JavaScript
 * DIFFICULT
 * https://codeburst.io/how-to-create-a-priority-queue-with-javascript-c56a970f29a8
 */
const leftChild = (index) => index * 2 + 1;
const rightChild = (index) => index * 2 + 2;
const parent = (index) => Math.floor((index - 1) / 2);

/**
 * Heaps are a tree-based data structure, usually implemented as an array, which represent a priority queue
 */
class PriorityQueue {
  /**
   * @param {(a: any, b: any) => -1 | 0 | 1} compare -
   * compare function, similar to parameter of Array.prototype.sort
   * Default min heap
   */
  constructor(compare = (a, b) => a - b) {
    this.compare = (a, b) => compare(a, b) > 0; // we just compare if a > b
    this.heap = [];
  }
  /**
   * return {number} amount of items
   */
  size() {
    return this.heap.length;
  }

  /**
   * returns the head element
   */
  peek() {
    // the root is always the highest priority item
    return this.heap[0];
  }

  /**
    * Insert
    Insert pushes an element on to our heap.
    After we have inserted the element, we correctly position the element in our heap by comparing the values of the newly inserted element with its parent.
    If the newly inserted elements priority is greater, then the newly inserted element is swapped with its parent. 
    This is recursively called until the element is rightly positioned.
    */
  add(element) {
    // push element to the end of the heap
    this.heap.push(element);
    if (this.heap.length > 1) {
      this.moveUp(this.heap.length - 1);
    }
  }
  moveUp(index) {
    if (index === 0) {
      return;
    }

    const parentIdx = parent(index);
    if (this.compare(this.heap[parentIdx], this.heap[index])) {
      // if the element is greater than its parent:
      // swap element with its parent, keep doing until elt is at its right pos
      this.swap(parentIdx, index);
      this.moveUp(parentIdx);
    }
  }

  /**
   * poll extracts the root from the heap and calls heapify to reposition the rest of the heap,
   * placing the next highest priority item at the root.
   */
  poll() {
    // remove the first element from the heap
    const root = this.heap.shift();

    // put the last element to the front of the heap
    // and remove the last element from the heap as it now
    // sits at the front of the heap
    this.heap.unshift(this.heap[this.heap.length - 1]);
    this.heap.pop();

    // correctly re-position heap
    this.heapify(0);

    return root;
  }
  /**
    Heapify re-positions the heap by comparing the left and right child of a specific node and swapping them as necessary.
    This is recursively called until the heap is correctly repositioned.} index 
    */
  heapify(index) {
    const childIdx = this.getChildIdx(index); // child index with which we need to swap
    //if(!childIdx) return;

    // if the value of index has changed, then some swapping needs to be done
    // and this method needs to be called again with the swapped element
    if (index !== childIdx) {
      this.swap(index, childIdx);
      this.heapify(childIdx);
    }
  }

  getChildIdx(index) {
    let left = leftChild(index);
    let right = rightChild(index);

    // if the left child has higher priority than the node we are looking at
    // Min heap: a-b : index-Left > 0 means index > left and so we have to give priority to left
    // Max heap: b-a: Left-index > 0 means left > index and so we have to give priority to left
    if (
      left < this.heap.length &&
      this.compare(this.heap[index], this.heap[left])
    ) {
      index = left;
    }

    // if the right child has higher priority than the node we are looking at
    if (
      right < this.heap.length &&
      this.compare(this.heap[index], this.heap[right])
    ) {
      index = right;
    }
    return index;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

/**
 * Testing
 */
const pq = new PriorityQueue((a, b) => a - b);
// (a, b) => a - b means
//returns        1    if    a    has    higher    priority,
//returns        0    if    both    have    the    same    priority
//returns        -1    if    b    has    higher    priority.
// smaller numbers are closer to index:0
// which means smaller number are to be removed sooner

pq.add(5); // now 5 is the only element
pq.add(2); // 2 added
console.log(pq.peek()); // 2, since smaller number are sooner to be removed
pq.add(1); // 1 added
console.log(pq.peek()); // 1, since smaller number are sooner to be removed
console.log(pq.poll()); // 1 is removed, 2 and 5 are left
console.log(pq.peek()); // 2 is the smallest now, this returns 2
console.log(pq.poll()); // 2 is removed, only 5 is left

/***************************************************** */
// complete the implementation
class PriorityQueue {
  /**
   * @param {(a: any, b: any) => -1 | 0 | 1} compare -
   * compare function, similar to parameter of Array.prototype.sort
   */
  constructor(compare) {
    this.compare = (a, b) => compare(a, b) > 0;
    this.heap = [];
  }

  /**
   * return {number} amount of items
   */
  size() {
    return this.heap.length;
  }

  /**
   * returns the head element
   */
  peek() {
    return this.heap[0];
  }

  /**
   * @param {any} element - new element to add
   */
  add(element) {
    this.heap.push(element);
    if (this.heap.length > 1) {
      this.moveUp(this.heap.length - 1);
    }
  }

  /**
   * remove the head element
   * @return {any} the head element
   */
  poll() {
    if (this.heap.length <= 1) {
      return this.heap.pop();
    }
    this.swap(0, this.heap.length - 1);
    const removed = this.heap.pop();
    if (this.heap.length > 1) {
      this.moveDown(0);
    }
    return removed;
  }

  moveDown(index) {
    if (index >= this.heap.length - 1) return;

    const child = this.getChild(index);
    if (!child) return;

    if (this.compare(this.heap[index], this.heap[child])) {
      this.swap(index, child);
      this.moveDown(child);
    }
  }

  getChild(index) {
    let left = index * 2 + 1;
    if (left >= this.heap.length) left = null;
    let right = index * 2 + 2;
    if (right >= this.heap.length) right = null;

    if (left && right) {
      return this.compare(this.heap[left], this.heap[right]) ? right : left;
    }
    if (right) {
      return right;
    }
    if (left) {
      return left;
    }
  }

  moveUp(index) {
    if (index === 0) {
      return;
    }

    const parent = Math.floor(index / 2);
    if (this.compare(this.heap[parent], this.heap[index])) {
      this.swap(parent, index);
      this.moveUp(parent);
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

/************************************ */
class PriorityQueue {
  constructor(compare) {
    this.compare = compare;
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  add(element) {
    this.heap.push(element);
    this.siftUp();
  }

  poll() {
    const polled = this.heap[0];
    this.swap(0, this.heap.length - 1);
    this.heap.pop();
    this.siftDown();
    return polled;
  }

  worse(a, b) {
    return this.compare(this.heap[a], this.heap[b]) > 0;
  }

  swap(a, b) {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  siftUp() {
    let i = this.heap.length - 1;
    while (i > 0) {
      if (this.worse(i, i >> 1)) return;
      this.swap(i, i >> 1);
      i >>= 1;
    }
  }

  siftDown() {
    let i = 0;
    while ((i << 1) + 1 < this.heap.length) {
      let child = (i << 1) + 1;
      child !== this.heap.length - 1 && this.worse(child, child + 1) && child++;
      if (this.worse(child, i)) return;
      this.swap(i, child);
      i = child;
    }
  }
}

/******************************************************* */

// complete the implementation
class PriorityQueue {
  heap = [];
  /**
   * @param {(a: any, b: any) => -1 | 0 | 1} compare -
   * compare function, similar to parameter of Array.prototype.sort
   */
  constructor(compare) {
    this.compare = compare;
  }

  /**
   * return {number} amount of items
   */
  size() {
    return this.heap.length;
  }

  /**
   * returns the head element
   */
  peek() {
    return this.heap.length ? this.heap[0] : undefined;
  }

  /**
   * @param {any} element - new element to add
   */
  add(element) {
    this.heap.push(element);
    if (this.heap.length > 1) this.bubbleUp(this.heap.length - 1);
  }

  /**
   * remove the head element
   * @return {any} the head element
   */
  poll() {
    if (this.heap.length) {
      const val = this.heap[0];
      if (this.heap.length === 1) {
        this.heap.length = 0;
      } else {
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.length -= 1;
        if (this.heap.length > 1) this.bubbleDown(0);
      }
      return val;
    }
  }

  bubbleDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    const leftSwappable = this.compare(this.heap[index], this.heap[left]) > 0;

    if (right >= this.heap.length) {
      if (leftSwappable) {
        [this.heap[index], this.heap[left]] = [
          this.heap[left],
          this.heap[index],
        ];
      }
      return;
    }

    const rightSwappable = this.compare(this.heap[index], this.heap[right]) > 0;

    if (leftSwappable && rightSwappable) {
      const comparison = this.compare(this.heap[left], this.heap[right]);
      if (comparison < 0) {
        [this.heap[index], this.heap[left]] = [
          this.heap[left],
          this.heap[index],
        ];
        this.bubbleDown(left);
      } else {
        [this.heap[index], this.heap[right]] = [
          this.heap[right],
          this.heap[index],
        ];
        this.bubbleDown(right);
      }
    } else {
      if (leftSwappable) {
        [this.heap[index], this.heap[left]] = [
          this.heap[left],
          this.heap[index],
        ];
        this.bubbleDown(left);
      } else {
        [this.heap[index], this.heap[right]] = [
          this.heap[right],
          this.heap[index],
        ];
        this.bubbleDown(right);
      }
    }
  }

  bubbleUp(index) {
    const parent = Math.floor((index - 1) / 2);
    if (this.compare(this.heap[parent], this.heap[index]) > 0) {
      [this.heap[parent], this.heap[index]] = [
        this.heap[index],
        this.heap[parent],
      ];
      this.bubbleUp(parent);
    }
  }
}
