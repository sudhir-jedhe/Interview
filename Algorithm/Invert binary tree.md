// Invert binary tree
// Given a binary tree, invert the binary tree - Inverting a binary tree means that the resulting binary tree should be a mirror replica of the input binary tree.

// Example
// Input
// Binary Tree
//                 1
//               /   \
//             2       3
//           /   \       \
//         4       5       7
//        /  \ 
//     8       9
// Output
// Binary Tree
//                 1
//               /   \
//             3       2
//           /       /   \
//         7       5       4
//                       /   \
//                     9       8
// Explanation
// The resulting output binary tree is an exact mirror replica of the given input binary tree. Hence, the output is an inverted binary tree.


// Time: O(N) | Space: O(n)
const invertBinaryTree = (tree) => {
    if (!tree) return null;
    let queue = [tree];
    while (queue.length) {
      let currentNode = queue.shift();
      let left = currentNode.left;
      let right = currentNode.right;
      currentNode.left = right;
      currentNode.right = left;
      if (left) queue.push(left);
      if (right) queue.push(right);
    }
    return tree;
  };
  
  
  // Driver Code
  class BinaryTree {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  const tree = new BinaryTree(1);
  tree.left = new BinaryTree(2);
  tree.right = new BinaryTree(3);
  tree.left.left = new BinaryTree(4);
  tree.left.right = new BinaryTree(5);
  tree.right.left = new BinaryTree(6);
  tree.right.right = new BinaryTree(7);
  tree.left.left.left = new BinaryTree(8);
  tree.left.left.right = new BinaryTree(9);
  
  
  console.log(invertBinaryTree(tree));
  

  /************************************************ */

  // Time: O(n) | Space: O(height)
const invertBinaryTree = (tree) => {
    if (!tree) return null;
    let left = invertBinaryTree(tree.left);
    let right = invertBinaryTree(tree.right);
    tree.left = right;
    tree.right = left;
    return tree;
  };
  
  // Driver Code
  class BinaryTree {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  const tree = new BinaryTree(1);
  tree.left = new BinaryTree(2);
  tree.right = new BinaryTree(3);
  tree.left.left = new BinaryTree(4);
  tree.left.right = new BinaryTree(5);
  tree.right.left = new BinaryTree(6);
  tree.right.right = new BinaryTree(7);
  tree.left.left.left = new BinaryTree(8);
  tree.left.left.right = new BinaryTree(9);
  
  
  console.log(invertBinaryTree(tree));
  

  /*********************************** */

  // Time: O(n) | Space: O(height)

const invertBinaryTree = (tree) => {
    if (!tree) return;
    swapLeftRight(tree);
    invertBinaryTree(tree.left);
    invertBinaryTree(tree.right);
    return tree;
  };
  
  const swapLeftRight = (tree) => {
    let left = tree.left;
    tree.left = tree.right;
    tree.right = left;
  };
  // Driver Code
  class BinaryTree {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  const tree = new BinaryTree(1);
  tree.left = new BinaryTree(2);
  tree.right = new BinaryTree(3);
  tree.left.left = new BinaryTree(4);
  tree.left.right = new BinaryTree(5);
  tree.right.left = new BinaryTree(6);
  tree.right.right = new BinaryTree(7);
  tree.left.left.left = new BinaryTree(8);
  tree.left.left.right = new BinaryTree(9);
  
  
  console.log(invertBinaryTree(tree));
  
  