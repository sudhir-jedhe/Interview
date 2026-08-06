class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}


function addTwoNumbers(l1, l2) {
    let dummyHead = new ListNode(0);
    let current = dummyHead;
    let carry = 0;

    while (l1 !== null || l2 !== null) {
        let sum = carry;
        if (l1 !== null) {
            sum += l1.val;
            l1 = l1.next;
        }
        if (l2 !== null) {
            sum += l2.val;
            l2 = l2.next;
        }

        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;
    }

    if (carry > 0) {
        current.next = new ListNode(carry);
    }

    return dummyHead.next;
}


// Example lists: 2 -> 4 -> 3 and 5 -> 6 -> 4 (representing 342 + 465)
let l1 = new ListNode(2);
l1.next = new ListNode(4);
l1.next.next = new ListNode(3);

let l2 = new ListNode(5);
l2.next = new ListNode(6);
l2.next.next = new ListNode(4);

let result = addTwoNumbers(l1, l2);

// Output the result (should be 7 -> 0 -> 8, representing 807)
while (result !== null) {
    console.log(result.val);
    result = result.next;
}


/*********************** */

class Node {
    constructor(data, next = null) {
      this.data = data;
      this.next = next;
    }
  }
  
  function addTwoNumbers(l1, l2) {
    let dummy = new Node(0);
    let current = dummy;
    let carry = 0;
  
    while (l1 || l2 || carry) {
      let sum = (l1 ? l1.data : 0) + (l2 ? l2.data : 0) + carry;
      carry = Math.floor(sum / 10);
      current.next = new Node(sum % 10);
      current = current.next;
      l1 = l1 ? l1.next : null;
      l2 = l2 ? l2.next : null;
    }
  
    return dummy.next;
  }
  
  // Example usage:
  
  const l1 = new Node(2, new Node(4, new Node(3)));
  const l2 = new Node(5, new Node(6, new Node(4)));
  
  const sum = addTwoNumbers(l1, l2);
  
  console.log(sum); // Output: 7 -> 0 -> 8