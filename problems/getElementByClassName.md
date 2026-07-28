```js
function findByClass(class) {
    // get the root element,
    // you can start from the body
    const root = document.body;
    
    // helper function to perform a search using dfs
    function search(node) {
      // store the result
      let result = [];
      
      // if the class name is present in the class list of the element
      // add the element in the result
      if(node.classList.contains(class)) {
         result.push(node);
      }
     
      // for all the children of the element 
      // recursively search and check if the class is present
      for (const element of node.children) {
        // recursively search
        const res = search(element);
        
        // add the result from the recursive 
        // search to the actual result
        result = result.concat(res);
      }
      
      // return the result
      return result;
    }
    
    // initiate the search and return the result
    return search(root);
  }



  Input:
<div class='a' id="root">
  <div class='b' id='b-1'>
    <div class='a' id='a-2'>
      <div class='d' id='d-1'></div>
    </div>
    <div class='c' id='c-1'>
      <div class='a' id='a-3'>
        <div class='d' id='d-2'></div>
      </div>
    </div>
  </div>
</div>

console.log(findByClass('a'));

Output:
[<div class="a" id="root">
  <div class="b" id="b-1">
    <div class="a" id="a-2">
      <div class="d" id="d-1"></div>
    </div>
    <div class="c" id="c-1">
      <div class="a" id="a-3">
        <div class="d" id="d-2"></div>
      </div>
    </div>
  </div>
</div>,
<div class="a" id="a-2">
      <div class="d" id="d-1"></div>
</div>,
<div class="a" id="a-3">
       <div class="d" id="d-2"></div>
</div>
]