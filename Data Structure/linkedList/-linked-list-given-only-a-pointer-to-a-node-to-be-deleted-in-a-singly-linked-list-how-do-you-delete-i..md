// javascript program to del the node in
// which only a single pointer is
// known pointing to that node

// A simple solution is to traverse the linked list until you find the node you want to delete. But this solution requires a pointer to the head node which contradicts the problem statement.

// The fast solution is to copy the data from the next node to the node to be deleted and delete the next node. Something like this:

var head;

class Node {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

function printList(node) {
  while (node != null) {
    document.write(node.data + " ");
    node = node.next;
  }
}

function deleteNode(node) {
  var temp = node.next;
  node.data = temp.data;
  node.next = temp.next;
}

// Driver code

head = new Node(1);
head.next = new Node(12);
head.next.next = new Node(1);
head.next.next.next = new Node(4);
head.next.next.next.next = new Node(1);

document.write("Before Deleting<br/> ");
printList(head);

/*
 * I m deleting the head itself. You can check for more cases
 */
deleteNode(head);
document.write("<br/>");
document.write("After deleting<br/> ");
printList(head);
