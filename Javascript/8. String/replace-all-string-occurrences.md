```js
let str = 'I am prashant yadav';
str.split(' '); // splitting at white space
['I', 'am', 'prashant', 'yadav']


let strArr = ['I', 'am', 'prashant', 'yadav'];
strArr.join(' '); // joining with white space
'I am prashant yadav';


let str = 'I am prashant yadav'.split('prashant').join('golu');
console.log(str); // 'I am golu yadav'


String.replace(/EXPR/g, '');  //case sensitive
String.replace(/EXPR/gi, ''); //case insensitive

// Replace case sensitive string
let str = 'String first, string second'.replace(/string/g, 'random');
console.log(str); // 'String first, random second'


// Replace case in-sensitive string
let str = 'String first, string second'.replace(/string/gi, 'random');
console.log(str); // 'random first, random second'

Regular expression efficiency depends upon its implementation so in some cases it can run fast and in some cases it can run slow also they do not perform good with some special characters so it is better to escape them.

let escapeString = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
```

Your snippets provide a great overview of basic string manipulation using `split()`, `join()`, `replace()`, and escaping special characters for regular expressions.

Here are a few quick technical notes and modern additions to refine your code.

---

### Key Observations & Refinements

#### 1. Native Polyfill via `split().join()`

Using `.split('prashant').join('golu')` to replace a substring is a classic, zero-regex technique that works across all JavaScript versions.

Modern engines (ES2021+) also offer the native `replaceAll` method:

```javascript
let str = 'I am prashant yadav'.replaceAll('prashant', 'golu');
console.log(str); // 'I am golu yadav'

```

---

#### 2. Case-Insensitive Replacements with Dynamic Values

When combining your `escapeString` function with a case-insensitive match (`/gi`), you can dynamically replace string variations using the `RegExp` constructor:

```javascript
const escapeString = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceCaseInsensitive = (str, target, replacement) => {
  const safeTarget = escapeString(target);
  return str.replace(new RegExp(safeTarget, 'gi'), replacement);
};

let text = 'String first, string second';
console.log(replaceCaseInsensitive(text, 'string', 'random')); 
// Output: 'random first, random second'

```

---

#### 3. Regex Performance Tip (`/g` vs `/gi`)

* **`g` (Global Flag):** Scans the string linearly in $\mathcal{O}(N)$ time.
* **`i` (Ignore Case Flag):** Requires lowercasing characters in memory during comparison, making it slightly slower than strict ASCII matching on massive text bodies.
* **Special Character Escaping (`\\$&`):** Ensures that characters like `.`, `*`, `?`, `[`, and `$` are treated as literal text instead of active regex wildcards or capture group references.
