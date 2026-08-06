// Ques 2 : Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
//          determine if the input string is valid.
// Open brackets must be closed by the same type of brackets.
// Open brackets must be closed in the correct order.
// Every close bracket has a corresponding open bracket of the same type.

// Input: "()"             ----->>>>>        Output: true
// Input: "([]{})"         ----->>>>>        Output: true
// Input: "(]"             ----->>>>>        Output: false

function isValid(s) {
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else if (char === ")" || char === "]" || char === "}") {
      if (isEmpty(stack)) {
        return false;
      }

      const top = stack.pop();
      if (
        (char === ")" && top !== "(") ||
        (char === "]" && top !== "[") ||
        (char === "}" && top !== "{")
      ) {
        return false;
      }
    }
  }

  return isEmpty(stack);
}

function isEmpty(stack) {
  return stack.length === 0;
}

const string1 = "([{})";
console.log(isValid(string1));

// Time Complexity = O(n)
// Space Complexity = O(n)


/********************************* */

function isValid(s) {
  const stack = [];
  const pairs = {
      ')': '(',
      '}': '{',
      ']': '['
  };
  
  for (let char of s) {
      if (char === '(' || char === '{' || char === '[') {
          stack.push(char);
      } else if (char === ')' || char === '}' || char === ']') {
          let top = stack.pop();
          if (pairs[char] !== top) {
              return false;
          }
      }
  }
  
  return stack.length === 0;
}

// Test cases
console.log(isValid("()")); // Output: true
console.log(isValid("()[]{}")); // Output: true
console.log(isValid("(]")); // Output: false
console.log(isValid("([)]")); // Output: false
console.log(isValid("{[]}")); // Output: true


/**************************************** */

function isValidParentheses(str) {
  const stack = [];
  const opening = { '(': ')', '{': '}', '[': ']' };
  const closing = ')', '}', ']';

  for (let char of str) {
    if (opening[char]) {
      // Push opening brackets onto the stack
      stack.push(opening[char]);
    } else if (closing.includes(char)) {
      // Check if the closing bracket matches the top element on the stack
      const expectedClosing = stack.pop();
      if (char !== expectedClosing) {
        return false;
      }
    }
  }

  // Ensure all opening brackets have a matching closing bracket
  return stack.length === 0;
}

// Examples
console.log(isValidParentheses("()")); // Output: true
console.log(isValidParentheses("([)]")); // Output: false
console.log(isValidParentheses("{[]}()")); // Output: true
