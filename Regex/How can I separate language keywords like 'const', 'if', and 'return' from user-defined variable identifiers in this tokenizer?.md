In compiler and lexer design, regular expressions usually don't try to distinguish reserved keywords from generic identifiers directly in the pattern. Doing so creates massive, unwieldy regexes.

Instead, the standard pattern is:

1. Match the token using the general identifier pattern (`[a-zA-Z_$][a-zA-Z0-9_$]*`).
2. Do an $O(1)$ lookup against a `Set` of predefined language keywords. If it matches, classify it as a `Keyword`; otherwise, it remains an `Identifier`.

---

### Implementation

```javascript
// 1. Define reserved keywords in a Set for O(1) lookup
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
  const categorized = {
    keywords: [],
    identifiers: [],
    numbers: [],
    operators: [],
    punctuation: [],
    others: []
  };

  for (const match of input.matchAll(tokenRegex)) {
    const { groups } = match;

    if (groups.whitespace) continue;

    if (groups.identifier) {
      const val = groups.identifier;

      // 2. Check if the matched identifier is in our keyword table
      if (JAVASCRIPT_KEYWORDS.has(val)) {
        tokens.push({ type: 'Keyword', value: val });
        categorized.keywords.push(val);
      } else {
        tokens.push({ type: 'Identifier', value: val });
        categorized.identifiers.push(val);
      }
    } else if (groups.number) {
      tokens.push({ type: 'Number', value: Number(groups.number) });
      categorized.numbers.push(Number(groups.number));
    } else if (groups.operator) {
      tokens.push({ type: 'Operator', value: groups.operator });
      categorized.operators.push(groups.operator);
    } else if (groups.punctuation) {
      tokens.push({ type: 'Punctuation', value: groups.punctuation });
      categorized.punctuation.push(groups.punctuation);
    } else if (groups.unexpected) {
      tokens.push({ type: 'Unknown', value: groups.unexpected });
      categorized.others.push(groups.unexpected);
    }
  }

  return { tokens, categorized };
}

```

---

### Example Output

```javascript
const code = `const total = calculateScore(user, 10); if (total > 50) return true;`;
const { tokens, categorized } = tokenize(code);

console.log('Grouped Results:');
console.log('Keywords:', categorized.keywords);
// ['const', 'if', 'return', 'true']

console.log('Identifiers:', categorized.identifiers);
// ['total', 'calculateScore', 'user']

```

### Why a Post-Match Lookup is Preferred

* **Cleaner Regex Engine:** Keeps the regular expression engine from having to backtrack through dozens of alternations like `(?:const|if|return|...)`.
* **Configurable Dialects:** You can easily swap or extend the `Set` to support custom DSLs, SQL keywords, or language versions without modifying the core matching logic.
* **Separation of Concerns:** Character boundary checks stay strictly lexical, while keyword semantics belong to grammar classification.
