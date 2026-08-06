// Input : [34, 3, 31, 98, 92, 23]
// Output : [3, 23, 31, 34, 92, 98]

// Input : [3, 5, 1, 4, 2, 8]
// Output : [1, 2, 3, 4, 5, 8]

// Javascript program to sort a stack using
// a auxiliary stack.

// This function return the sorted stack
function sortstack(input) {
  let tmpStack = [];
  while (input.length > 0) {
    // pop out the first element
    let tmp = input.pop();

    // while temporary stack is not empty and
    // top of stack is lesser than temp
    while (tmpStack.length > 0 && tmpStack[tmpStack.length - 1] < tmp) {
      // pop from temporary stack and
      // push it to the input stack
      input.push(tmpStack[tmpStack.length - 1]);
      tmpStack.pop();
    }

    // push temp in temporary of stack
    tmpStack.push(tmp);
  }
  return tmpStack;
}

let input = [];
input.push(34);
input.push(3);
input.push(31);
input.push(98);
input.push(92);
input.push(23);

// This is the temporary stack
let tmpStack = sortstack(input);
document.write("Sorted numbers are:" + "</br>");

while (tmpStack.length > 0) {
  document.write(tmpStack[tmpStack.length - 1] + " ");
  tmpStack.pop();
}
