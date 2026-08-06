function generateParenthesis(n) {
    const result = [];
    
    function backtrack(combination, open, close) {
        if (combination.length === 2 * n) {
            result.push(combination);
            return;
        }
        
        if (open < n) {
            backtrack(combination + '(', open + 1, close);
        }
        
        if (close < open) {
            backtrack(combination + ')', open, close + 1);
        }
    }
    
    backtrack('', 0, 0);
    
    return result;
}

// Test cases
console.log(generateParenthesis(3)); // Output: ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis(1)); // Output: ["()"]


/**************************** */
function generateParenthesis(n) {
    const result = [];
    function backtrack(currStr = "", open = 0, close = 0) {
      if (currStr.length === n * 2) {
        result.push(currStr);
        return;
      }
  
      if (open < n) {
        backtrack(currStr + "(", open + 1, close);
      }
  
      if (close < open) {
        backtrack(currStr + ")", open, close + 1);
      }
    }
  
    backtrack();
    return result;
  }
  
  // Examples
  console.log(generateParenthesis(3)); // Output: ["((()))","(()())","(())()","()(())","()()()"]
  console.log(generateParenthesis(1)); // Output: ["()"]
  