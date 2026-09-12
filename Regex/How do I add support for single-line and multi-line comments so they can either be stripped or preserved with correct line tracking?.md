To add comment support, you need two things:

1. **Regular expression patterns** placed before the operator rule so `//` and `/*` aren't split into `/` and `*`:

* Single-line comments: `\/\/[^\n]*`
* Multi-line block comments: `\/\*[\s\S]*?\*\/` (using non-greedy `*?` so it stops at the first `*/`).

1. **A toggle option** (`preserveComments: boolean`) so callers can choose whether to retain comments as tokens (useful for formatters, doc generators, and linters) or drop them (useful for AST compilers).

Because our `advancePosition()` helper inspects each character, any newlines inside multi-line block comments will automatically update line and column counts whether comments are preserved or stripped.

---

### Implementation

```javascript
const JAVASCRIPT_KEYWORDS = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
  'for', 'function', 'if', 'import', 'in', 'instanceof', 'new',
  'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
  'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'await',
  'async', 'null', 'true', 'false'
]);

function unescapeString(str) {
  const inner = str.slice(1, -1);
  return inner.replace(/\\(.)/gs, (match, char) => {
    switch (char) {
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      case 'b': return '\b';
      case 'f': return '\f';
      case '0': return '\0';
      case '\\': return '\\';
      case "'": return "'";
      case '"': return '"';
      case '`': return '`';
      default: return char;
    }
  });
}

function tokenize(input, options = { preserveComments: false }) {
  const tokenRegex = new RegExp(
    [
      // 1. Comments: Must precede operators to prevent '/' and '*' collisions
      /(?<commentLine>\/\/[^\n]*)/.source,
      /(?<commentBlock>\/\*[\s\S]*?\*\/)/.source,

      // 2. Strings
      /(?<string>"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/.source,

      // 3. Identifiers
      /(?<identifier>[a-zA-Z_$][a-zA-Z0-9_$]*)/.source,

      // 4. Numbers
      /(?<number>\b\d+(\.\d+)?\b)/.source,

      // 5. Operators (compound before single-char)
      /(?<operator>===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%><=!&|^~])/.source,

      // 6. Delimiters
      /(?<punctuation>[(),;{}[\]])/.source,

      // 7. Whitespace
      /(?<whitespace>\s+)/.source,

      // 8. Fallback
      /(?<unexpected>[^\s])/.source
    ].join('|'),
    'gs'
  );

  const tokens = [];
  let line = 1;
  let column = 1;
  let lastIndex = 0;

  function advancePosition(text) {
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
    }
  }

  for (const match of input.matchAll(tokenRegex)) {
    const rawText = match[0];
    const startIndex = match.index;

    // Advance for any uncaptured gaps
    if (startIndex > lastIndex) {
      advancePosition(input.slice(lastIndex, startIndex));
    }

    const tokenLine = line;
    const tokenColumn = column;

    // Always advance past the token text to keep position accurate
    advancePosition(rawText);
    lastIndex = startIndex + rawText.length;

    const { groups } = match;

    if (groups.whitespace) continue;

    // Handle single-line comments
    if (groups.commentLine) {
      if (options.preserveComments) {
        tokens.push({
          type: 'CommentLine',
          value: groups.commentLine.slice(2).trim(), // Strip leading '//'
          raw: rawText,
          loc: { line: tokenLine, column: tokenColumn, offset: startIndex, length: rawText.length }
        });
      }
      continue;
    }

    // Handle multi-line block comments
    if (groups.commentBlock) {
      if (options.preserveComments) {
        tokens.push({
          type: 'CommentBlock',
          value: groups.commentBlock.slice(2, -2), // Strip '/*' and '*/'
          raw: rawText,
          loc: { line: tokenLine, column: tokenColumn, offset: startIndex, length: rawText.length }
        });
      }
      continue;
    }

    let type;
    let value;

    if (groups.string) {
      type = 'String';
      value = unescapeString(groups.string);
    } else if (groups.identifier) {
      const val = groups.identifier;
      type = JAVASCRIPT_KEYWORDS.has(val) ? 'Keyword' : 'Identifier';
      value = val;
    } else if (groups.number) {
      type = 'Number';
      value = Number(groups.number);
    } else if (groups.operator) {
      type = 'Operator';
      value = groups.operator;
    } else if (groups.punctuation) {
      type = 'Punctuation';
      value = groups.punctuation;
    } else {
      type = 'Unknown';
      value = groups.unexpected;
    }

    tokens.push({
      type,
      value,
      raw: rawText,
      loc: {
        line: tokenLine,
        column: tokenColumn,
        offset: startIndex,
        length: rawText.length
      }
    });
  }

  return tokens;
}

```

---

### Verification: Correct Line Tracking Across Comments

```javascript
const sourceCode = `// Top header comment
const base = 100; /* inline block comment */
/*
   Multi-line block comment
   spanning multiple lines
*/
const total = base * 2;
`;

// 1. With preserveComments: false (strips comments, preserves line sync)
const strippedTokens = tokenize(sourceCode, { preserveComments: false });
console.log("Stripped - First token after multi-line comment:");
const totalToken = strippedTokens.find(t => t.value === 'total');
console.log(`Token '${totalToken.value}' starts at Line ${totalToken.loc.line}, Col ${totalToken.loc.column}`);
// Output: Token 'total' starts at Line 7, Col 7

// 2. With preserveComments: true (retains comment tokens)
const allTokens = tokenize(sourceCode, { preserveComments: true });
allTokens.forEach(t => {
  console.log(`[${t.loc.line}:${t.loc.column}] ${t.type.padEnd(14)} => ${JSON.stringify(t.value)}`);
});

```

#### Output

```text
[1:1] CommentLine    => "Top header comment"
[2:1] Keyword        => "const"
[2:7] Identifier     => "base"
[2:12] Operator       => "="
[2:14] Number         => 100
[2:17] Punctuation    => ";"
[2:19] CommentBlock   => " inline block comment "
[3:1] CommentBlock   => "\n   Multi-line block comment\n   spanning multiple lines\n"
[7:1] Keyword        => "const"
[7:7] Identifier     => "total"
[7:13] Operator       => "="
[7:15] Identifier     => "base"
[7:20] Operator       => "*"
[7:22] Number         => 2
[7:23] Punctuation    => ";"

```

Even when comments are stripped out entirely, `const total` lands on **Line 7, Col 1**, ensuring downstream syntax errors point to the actual line in the source file.
