To generate cryptographically secure passphrases in the browser, you must use **`window.crypto.getRandomValues()`** rather than `Math.random()`. `Math.random()` uses a pseudo-random number generator (PRNG) that is predictable and unsuitable for security.

Here is a complete, production-ready implementation that uses a wordlist and cryptographically secure random numbers to build a passphrase (similar to the famous *correct-horse-battery-staple* method).

---

### Complete JavaScript Implementation

```javascript
// A sample wordlist. In production, use a larger wordlist (like EFF's 7,776 wordlist)
const DEFAULT_WORDLIST = [
  'correct', 'horse', 'battery', 'staple', 'dragon', 'rocket', 'shadow',
  'galaxy', 'silver', 'forest', 'whisper', 'thunder', 'anchor', 'canvas',
  'breeze', 'harbor', 'summit', 'velvet', 'beacon', 'marble', 'phoenix'
];

/**
 * Selects an unbiased, cryptographically secure random integer in the range [0, max).
 * Uses rejection sampling to eliminate modulo bias.
 * 
 * @param {number} max - The upper bound (exclusive)
 * @returns {number} Unbiased random index
 */
function getSecureRandomIndex(max) {
  if (max <= 0) throw new Error("Max must be greater than 0");

  const array = new Uint32Array(1);
  const maxUint32 = 0xFFFFFFFF; // 2^32 - 1
  // Calculate highest multiple of max that fits in 32 bits to prevent modulo bias
  const limit = maxUint32 - (maxUint32 % max);

  let randomVal;
  do {
    window.crypto.getRandomValues(array);
    randomVal = array[0];
  } while (randomVal >= limit); // Reject numbers that fall into the biased upper remainder

  return randomVal % max;
}

/**
 * Generates a cryptographically secure random passphrase.
 * 
 * @param {Object} options Configuration settings
 * @param {number} options.wordCount - Number of words in the passphrase (default: 4)
 * @param {string} options.separator - Delimiter between words (default: '-')
 * @param {string[]} options.wordlist - List of candidate words
 * @param {boolean} options.capitalize - Whether to capitalize the first letter of each word
 * @param {boolean} options.addNumber - Whether to append a random digit
 * @returns {string} The generated passphrase
 */
function generatePassphrase({
  wordCount = 4,
  separator = '-',
  wordlist = DEFAULT_WORDLIST,
  capitalize = false,
  addNumber = false
} = {}) {
  if (wordlist.length < 2) {
    throw new Error("Wordlist must contain at least 2 words.");
  }

  const selectedWords = [];

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = getSecureRandomIndex(wordlist.length);
    let word = wordlist[randomIndex];

    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    selectedWords.push(word);
  }

  let passphrase = selectedWords.join(separator);

  // Append a secure random digit if requested
  if (addNumber) {
    const randomDigit = getSecureRandomIndex(10);
    passphrase += `${separator}${randomDigit}`;
  }

  return passphrase;
}

// --- Usage Examples ---

// 1. Standard 4-word passphrase
console.log(generatePassphrase({ wordCount: 4 })); 
// Output: "dragon-canvas-whisper-rocket"

// 2. 5-word capitalized passphrase with custom separator and number
console.log(generatePassphrase({
  wordCount: 5,
  separator: '.',
  capitalize: true,
  addNumber: true
})); 
// Output: "Beacon.Forest.Silver.Phoenix.Anchor.7"

```

---

### Key Security Details

#### 1. Avoiding Modulo Bias with Rejection Sampling

Simply using `crypto.getRandomValues()` with `% wordlist.length` introduces **modulo bias** if $2^{32}$ is not evenly divisible by the array length. Some words at the beginning of the list would have a slightly higher probability of being chosen.

The `getSecureRandomIndex` function eliminates this bias by applying **rejection sampling**: discarding any random uint32 value that falls into the incomplete upper remainder.

#### 2. Estimating Passphrase Entropy

The strength (entropy) of a passphrase depends directly on the **wordlist size** and the **number of words chosen**:

$$\text{Entropy (bits)} = \text{Word Count} \times \log_2(\text{Wordlist Size})$$

| Wordlist                         | Word Count | Calculation             | Total Entropy                         |
| -------------------------------- | ---------- | ----------------------- | ------------------------------------- |
| **EFF Large List** (7,776 words) | 4 words    | $4 \times \log_2(7776)$ | **$\approx 51.6$ bits**               |
| **EFF Large List** (7,776 words) | 5 words    | $5 \times \log_2(7776)$ | **$\approx 64.6$ bits**               |
| **EFF Large List** (7,776 words) | 6 words    | $6 \times \log_2(7776)$ | **$\approx 77.5$ bits** (Recommended) |

---

### Fetching the Official EFF 7,776 Wordlist

For production apps, load the standard EFF Large Wordlist over HTTPS rather than hardcoding a small array:

```javascript
async function fetchEFFWordlist() {
  const response = await fetch('https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt');
  const text = await response.text();
  
  // EFF wordlist format: "11111\tabacus\n11112\tabdomen\n..."
  return text
    .trim()
    .split('\n')
    .map(line => line.split('\t')[1]); // Extract word column
}

// Usage with EFF wordlist:
fetchEFFWordlist().then(effWords => {
  const securePassphrase = generatePassphrase({
    wordCount: 5,
    wordlist: effWords
  });
  console.log("Secure Passphrase:", securePassphrase);
});

```
