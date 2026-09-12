To add block statements, conditional branches (`if`/`else`), and loops (`while`), we need three coordinated updates:

1. **Lexical Scoping in the Environment**: When entering a block `{ ... }`, instantiate a child `Environment` holding a reference to its `parent`. Identifiers resolve up the scope chain, but bindings created with `let`/`const` remain local to the block.
2. **Grammar Expansion in the Parser**: Add rules for `BlockStatement`, `IfStatement`, and `WhileStatement`.
3. **Execution Control in the Interpreter**:

* Execute blocks inside a fresh child environment.
* For `while`, execute loop iterations until the condition evaluates to falsy.

---

### 1. The Scoped Environment

Our previous `Environment` already had a `parent` link. We'll add a helper method `extend()` to spawn a child lexical scope:

```javascript
class Environment {
  constructor(parent = null) {
    this.bindings = new Map(); // Map<string, { value: any, isConst: boolean }>
    this.parent = parent;
  }

  extend() {
    return new Environment(this);
  }

  define(name, value, isConst = false) {
    if (this.bindings.has(name)) {
      throw new SyntaxError(`Identifier '${name}' has already been declared`);
    }
    this.bindings.set(name, { value, isConst });
    return value;
  }

  assign(name, value) {
    if (this.bindings.has(name)) {
      const binding = this.bindings.get(name);
      if (binding.isConst) {
        throw new TypeError(`Assignment to constant variable '${name}'`);
      }
      binding.value = value;
      return value;
    }
    if (this.parent) {
      return this.parent.assign(name, value);
    }
    throw new ReferenceError(`${name} is not defined`);
  }

  get(name) {
    if (this.bindings.has(name)) {
      return this.bindings.get(name).value;
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new ReferenceError(`${name} is not defined`);
  }
}

```

---

### 2. Parser Enhancements

We update `parseStatement` to route to block statements, `if` branches, and `while` loops:

```javascript
// Add these methods to the Parser class:

parseStatement() {
  const token = this.peek();
  if (!token) throw new SyntaxError("Unexpected end of input");

  // 1. Block Statement: { ... }
  if (token.type === 'Punctuation' && token.value === '{') {
    return this.parseBlockStatement();
  }

  // 2. If Statement: if (cond) stmt [else stmt]
  if (token.type === 'Keyword' && token.value === 'if') {
    return this.parseIfStatement();
  }

  // 3. While Statement: while (cond) stmt
  if (token.type === 'Keyword' && token.value === 'while') {
    return this.parseWhileStatement();
  }

  // 4. Variable Declaration: const / let
  if (token.type === 'Keyword' && (token.value === 'const' || token.value === 'let')) {
    const kind = this.consume().value;
    const idToken = this.consume('Identifier');

    let init = null;
    if (this.match('Operator', '=')) {
      init = this.parseExpression();
    } else if (kind === 'const') {
      throw new SyntaxError(`Missing initializer in const declaration '${idToken.value}'`);
    }

    this.match('Punctuation', ';');
    return {
      type: 'VariableDeclaration',
      kind,
      declarations: [{ id: { type: 'Identifier', name: idToken.value }, init }]
    };
  }

  // 5. Expression Statement: x = 10; or fn();
  const expr = this.parseExpression();
  this.match('Punctuation', ';');
  return { type: 'ExpressionStatement', expression: expr };
}

parseBlockStatement() {
  this.consume('Punctuation', '{');
  const body = [];
  while (this.peek() && !(this.peek().type === 'Punctuation' && this.peek().value === '}')) {
    body.push(this.parseStatement());
  }
  this.consume('Punctuation', '}');
  return { type: 'BlockStatement', body };
}

parseIfStatement() {
  this.consume('Keyword', 'if');
  this.consume('Punctuation', '(');
  const test = this.parseExpression();
  this.consume('Punctuation', ')');

  const consequent = this.parseStatement();
  let alternate = null;

  if (this.peek() && this.peek().type === 'Keyword' && this.peek().value === 'else') {
    this.consume('Keyword', 'else');
    alternate = this.parseStatement();
  }

  return {
    type: 'IfStatement',
    test,
    consequent,
    alternate
  };
}

parseWhileStatement() {
  this.consume('Keyword', 'while');
  this.consume('Punctuation', '(');
  const test = this.parseExpression();
  this.consume('Punctuation', ')');
  const body = this.parseStatement();

  return {
    type: 'WhileStatement',
    test,
    body
  };
}

```

---

### 3. Adding Comparison Operators to `parseExpression`

To make conditionals and loops practical, we need comparison operators (`>`, `<`, `===`, etc.). We can quickly integrate these right above `parseAssignment`:

```javascript
// Update parseExpression and parseAssignment:
parseExpression() {
  return this.parseAssignment();
}

parseAssignment() {
  const expr = this.parseComparison();

  if (this.peek() && this.peek().type === 'Operator' && this.peek().value === '=') {
    this.consume('Operator', '=');
    const right = this.parseAssignment();

    if (expr.type !== 'Identifier' && expr.type !== 'MemberExpression') {
      throw new SyntaxError('Invalid left-hand side in assignment');
    }

    return { type: 'AssignmentExpression', operator: '=', left: expr, right };
  }

  return expr;
}

parseComparison() {
  let left = this.parseMemberOrCall();

  while (
    this.peek() &&
    this.peek().type === 'Operator' &&
    ['===', '!==', '==', '!=', '<', '>', '<=', '>='].includes(this.peek().value)
  ) {
    const operator = this.consume().value;
    const right = this.parseMemberOrCall();
    left = {
      type: 'BinaryExpression',
      operator,
      left,
      right
    };
  }

  return left;
}

```

---

### 4. Interpreter Evaluation

Now we implement execution for `BlockStatement`, `IfStatement`, `WhileStatement`, and `BinaryExpression`:

```javascript
class Interpreter {
  constructor(globalEnv = new Environment()) {
    this.globalEnv = globalEnv;
  }

  evaluate(node, currentEnv = this.globalEnv) {
    switch (node.type) {
      case 'Program': {
        let result;
        for (const stmt of node.body) {
          result = this.evaluate(stmt, currentEnv);
        }
        return result;
      }

      // Block statements create a fresh child scope
      case 'BlockStatement': {
        const blockEnv = currentEnv.extend();
        let result;
        for (const stmt of node.body) {
          result = this.evaluate(stmt, blockEnv);
        }
        return result;
      }

      case 'IfStatement': {
        const testCondition = Boolean(this.evaluate(node.test, currentEnv));
        if (testCondition) {
          return this.evaluate(node.consequent, currentEnv);
        } else if (node.alternate) {
          return this.evaluate(node.alternate, currentEnv);
        }
        return undefined;
      }

      case 'WhileStatement': {
        let result;
        while (Boolean(this.evaluate(node.test, currentEnv))) {
          result = this.evaluate(node.body, currentEnv);
        }
        return result;
      }

      case 'BinaryExpression': {
        const left = this.evaluate(node.left, currentEnv);
        const right = this.evaluate(node.right, currentEnv);
        switch (node.operator) {
          case '===': return left === right;
          case '!==': return left !== right;
          case '==':  return left == right;
          case '!=':  return left != right;
          case '<':   return left < right;
          case '>':   return left > right;
          case '<=':  return left <= right;
          case '>=':  return left >= right;
          default:
            throw new Error(`Unsupported binary operator: ${node.operator}`);
        }
      }

      case 'VariableDeclaration': {
        const isConst = node.kind === 'const';
        for (const decl of node.declarations) {
          const val = decl.init ? this.evaluate(decl.init, currentEnv) : undefined;
          currentEnv.define(decl.id.name, val, isConst);
        }
        return undefined;
      }

      case 'ExpressionStatement': {
        return this.evaluate(node.expression, currentEnv);
      }

      case 'AssignmentExpression': {
        const value = this.evaluate(node.right, currentEnv);
        if (node.left.type === 'Identifier') {
          return currentEnv.assign(node.left.name, value);
        }
        if (node.left.type === 'MemberExpression') {
          const target = this.evaluate(node.left.object, currentEnv);
          const key = node.left.computed
            ? this.evaluate(node.left.property, currentEnv)
            : node.left.property.name;
          target[key] = value;
          return value;
        }
        throw new SyntaxError('Invalid assignment target');
      }

      case 'Literal': {
        if (node.regex) return new RegExp(node.regex.pattern, node.regex.flags);
        return node.value;
      }

      case 'Identifier': {
        return currentEnv.get(node.name);
      }

      case 'MemberExpression': {
        const target = this.evaluate(node.object, currentEnv);
        const propKey = node.computed ? this.evaluate(node.property, currentEnv) : node.property.name;
        return target[propKey];
      }

      case 'CallExpression': {
        let fn;
        let thisContext = null;
        if (node.callee.type === 'MemberExpression') {
          thisContext = this.evaluate(node.callee.object, currentEnv);
          const propKey = node.callee.computed ? this.evaluate(node.callee.property, currentEnv) : node.callee.property.name;
          fn = thisContext[propKey];
        } else {
          fn = this.evaluate(node.callee, currentEnv);
        }
        const args = node.arguments.map(arg => this.evaluate(arg, currentEnv));
        return Reflect.apply(fn, thisContext, args);
      }

      default:
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }
}

```

---

### 5. Verification Examples

#### Example A: Lexical Block Scoping & Shadowing

```javascript
function execute(code) {
  const tokens = tokenize(code);
  const parser = new Parser(tokens);
  const ast = parser.parseProgram();
  const interpreter = new Interpreter();
  return interpreter.evaluate(ast);
}

const scopingCode = `
  let x = "outer";
  {
    let x = "inner";
    let y = "scoped";
  }
  x;
`;

console.log(execute(scopingCode)); // "outer" (inner let did not leak)

```

Trying to access a variable outside its block correctly throws:

```javascript
try {
  execute(`
    {
      let secret = 123;
    }
    secret;
  `);
} catch (err) {
  console.error(err.message); // "secret is not defined"
}

```

#### Example B: `if` / `else` Logic

```javascript
const ifElseCode = `
  let status;
  const score = 85;
  if (score >= 50) {
    status = "passed";
  } else {
    status = "failed";
  }
  status;
`;

console.log(execute(ifElseCode)); // "passed"

```

#### Example C: Loop Condition Checking Regex

```javascript
const whileLoopCode = `
  let text = "aaa";
  let iterations = 0;
  const pattern = /^a+$/;

  while (pattern.test(text)) {
    iterations = "done";
    text = "stop"; // Breaks regex match on next evaluation
  }
  iterations;
`;

console.log(execute(whileLoopCode)); // "done"

```
