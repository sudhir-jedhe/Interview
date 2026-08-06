// Write a function that implements the breadth-first search (BFS) algorithm
//  on a directed graph (in adjacency list format), given a starting node.
// BFS is an algorithm used for traversing a graph or a tree, starting from the root
// node and exploring all the neighbors at the current depth before moving
// on to nodes at the next depth level. The output from BFS is an array of
// the graph's nodes in the order they were traversed. Visiting neighboring
// nodes in any order is a valid BFS, but for this question,
// please visit each node's neighbors from left to right.


Examples
const graph1 = {
  A: ['B', 'C', 'D'],
  B: ['E', 'F'],
  C: ['G', 'H'],
  D: ['I', 'J'],
  E: ['D'],
  F: [],
  G: [],
  H: [],
  I: [],
  J: [],
};

breadthFirstSearch(graph1, 'A'); // ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

        A
      / | \
     B  C  D
   / |   |   | \
  E  F   G   H  I
         |
         J

breadthFirstSearch(graph1, 'B'); // ['B', 'E', 'F', 'D', 'I', 'J']

    B
   / \
  E   F
  |
  D
 / \
I   J


const graph2 = {
  'A': ['B', 'C'],
  'B': ['D', 'E'],
  'C': ['F', 'G'],
  'D': [],
  'E': [],
  'F': [],
  'G': [],
};

breadthFirstSearch(graph2, 'A')); // ['A', 'B', 'C', 'D', 'E', 'F', 'G']

       A
     /   \
    B     C
  /  \   /   \
 D   E  F    G

breadthFirstSearch(graph2, 'E')); // ['E']

// Recap (Hint)
// Breadth-first search (BFS) is an algorithm used for traversing a graph or a tree. Here is an overview of how BFS works to traverse a graph, using the standard implementation that takes in an adjacency list (we use an array instead) and the root node:

// Initialize a queue to store nodes to be visited. Enqueue the root node.
// Initialize a set to track visited nodes.
// Enter a loop that continues until the queue is empty. In each iteration of the loop:
// Dequeue from the queue and mark it as visited.
// Retrieve the neighbors of the node from the input graph.
// For each neighbor, check if it has been visited. If it has not been visited, enqueue the node.
// Return the set of visited nodes.