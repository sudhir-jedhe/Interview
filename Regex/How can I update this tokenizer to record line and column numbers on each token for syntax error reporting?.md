To track source coordinates accurately, you need to monitor **newlines (`\n`)** as the cursor moves through the string.

Because `matchAll` produces a `match.index` (the raw 0-based character offset) for every matched segment, you can incrementally compute line and column numbers by scanning through any text that occurred between the previous match and the current one.

Here is the updated implementation with precise line and column tracking:

```javascript
const JAVASCRIPT_KEYWORDS = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
  'for', 'function', 'if', 'import', 'in', 'instanceof', 'new',
  'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
  'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'await',
  'async', 'null', 'true', 'false'
]);

function tokenize(input) {
  const tokenRegex = new RegExp(
    [
      /(?<identifier>[a-zA-Z_$][a-zA-Z0-9_$]*)/.source,
      /(?<number>\b\d+(\.\d+)?\b)/.source,
      /(?<operator>===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%><=!&|^~])/.source,
      /(?<punctuation>[(),;{}[\]])/.source,
      /(?<whitespace>\s+)/.source,
      /(?<unexpected>[^\s])/.source
    ].join('|'),
    'g'
  );

  const tokens = [];

  // Track position (1-based index is standard for error reporting)
  let line = 1;
  let column = 1;
  let lastIndex = 0;

  // Helper to advance line/column state by scanning consumed text
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

    // Advance for any uncaptured gaps (if any) up to match start
    if (startIndex > lastIndex) {
      advancePosition(input.slice(lastIndex, startIndex));
    }

    // Capture the starting location of THIS specific token
    const tokenLine = line;
    const tokenColumn = column;

    // Advance past this token's text so the cursor is ready for next iteration
    advancePosition(rawText);
    lastIndex = startIndex + rawText.length;

    const { groups } = match;

    // Ignore whitespace tokens
    if (groups.whitespace) continue;

    let type;
    let value;

    if (groups.identifier) {
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

### Example Usage & Error Formatting

With `line`, `column`, `offset`, and `length`, generating compiler-style error diagnostics (like GCC or Babel) becomes straightforward:

```javascript
const sourceCode = `const x = 10;
const y = @; // Syntax error here
return x + y;`;

const tokens = tokenize(sourceCode);

// Helper to format a compiler-grade diagnostic
function formatError(message, token, fullSource) {
  const lines = fullSource.split('\n');
  const targetLine = lines[token.loc.line - 1];
  const pointer = ' '.repeat(token.loc.column - 1) + '^'.repeat(token.loc.length);

  return [
    `SyntaxError: ${message} (${token.loc.line}:${token.loc.column})`,
    ``,
    `  ${token.loc.line} | ${targetLine}`,
    `    | ${pointer}`
  ].join('\n');
}

// Find invalid character token
const badToken = tokens.find(t => t.type === 'Unknown');
if (badToken) {
  console.log(formatError(`Unexpected token '${badToken.value}'`, badToken, sourceCode));
}

```

#### Diagnostic Output

```text
SyntaxError: Unexpected token '@' (2:11)

  2 | const y = @; // Syntax error here
    |           ^

```
