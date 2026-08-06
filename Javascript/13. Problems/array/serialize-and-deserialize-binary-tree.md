```js
Input:
          15
         /  \
	/    \
       10     20
              / \
             /   \
            16   25

Output:
Serialzied: 
[15, 10, null, null, 20, 16, null, null, 25, null, null] 
              or 
[15, 10, 20, null, null, 16, 25]

Deserialized:
          15
         /  \
	/    \
       10     20
              / \
             /   \
            16   25




            const serializeIterative = (root) => {
                const res = [];
                //create a queue
                const queue = root ? [root] : [];
                
                //Iterate the queue
                while (queue.length) {
                    //Get the top node
                    let node = queue.shift();
                    
                    //If node exists
                    if (node) {
                        //Push the node value
                        res.push(node.val);
                        
                        //Add the left and right child
                        queue.push(node.left || null);
                        queue.push(node.right || null);
                    } else {
                        //Else push null
                        res.push(null);
                    }
                }
                
                //Remove the trailing nulls to optimize it further
                while (res[res.length - 1] === null){ 
                  res.pop(); 
                }
              
                return res;
            };


            Input:
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

const tree = new Node(1);  
tree.left = new Node(2);  
tree.right = new Node(3);   
tree.right.left = new Node(4);  
tree.right.right = new Node(5);

console.log(serializeIterative(tree));

Output:
[1, 2, 3, null, null, 4, 5]



/*************************** */
const serializeRecursive = (root) => {
    // array
    let res = [];

    // recursive function to perform pre order traversal on Binary Tree
    function traversal(node) {
        // check for the first null value
        if(node === null) {
            res.push(null);
            return;
        }

        res.push(node.val);
        traversal(node.left);
        traversal(node.right)
    }

    // start the Traversal
    traversal(root);
  
    return res; 
};


/************************************* */
const deserializeIterative = (arr) => {
    //Base case
    if (!arr.length){ 
      return null;
    }
    
    //Create the root from first value
    const root = new Node(arr.shift());
    
    //Create the queue
    const queue = [root];
  
    //Iterate the queue
    while (queue.length) {
        let node = queue.shift(), val;
        
        //Set the left and right child values
        node.left = (val = arr.shift()) || val === 0 ? new Node(val) : null;
        node.right = (val = arr.shift()) || val === 0 ? new Node(val) : null;
        
        //Add the left and right child to the queue
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
  
    //return the tree
    return root;
};


Input:
console.log(deserializeIterative([15, 10, 20, null, null, 16, 25]));

Output:
          15
         /  \
	    /    \
       10     20
              / \
             /   \
            16   25


            const deserializeRecursive = (arr) => {
                // recursive function
                function reverseTraversal() {
            
                    // check for null or empty value
                    if(arr.length == 0) {
                        return ;
                    }
            
                    // Remove the root node or first element
                    const val = arr.shift();
            
                    // check for the null and return null
                    if(val == null) return null;
            
                    // Create a new Tree Node
                    let node = new Node(val);
            
                    // First check for left elements in tree
                    node.left = reverseTraversal();
            
                    // Second check for right elements in tree
                    node.right = reverseTraversal();
            
                    // Return the node
                    return node;
                }
            
                return reverseTraversal();
            };


            Input:
console.log(deserializeRecursive([15, 10, null, null, 20, 16, null, null, 25, null, null]));

Output:
          15
         /  \
	/    \
       10     20
              / \
             /   \
            16   25