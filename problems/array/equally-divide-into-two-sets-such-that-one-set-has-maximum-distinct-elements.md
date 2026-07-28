```js
// Input : arr[] = [1, 1, 2, 2, 3, 3]
// Output: 3
// Explanation:
// There are three different kinds of resources (1, 2 and 3), and two for each kind. Optimal distribution: Process P1 has resources [1, 2, 3] and the process P2 has gifts [1, 2, 3], too. Process p2 has 3 distinct resources.

// Input: arr[] = [1, 1, 2, 1, 3, 4]
// Output: 3
// Explanation:
// There are three different kinds of resources (1, 2, 3, 4), 3 instances of 1 and  single instances of resource 2, 3, 4. Optimal distribution: Process P1 has resources [1, 1, 1] and the process P2 has gifts [2, 3, 4].
// Process p2 has 3 distinct resources.

// Javascript program to equally divide n elements
// into two sets such that second set has
// maximum distinct elements.

function distribution(arr, n) {
  arr.sort((a, b) => a - b);
  var count = 1;
  for (var i = 1; i < n; i++) if (arr[i] > arr[i - 1]) count++;

  return Math.min(count, parseInt(n / 2));
}

// Driver code
var arr = [1, 1, 2, 1, 3, 4];
var n = arr.length;
document.write(distribution(arr, n));

/********************************************************* */

// Javascript program to equally divide n elements
// into two sets such that second set has
// maximum distinct elements.
function distribution(arr, n) {
  let resources = new Set();

  // Insert all the resources in the set
  // There will be unique resources in the set
  for (let i = 0; i < n; i++) resources.add(arr[i]);

  // return minimum of distinct resources
  // and n/2
  return Math.min(resources.size, parseInt(n / 2, 10));
}

let arr = [1, 1, 2, 1, 3, 4];
let n = arr.length;
document.write(distribution(arr, n) + "</br>");
