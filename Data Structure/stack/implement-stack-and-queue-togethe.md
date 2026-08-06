class Deque {
  constructor(size) {
    this.arr = new Array(size); // Initialize the circular array
    this.front = -1; // Initialize front pointer
    this.rear = 0; // Initialize rear pointer
    this.size = size; // Store the size of the deque
  }

  isFull() {
    return (
      (this.front === 0 && this.rear === this.size - 1) ||
      this.front === this.rear + 1
    );
  }

  isEmpty() {
    return this.front === -1;
  }

  insertfront(key) {
    if (this.isFull()) {
      console.log("Overflow"); // Deque is full, cannot insert
      return;
    }

    if (this.front === -1) {
      this.front = 0;
      this.rear = 0;
    } else if (this.front === 0) {
      this.front = this.size - 1;
    } else {
      this.front = this.front - 1;
    }

    this.arr[this.front] = key;
  }

  insertrear(key) {
    if (this.isFull()) {
      console.log("Overflow"); // Deque is full, cannot insert
      return;
    }

    if (this.front === -1) {
      this.front = 0;
      this.rear = 0;
    } else if (this.rear === this.size - 1) {
      this.rear = 0;
    } else {
      this.rear = this.rear + 1;
    }

    this.arr[this.rear] = key;
  }

  deletefront() {
    if (this.isEmpty()) {
      console.log("Queue Underflow"); // Deque is empty, cannot delete
      return;
    }

    if (this.front === this.rear) {
      this.front = -1;
      this.rear = -1;
    } else if (this.front === this.size - 1) {
      this.front = 0;
    } else {
      this.front = this.front + 1;
    }
  }

  deleterear() {
    if (this.isEmpty()) {
      console.log("Underflow"); // Deque is empty, cannot delete
      return;
    }

    if (this.front === this.rear) {
      this.front = -1;
      this.rear = -1;
    } else if (this.rear === 0) {
      this.rear = this.size - 1;
    } else {
      this.rear = this.rear - 1;
    }
  }

  getFront() {
    if (this.isEmpty()) {
      console.log("Underflow"); // Deque is empty, cannot get front
      return -1;
    }
    return this.arr[this.front];
  }

  getRear() {
    if (this.isEmpty() || this.rear < 0) {
      console.log("Underflow"); // Deque is empty, cannot get rear
      return -1;
    }
    return this.arr[this.rear];
  }
}

// Driver code
const dq = new Deque(5);

// Function calls
console.log("Insert element at rear end: 5");
dq.insertrear(5);

console.log("Insert element at rear end: 10");
dq.insertrear(10);

console.log("Get rear element:", dq.getRear());

/************************************************************ */
// JavaScript code for the approach
// A class representing a Node in a doubly linked list
class Node {
  constructor(d) {
    this.data = d;
    this.prev = null;
    this.next = null;
  }
}

// A class representing a StackQueue data structure
class StackQueue {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // Pushes an item onto the top of the stack
  // @param data the data to be pushed onto the stack
  push(data) {
    const new_node = new Node(data);
    if (this.tail == null) {
      this.tail = new_node;
      this.head = new_node;
    } else {
      new_node.prev = this.tail;
      this.tail.next = new_node;
      this.tail = new_node;
    }
  }

  // Removes and returns the item at the top of the stack
  // @return the item at the top of the stack
  pop() {
    if (this.tail == null) {
      return -1;
    }
    const popped_node = this.tail;
    if (this.tail == this.head) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = popped_node.prev;
      this.tail.next = null;
    }
    return popped_node.data;
  }

  // Adds an item to the back of the queue
  // @param data the data to be added to the queue
  enqueue(data) {
    const new_node = new Node(data);
    if (this.head == null) {
      this.head = new_node;
      this.tail = new_node;
    } else {
      new_node.prev = this.tail;
      this.tail.next = new_node;
      this.tail = new_node;
    }
  }

  // Removes and returns the item at the front of the queue
  // @return the item at the front of the queue
  dequeue() {
    if (this.head == null) {
      return -1;
    }
    const dequeued_node = this.head;
    if (this.head == this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = dequeued_node.next;
      this.head.prev = null;
    }
    return dequeued_node.data;
  }
}

// Driver Code
(() => {
  // Create a new StackQueue object
  const sq = new StackQueue();

  // Perform stack operations
  sq.push(1);
  sq.push(2);
  sq.push(3);
  console.log(sq.pop()); // Output: 3
  console.log(sq.pop()); // Output: 2
  console.log(sq.pop()); // Output: 1

  // Perform queue operations
  sq.enqueue(4);
  sq.enqueue(5);
  sq.enqueue(6);
  console.log(sq.dequeue()); // Output: 4
  console.log(sq.dequeue()); // Output: 5
  console.log(sq.dequeue()); // Output: 6
})();

dq.deleterear();
console.log("After delete rear element new rear becomes:", dq.getRear());

console.log("Inserting element at front end: 15");
dq.insertfront(15);

console.log("Get front element:", dq.getFront());

dq.deletefront();

console.log("After delete front element new front becomes:", dq.getFront());
