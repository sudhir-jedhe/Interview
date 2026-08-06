// Procedure to find median of N sorted numbers:

// if N is odd:
//     median is N/2th element
// else
//     median is N/2th element + (N/2+1)th element

// Input : 1->2->3->4->5->NULL
// Output : 3
// Input : 1->2->3->4->5->6->NULL
// Output : 3.5

// Javascript program to find median
// of a linked list

// A linked list node
class Node {
  constructor() {
    this.data = 0;
    this.next = null;
  }
}

/* Function to get the median of the linked list */
function printMidean(head) {
  var slow_ptr = head;
  var fast_ptr = head;
  var pre_of_slow = head;

  if (head != null) {
    while (fast_ptr != null && fast_ptr.next != null) {
      fast_ptr = fast_ptr.next.next;

      // previous of slow_ptr
      pre_of_slow = slow_ptr;
      slow_ptr = slow_ptr.next;
    }

    // if the below condition is true linked list
    // contain odd Node
    // simply return middle element
    if (fast_ptr != null) {
      document.write("Median is : " + slow_ptr.data);
    }

    // else linked list contain even element
    else {
      document.write("Median is : " + (slow_ptr.data + pre_of_slow.data) / 2);
    }
  }
}

/* Given a reference (pointer to
	pointer) to the head of a list
	and an int, push a new node on
	the front of the list. */
function push(head_ref, new_data) {
  // allocate node
  var new_node = new Node();

  // put in the data
  new_node.data = new_data;

  // link the old list
  // off the new node
  new_node.next = head_ref;

  // move the head to point
  // to the new node
  head_ref = new_node;
  return head_ref;
}

// Driver Code

// Start with the
// empty list
var head = null;

// Use push() to construct
// below list
// 1.2.3.4.5.6
head = push(head, 6);
head = push(head, 5);
head = push(head, 4);
head = push(head, 3);
head = push(head, 2);
head = push(head, 1);

// Check the count
// function
printMidean(head);

// This code is contributed by jana_sayantan.

/************************************************************ */
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class Solution {
  findMedian(head) {
    let n = 0;
    let p = head;

    // Count the number of elements in the linked list
    while (p) {
      n++;
      p = p.next;
    }

    // Call the helper function to find the median
    return n % 2 === 1
      ? this.findKth(head, Math.floor(n / 2))
      : (this.findKth(head, n / 2) + this.findKth(head, n / 2 - 1)) / 2.0;
  }

  findKth(head, k) {
    let p = head;

    // Iterate through the linked list until the kth element
    while (k > 0) {
      p = p.next;
      k--;
    }

    // Return the kth element's value
    return p.val;
  }
}

const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

const solution = new Solution();
console.log("The median is: " + solution.findMedian(head));
