// JavaScript program to print DFS
// traversal from a given
// graph

// This class represents a
// directed graph using adjacency
// list representation
class Graph {
  // Constructor
  constructor(v) {
    this.V = v;
    this.adj = new Array(v).fill([]);
  }

  // Function to Add an edge into the graph
  AddEdge(v, w) {
    this.adj[v].push(w); // Add w to v's list.
  }

  // A function used by DFS
  DFSUtil(v, visited) {
    // Mark the current
    // node as visited and print it
    visited[v] = true;
    console.log(v + " ");

    // Recur for all the
    // vertices adjacent to this
    // vertex
    for (const n of this.adj[v]) {
      if (!visited[n]) this.DFSUtil(n, visited);
    }
  }

  // The function to do
  // DFS traversal. It uses recursive
  // DFSUtil()
  DFS() {
    // Mark all the vertices as not visited(set as
    var visited = new Array(this.V).fill(false);

    // Call the recursive helper
    // function to print DFS
    // traversal starting from
    // all vertices one by one
    for (var i = 0; i < this.V; ++i)
      if (visited[i] == false) this.DFSUtil(i, visited);
  }
}

// Driver Code
var g = new Graph(4);

g.AddEdge(0, 1);
g.AddEdge(0, 2);
g.AddEdge(1, 2);
g.AddEdge(2, 0);
g.AddEdge(2, 3);
g.AddEdge(3, 3);

console.log("Following is Depth First Traversal<br>");

g.DFS();

// This code is contributed by rdtank.
