```js
Given a binary tree we have to arrange all the elements of it to the right node of the parent node such that the new tree looks like a linked list and do this in place.

Input:
    1
   / \
  2   5
 / \   \
3   4   6

Output:
1
 \
  2
   \
    3
     \
      4
       \
        5
         \
          6


          Traverse the binary tree using pre-order traversal and store each element in the queue.
Then iterate the queue and add them to the right of the parent node in binary tree.


const flatten = (root) => {
    const head = root;
    let queue = [];
    
    //To create new element
    class Node {
      constructor(key){
        this.key = key,
        this.left = null,
        this.right = null
      }
    }
    
    //Store each element of tree in a queue using pre-order traversal
    (function traverse(root){
        if (!root) return;
      
        queue.push(root.key);
        traverse(root.left)
        traverse(root.right)
    }(head));
    
    //Update all the elements to the right
    (function change(root){
        if (!root) return;
        
        queue.shift();
        root.right = root.left = null;
        while(queue.length) {
            const val = queue.shift();
            root.right = new Node(val);
            root = root.right;
        }
    }(root));
};

Input:
const tree = new BST();
tree.insert(11);
tree.insert(7);
tree.insert(15);
tree.insert(5);
tree.insert(3);
tree.insert(9);
const root = tree.getHead();
flatten(root);
console.log(root);

Output:
11
 \
  7
   \
    5
     \
      3
       \
        9
         \
          15



          /*********************************************** */

          const flatten = (root) => { 
            (function dfs(root, newTail = null) {
                if (!root) return newTail;
                
                //Traverse the list with DFS
                const right = dfs(root.right, newTail) || newTail;
                const left = dfs(root.left, right);
                
                //Flatten the tree
                root.right = left;
                root.left = null;
          
                return root;
            }(root))
          }