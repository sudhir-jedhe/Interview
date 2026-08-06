// Two stacks declared in the form of plain array
let stack1 = [];
let stack2 = [];

// Method that will perform our enqueue operation
function enqueue(element) {
  stack1.push(element);
  console.log("Stack-1 elements are enqueue: ", stack1);
}

// Method that will perform our dequeue operation
function dequeue() {
  if (stack2.length === 0) {
    if (stack1.length === 0) {
      console.log("Dequeue not possible because queue is empty..");
    }
    while (stack1.length > 0) {
      let x = stack1.pop();
      stack2.push(x);
    }
  }
  console.log("Element after Dequeue: " + stack2.pop());
}

enqueue("a");
enqueue("b");
enqueue("c");
dequeue();
dequeue();

// Stack-1 elements are enqueue:  [ 'a' ]
// Stack-1 elements are enqueue:  [ 'a', 'b' ]
// Stack-1 elements are enqueue:  [ 'a', 'b', 'c' ]
// Element after Dequeue: a
// Element after Dequeue: b

/************************************************************************************* */

// Two stacks declared in array form
let stack1 = [];
let stack2 = [];

// Method to implement enqueue operation
function enqueue(element) {
  // if dequeue was called before actual
  // enqueue operation
  if (stack2.length > 0) {
    let len = stack2.length;
    for (let i = 0; i < len; i++) {
      let p = stack2.pop();
      stack1.push(p);
    }
  }
  stack1.push(element);
  console.log("Elements after Enqueue: ", stack1);
}

// Method to implement dequeue operation......
function dequeue() {
  // If dequeue was called consecutively, all
  // the elements would be in stack2
  if (stack2.length > 0) {
    console.log("Element after dequeue : " + stack2.pop());
  }

  // If enqueue was called right before
  // this dequeue, stack2 is empty
  else if (stack2.length === 0) {
    if (stack1.length === 0) {
      // If the first operation is
      // dequeue itself
      console.log("Queue is empty");
    } else if (stack1.length === 1) {
      // If a single operation as
      // enqueue was performed
      console.log(stack1.pop());
    }

    // If enqueue was called before this
    // operation, all the elements are in
    // stack1, so pop them and push the
    // elements into stack2, then pop()
    else if (stack1.length > 0) {
      let len = stack1.length;
      for (let i = 0; i < len; i++) {
        let p = stack1.pop();
        stack2.push(p);
      }
      console.log("Element after dequeue: " + stack2.pop());
    }
  }
}
enqueue("a");
enqueue("b");
enqueue("c");
dequeue();
enqueue("d");
enqueue("e");
dequeue();
dequeue();
dequeue();
enqueue("f");

// Elements after Enqueue:  [ 'a' ]
// Elements after Enqueue:  [ 'a', 'b' ]
// Elements after Enqueue:  [ 'a', 'b', 'c' ]
// Element after dequeue: a
// Elements after Enqueue:  [ 'b', 'c', 'd' ]
// Elements after Enqueue:  [ 'b', 'c', 'd', 'e' ]
// Element after dequeue: b
// Element after dequeue : c
// Element after dequeue : d
