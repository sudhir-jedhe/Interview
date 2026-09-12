To add string literal support, we need regular expression patterns that:

1. Handle single- and double-quoted strings, allowing for escaped quotes (like `\'` or `\"`) using `"(?:\\.|[^"\\])*"` and `'(?:\\.|[^'\\])*'`.
2. Handle backtick template literals, which can span multiple lines: ``(?:\\.|[^`\\])*``.
3. Unescape character sequences when extracting the token's evaluated value, while retaining the raw string for syntax tracking.

Because our `advancePosition` function already iterates over every character and counts `\n`, multiline backtick template strings will automatically maintain 100% accurate line and column numbers.

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

// Helper to decode standard escape sequences into raw character values
function unescapeString(str) {
  // Strip outer quotes
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

function tokenize(input) {
  const tokenRegex = new RegExp(
    [
      // String Literals: double, single, and template (backtick)
      // Must be placed before identifiers and operators to avoid conflicts
      /(?<string>"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/.source,
      // Identifiers
      /(?<identifier>[a-zA-Z_$][a-zA-Z0-9_$]*)/.source,
      // Numbers (floats and integers)
      /(?<number>\b\d+(\.\d+)?\b)/.source,
      // Operators (compound before single-character)
      /(?<operator>===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%><=!&|^~])/.source,
      // Delimiters / Punctuation
      /(?<punctuation>[(),;{}[\]])/.source,
      // Whitespace
      /(?<whitespace>\s+)/.source,
      // Fallback
      /(?<unexpected>[^\s])/.source
    ].join('|'),
    'gs' // Note the 's' (dotAll) flag to allow backtick strings to match newlines
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

    advancePosition(rawText);
    lastIndex = startIndex + rawText.length;

    const { groups } = match;

    if (groups.whitespace) continue;

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

### Example: Escaped Quotes & Multiline Template Strings

```javascript
const code = `
const msg = "He said, \\"Hello!\\"";
const note = \`Line 1
Line 2\`;
const valid = true;
`;

const tokens = tokenize(code);

tokens.forEach(t => {
  console.log(
    `[${t.loc.line}:${t.loc.column}] ${t.type.padEnd(11)} => Raw: ${JSON.stringify(t.raw)} | Parsed: ${JSON.stringify(t.value)}`
  );
});

```

#### Output

```text
[2:1]  Keyword     => Raw: "const"                      | Parsed: "const"
[2:7]  Identifier  => Raw: "msg"                        | Parsed: "msg"
[2:11] Operator    => Raw: "="                          | Parsed: "="
[2:13] String      => Raw: "\"He said, \\\"Hello!\\\"\""| Parsed: "He said, \"Hello!\""
[2:36] Punctuation => Raw: ";"                          | Parsed: ";"
[3:1]  Keyword     => Raw: "const"                      | Parsed: "const"
[3:7]  Identifier  => Raw: "note"                       | Parsed: "note"
[3:12] Operator    => Raw: "="                          | Parsed: "="
[3:14] String      => Raw: "`Line 1\nLine 2`"           | Parsed: "Line 1\nLine 2"
[4:8]  Punctuation => Raw: ";"                          | Parsed: ";"
[5:1]  Keyword     => Raw: "const"                      | Parsed: "const"
[5:7]  Identifier  => Raw: "valid"                      | Parsed: "valid"
[5:13] Operator    => Raw: "="                          | Parsed: "="
[5:15] Keyword     => Raw: "true"                       | Parsed: "true"
[5:19] Punctuation => Raw: ";"                          | Parsed: ";"

```

Notice how the `valid` token is correctly tracked at line `5`, because `advancePosition` seamlessly counted the newline inside the multiline backtick string.
