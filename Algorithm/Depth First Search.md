// Depth First Search
// Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking. Implement Depth First Search for a given input tree.

// Example
// Input
// Binary Tree
//                 1
//               /   \
//             2       3
//           /   \       \
//         4       5       7
// Output
// Array
// DFS:  [ 1, 2, 4, 5, 3, 7 ]
// Explanation
// Since we are traversing the tree depth wise, the first thing we do is to traverse the tree till the bottom i.e. the from the root node to the extreme left leaf node. Oncce there are no children left, we backtrack and traverse the next set of leaf nodes.

// Keep in mind it is not the same as Breadth First Search, where we first traverse the siblings / neighbour nodes before we go to the depth.

const depthFirstSearch = (tree) => {
    const finalArray = []
    depthFirstSearchHelper(tree, finalArray)
    return finalArray
  }
  const depthFirstSearchHelper = (tree, array) => {
    if (!tree) return
    array.push(tree.value)
    depthFirstSearchHelper(tree.left, array)
    depthFirstSearchHelper(tree.right, array)
  }
  
  // driver code
  class BST {
    constructor(value) {
      this.left = null
      this.value = value
      this.right = null
    }
  }
  
  const tree = new BST(1)
  tree.left = new BST(2)
  tree.right = new BST(3)
  
  tree.left.left = new BST(4);
  tree.left.right = new BST(5);
  tree.right.right = new BST(7);
  
  console.log('DFS: ', depthFirstSearch(tree, 12))