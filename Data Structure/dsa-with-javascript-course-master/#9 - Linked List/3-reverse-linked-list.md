// Ques 2 : Given the head of a singly linked list, reverse the list, and
// return the reversed list.

// Input: head = [1,2]      ----->>>>>      Output: [2,1];

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
var reverseList = (head) => {
  let prev = null;
  let current = head;
  while (current !== null) {
    const nextNode = current.next;
    current.next = prev;
    prev = current;
    current = nextNode;
  }
  return prev;
};


/******************************* */
// Definition for singly-linked list node
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
      let next = current.next;
      current.next = prev;
      prev = current;
      current = next;
  }
  
  return prev; // prev is the new head of the reversed list
}

// Example usage:
// Create a linked list: 1 -> 2 -> 3 -> 4 -> 5
let head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
console.log("Original List:");
printList(head);

// Reverse the linked list
let reversedHead = reverseList(head);
console.log("Reversed List:");
printList(reversedHead);

// Function to print the linked list for verification
function printList(node) {
  let result = [];
  while (node !== null) {
      result.push(node.val);
      node = node.next;
  }
  console.log(result);
}


/************************************************* */


function reverseList(head) {
  let prev = null;
  let curr = head;
  let next;

  while (curr) {
    // Store the next node before overwriting curr.next
    next = curr.next;

    // Reverse the link by pointing curr.next to the previous node
    curr.next = prev;

    // Update prev and curr for the next iteration
    prev = curr;
    curr = next;
  }

  // The new head is the previously last node (prev)
  return prev;
}

// Example (assuming ListNode class for linked list nodes)
const list = new ListNode(1, new ListNode(2, new ListNode(3)));
const reversedList = reverseList(list);
// Output: reversed linked list with nodes in order (3, 2, 1)
