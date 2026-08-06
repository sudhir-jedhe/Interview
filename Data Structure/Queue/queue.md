// Queues should be implemented with linked lists which are essentially a chain of connected nodes. To simplify handling of linked list manipulation of empty queues, we make use of doubly-linked lists (nodes have both prev and next pointers) and dummy/sentinel head/tail nodes. With the usage of dummy nodes, the linked list will never be "empty" and we don't have to separately handle the case of enqueuing into empty queues and dequeuing a queue with only one item.

// Empty Queue

// enqueue()-ing involves creating a new Node and adding it between the _dummyTail node and _dummyTail.next (which is _dummyHead in the case of empty queues).

// Enqueue one item

// Enqueue second item

// dequeue()-ing involves removing the node between the _dummyHead node and _dummyHead.prev. This should be a no-op if the queue is empty otherwise _dummyTail will get dequeued.

// Dequeue

// Since the time complexity of length() has to be O(1) and counting the number of items in a linked list will take O(n), we need to separately track the number of items in the list with a _length instance property and update it within the enqueue() and dequeue() methods.

// Note that the autograder doesn't check if the time complexity of your enqueue() and dequeue() operations are O(1), but if you're only using a single JavaScript array to solve this question, then it's almost certainly not achieving O(1) time complexity for either of those operations.

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export default class Queue {
  constructor() {
    this._dummyHead = new Node();
    this._dummyTail = new Node();
    this._dummyHead.prev = this._dummyTail;
    this._dummyTail.next = this._dummyHead;
    this._length = 0;
  }

  /**
   * Adds an item to the back of the queue.
   * @param {*} item The item to be pushed onto the queue.
   * @return {number} The new length of the queue.
   */
  enqueue(item) {
    const node = new Node(item);
    const prevLast = this._dummyTail.next;
    prevLast.prev = node;

    node.next = prevLast;
    node.prev = this._dummyTail;
    this._dummyTail.next = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item from the front of the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._dummyHead.prev;
    const newFirst = node.prev;
    this._dummyHead.prev = newFirst;
    newFirst.next = this._dummyHead;
    // Unlink the node to be dequeued.
    node.prev = null;
    node.next = null;
    this._length--;
    return node.value;
  }

  /**
   * Determines if the queue is empty.
   * @return {boolean} `true` if the queue has no items, `false` otherwise.
   */
  isEmpty() {
    return this._length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  front() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyHead.prev.value;
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue it.
   * @return {*} The item at the back of the queue if it is not empty, `undefined` otherwise.
   */
  back() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyTail.next.value;
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length() {
    return this._length;
  }
}

// Edge Cases
// Calling dequeue() on empty stacks.
// Calling front() on empty stacks.
// Calling back() on empty stacks.
