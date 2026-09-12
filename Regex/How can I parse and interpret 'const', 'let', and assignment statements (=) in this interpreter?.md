To support `const`, `let`, and assignment (`=`), your engine needs to step up from evaluating isolated expressions to executing a **sequence of statements** within a scoped environment.

This requires three main pieces:

1. **Scope-Aware Environment:** Distinguishing between declarations (`define`) and reassignments (`assign`), while enforcing `const` immutability and block scope.
2. **Parser Upgrades:** Parsing `Program`, `VariableDeclaration`, `AssignmentExpression`, and trailing optional semicolons.
3. **Interpreter Upgrades:** Managing statement execution order and updating variable bindings.

---

### 1. Scope-Aware Environment

In JavaScript, assigning to a `const` throws a `TypeError`, assigning to an undeclared variable (in strict mode) throws a `ReferenceError`, and redeclaring a `let`/`const` in the same scope throws a `SyntaxError`.

```javascript
class Environment {
  constructor(parent = null) {
    this.bindings = new Map(); // Map<string, { value: any, isConst: boolean }>
    this.parent = parent;
  }

  // Used for: const x = ..., let x = ...
  define(name, value, isConst = false) {
    if (this.bindings.has(name)) {
      throw new SyntaxError(`Identifier '${name}' has already been declared`);
    }
    this.bindings.set(name, { value, isConst });
    return value;
  }

  // Used for: x = ...
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

  // Used for reading: x
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

### 2. AST Parser Additions

We expand the parser to:

* Wrap the entire script into a `Program` body.
* Recognize statement boundaries (semicolons `;` or end of line).
* Handle `const` and `let` declarations (`VariableDeclaration`).
* Handle assignments (`AssignmentExpression`), ensuring the left-hand side is a valid target.

```javascript
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.cursor = 0;
  }

  peek(offset = 0) {
    return this.tokens[this.cursor + offset];
  }

  consume(expectedType, expectedValue) {
    const token = this.peek();
    if (!token) throw new SyntaxError("Unexpected end of input");
    if (expectedType && token.type !== expectedType) {
      throw new SyntaxError(`Expected type ${expectedType}, got ${token.type} at ${token.loc?.line}:${token.loc?.column}`);
    }
    if (expectedValue && token.value !== expectedValue) {
      throw new SyntaxError(`Expected '${expectedValue}', got '${token.value}' at ${token.loc?.line}:${token.loc?.column}`);
    }
    this.cursor++;
    return token;
  }

  match(type, value) {
    const token = this.peek();
    if (!token) return false;
    if (type && token.type !== type) return false;
    if (value && token.value !== value) return false;
    this.cursor++;
    return true;
  }

  parseProgram() {
    const body = [];
    while (this.peek()) {
      body.push(this.parseStatement());
    }
    return { type: 'Program', body };
  }

  parseStatement() {
    const token = this.peek();

    // 1. Variable Declaration: const / let
    if (token.type === 'Keyword' && (token.value === 'const' || token.value === 'let')) {
      const kind = this.consume().value; // 'const' | 'let'
      const idToken = this.consume('Identifier');

      let init = null;
      if (this.match('Operator', '=')) {
        init = this.parseExpression();
      } else if (kind === 'const') {
        throw new SyntaxError(`Missing initializer in const declaration '${idToken.value}'`);
      }

      this.match('Punctuation', ';'); // Optional semicolon
      return {
        type: 'VariableDeclaration',
        kind,
        declarations: [{
          id: { type: 'Identifier', name: idToken.value },
          init
        }]
      };
    }

    // 2. Expression Statement (e.g. x = 10, or fn())
    const expr = this.parseExpression();
    this.match('Punctuation', ';');
    return { type: 'ExpressionStatement', expression: expr };
  }

  parseExpression() {
    return this.parseAssignment();
  }

  // Right-associative assignment: a = b = 5
  parseAssignment() {
    const expr = this.parseMemberOrCall();

    if (this.peek() && this.peek().type === 'Operator' && this.peek().value === '=') {
      this.consume('Operator', '=');
      const right = this.parseAssignment(); // Recurse for right-associativity

      // In JS, left side can be an Identifier (x = 5) or MemberExpression (obj.prop = 5)
      if (expr.type !== 'Identifier' && expr.type !== 'MemberExpression') {
        throw new SyntaxError('Invalid left-hand side in assignment');
      }

      return {
        type: 'AssignmentExpression',
        operator: '=',
        left: expr,
        right
      };
    }

    return expr;
  }

  parseMemberOrCall() {
    let expr = this.parsePrimary();

    while (this.peek()) {
      const token = this.peek();
      if ((token.type === 'Operator' || token.type === 'Punctuation') && token.value === '.') {
        this.consume();
        const propToken = this.consume('Identifier');
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: { type: 'Identifier', name: propToken.value },
          computed: false
        };
      } else if (token.type === 'Punctuation' && token.value === '[') {
        this.consume('Punctuation', '[');
        const propExpr = this.parseExpression();
        this.consume('Punctuation', ']');
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: propExpr,
          computed: true
        };
      } else if (token.type === 'Punctuation' && token.value === '(') {
        this.consume('Punctuation', '(');
        const args = [];
        if (this.peek() && this.peek().value !== ')') {
          while (true) {
            args.push(this.parseExpression());
            if (!this.match('Punctuation', ',')) break;
          }
        }
        this.consume('Punctuation', ')');
        expr = { type: 'CallExpression', callee: expr, arguments: args };
      } else {
        break;
      }
    }

    return expr;
  }

  parsePrimary() {
    const token = this.peek();
    if (!token) throw new SyntaxError("Unexpected end of input");

    if (token.type === 'RegExp') {
      this.consume();
      const lastSlash = token.value.lastIndexOf('/');
      return {
        type: 'Literal',
        regex: {
          pattern: token.value.slice(1, lastSlash),
          flags: token.value.slice(lastSlash + 1)
        },
        raw: token.value
      };
    }

    if (token.type === 'String' || token.type === 'Number') {
      this.consume();
      return { type: 'Literal', value: token.value, raw: token.raw };
    }

    if (token.type === 'Identifier') {
      this.consume();
      return { type: 'Identifier', name: token.value };
    }

    if (token.type === 'Punctuation' && token.value === '(') {
      this.consume('Punctuation', '(');
      const expr = this.parseExpression();
      this.consume('Punctuation', ')');
      return expr;
    }

    throw new SyntaxError(`Unexpected token: '${token.value}'`);
  }
}

```

---

### 3. Updating the Interpreter

We add handling for `Program`, `VariableDeclaration`, `ExpressionStatement`, and `AssignmentExpression`.

For `AssignmentExpression`, we handle both:

* Variable reassignment: `x = 10` $\rightarrow$ calls `env.assign(name, val)`
* Property mutations: `obj.prop = 10` or `obj['prop'] = 10` $\rightarrow$ mutates object property directly

```javascript
class Interpreter {
  constructor(globalEnv = new Environment()) {
    this.env = globalEnv;
  }

  evaluate(node, currentEnv = this.env) {
    switch (node.type) {
      case 'Program': {
        let result = undefined;
        for (const statement of node.body) {
          result = this.evaluate(statement, currentEnv);
        }
        return result; // Programs return the value of their last statement
      }

      case 'VariableDeclaration': {
        const isConst = node.kind === 'const';
        for (const decl of node.declarations) {
          const varName = decl.id.name;
          const initialValue = decl.init ? this.evaluate(decl.init, currentEnv) : undefined;
          currentEnv.define(varName, initialValue, isConst);
        }
        return undefined; // Declarations evaluate to undefined
      }

      case 'ExpressionStatement': {
        return this.evaluate(node.expression, currentEnv);
      }

      case 'AssignmentExpression': {
        const value = this.evaluate(node.right, currentEnv);

        // Case A: Variable assignment (e.g., x = 20)
        if (node.left.type === 'Identifier') {
          return currentEnv.assign(node.left.name, value);
        }

        // Case B: Property assignment (e.g., user.name = "Bob" or user["age"] = 30)
        if (node.left.type === 'MemberExpression') {
          const target = this.evaluate(node.left.object, currentEnv);
          if (target == null) {
            throw new TypeError(`Cannot set property of ${target}`);
          }
          const key = node.left.computed
            ? this.evaluate(node.left.property, currentEnv)
            : node.left.property.name;

          target[key] = value;
          return value;
        }

        throw new SyntaxError('Invalid assignment target');
      }

      case 'Literal': {
        if (node.regex) {
          return new RegExp(node.regex.pattern, node.regex.flags);
        }
        return node.value;
      }

      case 'Identifier': {
        return currentEnv.get(node.name);
      }

      case 'MemberExpression': {
        const target = this.evaluate(node.object, currentEnv);
        if (target == null) {
          throw new TypeError(`Cannot read properties of ${target}`);
        }
        const propKey = node.computed 
          ? this.evaluate(node.property, currentEnv) 
          : node.property.name;
        return target[propKey];
      }

      case 'CallExpression': {
        let fn;
        let thisContext = null;

        if (node.callee.type === 'MemberExpression') {
          thisContext = this.evaluate(node.callee.object, currentEnv);
          if (thisContext == null) {
            throw new TypeError(`Cannot read properties of ${thisContext}`);
          }
          const propKey = node.callee.computed
            ? this.evaluate(node.callee.property, currentEnv)
            : node.callee.property.name;
          fn = thisContext[propKey];
        } else {
          fn = this.evaluate(node.callee, currentEnv);
        }

        if (typeof fn !== 'function') {
          throw new TypeError(`Callee is not a function`);
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

### 4. Running and Testing Scenarios

```javascript
function execute(code) {
  const tokens = tokenize(code); // Context-aware tokenizer from previous step
  const parser = new Parser(tokens);
  const ast = parser.parseProgram();
  const interpreter = new Interpreter();
  return interpreter.evaluate(ast);
}

// 1. Successful declaration and assignment
const res1 = execute(`
  let count = 10;
  count = 25;
  count;
`);
console.log(res1); // 25

// 2. Chained assignment (right-associative)
const res2 = execute(`
  let a;
  let b;
  a = b = 42;
  a;
`);
console.log(res2); // 42

// 3. Regex instance method with mutated object
const res3 = execute(`
  const validator = /^[0-9]+$/;
  let form = "98234";
  validator.test(form);
`);
console.log(res3); // true

// 4. TypeError on reassigning const
try {
  execute(`
    const pi = 3.14;
    pi = 3.14159;
  `);
} catch (err) {
  console.error(err.message); // "Assignment to constant variable 'pi'"
}

// 5. SyntaxError on redeclaration in same scope
try {
  execute(`
    let user = "Alice";
    let user = "Bob";
  `);
} catch (err) {
  console.error(err.message); // "Identifier 'user' has already been declared"
}

```
