// Input : list: 1->2->4->5, x = 3
// Output : 1->2->3->4->5

// Input : list: 5->10->4->32->16, x = 41
// Output : 5->10->4->41->32->16

// Javascript implementation to insert node
// at the middle of the linked list

var head; // head of list

/* Node Class */
class Node {
  // Constructor to create a new node
  constructor(d) {
    this.data = d;
    this.next = null;
  }
}

// function to insert node at the
// middle of the linked list
function insertAtMid(x) {
  // if list is empty
  if (head == null) head = new Node(x);
  else {
    // get a new node
    var newNode = new Node(x);

    var ptr = head;
    var len = 0;

    // calculate length of the linked list
    // , i.e, the number of nodes
    while (ptr != null) {
      len++;
      ptr = ptr.next;
    }

    // 'count' the number of nodes after which
    // the new node is to be inserted
    var count = len % 2 == 0 ? len / 2 : (len + 1) / 2;
    ptr = head;

    // 'ptr' points to the node after which
    // the new node is to be inserted
    while (count-- > 1) ptr = ptr.next;

    // insert the 'newNode' and adjust
    // the required links
    newNode.next = ptr.next;
    ptr.next = newNode;
  }
}

// function to display the linked list
function display() {
  var temp = head;
  while (temp != null) {
    document.write(temp.data + " ");
    temp = temp.next;
  }
}

// Driver program to test above

// Creating the list 1.2.4.5

head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(4);
head.next.next.next = new Node(5);

document.write("Linked list before " + "insertion: ");
display();

var x = 3;
insertAtMid(x);

document.write("<br/>Linked list after" + " insertion: ");
display();

// This code contributed by Rajput-Ji

/************************************************************************ */

// Javascript implementation to insert node
// at the middle of the linked list

var head; // head of list

/* Node Class */
class Node {
  // Constructor to create a new node
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

// function to insert node at the
// middle of the linked list
function insertAtMid(x) {
  // if list is empty
  if (head == null) head = new Node(x);
  else {
    // get a new node
    var newNode = new Node(x);

    // assign values to the slow
    // and fast pointers
    var slow = head;
    var fast = head.next;

    while (fast != null && fast.next != null) {
      // move slow pointer to next node
      slow = slow.next;

      // move fast pointer two nodes
      // at a time
      fast = fast.next.next;
    }

    // insert the 'newNode' and adjust
    // the required links
    newNode.next = slow.next;
    slow.next = newNode;
  }
}

// function to display the linked list
function display() {
  var temp = head;
  while (temp != null) {
    document.write(temp.data + " ");
    temp = temp.next;
  }
}

// Driver program to test above

// Creating the list 1.2.4.5
head = null;
head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(4);
head.next.next.next = new Node(5);

document.write("Linked list before" + " insertion: ");
display();

var x = 3;
insertAtMid(x);

document.write("<br/>Linked list after" + " insertion: ");
display();
