```js
Height of a binary tree
Height of a binary tree is the maximum depth of the tree. As you can see in the above diagram the height of it is 4 because it contains 4 levels of depth.

To find out the depth of the tree we will create an algorithm which will perform the following operations.

We will recursively find out the depth of the left sub tree and right sub tree.
Then get the max of both sides depth and return it.


const bstHeight = (node) => {
    //If null return 0
    if(node === null){
      return 0;
    }
    
    //Get left sub tree height
    const leftHeight = bstHeight(node.left);
    
    //Get right sub tree height
    const rightHeight = bstHeight(node.right);
    
    //Return the max of them
    return leftHeight > rightHeight ? leftHeight + 1 : rightHeight + 1;
  }


  Input:
const tree = new BinarySearchTree();
tree.insert(10);
tree.insert(7);
tree.insert(11);
tree.insert(8);
tree.insert(20);
tree.insert(12);
tree.insert(5);

const root = tree.getRoot();
console.log(bstHeight(root));

Output:
4

Width of binary and binary search tree
The width of a binary tree is the number of nodes present at the given level. So here we will see how we can find the width at each level and return the maximum width of the tree.

We will use two different methods to find the width of BST.

Find width at each level and the return the max among them.
We will first get the height of the tree and then find the width by recursively checking number of nodes at every level.

const bstWidth = (node, level) => {
    //If null return 0
    if(node === null){
      return 0;
    }
    
    //If at root level return 1
    if(level === 1) return 1;
    
    //Else recursively find the width at each level
    if(level > 1){
      return bstWidth(node.left, level - 1)  + bstWidth(node.right, level - 1);
    };
    
    return 0;
  }

  const maxBSTWidth = (node) => {
    let maxWidth = 0;
    let width, height = bstHeight(node);
    
    /* Get width of each level and compare  
    the width with maximum width so far */
    for(let i = 1; i <= height; i++)  
    { 
      width = bstWidth(node, i); 
      if (width > maxWidth) {
        maxWidth = width; 
      }
    } 
  
    return maxWidth; 
  }

  Input:
const tree = new BinarySearchTree();
tree.insert(10);
tree.insert(7);
tree.insert(11);
tree.insert(8);
tree.insert(20);
tree.insert(12);
tree.insert(5);

const root = tree.getRoot();
console.log(maxBSTWidth(root));

Output:
3


/***************************** */

const maxWidthUsingQueue = (node) => { 
    // Base case 
    if (node === null){ 
      return 0; 
    }
  
    // Initialize result 
    let maxwidth = 0; 
  
    // Do Level order traversal keeping  
    // track of number of nodes at every level 
    const q = new Queue(); 
    q.enqueue(node); 
  
    while (!q.isEmpty())  
    { 
      // Get the size of queue when the level order 
      // traversal for one level finishes 
      let count = q.size(); 
  
      // Update the maximum node count value 
      maxwidth = Math.max(maxwidth, count); 
  
      // Iterate for all the nodes in  
      // the queue currently 
      while (count > 0)  
      { 
        // Dequeue an node from queue 
        let temp = q.dequeue(); 
  
        // Enqueue left and right children  
        // of dequeued node 
        if (temp.left !== null)  
        { 
          q.enqueue(temp.left); 
        } 
  
        if (temp.right !== null)  
        { 
          q.enqueue(temp.right); 
        } 
  
        count--;
      } 
    } 
  
    return maxwidth; 
  }

  