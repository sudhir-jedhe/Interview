```js
// Input: N = 2, arr[] = {3, 0, 2, 1}
// Output: 1
// Explanation: Swap values 0 and 2, after that new array will be {3, 2, 0, 1} where 0 is adjacent to 1 and 2 is adjacent to 3.

// Input: N = 3, arr[] = {1, 0, 3, 2, 4, 5}
// Output: 0
// Explanations: Clearly all even number E is adjacent to E+1.

// Custom class to represent pairs
class Pair {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }

  hashCode() {
    return JSON.stringify([this.first, this.second]);
  }

  equals(obj) {
    if (this === obj) return true;
    if (obj == null || typeof obj !== "object" || obj.constructor !== Pair)
      return false;
    return this.first === obj.first && this.second === obj.second;
  }
}

// Initialize DSU
function make(i, parent) {
  parent.set(i, i);
}

// Find the parent of each component
function find(v, parent) {
  if (parent.get(v).equals(v)) return v;
  return find(parent.get(v), parent);
}

// Merge two components together
function Union(a, b, parent) {
  a = find(a, parent);
  b = find(b, parent);
  if (!a.equals(b)) {
    parent.set(b, a);
  }
}

// Solve the problem
function solve(arr, n) {
  let parent = new Map();

  // Initializing the DSU
  for (let i = 0; i < n; i++) {
    let p = new Pair(2 * i, 2 * i + 1);
    make(p, parent);
  }

  // For all vertices i and j
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      // Vertex formed by i
      let a = new Pair(2 * i, 2 * i + 1);

      // Vertex formed by j
      let b = new Pair(2 * j, 2 * j + 1);

      // Condition to find E and E+1 vertices
      if (
        arr[2 * i] / 2 === arr[2 * j] / 2 ||
        arr[2 * i] / 2 === arr[2 * j + 1] / 2 ||
        arr[2 * i + 1] / 2 === arr[2 * j] / 2 ||
        arr[2 * i + 1] / 2 === arr[2 * j + 1] / 2
      ) {
        // Union of valid vertices.
        Union(a, b, parent);
      }
    }
  }

  let comp = new Map();

  // Finding total unique components.
  for (let i = 0; i < n; i++) {
    let component = find(new Pair(2 * i, 2 * i + 1), parent);
    comp.set(component, (comp.get(component) || 0) + 1);
  }

  // n-unique components is our answer
  return n - comp.size;
}

// Driver function
let N = 2;
let arr = [3, 0, 2, 1];

// Function call
console.log(solve(arr, N));

// code contributed by shinjanpatra
