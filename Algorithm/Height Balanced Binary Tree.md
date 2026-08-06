// Height Balanced Binary Tree
// Given a pointer to the root node of a binary tree, return true if the binary tree is height balanced.

// A height-balanced binary tree is a Binary tree in which the difference between the left subtree height and the right subtree height is at most 1.

// Height of a binary tree is the number of edges between the root node to the longest leaf node.

// NOTE: If the root node is height balanced in a binary tree, that does not ensure that the entire binary tree is height balanced.

// Example
// Input binary tree

// Output
// true
// Explanation
// At any point or node in the given binary tree, the maximum difference of the height does not exceed 1. That is, Height(left subtree) - Height (right subtree) <= 1 at all the nodes.

// Example
// Input binary tree

// Output
// false
// Explanation
// Consider node 5: The height of the Right subtree is 2 and the height of the Left subtree is 0. The difference comes out to be 2. Hence the given binary tree is not height balanced.

function heightBalancedBinaryTree(tree) {
    let treeInfo = heightBalancedBinaryTreeHelper(tree)
    console.log(treeInfo)
  
    return treeInfo.isBalanced
  }
  
  const heightBalancedBinaryTreeHelper = (tree) => {
    if (!tree) {
      return new TreeInfo(true, -1)
    }
  
    let leftSubtreeInfo = heightBalancedBinaryTreeHelper(tree.left)
    let rightSubtreeInfo = heightBalancedBinaryTreeHelper(tree.right)
  
    let isBalanced =
      leftSubtreeInfo.isBalanced &&
      rightSubtreeInfo.isBalanced &&
      Math.abs(leftSubtreeInfo.height - rightSubtreeInfo.height) <= 1
  
    let height = Math.max(leftSubtreeInfo.height, rightSubtreeInfo.height) + 1
  
    return new TreeInfo(isBalanced, height)
  }
  
  class TreeInfo {
    constructor(isBalanced, height) {
      this.isBalanced = isBalanced
      this.height = height
    }
  }
  
  // Driver code
  class BinaryTree {
    constructor(val) {
      this.left = null
      this.right = null
      this.val = val
    }
  }
  let tree = new BinaryTree(1)
  tree.left = new BinaryTree(2)
  tree.right = new BinaryTree(3)
  tree.right.right = new BinaryTree(6)
  tree.left.left = new BinaryTree(4)
  tree.left.right = new BinaryTree(5)
  tree.left.right.left = new BinaryTree(6)
  tree.left.right.right = new BinaryTree(7)
  console.log(heightBalancedBinaryTree(tree))
  