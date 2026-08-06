// Input : Queue[] = { 5, 1, 2, 3, 4 }
// Output : Yes
// Pop the first element of the given Queue i.e 5.
// Push 5 into the stack.
// Now, pop all the elements of the given Queue and push them to
// second Queue.
// Now, pop element 5 in the stack and push it to the second Queue.

// Input : Queue[] = { 5, 1, 2, 6, 3, 4 }
// Output : No
// Push 5 to stack.
// Pop 1, 2 from given Queue and push it to another Queue.
// Pop 6 from given Queue and push to stack.
// Pop 3, 4 from given Queue and push to second Queue.
// Now, from using any of above operation, we cannot push 5
// into the second Queue because it is below the 6 in the stack.

// Javascript Program to check if a queue
// of first n natural number can
// be sorted using a stack

let q = [];

// Function to check if given
// queue element can be sorted
// into another queue using a stack.
function checkSorted(n) {
  let st = [];
  let expected = 1;
  let fnt;

  // while given Queue
  // is not empty.
  while (q.length != 0) {
    fnt = q[0];
    q.shift();

    // if front element is
    // the expected element
    if (fnt == expected) expected++;
    else {
      // if stack is empty,
      // push the element
      if (st.length == 0) {
        st.push(fnt);
      }

      // if top element is less than
      // element which need to be
      // pushed, then return false.
      else if (st.length != 0 && st[st.length - 1] < fnt) {
        return false;
      }

      // else push into the stack.
      else st.push(fnt);
    }

    // while expected element are
    // coming from stack, pop them out.
    while (st.length != 0 && st[st.length - 1] == expected) {
      st.pop();
      expected++;
    }
  }

  // if the final expected element
  // value is equal to initial Queue
  // size and the stack is empty.
  if (expected - 1 == n && st.length == 0) return true;

  return false;
}

q.push(5);
q.push(1);
q.push(2);
q.push(3);
q.push(4);

let n = q.length;

if (checkSorted(n)) document.write("Yes");
else document.write("No");
