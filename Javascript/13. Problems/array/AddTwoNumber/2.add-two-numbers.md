// Input: l1 = [2,4,3], l2 = [5,6,4]
// Output: [7,0,8]
// Explanation: 342 + 465 = 807.
// Example 2:

// Input: l1 = [0], l2 = [0]
// Output: [0]
// Example 3:

// Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
// Output: [8,9,9,9,0,0,0,1]

var addTwoNumbers = function (l1, l2) {
  // Convert a ListNode to an array of its digits in reverse order
  function ConvertReverseListNodeToArray(listNode) {
    // Initialise an array to return
    let returnedArray = [];

    // Check if there is another level to the ListNode
    if (listNode.next != null) {
      // Merge the current array with the result of calling the function again on the next level
      returnedArray = returnedArray.concat(
        ConvertReverseListNodeToArray(listNode.next)
      );
    }

    // Add the current node's value to the returned array
    returnedArray.push(listNode.val);

    // Return the constructed array
    return returnedArray;
  }

  // Convert the ListNodes to Arrays
  const l1Array = ConvertReverseListNodeToArray(l1);
  const l2Array = ConvertReverseListNodeToArray(l2);

  // Add the numbers (after merging them), using BigInt due to LeetCode's edge cases
  let newTotal = BigInt(l1Array.join("")) + BigInt(l2Array.join(""));

  // Split the total back into an array
  splitNewTotal = newTotal.toString().split("");

  // Initialise an empty ListNode
  let returnedListNode = null;

  // Loop through the total value's array
  for (let i = 0; i < splitNewTotal.length; i++) {
    // Add this digit to the ListNode
    returnedListNode = {
      val: splitNewTotal[i],
      next: returnedListNode,
    };
  }

  // Return the constructed ListNode
  return returnedListNode;
};

/************************************************************ */

var addTwoNumbers = function (l1, l2) {
  // Initialise a new ListNode to be returned
  var newListNode = new ListNode(0);
  var headOfNewListNode = newListNode;

  // Initialise variables to be utilised on each run
  var sum = 0;
  var carry = 0;

  // While there are elements (or a carried number) to add
  while (l1 !== null || l2 !== null || sum > 0) {
    // If there's an element in l1 to be added, add it to the sum and move to the next l1 node
    if (l1 !== null) {
      sum = sum + l1.val;
      l1 = l1.next;
    }

    // If there's an element in l2 to be added, add it to the sum and move to the next l2 node
    if (l2 !== null) {
      sum = sum + l2.val;
      l2 = l2.next;
    }

    // Check if the sum for these nodes exceeds 10
    if (sum >= 10) {
      carry = 1;
      sum = sum - 10;
    }

    // Add the sum to the new ListNode, and then move it to the next entry
    headOfNewListNode.next = new ListNode(sum);
    headOfNewListNode = headOfNewListNode.next;

    // Set the sum for the next addition to equal the carry-over (if there was one)
    sum = carry;
    carry = 0;
  }

  // Return the constructed ListNode (ignoring the first dummy entry)
  return newListNode.next;
};

/******************************************************* */
var addTwoNumbers = function (l1, l2) {
  // Initialise the node as null in case no values are added to it (so parent's .next will be null)
  let node = null;

  // Obtain the secret third argument (or change it to 0)
  const carry = arguments[2] ? 1 : 0;

  // Check if either an l1 node or l2 node exist to be added together
  if (l1 || l2) {
    // Obtain the values of the current l1 and l2 nodes (or 0 if they do not exist)
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;

    // Obtain the .next values of the current l1 and l2 nodes (or null if they do not exist)
    const next1 = l1 ? l1.next : null;
    const next2 = l2 ? l2.next : null;

    // Sum together the two values and the (optional) carry
    const sum = val1 + val2 + Number(carry);

    // Set the returning node to the sum, with any potential carry removed
    node = new ListNode(sum % 10);

    // Set the returning node's .next value to be the sum of adding the next two nodes together, along with the current carry (if one exists)
    node.next = addTwoNumbers(next1, next2, sum >= 10);
  } else if (carry) {
    // If a carry was passed in but no values exist to be added, return a node with the carry value in it, and no .next
    node = new ListNode(1);
    node.next = null;
  }

  // Return the constucted node
  return node;
};


/***************************************************** */
// Definition for a singly-linked list node
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function addTwoNumbers(l1, l2) {
  let dummy = new ListNode();
  let current = dummy;
  let carry = 0;
  
  while (l1 || l2 || carry) {
    let sum = carry;
    
    if (l1) {
      sum += l1.val;
      l1 = l1.next;
    }
    
    if (l2) {
      sum += l2.val;
      l2 = l2.next;
    }
    
    carry = Math.floor(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;
  }
  
  return dummy.next;
}

// Function to convert array to linked list
function arrayToLinkedList(arr) {
  if (arr.length === 0) return null;
  let dummy = new ListNode();
  let current = dummy;
  for (let num of arr) {
    current.next = new ListNode(num);
    current = current.next;
  }
  return dummy.next;
}

// Function to convert linked list to array
function linkedListToArray(head) {
  let result = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

// Test cases
let l1 = arrayToLinkedList([2, 4, 3]);
let l2 = arrayToLinkedList([5, 6, 4]);
let result = addTwoNumbers(l1, l2);
console.log(linkedListToArray(result)); // Output: [7, 0, 8]

l1 = arrayToLinkedList([0]);
l2 = arrayToLinkedList([0]);
result = addTwoNumbers(l1, l2);
console.log(linkedListToArray(result)); // Output: [0]

l1 = arrayToLinkedList([9, 9, 9, 9, 9, 9, 9]);
l2 = arrayToLinkedList([9, 9, 9, 9]);
result = addTwoNumbers(l1, l2);
console.log(linkedListToArray(result)); // Output: [8, 9, 9, 9, 0, 0, 0, 1]


/********************************************* */

// Definition for a singly-linked list node
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function addTwoNumbersRecursive(l1, l2, carry = 0) {
  if (!l1 && !l2 && carry === 0) {
    return null;
  }
  
  let sum = carry;
  if (l1) {
    sum += l1.val;
    l1 = l1.next;
  }
  if (l2) {
    sum += l2.val;
    l2 = l2.next;
  }
  
  let newNode = new ListNode(sum % 10);
  newNode.next = addTwoNumbersRecursive(l1, l2, Math.floor(sum / 10));
  return newNode;
}

// Function to convert array to linked list
function arrayToLinkedList(arr) {
  if (arr.length === 0) return null;
  let dummy = new ListNode();
  let current = dummy;
  for (let num of arr) {
    current.next = new ListNode(num);
    current = current.next;
  }
  return dummy.next;
}

// Function to convert linked list to array
function linkedListToArray(head) {
  let result = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

// Test cases
let l1 = arrayToLinkedList([2, 4, 3]);
let l2 = arrayToLinkedList([5, 6, 4]);
let result = addTwoNumbersRecursive(l1, l2);
console.log(linkedListToArray(result)); // Output: [7, 0, 8]

l1 = arrayToLinkedList([0]);
l2 = arrayToLinkedList([0]);
result = addTwoNumbersRecursive(l1, l2);
console.log(linkedListToArray(result)); // Output: [0]

l1 = arrayToLinkedList([9, 9, 9, 9, 9, 9, 9]);
l2 = arrayToLinkedList([9, 9, 9, 9]);
result = addTwoNumbersRecursive(l1, l2);
console.log(linkedListToArray(result)); // Output: [8, 9, 9, 9, 0, 0, 0, 1]


/**************************************************** */

function sumTwoLists(list1, list2) {
  // Handle lists of different lengths
  const maxLength = Math.max(list1.length, list2.length);
  list1 = list1.padEnd(maxLength, 0);
  list2 = list2.padEnd(maxLength, 0);

  // Element-wise sum using map
  return list1.map((value, index) => value + list2[index]);
}

// Examples
const list1 = [2, 4, 3];
const list2 = [5, 6, 4];
console.log(sumTwoLists(list1, list2)); // Output: [7, 10, 7]

const list3 = [0];
const list4 = [0];
console.log(sumTwoLists(list3, list4)); // Output: [0]

const list5 = [9, 9, 9, 9, 9, 9, 9];
const list6 = [9, 9, 9, 9];
console.log(sumTwoLists(list5, list6)); // Output: [8, 18, 18, 18, 0, 0, 0, 1]



/*********************************************** */

function sumTwoLists(list1, list2) {
  const maxLength = Math.max(list1.length, list2.length);
  const result = new Array(maxLength).fill(0); // Pre-allocate result array

  for (let i = 0; i < maxLength; i++) {
    const value1 = list1[i] || 0; // Handle potential undefined values
    const value2 = list2[i] || 0;
    result[i] = value1 + value2;
  }

  return result;
}


/******************************************************** */


function sumTwoLists(list1, list2) {
  const maxLength = Math.max(list1.length, list2.length);
  const shorterList = list1.length < list2.length ? list1 : list2; // Identify shorter list

  // Pad shorter list with zeros using reduce
  const paddedList = shorterList.reduce((acc, value, index) => {
    acc[index] = value;
    acc.push(list2[index] || 0); // Add corresponding value from longer list
    return acc;
  }, []);

  // Reduce again to sum elements
  return paddedList.reduce((acc, value) => acc + value, 0);
}
