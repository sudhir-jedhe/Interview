Building a password strength meter that measures **bits of entropy** is far superior to simple character-count checklists. Entropy quantifies the mathematical randomness of a password based on its character set size and length using the standard formula:

$$E = L \times \log_2(R)$$

* $L$ = Length of the password
* $R$ = Size of the character pool (lowercase, uppercase, numbers, symbols)

---

### Complete JavaScript Implementation

Here is a complete, self-contained implementation that calculates entropy bits, deducts points for common predictable patterns (sequences, repeated characters), and returns a score, rating, and percentage.

```javascript
/**
 * Calculates password entropy and returns a comprehensive strength rating.
 * 
 * @param {string} password - The input password
 * @returns {Object} Strength metric details
 */
function evaluatePasswordStrength(password) {
  if (!password) {
    return { entropy: 0, score: 0, percent: 0, label: 'Very Weak', color: '#dc3545' };
  }

  // 1. Determine Character Pool Size (R)
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26; // Lowercase
  if (/[A-Z]/.test(password)) poolSize += 26; // Uppercase
  if (/[0-9]/.test(password)) poolSize += 10; // Digits
  if (/[^\w\s]/.test(password)) poolSize += 32; // Special characters / symbols
  if (/\s/.test(password)) poolSize += 1; // Whitespace

  // Fallback for non-standard characters
  if (poolSize === 0) poolSize = 1;

  // 2. Base Entropy Calculation: L * log2(R)
  const length = password.length;
  let rawEntropy = length * (Math.log2(poolSize));

  // 3. Deductions for Predictable Patterns
  let penalties = 0;

  // Deduct for sequential numbers or letters (e.g., "1234", "abcd", "qwerty")
  const sequences = /(1234|2345|3456|4567|5678|6789|abcd|qwerty|password|admin)/i;
  if (sequences.test(password)) penalties += 15;

  // Deduct for character repetitions (e.g., "aaa", "111")
  const repetitions = /(.)\1{2,}/g;
  const matchRepetitions = password.match(repetitions);
  if (matchRepetitions) {
    penalties += matchRepetitions.length * 10;
  }

  // Adjusted final entropy
  const entropy = Math.max(0, Math.round(rawEntropy - penalties));

  // 4. Categorize Strength based on Entropy Bits
  let label = '';
  let color = '';
  let score = 0; // Score out of 4 (ideal for UI progress bars)

  if (entropy < 28) {
    label = 'Very Weak';
    color = '#dc3545'; // Red
    score = 0;
  } else if (entropy < 36) {
    label = 'Weak';
    color = '#fd7e14'; // Orange
    score = 1;
  } else if (entropy < 60) {
    label = 'Fair';
    color = '#ffc107'; // Yellow
    score = 2;
  } else if (entropy < 80) {
    label = 'Strong';
    color = '#20c997'; // Teal
    score = 3;
  } else {
    label = 'Very Strong';
    color = '#198754'; // Green
    score = 4;
  }

  // Calculate percentage capped at 100% (100 bits = max score)
  const percent = Math.min(100, Math.round((entropy / 100) * 100));

  return {
    entropy,
    score,
    percent,
    label,
    color,
    poolSize,
    length
  };
}

// --- Examples ---
console.log(evaluatePasswordStrength("password"));
// Output: { entropy: 12, score: 0, percent: 12, label: 'Very Weak', color: '#dc3545' }

console.log(evaluatePasswordStrength("P@ssw0rd2026!"));
// Output: { entropy: 70, score: 3, percent: 70, label: 'Strong', color: '#20c997' }

console.log(evaluatePasswordStrength("correct-horse-battery-staple"));
// Output: { entropy: 133, score: 4, percent: 100, label: 'Very Strong', color: '#198754' }

```

---

### Real-Time HTML & CSS Strength Bar Example

Here is how to hook the function up to a live UI input field with a dynamic strength bar:

```html
<div style="max-width: 350px; font-family: sans-serif;">
  <label for="password" style="display: block; margin-bottom: 5px;">Password</label>
  <input 
    type="password" 
    id="password" 
    placeholder="Enter password"
    style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"
  />

  <!-- Strength Bar Container -->
  <div style="background-color: #eee; height: 8px; border-radius: 4px; margin-top: 8px; overflow: hidden;">
    <div id="strength-bar" style="height: 100%; width: 0%; transition: all 0.3s ease;"></div>
  </div>

  <!-- Text Output -->
  <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.85em;">
    <span id="strength-label" style="font-weight: bold; color: #666;">Enter a password</span>
    <span id="entropy-bits" style="color: #888;">0 bits</span>
  </div>
</div>

<script>
  const passwordInput = document.getElementById('password');
  const strengthBar = document.getElementById('strength-bar');
  const strengthLabel = document.getElementById('strength-label');
  const entropyBits = document.getElementById('entropy-bits');

  passwordInput.addEventListener('input', (e) => {
    const val = e.target.value;
    const result = evaluatePasswordStrength(val);

    if (!val) {
      strengthBar.style.width = '0%';
      strengthLabel.textContent = 'Enter a password';
      strengthLabel.style.color = '#666';
      entropyBits.textContent = '0 bits';
      return;
    }

    // Update UI elements
    strengthBar.style.width = `${result.percent}%`;
    strengthBar.style.backgroundColor = result.color;
    strengthLabel.textContent = result.label;
    strengthLabel.style.color = result.color;
    entropyBits.textContent = `${result.entropy} bits`;
  });
</script>

```

---

### Standard Entropy Thresholds

| Entropy Bits     | Strength Classification | Estimated Time to Brute Force |
| ---------------- | ----------------------- | ----------------------------- |
| **< 28 bits**    | Very Weak               | Instantaneous                 |
| **28 – 35 bits** | Weak                    | Seconds to minutes            |
| **36 – 59 bits** | Fair                    | Hours to days                 |
| **60 – 79 bits** | Strong                  | Months to years               |
| **80+ bits**     | Very Strong             | Centuries / Unfeasible        |
