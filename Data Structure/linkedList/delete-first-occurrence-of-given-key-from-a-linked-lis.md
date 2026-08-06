// Input: list = 1->2->3->5->2->10, key = 2
// Output: 1->3->5->2->10
// Explanation: There are two instances of 2. But as per the question we need to delete the first occurrence only.

// Input: list = 3->3->3->3, key = 3
// Output: 3->3->3

// A complete working javascript program
// to demonstrate deletion
// in singly linked list

// Head of list
var head;

// Linked list Node
class Node {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

// Given a key, deletes the first occurrence
// of key in linked list
function deleteNode(key) {
  // Store head node
  var temp = head,
    prev = null;

  // If head node itself holds the key to be deleted
  if (temp != null && temp.data == key) {
    // Changed head
    head = temp.next;
    return;
  }

  // Search for the key to be deleted, keep track of
  // the previous node as we need to change temp.next
  while (temp != null && temp.data != key) {
    prev = temp;
    temp = temp.next;
  }

  // If key was not present in linked list
  if (temp == null) return;

  // Unlink the node from linked list
  prev.next = temp.next;
}

// Inserts a new Node at front of the list.
function push(new_data) {
  var new_node = new Node(new_data);
  new_node.next = head;
  head = new_node;
}

// This function prints contents of linked list
// starting from the given node
function printList() {
  tnode = head;
  while (tnode != null) {
    console.log(tnode.data + " ");
    tnode = tnode.next;
  }
}

// Driver program to test above functions.
// Ideally this function should be in a
// separate user class. It is kept here to keep code compact
push(7);
push(1);
push(3);
push(2);

console.log("Created Linked List: ");
printList();

// Delete node with data 1
deleteNode(1);

console.log("Linked List after Deletion of 1:");
printList();

// Created Linked List:
// 2 3 1 7
// Linked List after Deletion of 1:
// 2 3 7
