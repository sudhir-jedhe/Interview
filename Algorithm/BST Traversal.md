// BST Traversal
// Given a Binary Search Tree, Traverse the tree in Preorder, Postorder, and inorder traversal.

// Consider the following Binary Tree
// Binary Search Tree
//                 10
//               /   \
//             5       18
//           /   \       \
//         1       7      21
// Preorder Traversal
// When you traverse a tree in root->left->right fashion, it is called a preorder traversal. In the above example, the preorder traversal of the tree will be

// 10 5 1 7 18 21
// Postorder Traversal
// Here, the traversal order will be left->right->root. That is, left subtree is traversed first, then the the right subtree is traversed, and finally the root value is printed.

// The postorder traversal of the above tree will be

// 1 7 5 21 20 18 10 
// Inorder Traversal
// Here, the traversal order will be left->root->right. That is, left subtree is traversed first, then the root value is printed, and finally the right subtree is printed.

// The postorder traversal of the above tree will be

// 1 5 7 10 18 21 



function inOrderTraversal(tree) {
    if (!tree) return
    inOrderTraversal(tree.left)
    process.stdout.write(tree.value + ' ')
    inOrderTraversal(tree.right)
  }
  function preOrderTraversal(tree) {
    if (!tree) return
    process.stdout.write(tree.value + ' ')
    preOrderTraversal(tree.left)
    preOrderTraversal(tree.right)
  }
  
  function postOrderTraversal(tree) {
    if (!tree) return
    postOrderTraversal(tree.left)
    postOrderTraversal(tree.right)
    process.stdout.write(tree.value + ' ')
  }
  
  class BST {
    constructor(value) {
      this.left = null
      this.value = value
      this.right = null
    }
  
    insert(value) {
      // insert value into the tree
      let currentNode = this
      while (true) {
        if (value < currentNode.value) {
          if (currentNode.left === null) {
            currentNode.left = new BST(value)
            break
          } else {
            currentNode = currentNode.left
          }
        } else {
          if (currentNode.right === null) {
            currentNode.right = new BST(value)
            break
          } else {
            currentNode = currentNode.right
          }
        }
      }
      return this
    }
  }
  
  const tree = new BST(10)
  tree.insert(5)
  tree.insert(1)
  tree.insert(7)
  tree.insert(18)
  tree.insert(21)
  
  preOrderTraversal(tree)
  console.log("\n");
  postOrderTraversal(tree)
  console.log("\n");
  inOrderTraversal(tree)
  