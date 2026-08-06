```js
Input: "( p((q)) ((s)t) )";
("b) (c) ()");

Output: 3 - 1;

let maximumDepth = (str) => {
  //Keep track of the current max and total max
  let max = 0;
  let total_max = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      max++;

      //If current max is greater than total max then update
      if (max > total_max) {
        total_max = max;
      }
    } else if (str[i] == ")") {
      //Check for balanced parentheses
      if (max > 0) {
        max--;
      } else {
        return -1;
      }
    }
  }

  //Again check for balanced parentheses
  if (max != 0) {
    return -1;
  }

  //Return total
  return total_max;
};

Input: console.log(maximumDepth("( a(b) (c) (d(e(f)g)h) I (j(k)l)m)"));
console.log(maximumDepth("( p((q)) ((s)t) )"));
console.log(maximumDepth(" "));
console.log(maximumDepth("b) (c) ()"));

Output: 4;
3;
0 - 1;
/*************************** */

let maximumDepthWithStack = (str) => {
  //Keep track of the current max and total max
  let max = 0;
  let total_max = 0;
  let stack = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      max++;

      //Push '(' in stack
      stack.push("(");

      //If current max is greater than total max then update
      if (max > total_max) {
        total_max = max;
      }
    } else if (str[i] == ")") {
      //Check for balanced parentheses
      let open = stack.pop();

      if (max > 0 && open == "(") {
        max--;
      } else {
        return -1;
      }
    }
  }

  //Again check for balanced parentheses
  if (stack.length != 0) {
    return -1;
  }

  //Return total
  return total_max;
};

Input: console.log(maximumDepthWithStack("( a(b) (c) (d(e(f)g)h) I (j(k)l)m)"));
console.log(maximumDepthWithStack("( p((q)) ((s)t) )"));
console.log(maximumDepthWithStack(" "));
console.log(maximumDepthWithStack("b) (c) ()"));

Output: 4;
3;
0 - 1;
```
