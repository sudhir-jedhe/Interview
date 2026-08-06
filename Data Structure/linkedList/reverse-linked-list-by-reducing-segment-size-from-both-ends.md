// Given a linked list of even length, where each element is an integer, the task is to reverse the list by performing the following steps repeatedly, after completing the below steps, return the new head of the list.

// Reverse the list and remove the first and last elements.
// Repeat step 1 until there are no more elements left.

// Input: 1 -> 5 -> 2 -> 7 -> 8 -> 3 -> NULL
// Output: 3 -> 5 -> 7 -> 2 -> 8 -> 1 -> NULL
// Explanation: The initial linked list is : 1 -> 5 -> 2 -> 7 -> 8 -> 3 -> NULL
// Reverse the complete list: 3 -> 8 -> 7 -> 2 -> 5 -> 1 -> NULL
// Reduce the segment by 1 from both ends and reverse the list: 3 -> 5 -> 2 -> 7 -> 8 -> 1 -> NULL
// Reduce the segment by 1 from both ends and reverse the list: 3 -> 5 -> 7 -> 2 -> 8 -> 1 -> NULL

// Input: 3 -> 4 -> 7 -> 8 -> NULL
// Output: 8 -> 4 -> 7 -> 3 -> NULL

// JavaScript code for the approach

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

// Function to reverse the linked list
function reverse(head) {
  let fast = head;
  let slow = head;
  let length = 0;

  // Find length of linked list
  while (fast != null && fast.next != null) {
    fast = fast.next.next;
    slow = slow.next;
    length += 2;
  }

  let node = head;

  // Reversing the list
  for (let i = 0; i < length / 2; i++) {
    if (i % 2 == 0) {
      // Assign the slow pointer as
      // it is at mid + 1 index
      let temp = slow;

      // How many steps to move right
      // to reach right pointer of
      // this segment
      let count = length / 2 - i - 1;
      while (count > 0) {
        temp = temp.next;
        count--;
      }

      // Swap their values or you
      // can also swap the nodes
      let val = node.val;
      node.val = temp.val;
      temp.val = val;
      node = node.next;
    } else {
      node = node.next;
    }
  }

  return head;
}

// Print the list
function printList(node) {
  let res = "";
  while (node !== null) {
    res += node.val + " ";
    node = node.next;
  }
  return res.trim();
}

// Driver code
let head = new Node(1);
head.next = new Node(5);
head.next.next = new Node(2);
head.next.next.next = new Node(7);
head.next.next.next.next = new Node(8);
head.next.next.next.next.next = new Node(3);

console.log("Given linked list");
console.log(printList(head));

head = reverse(head);

console.log("Reversed linked list");
console.log(printList(head));
