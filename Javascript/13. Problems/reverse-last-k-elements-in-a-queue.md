```js
const reverseQueue = (queue, k) => {
  let n = queue.size();
  //   Shift the elements to the front which are not be reversed.
  //   Copy the elements in the stack
  //   Again copy the elements from the stack back.
  //If out of range then return the original queue
  if (k > n || k < 1) {
    return queue;
  }

  let stack = [];

  //Get the last n - k elements
  for (let i = 0; i < n - k; i++) {
    stack.push(queue.front());
    queue.dequeue();
  }

  //Move the last n - k elements to the first
  for (let i = 0; i < n - k; i++) {
    queue.enqueue(stack.pop());
  }

  //Add all the elements to the stack
  for (let i = 0; i < n; i++) {
    stack.push(queue.dequeue());
  }

  //Copy the reversed list back to the queue
  for (let i = 0; i < n; i++) {
    queue.enqueue(stack.pop());
  }

  //Return queue
  return queue;
};

// Input:
// let queue = new Queue();
// queue.enqueue(1);
// queue.enqueue(2);
// queue.enqueue(3);
// queue.enqueue(4);
// queue.enqueue(5);

// let newQueue = reverseQueue(queue, 3);

// while (!newQueue.isEmpty()) {
//    console.log(newQueue.dequeue());
// }

// Output:
// 1
// 2
// 5
// 4
// 3


/*************************** */
Linked list stores the data the same way the queue stores it that is in FIFO order.

So we will copy the elements in the linked list and then reverse the list and copy back the reversed elements back to the queue.

const reverseQueueUsingLinkedList = (queue, k) => {
    let n = queue.size();
 
    //If out of range then return the original queue
    if (k > n || k < 1) {
       return queue;
    }
 
    let ll = new linkedlist();
 
    //Move the n - k elements to first
    for (let i = 0; i < n - k; i++) {
       let k = queue.front();
       queue.enqueue(queue.dequeue());
    }
 
    //Copy the k elements to the linked list
    for (let i = 0; i < k; i++) {
       let k = queue.front();
       ll.append(k);
       queue.dequeue();
    }
 
    //Reverse the linkedlist and copy the reversed elements back to queue
    let reversedLL = reverseLL(ll.getHead());
    let current = reversedLL;
    while (current) {
      queue.enqueue(current.element);
      current = current.next;
    }
 
   return queue;
 };
 
 //Reverse linked list
 const reverseLL = (head) => {
   let current = head;
   let previous = null,
       next = null;
   while (current) {
      previous = current;
      current = current.next;
      previous.next = next;
      next = previous;
   }
 
    return next;
 };


 /*************************************** */

 let reverseQueue = (queue) => {
  
  //Use a stack to reverse the queue
  let stack = new Stack();
  
  //Push all the items of the queue to the stack
  while(!queue.isEmpty()){
    stack.push(queue.dequeue());
  }
  
  //Again push all the items from the stack into the queue
  while(!stack.isEmpty()){
    queue.enqueue(stack.pop());
  }
  
  return queue;
}


Input:
let queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.enqueue(4);
queue.enqueue(5);
queue.enqueue(6);
queue.enqueue(7);
queue.enqueue(8);
queue.enqueue(9);
queue.enqueue(10);
let reversed = reverseQueue(queue);
reversed.print();

Output:
"10,9,8,7,6,5,4,3,2,1"