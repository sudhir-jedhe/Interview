// Input :  List is 1->2->3->4->5->6->7
//          K= 2
// Output : 2

// Input :  list is 7->8->9->10->11->12
//          K = 3
// Output : 7

// Traverse the List from beginning to end and count the total number of nodes. Now, suppose n
// is the total number of nodes in the List. Therefore, the middle node will be at the position (n/2)+1.
// Now, the task remains to print the node at (n/2 + 1 – k)th position from the head of the List.

// javascript program to find Kth node from mid
// of a linked list in single traversal

// Linked list node
class Node {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}
var start = null;

// Function to push node at head
function push(data) {
  if (this.start == null) {
    temp = new Node(data);
    this.start = temp;
  } else {
    temp = new Node(data);
    temp.next = this.start;
    this.start = temp;
  }
}

// method to get the count of node
function getCount(start) {
  temp = start;
  var cnt = 0;
  while (temp != null) {
    temp = temp.next;
    cnt++;
  }
  return cnt;
}

// Function to get the kth node from the mid
// towards begin of the linked list
function printKthfromid(start, k) {
  // Get the count of total number of
  // nodes in the linked list
  var n = getCount(start);
  var reqNode = (n + 1) / 2 - k;

  // If no such node exists, return -1
  if (reqNode <= 0) return -1;
  else {
    current = start;
    var count = 1,
      ans = 0;
    while (current != null) {
      if (count == reqNode) {
        ans = current.data;
        break;
      }
      count++;
      current = current.next;
    }
    return ans;
  }
}

// Driver code

// create linked list
// 1->2->3->4->5->6->7
push(7);
push(6);
push(5);
push(4);
push(3);
push(2);
push(1);
document.write(printKthfromid(start, 2));

// This code is contributed by aashish1995

/****************************************************** */
// Using two pointers
// JS program to find kth node from middle
// towards Head of the Linked List

// Linked list node
class Node {
  constructor(d) {
    this.data = d;
    this.next = null;
  }
}

/* Given a reference (pointer to
pointer) to the head of a list
and an int, push a new node on
the front of the list. */
function push(head_ref, new_data) {
  let new_node = new Node();
  new_node.data = new_data;
  new_node.next = head_ref;
  head_ref = new_node;
  // console.log("data",head_ref);
}

// Function to get the kth node from the mid
// towards begin of the linked list
function printKthfrommid(head_ref, k) {
  let slow = head_ref.next;
  let fast = head_ref.next; // initializing fast and slow pointers
  for (let i = 0; i < k; i++) {
    if (head_ref.next == null && head_ref.next == null) {
      head_ref.next = head_ref.next.next.next; // moving the fast pointer
    } else {
      return 2; // If no such node exists, return -1
    }
  }

  while (head_ref.next == null && head_ref.next.next == null) {
    slow = slow.next;
    head_ref.next = head_ref.next.next.next;
  }

  return slow.data;
}

// Driver code
// start with empty list
let head = new Node();
let k = 2;

// create linked list
// 1->2->3->4->5->6->7
push(head, 7);
push(head, 6);
push(head, 5);
push(head, 4);
push(head, 3);
push(head, 2);
push(head, 1);

console.log(printKthfrommid(head, 2));
