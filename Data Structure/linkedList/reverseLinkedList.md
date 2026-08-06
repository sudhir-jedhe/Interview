/**
 * Iterative
 */
const reverseLinkedList = (head) => {
  let prev = null,
    curr = head,
    next = null;

  while (curr != null) {
    next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};

// recursive
const reverseLinkedList = (head) => {
  if (head == null || head.next == null) return head;

  let p = reverseLinkedList(head.next);
  head.next.next = head;
  head.next = null;
  return p;
};

/******************************** */

const reverseLinkedList = (list) => {
  let node = list,
    prev = null;
  while (node !== null) {
    [node.next, node, prev] = [prev, node.next, node];
  }
  return prev;
};

// n this problem, temporary variables are required so you don't overwrite variable values that you still need later on in the loop. (e.g. (1) prev = node; (2) node.next = prev; Here, prev was overwritten in (1), therefore node.next is incorrectly assigned).

// Notice the use of array destructuring here to efficiently store temporary variables: The array on the right is a 'temporary variable array', which holds the references stored in the current prev, node.next, and node variables. For each iteration of the while loop:

// the node.next variable points to the temporary prev reference - i.e. the current node's next will point to the previous node, reversing the link
// the node variable points to the temporary node.next reference - the 'node' runner variable will progress to the next node in the linked list
// the prev variable points to temporary node reference - the 'prev' runner variable will progress to the previous node.

/**
 * class Node {
 *  new(val: number, next: Node);
 *    val: number
 *    next: Node
 * }
 */

/**
 * @param {Node} list
 * @return {Node}
 */
const reverseLinkedList = (list) => {
  let head = null;
  let node = list;
  while (node) {
    const next = node.next;
    node.next = head;
    head = node;
    node = next;
  }
  return head;
};

/*
    head = 3 -> 2 -> 1 -> null
    node.next -> head
    head = node
     1 -> 2 -> 3
               ^node
                    ^next

     3 -> 2 -> 1
*/
