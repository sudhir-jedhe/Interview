// Input  : 1 2 3 4 5
// Output : 3 1 2 4 5

// Input  : 1 2 3 4 5 6
// Output : 4 1 2 3 5 6

// javascript program to make middle node
// as head of Linked list

/* Link list node */
class Node {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

var head;

/*
 * Function to get the middle and set at beginning of the linked list
 */
function setMiddleHead() {
  if (head == null) return;

  // To traverse list nodes one
  // by one
  one_node = head;

  // To traverse list nodes by
  // skipping one.
  two_node = head;

  // To keep track of previous of middle
  prev = null;
  while (two_node != null && two_node.next != null) {
    /* for previous node of middle node */
    prev = one_node;

    /* move one node each time */
    two_node = two_node.next.next;

    /* move two node each time */
    one_node = one_node.next;
  }

  /* set middle node at head */
  prev.next = prev.next.next;
  one_node.next = head;
  head = one_node;
}

// To insert a node at the beginning of
// linked list.
function push(new_data) {
  /* allocate node */
  new_node = new Node(new_data);

  /* link the old list of the new node */
  new_node.next = head;

  /* move the head to point to the new node */
  head = new_node;
}

// A function to print a given linked list
function printList(ptr) {
  while (ptr != null) {
    document.write(ptr.data + " ");
    ptr = ptr.next;
  }
  document.write("<br/>");
}

/* Driver function */

// Create a list of 5 nodes
head = null;
var i;
for (i = 5; i > 0; i--) push(i);

document.write(" list before: ");
printList(head);

setMiddleHead();

document.write(" list After: ");
printList(head);
