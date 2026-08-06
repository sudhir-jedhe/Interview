// Input: 4->5->6->1->2->3 ; m = 3
// Output: 1->2->3->4->5->6
// Input: 0->1->2->3->4->5 ; m = 4
// Output: 2->3->4->5->0->1

// JavaScript Program to move last m elements
// to front in a given linked list
// A linked list node
class Node {
  constructor() {
    this.data = 0;
    this.next = null;
  }
}

var first, last;

var length = 0;

// Function to print nodes
// in a given linked list
function printList(node) {
  while (node != null) {
    document.write(node.data + " ");
    node = node.next;
  }
}

// Pointer head and p are being used here
// because, the head of the linked list
// is changed in this function.
function moveToFront(head, p, m) {
  // If the linked list is empty,
  // or it contains only one node,
  // then nothing needs to be done,
  // simply return
  if (head == null) return;

  p = head;
  head = head.next;
  m++;

  // if m value reaches length,
  // the recursion will end
  if (length == m) {
    // breaking the link
    p.next = null;

    // connecting last to first &
    // will make another node as head
    last.next = first;

    // Making the first node of
    // last m nodes as root
    first = head;
  } else moveToFront(head, p, m);
}

// UTILITY FUNCTIONS

// Function to add a node at
// the beginning of Linked List
function push(head_ref, new_data) {
  // allocate node
  var new_node = new Node();

  // put in the data
  new_node.data = new_data;

  // link the old list of the new node
  new_node.next = head_ref;

  // move the head to point to the new node
  head_ref = new_node;

  // making first & last nodes
  if (length == 0) last = head_ref;
  else first = head_ref;

  // increase the length
  length++;
  return head_ref;
}

// Driver code
var start = null;

// The constructed linked list is:
// 1.2.3.4.5
start = push(start, 5);
start = push(start, 4);
start = push(start, 3);
start = push(start, 2);
start = push(start, 1);
start = push(start, 0);

document.write("Initial Linked list <br>");
printList(start);
var m = 4; // no.of nodes to change
var temp = new Node();
moveToFront(start, temp, m);

document.write("<br> Final Linked list <br>");
start = first;
printList(start);
