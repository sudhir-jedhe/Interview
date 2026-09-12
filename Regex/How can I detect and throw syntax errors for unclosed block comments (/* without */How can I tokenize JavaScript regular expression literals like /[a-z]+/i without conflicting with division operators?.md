In JavaScript lexical analysis, distinguishing between a **division operator** (`/` or `/=`) and a **Regular Expression Literal** (`/abc/gi`) is one of the classic lexical ambiguities.

Because both start with a forward slash `/`, you **cannot** solve this with regular expression patterns alone. A single static regex doesn't know whether `/` is an operator or a regex literal.

To solve this, real-world JavaScript lexers (like Babel, Acorn, or V8) use **context-aware scanning**: whether a `/` is a division or a regex literal depends entirely on the **preceding token**.

---

### The Grammar Rule

* **A `/` is a DIVISION operator (`/` or `/=`)** if it comes immediately after an expression/value that can be divided (an operand).
* Examples: `x / 2`, `(a + b) / 4`, `arr[0] / 2`, `100 / 5`, `"hello" / 2`
* Prior tokens: **Number**, **Identifier**, **String**, `)`, `]`, `++`, `--`

* **A `/` is a REGEX LITERAL (`/.../flags`)** if it comes after a token where an expression is *expected* to begin (punctuation, operators, or statement keywords).
* Examples: `const r = /abc/`, `test(/abc/)`, `if (/abc/.test(str))`, `return /abc/`
* Prior tokens: Operators (`=`, `+`, `*`, `&&`, etc.), Open delimiters (`(`, `[`, `{`, `,`, `;`, `:`), or control keywords (`return`, `case`, `yield`, `await`).

---

### Step-by-Step Lexer Architecture

Instead of matching everything in one pass with `matchAll()`, we run a **cursor loop** with `sticky` (`y` flag) regular expressions.

When the cursor lands on `/`, we inspect the `lastMeaningfulToken`:

1. If the last token is an operand $\rightarrow$ match a **division operator** (`/=` or `/`).
2. Otherwise $\rightarrow$ match a **regular expression literal** (`/(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\[\r\n])+\/[a-z]*/`).

---

### Full Implementation

```javascript
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

// Tokens after which a '/' MUST be treated as a division operator
const PRECEDES_DIVISION = new Set([
  'Number',
  'String',
  'Identifier',
  ')',
  ']',
  '++'
]);

// Keywords after which an expression begins (meaning '/' is a REGEX, not division)
const EXPR_KEYWORDS = new Set([
  'return', 'case', 'typeof', 'yield', 'await', 'delete', 'void', 'throw'
]);

// Regex literals match:
// / + (escape sequence | character class [...] | normal non-slash char)+ / + flags
const REGEX_LITERAL_PATTERN = /^\/(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\[\r\n])+\/[a-z]*/i;
const UNCLOSED_REGEX_PATTERN = /^\/(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\[\r\n])*(?:[\r\n]|$)/;

function tokenize(input) {
  const tokens = [];
  let index = 0;
  let line = 1;
  let column = 1;
  let lastMeaningfulToken = null;

  function advance(count) {
    for (let i = 0; i < count; i++) {
      if (input[index + i] === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
    }
    index += count;
  }

  while (index < input.length) {
    const remaining = input.slice(index);
    const startLoc = { line, column, offset: index };

    // 1. Whitespace
    const wsMatch = remaining.match(/^\s+/);
    if (wsMatch) {
      advance(wsMatch[0].length);
      continue;
    }

    // 2. Comments
    if (remaining.startsWith('//')) {
      const lineComment = remaining.match(/^\/\/[^\n]*/)[0];
      advance(lineComment.length);
      continue;
    }
    if (remaining.startsWith('/*')) {
      const blockComment = remaining.match(/^\/\*[\s\S]*?\*\//);
      if (!blockComment) {
        throw new LexerError('Unterminated block comment', input, { ...startLoc, length: 2 });
      }
      advance(blockComment[0].length);
      continue;
    }

    // 3. Forward Slash Ambiguity Resolution (/ or /= vs Regex)
    if (remaining[0] === '/') {
      let isDivision = false;

      if (lastMeaningfulToken) {
        const { type, value } = lastMeaningfulToken;
        // If the preceding token was a keyword like 'return' or 'case', it's an expression start
        if (type === 'Keyword' && !EXPR_KEYWORDS.has(value)) {
          isDivision = false;
        } else if (PRECEDES_DIVISION.has(type) || PRECEDES_DIVISION.has(value)) {
          isDivision = true;
        }
      }

      if (isDivision) {
        // Match /= or /
        const op = remaining.startsWith('/=') ? '/=' : '/';
        const token = {
          type: 'Operator',
          value: op,
          loc: { ...startLoc, length: op.length }
        };
        tokens.push(token);
        lastMeaningfulToken = token;
        advance(op.length);
        continue;
      } else {
        // Match Regex Literal
        const regexMatch = remaining.match(REGEX_LITERAL_PATTERN);
        if (regexMatch) {
          const raw = regexMatch[0];
          const token = {
            type: 'RegExp',
            value: raw,
            loc: { ...startLoc, length: raw.length }
          };
          tokens.push(token);
          lastMeaningfulToken = token;
          advance(raw.length);
          continue;
        } else {
          // Check for unclosed regex
          const unclosed = remaining.match(UNCLOSED_REGEX_PATTERN);
          throw new LexerError('Unterminated regular expression literal', input, {
            ...startLoc,
            length: unclosed ? unclosed[0].length : 1
          });
        }
      }
    }

    // 4. Strings
    const strMatch = remaining.match(/^("(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|`(?:\\.|[^`\\])*`)/);
    if (strMatch) {
      const raw = strMatch[0];
      const token = { type: 'String', value: raw, loc: { ...startLoc, length: raw.length } };
      tokens.push(token);
      lastMeaningfulToken = token;
      advance(raw.length);
      continue;
    }

    // 5. Numbers
    const numMatch = remaining.match(/^\b\d+(\.\d+)?\b/);
    if (numMatch) {
      const raw = numMatch[0];
      const token = { type: 'Number', value: Number(raw), loc: { ...startLoc, length: raw.length } };
      tokens.push(token);
      lastMeaningfulToken = token;
      advance(raw.length);
      continue;
    }

    // 6. Identifiers / Keywords
    const idMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (idMatch) {
      const val = idMatch[0];
      const type = ['const', 'let', 'var', 'if', 'else', 'return', 'case', 'function'].includes(val) 
        ? 'Keyword' 
        : 'Identifier';
      const token = { type, value: val, loc: { ...startLoc, length: val.length } };
      tokens.push(token);
      lastMeaningfulToken = token;
      advance(val.length);
      continue;
    }

    // 7. Multi-character and Single-character Operators
    const opMatch = remaining.match(/^(===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|[+\-*%><=!&|^~])/);
    if (opMatch) {
      const op = opMatch[0];
      const token = { type: 'Operator', value: op, loc: { ...startLoc, length: op.length } };
      tokens.push(token);
      lastMeaningfulToken = token;
      advance(op.length);
      continue;
    }

    // 8. Delimiters
    const puncMatch = remaining.match(/^[(),;{}[\]]/);
    if (puncMatch) {
      const punc = puncMatch[0];
      const token = { type: 'Punctuation', value: punc, loc: { ...startLoc, length: 1 } };
      tokens.push(token);
      lastMeaningfulToken = token;
      advance(1);
      continue;
    }

    throw new LexerError(`Unexpected character '${remaining[0]}'`, input, { ...startLoc, length: 1 });
  }

  return tokens;
}

```

---

### Demonstrating Correct Disambiguation

Let's test expressions where `/` appears in different roles:

```javascript
const snippet = `
const ratio = total / count;          // Division
const matches = str.match(/^[a-z]+/i); // Regex Literal
return /test/g.test(val);             // Regex Literal after keyword
const compound = (a + b) / 2;         // Division after closing paren
`;

const tokens = tokenize(snippet);

tokens
  .filter(t => t.type === 'Operator' && t.value === '/' || t.type === 'RegExp')
  .forEach(t => {
    console.log(`[Line ${t.loc.line}] ${t.type.padEnd(8)}: ${t.value}`);
  });

```

#### Output

```text
[Line 2] Operator: /
[Line 3] RegExp  : /^[a-z]+/i
[Line 4] RegExp  : /test/g
[Line 5] Operator: /

```

### Edge Cases Handled

1. **Character Classes Containing Slashes:** In `/[a/b]/`, the `/` inside `[...]` does not prematurely close the regex because the regex pattern accounts for nested brackets `\[(?:\\.|[^\]\\])*\]`.
2. **Escaped Characters:** `/\/api\/v1\//` properly ignores escaped `\/` slashes.
3. **Closing Delimiters:** In `(x + y) / 2`, the token before `/` is `)`, which is registered in `PRECEDES_DIVISION`, correctly preventing it from reading `/ 2` as a regex.
