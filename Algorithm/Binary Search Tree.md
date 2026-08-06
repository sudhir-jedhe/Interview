/**
 * Problem: Construct a Binary Search Tree and implement `insert`, `search`, `traverse` and `delete`
 */

```js
class BST {
    constructor(value) {
      this.left = null;
      this.value = value;
      this.right = null;
    }
  
    traverse() {
      // PREORDER: root, left, right
      let currentNode = this;
      if (currentNode === null) {
        return;
      }
      console.log(currentNode.value);
      currentNode.left && currentNode.left.traverse();
      currentNode.right && currentNode.right.traverse();
    }
  
    insert(value) {
      // insert value into the tree
      let currentNode = this;
      while (true) {
        if (value < currentNode.value) {
          if (currentNode.left === null) {
            currentNode.left = new BST(value);
            break;
          } else {
            currentNode = currentNode.left;
          }
        } else {
          if (currentNode.right === null) {
            currentNode.right = new BST(value);
            break;
          } else {
            currentNode = currentNode.right;
          }
        }
      }
      return this;
    }
  
    search(value) {
      // search for value in the tree
      let currentNode = this;
      while (currentNode !== null) {
        if (value < currentNode.value) {
          currentNode = currentNode.left;
        } else if (value > currentNode.value) {
          currentNode = currentNode.right;
        } else {
          return currentNode;
        }
      }
      return null;
    }
  
    delete(value, parentNode = null) {
      // delete value from the tree
      let currentNode = this;
      while (currentNode !== null) {
        if (value < currentNode.value) {
          parentNode = currentNode;
          currentNode = currentNode.left;
        } else if (value > currentNode.value) {
          parentNode = currentNode;
          currentNode = currentNode.right;
        } else {
          // meaty case
          if (currentNode.left !== null && currentNode.right !== null) {
            currentNode.value = currentNode.right.getMinValue();
            currentNode.right.delete(currentNode.value, currentNode);
          } else if (parentNode === null) {
            if (currentNode.left !== null) {
              currentNode.value = currentNode.left.value;
              currentNode.right = currentNode.left.right;
              currentNode.left = currentNode.left.left;
            } else if (currentNode.right !== null) {
              currentNode.value = currentNode.right.value;
              currentNode.left = currentNode.right.left;
              currentNode.right = currentNode.right.right;
            } else {
              // single node tree - do nothing
            }
          } else if (parentNode.left === currentNode) {
            parentNode.left =
              currentNode.left !== null ? currentNode.left : currentNode.right;
          } else if (parentNode.right === currentNode) {
            parentNode.right =
              currentNode.left !== null ? currentNode.left : currentNode.right;
          }
          break;
        }
      }
      return this;
    }
    getMinValue() {
      let currentNode = this;
      while (currentNode.left !== null) {
        currentNode = currentNode.left;
      }
      return currentNode.value;
    }
  }
  
  const tree = new BST(10);
  tree.insert(5);
  tree.insert(15);
  tree.insert(2);
  tree.insert(5);
  tree.insert(13);
  tree.insert(22);
  tree.insert(1);
  tree.insert(14);
  tree.traverse();
  ```
//   BST Construction
// Construct a Binary Search Tree and implement that implementsinsert(), search(), traverse() and delete() methods.

// Binary Search Tree is a node-based binary tree data structure which has the following properties:

// The left subtree of a node contains only nodes with keys lesser than the node's key.
// The right subtree of a node contains only nodes with keys greater than the node's key.
// The left and right subtree each must also be a binary search tree.
// Tasks
// Create a Binary Search Tree class.
// Create an insert() method - that inserts a new node in the Binary Search Tree.
// Create an delete() method - that deletes a new node from the Binary Search Tree.
// Create a traverse() method - that traverses the Binary Search Tree in preorder traversal.
// Create a search() method - that searches for a target value in the Binary Search Tree. If the element is present, return true. Otherwise, return false.
// Example
// const tree = new BST(10);
// tree.insert(5);
// tree.insert(15);
// tree.insert(2);
// tree.insert(5);
// tree.insert(13);
// tree.insert(22);
// tree.insert(1);
// tree.insert(14);
// tree.traverse();
// Output:
// 10 5 2 1 5 15 13 14 22