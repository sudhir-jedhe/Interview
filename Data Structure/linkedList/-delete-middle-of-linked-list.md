// 1->2->3->4->5 then the linked list should be modified to 1->2->4->5
// 1->2->3->4->5->6 then it should be modified to 1->2->3->5->6.

// Javascript program to delete the
// middle of a linked list
// Link list Node
class Node {
  constructor() {
    this.data = 0;
    this.next = null;
  }
}

// Deletes middle node and returns
// head of the modified list
function deleteMid(head) {
  // Base cases
  if (head == null) return null;
  if (head.next == null) {
    return null;
  }

  // Initialize slow and fast pointers
  // to reach middle of linked list
  var slow_ptr = head;
  var fast_ptr = head;

  // Find the middle and previous of
  // middle.
  var prev = null;

  // To store previous of slow_ptr
  while (fast_ptr != null && fast_ptr.next != null) {
    fast_ptr = fast_ptr.next.next;
    prev = slow_ptr;
    slow_ptr = slow_ptr.next;
  }

  // Delete the middle node
  prev.next = slow_ptr.next;

  return head;
}

// A utility function to print
// a given linked list
function printList(ptr) {
  while (ptr != null) {
    document.write(ptr.data + "->");
    ptr = ptr.next;
  }
  document.write("NULL<br/>");
}

// Utility function to create a
// new node.
function newNode(data) {
  temp = new Node();
  temp.data = data;
  temp.next = null;
  return temp;
}

// Driver code
// Start with the empty list
head = newNode(1);
head.next = newNode(2);
head.next.next = newNode(3);
head.next.next.next = newNode(4);
document.write("Given Linked List<br/>");
printList(head);
head = deleteMid(head);
document.write("Linked List after deletion of middle<br/>");
printList(head);
