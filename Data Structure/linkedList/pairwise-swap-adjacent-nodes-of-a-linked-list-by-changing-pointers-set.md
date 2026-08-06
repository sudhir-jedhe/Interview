// Input : 1->2->3->4->5->6->7
// Output : 2->1->4->3->6->5->7,

// Input : 1->2->3->4->5->6
// Output : 2->1->4->3->6->5

/* This program swaps the nodes of linked list 
rather than swapping the field from the nodes. 
Imagine a case where a node contains many 
fields, there will be plenty of unnecessary 
swap calls. */

/* A linked list node */
class Node {
  constructor() {
    this.data = 0;
    this.next = null;
  }
}
var head = null;

/* Function to pairwise swap 
elements of a linked list */
function pairWiseSwap(head) {
  // If linked list is empty or there
  // is only one node in list
  if (head == null || head.next == null) return head;

  // Fix the head and its next explicitly to
  // avoid many if else in while loop
  var curr = head.next.next;
  var prev = head;
  head = head.next;
  head.next = prev;

  // Fix remaining nodes
  while (curr != null && curr.next != null) {
    prev.next = curr.next;
    prev = curr;
    var next = curr.next.next;
    curr.next.next = curr;
    curr = next;
  }

  prev.next = curr;
  return head;
}

/* Function to add a node at the 
beginning of Linked List */
function push(new_data) {
  var new_node = new Node();
  new_node.data = new_data;
  new_node.next = head;
  head = new_node;
}

/* Function to print nodes
in a given linked list */
function printList(node) {
  while (node != null) {
    document.write(node.data + " ");
    node = node.next;
  }
}

/* Driver code */
/* The constructed linked list is: 
1->2->3->4->5->6->7 */
push(7);
push(6);
push(5);
push(4);
push(3);
push(2);
push(1);
document.write("Linked list before" + "calling pairWiseSwap() ");
printList(head);
var start = pairWiseSwap(head);
document.write("<br> Linked list after" + "calling pairWiseSwap() ");
printList(start);

/**************************************************************** */
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Function to insert a node at the beginning
function push(list, newData) {
  let newNode = new Node(newData);
  newNode.next = list.head;
  list.head = newNode;
}

// Utility function to print a singly linked list
function printList(head) {
  let temp = head;
  while (temp !== null) {
    console.log(temp.data);
    temp = temp.next;
  }
}

// Function to swap adjacent nodes
function swapPairs(list) {
  let head = list.head;
  let dummy = new Node(null);
  dummy.next = head;
  let prev = dummy;
  while (head && head.next) {
    let one = head;
    let two = one.next.next;
    prev.next = one.next;
    one.next.next = one;
    one.next = two;
    prev = one;
    head = one.next;
  }
  list.head = dummy.next;
}

let list = { head: null };
push(list, 6);
push(list, 5);
push(list, 4);
push(list, 3);
push(list, 2);
push(list, 1);

console.log("Actual List:");
printList(list.head);

swapPairs(list);

console.log("Modified Linked List:");
printList(list.head);
