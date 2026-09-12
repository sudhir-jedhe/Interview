To separate characters, numbers, and operators from an array, you can use `Array.prototype.reduce()` or multiple `filter()` calls with regular expressions or type checks.

Here is an implementation using `reduce` to categorize them in a single pass:

```javascript
function separateTokens(arr) {
  return arr.reduce(
    (acc, item) => {
      // Standardize input as a string for regex matching
      const str = String(item).trim();

      if (typeof item === 'number' || (!isNaN(Number(str)) && str !== '')) {
        acc.numbers.push(typeof item === 'number' ? item : Number(item));
      } else if (/^[+\-*/%=><!&|^~]+$/.test(str)) {
        acc.operators.push(item);
      } else if (/^[a-zA-Z]$/.test(str)) {
        acc.characters.push(item);
      } else {
        acc.others.push(item);
      }

      return acc;
    },
    { characters: [], numbers: [], operators: [], others: [] }
  );
}

// Example usage:
const input = ['a', 12, '+', 'b', '45', '*', '-', 'Z', 9, '/', '=', 'word'];

const { characters, numbers, operators, others } = separateTokens(input);

console.log('Characters:', characters); // ['a', 'b', 'Z']
console.log('Numbers:', numbers);       // [12, 45, 9]
console.log('Operators:', operators);   // ['+', '*', '-', '/', '=']
console.log('Others:', others);         // ['word']

```

---

### Alternative: Direct Array Filtering

If the input array contains only single-character strings or distinct types:

```javascript
const input = ['a', 12, '+', 'b', 45, '*', '-', 'z'];

const isOperator = (ch) => '+-*/%=<>!&|^'.includes(ch);

const numbers = input.filter((item) => typeof item === 'number');
const operators = input.filter((item) => typeof item === 'string' && isOperator(item));
const characters = input.filter((item) => typeof item === 'string' && /^[a-zA-Z]$/.test(item));

```

The cleanest and most robust way to tokenize a raw string in modern JavaScript is using a regular expression with **named capture groups** combined with `String.prototype.matchAll()`.

This approach scans the string in order, handles multi-character operators (like `==`, `!=`, `&&`), multi-digit numbers (including decimals), valid JS identifiers (words/variable names), and skips arbitrary whitespace.

---

### Lexer Implementation with `matchAll`

```javascript
function tokenize(input) {
  // Order matters: match multi-character operators before single characters
  const tokenRegex = new RegExp(
    [
      // Identifiers: start with a letter/$, follow with letters/digits/$
      /(?<identifier>[a-zA-Z_$][a-zA-Z0-9_$]*)/.source,
      // Numbers: integer or floating-point
      /(?<number>\b\d+(\.\d+)?\b)/.source,
      // Operators: compound operators first, then single-character
      /(?<operator>===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%><=!&|^~])/.source,
      // Delimiters / Punctuation
      /(?<punctuation>[(),;{}[\]])/.source,
      // Whitespace: caught so we can discard it
      /(?<whitespace>\s+)/.source,
      // Fallback: any unexpected characters
      /(?<unexpected>[^\s])/.source
    ].join('|'),
    'g'
  );

  const tokens = [];
  const categorized = {
    identifiers: [],
    numbers: [],
    operators: [],
    punctuation: [],
    others: []
  };

  for (const match of input.matchAll(tokenRegex)) {
    const { groups } = match;

    if (groups.whitespace) continue; // Skip whitespace

    if (groups.identifier) {
      tokens.push({ type: 'Identifier', value: groups.identifier });
      categorized.identifiers.push(groups.identifier);
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

// Example usage:
const code = `const total = (count * 105.5) + baseValue >= 500;`;
const { tokens, categorized } = tokenize(code);

console.log('Sequential Stream:', tokens.slice(0, 5));
// [
//   { type: 'Identifier', value: 'const' },
//   { type: 'Identifier', value: 'total' },
//   { type: 'Operator',   value: '=' },
//   { type: 'Punctuation', value: '(' },
//   { type: 'Identifier', value: 'count' }
// ]

console.log('Grouped Categories:', categorized);
// {
//   identifiers: ['const', 'total', 'count', 'baseValue'],
//   numbers: [105.5, 500],
//   operators: ['=', '*', '+', '>='],
//   punctuation: ['(', ')', ';'],
//   others: []
// }

```

---

### Why this pattern works well

* **Avoids greedy overlaps:** Putting compound operators (`>=`, `===`, `&&`) before single-character operators (`>`, `=`, `&`) prevents the regex engine from eagerly cutting `>=` into `>` followed by `=`.
* **Standard identifier rules:** `[a-zA-Z_$][a-zA-Z0-9_$]*` respects valid variable names, ensuring names like `item2` or `user_id` stay intact instead of splitting into `item` and `2`.
* **Preserves positions:** `match.index` is available on every match object if you need line and column tracking for syntax errors.
