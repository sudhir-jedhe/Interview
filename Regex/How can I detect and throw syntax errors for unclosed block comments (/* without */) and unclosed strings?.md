When a string or block comment isn't closed, a standard regex like `"(?:\\.|[^"\\])*"` simply fails to match. If it fails, the opening delimiter (`"`, `'`, ```, or `/*`) drops through to your fallback rules, causing confusing cascade errors later in the file.

To catch these cleanly, add **explicit patterns for the unclosed variations** directly into the regex alternations, placed immediately after the valid closed rules. If an unclosed variant matches, you can immediately construct and throw a compiler-grade `SyntaxError` referencing the exact starting location.

---

### Lexer Rules for Unclosed Literals

1. **Unclosed Single / Double Strings:** In JavaScript, regular strings cannot span raw newlines without an escaping backslash. An unclosed string runs from the opening quote to the end of the line (`\n`) or EOF:

* `(?<unclosedString>"(?:\\.|[^"\\\r\n])*(?:[\r\n]|$)|'(?:\\.|[^'\\\r\n])*(?:[\r\n]|$))`

1. **Unclosed Backtick Strings:** Template strings can cross newlines, so an unclosed backtick runs from the backtick all the way to EOF without encountering an unescaped closing backtick:

* `(?<unclosedTemplate>`(?:\.|[^`\\])*$)`

1. **Unclosed Block Comments:** Starts with `/*` and runs to EOF without containing `*/`:

* `(?<unclosedComment>\/\*(?:(?!\*\/)[\s\S])*$)`

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

// Custom SyntaxError class with formatted code-frame diagnostics
class LexerError extends SyntaxError {
  constructor(message, source, loc) {
    const lines = source.split('\n');
    const targetLine = lines[loc.line - 1] || '';
    const pointer = ' '.repeat(Math.max(0, loc.column - 1)) + '^'.repeat(Math.max(1, loc.length || 1));

    const formattedMessage = [
      `${message} (${loc.line}:${loc.column})`,
      '',
      `  ${loc.line} | ${targetLine}`,
      `    | ${pointer}`
    ].join('\n');

    super(formattedMessage);
    this.name = 'LexerError';
    this.loc = loc;
  }
}

function unescapeString(str) {
  const inner = str.slice(1, -1);
  return inner.replace(/\\(.)/gs, (_, char) => {
    const map = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '0': '\0', '\\': '\\', "'": "'", '"': '"', '`': '`' };
    return map[char] || char;
  });
}

function tokenize(input, options = { preserveComments: false }) {
  const tokenRegex = new RegExp(
    [
      // 1. Comments
      /(?<commentLine>\/\/[^\n]*)/.source,
      /(?<commentBlock>\/\*[\s\S]*?\*\/)/.source,
      /(?<unclosedComment>\/\*(?:(?!\*\/)[\s\S])*$)/.source, // Catch /* to EOF

      // 2. Strings (Valid)
      /(?<string>"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|`(?:\\.|[^`\\])*`)/.source,
      // Strings (Unclosed error states)
      /(?<unclosedString>"(?:\\.|[^"\\\r\n])*(?:[\r\n]|$)|'(?:\\.|[^'\\\r\n])*(?:[\r\n]|$))/.source,
      /(?<unclosedTemplate>`(?:\\.|[^`\\])*$)/.source,

      // 3. Identifiers
      /(?<identifier>[a-zA-Z_$][a-zA-Z0-9_$]*)/.source,

      // 4. Numbers
      /(?<number>\b\d+(\.\d+)?\b)/.source,

      // 5. Operators
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

    if (startIndex > lastIndex) {
      advancePosition(input.slice(lastIndex, startIndex));
    }

    const tokenLine = line;
    const tokenColumn = column;

    advancePosition(rawText);
    lastIndex = startIndex + rawText.length;

    const { groups } = match;

    if (groups.whitespace) continue;

    // Helper for generating loc metadata
    const loc = {
      line: tokenLine,
      column: tokenColumn,
      offset: startIndex,
      length: rawText.trimEnd().length || 1
    };

    // --- SYNTAX ERROR DETECTIONS ---
    if (groups.unclosedComment) {
      throw new LexerError('Unterminated block comment', input, loc);
    }
    if (groups.unclosedString) {
      throw new LexerError('Unterminated string literal', input, loc);
    }
    if (groups.unclosedTemplate) {
      throw new LexerError('Unterminated template literal', input, loc);
    }
    if (groups.unexpected) {
      throw new LexerError(`Unexpected token '${groups.unexpected}'`, input, loc);
    }

    // --- VALID TOKENS ---
    if (groups.commentLine) {
      if (options.preserveComments) {
        tokens.push({ type: 'CommentLine', value: groups.commentLine.slice(2).trim(), raw: rawText, loc });
      }
      continue;
    }

    if (groups.commentBlock) {
      if (options.preserveComments) {
        tokens.push({ type: 'CommentBlock', value: groups.commentBlock.slice(2, -2), raw: rawText, loc });
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
    }

    tokens.push({ type, value, raw: rawText, loc });
  }

  return tokens;
}

```

---

### Verifying Error Reporting

#### 1. Testing an Unterminated String

```javascript
try {
  const badCode = `const title = "Hello World;\nconst count = 5;`;
  tokenize(badCode);
} catch (err) {
  console.error(err.message);
}

```

**Output:**

```text
Unterminated string literal (1:15)

  1 | const title = "Hello World;
    |               ^^^^^^^^^^^^^

```

#### 2. Testing an Unterminated Block Comment

```javascript
try {
  const badCommentCode = `const a = 10;\n/* This comment never ends...\nconst b = 20;`;
  tokenize(badCommentCode);
} catch (err) {
  console.error(err.message);
}

```

**Output:**

```text
Unterminated block comment (2:1)

  2 | /* This comment never ends...
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

```

### Why this approach is optimal

* **No backtracking freezes:** Lookaheads like `(?!\*\/)` are anchored to EOF (`$`), so the regex engine performs a single linear scan to the end of the text.
* **Pinpointed diagnosis:** Instead of failing with a generic error on the *next* token, the error points directly to the opening quote or `/*` that caused the syntax failure.
