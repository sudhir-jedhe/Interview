A **`SyntaxError`** in JavaScript is thrown when the JavaScript engine tries to read your code but encounters something that violates the strict grammar rules of the language.

Unlike the other errors (which happen *while* the code is running), a `SyntaxError` usually happens during the **parsing phase**. This means that if there is a syntax error in your script, the code will fail to execute entirely.

Here are the most common causes of a `SyntaxError` and how to fix them:

## 1. Missing or Mismatched Brackets and Parentheses

The most frequent cause of a syntax error is simply forgetting to close a parenthesis `()`, a curly brace `{}`, or a square bracket `[]`.

```javascript
// Throws SyntaxError: Unexpected token '{'
if (true {
  console.log("Hello");
}

// Throws SyntaxError: missing ) after argument list
console.log("Missing a parenthesis";

```

**Fix:** Always ensure that every opening bracket or parenthesis has a matching closing counterpart. Modern code editors (like VS Code) will color-code your brackets to help you spot missing ones.

## 2. Mismatched Quotes

If you start a string with a single quote `'` but try to end it with a double quote `"`, or if you forget to close the quote altogether, the engine will fail to parse the code.

```javascript
// Throws SyntaxError: Invalid or unexpected token
let greeting = "Hello World!'; 

// Throws SyntaxError: Invalid or unexpected token
let message = 'This string never ends

```

**Fix:** Ensure your quotes match exactly (`""`, `''`, or ````). If you need a multi-line string, you must use backticks (template literals).

## 3. Missing Commas in Objects or Arrays

When defining an object or an array, you must separate each item or key-value pair with a comma. Forgetting one will confuse the parser.

```javascript
// Throws SyntaxError: Unexpected identifier
const user = {
  name: "Alice"
  age: 30
};

```

**Fix:** Add the missing comma between the properties.

```javascript
const user = {
  name: "Alice",
  age: 30
};

```

## 4. Invalid Variable Names

JavaScript has strict rules about what you can name a variable. A variable name cannot start with a number, and it cannot include spaces or hyphens.

```javascript
// Throws SyntaxError: Invalid or unexpected token
let 1stPlace = "John"; 

// Throws SyntaxError: Unexpected token '-'
let first-name = "Alice"; 

```

**Fix:** Start variable names with a letter, an underscore `_`, or a dollar sign `$`. Use camelCase instead of hyphens (e.g., `firstName` or `firstPlace`).

## 5. Using Reserved Keywords

JavaScript has a list of "reserved words" that are built into the language (like `if`, `for`, `let`, `return`, `class`, etc.). You cannot use these words as variable names.

```javascript
// Throws SyntaxError: Unexpected token 'return'
let return = "Success"; 

// Throws SyntaxError: let is disallowed as a lexically bound name
const let = 5; 

```

**Fix:** Choose a descriptive variable name that is not part of the core JavaScript language (e.g., `let returnStatus = "Success";`).

Occur during code parsing when the code breaks the language rules. The code will fail to execute entirely.

```javascript
// Example 1: Missing closing bracket or parenthetical
if (true {
  console.log("Missing parenthesis");
}

// Example 2: Unexpected token / invalid variable name
const 123variable = "Invalid name";

// Example 3: Unmatched closing brace/bracket
function test() {
  console.log("Hello");
}}

// Example 4: Invalid destructuring assignment target
const { a, b } = null = 5;

// Example 5: Reserved keywords used as variable names
const class = "Biology";

```
