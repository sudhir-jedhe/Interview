// Input : 10->6->8->4->12, n = 2
// Output : 16
// Sum of last two nodes:
// 12 + 4 = 16

// Input : 15->7->9->5->16->14, n = 4
// Output : 44

// JavaScript implementation to find the sum of
// last 'n' nodes of the Linked List

/* A Linked list node */
class Node {
  constructor() {
    this.data;
    this.next;
  }
}

let head;
let n, sum;
// function to insert a node at the
// beginning of the linked list
function push(head_ref, new_data) {
  /* allocate node */
  let new_node = new Node();

  /* put in the data */
  new_node.data = new_data;

  /* link the old list to the new node */
  new_node.next = head_ref;

  /* move the head to point to the new node */
  head_ref = new_node;
  head = head_ref;
}

// function to recursively find the sum of last
// 'n' nodes of the given linked list
function sumOfLastN_Nodes(head) {
  // if head = NULL
  if (head == null) return;

  // recursively traverse the remaining nodes
  sumOfLastN_Nodes(head.next);

  // if node count 'n' is greater than 0
  if (n > 0) {
    // accumulate sum
    sum = sum + head.data;

    // reduce node count 'n' by 1
    --n;
  }
}

// utility function to find the sum of last 'n' nodes
function sumOfLastN_NodesUtil(head, n) {
  // if n == 0
  if (n <= 0) return 0;

  sum = 0;

  // find the sum of last 'n' nodes
  sumOfLastN_Nodes(head);

  // required sum
  return sum;
}

// Driver Code
head = null;

// create linked list 10.6.8.4.12
push(head, 12);
push(head, 4);
push(head, 8);
push(head, 6);
push(head, 10);

n = 2;
document.write(
  "Sum of last " + n + " nodes = " + sumOfLastN_NodesUtil(head, n)
);

/***************************************************** */

// Javascript implementation to find the sum of last
// 'n' nodes of the Linked List

/* A Linked list node */
class Node {
  constructor() {
    let data, next;
  }
}

// function to insert a node at the
// beginning of the linked list
function push(head_ref, new_data) {
  /* allocate node */
  let new_node = new Node();
  /* put in the data */
  new_node.data = new_data;

  /* link the old list to the new node */
  new_node.next = head_ref;

  /* move the head to point to the new node */
  head_ref = new_node;
  return head_ref;
}

// utility function to find the sum of last 'n' nodes
function sumOfLastN_NodesUtil(head, n) {
  // if n == 0
  if (n <= 0) return 0;

  let st = [];
  let sum = 0;

  // traverses the list from left to right
  while (head != null) {
    // push the node's data onto the stack 'st'
    st.push(head.data);

    // move to next node
    head = head.next;
  }

  // pop 'n' nodes from 'st' and
  // add them
  while (n-- > 0) {
    sum += st[st.length - 1];
    st.pop();
  }

  // required sum
  return sum;
}

// Driver program to test above
let head = null;

// create linked list 10.6.8.4.12
head = push(head, 12);
head = push(head, 4);
head = push(head, 8);
head = push(head, 6);
head = push(head, 10);

let n = 2;
document.write(
  "Sum of last " + n + " nodes = " + sumOfLastN_NodesUtil(head, n)
);

/******************************************************************* */

// javascript implementation to find the sum of last
// 'n' nodes of the Linked List

/* A Linked list node */
class Node {
  constructor() {
    this.data = 0;
    this.next = null;
  }
}
var head;

// function to insert a node at the
// beginning of the linked list
function push(head_ref, new_data) {
  /* allocate node */
  var new_node = new Node();

  /* put in the data */
  new_node.data = new_data;

  /* link the old list to the new node */
  new_node.next = head_ref;

  /* move the head to point to the new node */
  head_ref = new_node;
  head = head_ref;
}

function reverseList(head_ref) {
  var current, prev, next;
  current = head_ref;
  prev = null;

  while (current != null) {
    next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  head_ref = prev;
  head = head_ref;
}

// utility function to find the sum of last 'n' nodes
function sumOfLastN_NodesUtil(n) {
  // if n == 0
  if (n <= 0) return 0;

  // reverse the linked list
  reverseList(head);

  var sum = 0;
  var current = head;

  // traverse the 1st 'n' nodes of the reversed
  // linked list and add them
  while (current != null && n-- > 0) {
    // accumulate node's data to 'sum'
    sum += current.data;

    // move to next node
    current = current.next;
  }

  // reverse back the linked list
  reverseList(head);

  // required sum
  return sum;
}

// Driver code

// create linked list 10.6.8.4.12
push(head, 12);
push(head, 4);
push(head, 8);
push(head, 6);
push(head, 10);

var n = 2;
document.write("Sum of last " + n + " nodes = " + sumOfLastN_NodesUtil(n));

/******************************************************* */

// Javascript implementation to
// find the sum of last
// 'n' nodes of the Linked List
/* A Linked list node */
class Node {
  constructor() {
    this.data = 0;
    this.next = null;
  }
}

var head;

// function to insert a node at the
// beginning of the linked list
function push(head_ref, new_data) {
  /* allocate node */
  new_node = new Node();

  /* put in the data */
  new_node.data = new_data;

  /* link the old list to 
		the new node */
  new_node.next = head_ref;

  /* move the head to point 
		to the new node */
  head_ref = new_node;
  head = head_ref;
}

// utility function to find
// the sum of last 'n' nodes
function sumOfLastN_NodesUtil(head, n) {
  // if n == 0
  if (n <= 0) return 0;

  var sum = 0,
    len = 0;
  temp = head;

  // calculate the length of the linked list
  while (temp != null) {
    len++;
    temp = temp.next;
  }

  // count of first (len - n) nodes
  var c = len - n;
  temp = head;

  // just traverse the 1st 'c' nodes
  while (temp != null && c-- > 0) {
    // move to next node
    temp = temp.next;
  }

  // now traverse the last 'n'
  // nodes and add them
  while (temp != null) {
    // accumulate node's data to sum
    sum += temp.data;

    // move to next node
    temp = temp.next;
  }

  // required sum
  return sum;
}

// Driver code

// create linked list 10.6.8.4.12
push(head, 12);
push(head, 4);
push(head, 8);
push(head, 6);
push(head, 10);

var n = 2;
document.write(
  "Sum of last " + n + " nodes = " + sumOfLastN_NodesUtil(head, n)
);

/*********************************************************** */

// Javascript implementation to find the sum of last
// 'n' nodes of the Linked List

// Defining structure
class Node {
  constructor() {
    let node, next;
  }
}

let head;

function printList(start) {
  let temp = start;
  while (temp != null) {
    document.write(temp.data + " ");
    temp = temp.next;
  }
  document.write("<br>");
}

// Push function
function push(start, info) {
  // Allocating node
  let node = new Node();

  // Info into node
  node.data = info;

  // Next of new node to head
  node.next = start;

  // head points to new node
  head = node;
}

function sumOfLastN_NodesUtil(head, n) {
  // if n == 0
  if (n <= 0) return 0;

  let sum = 0,
    temp = 0;
  let ref_ptr, main_ptr;
  ref_ptr = main_ptr = head;

  // traverse 1st 'n' nodes through 'ref_ptr' and
  // accumulate all node's data to 'sum'
  while (ref_ptr != null && n-- > 0) {
    sum += ref_ptr.data;

    // move to next node
    ref_ptr = ref_ptr.next;
  }

  // traverse to the end of the linked list
  while (ref_ptr != null) {
    // accumulate all node's data to 'temp' pointed
    // by the 'main_ptr'
    temp += main_ptr.data;

    // accumulate all node's data to 'sum' pointed by
    // the 'ref_ptr'
    sum += ref_ptr.data;

    // move both the pointers to their respective
    // next nodes
    main_ptr = main_ptr.next;
    ref_ptr = ref_ptr.next;
  }

  // required sum
  return sum - temp;
}

// Driver code
head = null;

// Adding elements to Linked List
push(head, 12);
push(head, 4);
push(head, 8);
push(head, 6);
push(head, 10);

let n = 2;

document.write(
  "Sum of last " + n + " nodes = " + sumOfLastN_NodesUtil(head, n)
);
