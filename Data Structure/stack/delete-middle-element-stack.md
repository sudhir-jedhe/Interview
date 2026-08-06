// Input  : Stack[] = [1, 2, 3, 4, 5]
// Output : Stack[] = [1, 2, 4, 5]

// Input  : Stack[] = [1, 2, 3, 4, 5, 6]
// Output : Stack[] = [1, 2, 4, 5, 6]

let st = [];
st.push("1");
st.push("2");
st.push("3");
st.push("4");
st.push("5");
st.push("6");
st.push("7");

let v = [];

while (st.length > 0) {
  v.push(st[0]);
  st.shift();
}

let n = v.length;

if (n % 2 == 0) {
  let target = Math.floor(n / 2);
  for (let i = 0; i < n; i++) {
    if (i == target) {
      continue;
    }
    st.push(v[i]);
  }
} else {
  let target = Math.floor(n / 2);
  for (let i = 0; i < n; i++) {
    if (i == target) {
      continue;
    }
    st.push(v[i]);
  }
}

console.log("Printing stack after deletion of middle: ");

while (st.length > 0) {
  let p = st[0];
  st.shift();
  console.log(p + " ");
}

// The code is contributed by Nidhi goel.

/****************************************************************** */

// Javascript code to delete middle of a stack
// without using additional data structure.

// Deletes middle of stack of size
// n. Curr is current item number
function deleteMid(st, n, curr) {
  // If stack is empty or all items
  // are traversed
  if (st.length == 0 || curr == n) return;

  // Remove current item
  let x = st[st.length - 1];
  st.pop();

  // Remove other items
  deleteMid(st, n, curr + 1);

  // Put all items back except middle
  if (curr != parseInt(n / 2, 10)) st.push(x);
}

let st = [];

// push elements into the stack
st.push("1");
st.push("2");
st.push("3");
st.push("4");
st.push("5");
st.push("6");
st.push("7");

deleteMid(st, st.length, 0);

// Printing stack after deletion
// of middle.
while (st.length > 0) {
  let p = st[st.length - 1];
  st.pop();
  document.write(p + " ");
}

/*************************************************** */
// JS code to delete middle of a stack with iterative method

// Deletes middle of stack of size n. Curr is current item number
function deleteMid(st) {
  let n = st.length;
  let tempSt = [];
  let count = 0;

  // Put first n/2 element of st in tempSt
  while (count < n / 2 - 1) {
    let c = st[0];
    st.shift();
    tempSt.unshift(c);
    count++;
  }

  // Delete middle element
  st.shift();

  // Put all (n/2) element of tempSt in st
  while (tempSt.length != 0) {
    st.unshift(tempSt[0]);
    tempSt.shift();
  }
}

// Driver Code
let st = [];

// unshift elements into the stack
st.unshift("1");
st.unshift("2");
st.unshift("3");
st.unshift("4");
st.unshift("5");
st.unshift("6");
st.unshift("7");
deleteMid(st);

// Printing stack after deletion of middle.

while (st.length != 0) {
  let p = st[0];
  st.shift();
  console.log(p, " ");
}
// This code is added by adityamaharshi21
