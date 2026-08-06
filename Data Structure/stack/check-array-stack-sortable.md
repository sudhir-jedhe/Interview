// Input : A[] = { 3, 2, 1 }
// Output : YES
// Explanation :
// Step 1: Remove the starting element of array A[]
//         and push it in the stack S. ( Operation 1)
//         That makes A[] = { 2, 1 } ; Stack S = { 3 }
// Step 2: Operation 1
//         That makes A[] = { 1 } Stack S = { 3, 2 }
// Step 3: Operation 1
//         That makes A[] = {} Stack S = { 3, 2, 1 }
// Step 4: Operation 2
//         That makes Stack S = { 3, 2 } B[] = { 1 }
// Step 5: Operation 2
//         That makes Stack S = { 3 } B[] = { 1, 2 }
// Step 6: Operation 2
//         That makes Stack S = {} B[] = { 1, 2, 3 }

// Input : A[] = { 2, 3, 1}
// Output : NO

// Remove the starting element of array A[] and push it into the stack.
// Remove the top element of the stack S and append it to the end of array B.

// JS implementation of above approach.

// Function to check if A[] is
// Stack Sortable or Not.
function check(A, N) {
  // Stack S
  let S = [];

  // Pointer to the end value of array B.
  let B_end = 0;

  // Traversing each element of A[] from starting
  // Checking if there is a valid operation
  // that can be performed.
  for (let i = 0; i < N; i++) {
    // If the stack is not empty
    if (S.length != 0) {
      // Top of the Stack.
      let top = S[0];

      // If the top of the stack is
      // Equal to B_end+1, we will pop it
      // And increment B_end by 1.
      while (top == B_end + 1) {
        // if current top is equal to
        // B_end+1, we will increment
        // B_end to B_end+1
        B_end = B_end + 1;

        // Pop the top element.
        S.shift();

        // If the stack is empty We cannot
        // further perform this operation.
        // Therefore break
        if (S.length == 0) {
          break;
        }

        // Current Top
        top = S[0];
      }

      // If stack is empty
      // Push the Current element
      if (S.length != 0) {
        S.push(A[i]);
      } else {
        top = S[0];

        // If the Current element of the array A[]
        // if smaller than the top of the stack
        // We can push it in the Stack.
        if (A[i] < top) {
          S.push(A[i]);
        }
        // Else We cannot sort the array
        // Using any valid operations.
        else {
          // Not Stack Sortable
          return false;
        }
      }
    } else {
      // If the stack is empty push the current
      // element in the stack.
      S.push(A[i]);
    }
  }

  // Stack Sortable
  return true;
}

// Driver's Code
let A = [4, 1, 2, 3];
let N = A.length;
check(A, N) ? console.log("YES") : console.log("NO");

// This code is contributed by adityamaharshi21
