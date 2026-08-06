/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function (root) {
    function dfs(root1, root2) {
        if (!root1 && !root2) return true;
        if (!root1 || !root2 || root1.val != root2.val) return false;
        return dfs(root1.left, root2.right) && dfs(root1.right, root2.left);
    }
    return dfs(root, root);
};


var isSameTree = function (p, q) {
    if (!p && !q) return true;
    if (p && q) {
        return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
    return false;
};



// 101. Symmetric Tree
// Description
// Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

 

// Example 1:



// Input: root = [1,2,2,3,4,4,3]
// Output: true
// Example 2:



// Input: root = [1,2,2,null,3,null,3]
// Output: false
 

// Constraints:

// The number of nodes in the tree is in the range [1, 1000].
// -100 <= Node.val <= 100
 

// Follow up: Could you solve it both recursively and iteratively?

// Solutions
// Solution 1: Recursion

// We design a function 
//  to determine whether two binary trees are symmetric. The answer is 
// .

// The logic of the function 
//  is as follows:

// If both 
//  and 
//  are null, then the two binary trees are symmetric, return true.
// If only one of 
//  and 
//  is null, or if 
// , then the two binary trees are not symmetric, return false.
// Otherwise, determine whether the left subtree of 
//  is symmetric to the right subtree of 
// , and whether the right subtree of 
//  is symmetric to the left subtree of 
// . Here we use recursion.
// The time complexity is 
// , and the space complexity is 
// . Here, 
//  is the number of nodes in the binary tree.