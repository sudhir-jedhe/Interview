To generate a cryptographically secure random password (composed of letters, numbers, and special symbols), you must draw random values from **`window.crypto.getRandomValues()`** and use **rejection sampling** to prevent modulo bias.

Here is a complete, modular, and production-ready implementation in JavaScript.

---

### Complete JavaScript Password Generator

```javascript
/**
 * Generates an unbiased, cryptographically secure random integer in the range [0, max).
 * Uses rejection sampling to eliminate modulo bias.
 * 
 * @param {number} max - Upper bound (exclusive)
 * @returns {number} Unbiased random index
 */
function getSecureRandomIndex(max) {
  if (max <= 0) throw new Error("Max must be greater than 0");

  const array = new Uint32Array(1);
  const maxUint32 = 0xFFFFFFFF; // 2^32 - 1
  // Find highest multiple of max that fits inside 32 bits
  const limit = maxUint32 - (maxUint32 % max);

  let randomVal;
  do {
    window.crypto.getRandomValues(array);
    randomVal = array[0];
  } while (randomVal >= limit); // Reject values in the biased remainder

  return randomVal % max;
}

/**
 * Fisher-Yates shuffle using cryptographically secure random numbers.
 * 
 * @param {Array} array - Array to shuffle in-place
 * @returns {Array} Shuffled array
 */
function secureShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generates a cryptographically secure random password.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.length - Total password length (min: 8, default: 16)
 * @param {boolean} options.uppercase - Include uppercase letters (A-Z)
 * @param {boolean} options.lowercase - Include lowercase letters (a-z)
 * @param {boolean} options.numbers - Include digits (0-9)
 * @param {boolean} options.symbols - Include special symbols (!@#$%^&*...)
 * @returns {string} Generated secure password
 */
function generateSecurePassword({
  length = 16,
  uppercase = true,
  lowercase = true,
  numbers = true,
  symbols = true
} = {}) {
  // Define character sets
  const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const selectedSets = [];
  if (uppercase) selectedSets.push(CHAR_SETS.uppercase);
  if (lowercase) selectedSets.push(CHAR_SETS.lowercase);
  if (numbers) selectedSets.push(CHAR_SETS.numbers);
  if (symbols) selectedSets.push(CHAR_SETS.symbols);

  if (selectedSets.length === 0) {
    throw new Error("At least one character type must be selected.");
  }

  if (length < selectedSets.length) {
    throw new Error(`Length must be at least ${selectedSets.length} to include all selected character types.`);
  }

  const passwordChars = [];

  // 1. GUARANTEE COMPLIANCE: Pick at least ONE character from each enabled set
  for (const set of selectedSets) {
    const randomIndex = getSecureRandomIndex(set.length);
    passwordChars.push(set[randomIndex]);
  }

  // 2. FILL REMAINING LENGTH: Draw from the combined pool of all selected sets
  const combinedPool = selectedSets.join('');
  while (passwordChars.length < length) {
    const randomIndex = getSecureRandomIndex(combinedPool.length);
    passwordChars.push(combinedPool[randomIndex]);
  }

  // 3. SHUFFLE: Randomize character positions so guaranteed types aren't always at the start
  return secureShuffle(passwordChars).join('');
}

// --- Usage Examples ---

// 1. Default 16-character secure password
console.log(generateSecurePassword());
// Output example: "k9#mP2$xR8!vL4Wq"

// 2. Custom 24-character alphanumeric password (no symbols)
console.log(generateSecurePassword({
  length: 24,
  symbols: false
}));
// Output example: "a7K9mP2xR8vL4Wq1N0jH5gD3"

```

---

### Why This Design is Cryptographically Sound

1. **`window.crypto.getRandomValues()`**: Uses the system's Cryptographically Secure Pseudo-Random Number Generator (CSPRNG), backed by hardware entropy (CPU noise, thermal sensors, driver events).
2. **Rejection Sampling (No Modulo Bias)**: Dividing a random 32-bit integer by character set sizes that aren't exact powers of 2 causes slight bias toward lower index values. Rejection sampling drops biased candidates to ensure every character in the set has a 100% equal mathematical probability of being picked.
3. **Guaranteed Complexity**: The function ensures at least 1 character from every active set (uppercase, lowercase, number, symbol) is selected first, avoiding edge cases where a 12-character password randomly fails to include a digit or symbol.
4. **Cryptographic Shuffle**: A standard Fisher-Yates algorithm driven by `getSecureRandomIndex()` shuffles the array so the guaranteed initial characters don't predictably sit at index `0`, `1`, `2`, or `3`.
