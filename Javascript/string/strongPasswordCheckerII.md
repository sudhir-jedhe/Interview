```js
function strongPasswordCheckerII(password: string): boolean {
    if (password.length < 8) {
        return false;
    }
    let mask = 0;
    for (let i = 0; i < password.length; ++i) {
        const c = password[i];
        if (i && c == password[i - 1]) {
            return false;
        }
        if (c >= 'a' && c <= 'z') {
            mask |= 1;
        } else if (c >= 'A' && c <= 'Z') {
            mask |= 2;
        } else if (c >= '0' && c <= '9') {
            mask |= 4;
        } else {
            mask |= 8;
        }
    }
    return mask == 15;
}

A password is said to be strong if it satisfies all the following criteria:

It has at least 8 characters.
It contains at least one lowercase letter.
It contains at least one uppercase letter.
It contains at least one digit.
It contains at least one special character. The special characters are the characters in the following string: "!@#$%^&*()-+".
It does not contain 2 of the same character in adjacent positions (i.e., "aab" violates this condition, but "aba" does not).
Given a string password, return true if it is a strong password. Otherwise, return false.



Example 1:

Input: password = "IloveLe3tcode!"
Output: true
Explanation: The password meets all the requirements. Therefore, we return true.
Example 2:

Input: password = "Me+You--IsMyDream"
Output: false
Explanation: The password does not contain a digit and also contains 2 of the same character in











/********************************** */



A password is considered strong if the below conditions are all met:

It has at least 6 characters and at most 20 characters.
It contains at least one lowercase letter, at least one uppercase letter, and at least one digit.
It does not contain three repeating characters in a row (i.e., "Baaabb0" is weak, but "Baaba0" is strong).
Given a string password, return the minimum number of steps required to make password strong. if password is already strong, return 0.

In one step, you can:

Insert one character to password,
Delete one character from password, or
Replace one character of password with another character.


Example 1:

Input: password = "a"
Output: 5
Example 2:

Input: password = "aA1"
Output: 3
Example 3:

Input: password = "1337C0d3"
Output: 0



class Solution {
    strongPasswordChecker(password) {
        const types = this.countTypes(password);
        const n = password.length;

        if (n < 6) {
            return Math.max(6 - n, 3 - types);
        }

        const chars = password.split('');
        if (n <= 20) {
            let replace = 0;
            let cnt = 0;
            let prev = '~';
            for (let i = 0; i < chars.length; i++) {
                const curr = chars[i];
                if (curr === prev) {
                    cnt++;
                } else {
                    replace += Math.floor(cnt / 3);
                    cnt = 1;
                    prev = curr;
                }
            }
            replace += Math.floor(cnt / 3);
            return Math.max(replace, 3 - types);
        }

        let replace = 0, remove = n - 20;
        let remove2 = 0;
        let cnt = 0;
        let prev = '~';
        for (let i = 0; i < chars.length; i++) {
            const curr = chars[i];
            if (curr === prev) {
                cnt++;
            } else {
                if (remove > 0 && cnt >= 3) {
                    if (cnt % 3 === 0) {
                        remove--;
                        replace--;
                    } else if (cnt % 3 === 1) {
                        remove2++;
                    }
                }
                replace += Math.floor(cnt / 3);
                cnt = 1;
                prev = curr;
            }
        }

        if (remove > 0 && cnt >= 3) {
            if (cnt % 3 === 0) {
                remove--;
                replace--;
            } else if (cnt % 3 === 1) {
                remove2++;
            }
        }
        replace += Math.floor(cnt / 3);

        const use2 = Math.min(Math.min(replace, remove2), Math.floor(remove / 2));
        replace -= use2;
        remove -= use2 * 2;

        const use3 = Math.min(replace, Math.floor(remove / 3));
        replace -= use3;
        remove -= use3 * 3;

        return (n - 20) + Math.max(replace, 3 - types);
    }

    countTypes(s) {
        let a = 0, b = 0, c = 0;
        for (let ch of s) {
            if (/[a-z]/.test(ch)) {
                a = 1;
            } else if (/[A-Z]/.test(ch)) {
                b = 1;
            } else if (/\d/.test(ch)) {
                c = 1;
            }
        }
        return a + b + c;
    }
}


const solution = new Solution();
console.log(solution.strongPasswordChecker("aA1")); // Example usage
```

Here is a detailed breakdown and review of both LeetCode problems presented in your snippet: **LeetCode 2299 ("Strong Password Checker II")** and **LeetCode 428 ("Strong Password Checker")**.

---

## Part 1: Strong Password Checker II (LeetCode 2299)

### Bug Analysis in Provided Code

Your bitmask-based TypeScript solution is almost perfect, but it contains **one edge-case bug**:

```typescript
} else {
    mask |= 8; // ⚠️ Bug: Assumes any non-alphanumeric char is a valid special char!
}

```

The problem statement strictly defines a valid set of special characters: `"!@#$%^&*()-+"`.

If the input contains space characters or other symbols like `'~'`, `'='`, or `'?'`, your current code sets `mask |= 8` and returns `true`, even though those are invalid special characters.

---

### Corrected & Optimal Solution

```typescript
function strongPasswordCheckerII(password: string): boolean {
    if (password.length < 8) {
        return false;
    }

    const specialChars = new Set("!@#$%^&*()-+");
    let mask = 0; // Bit 0: lowercase, Bit 1: uppercase, Bit 2: digit, Bit 3: valid special char

    for (let i = 0; i < password.length; ++i) {
        const c = password[i];

        // Criterion: No 2 adjacent identical characters
        if (i > 0 && c === password[i - 1]) {
            return false;
        }

        if (c >= 'a' && c <= 'z') {
            mask |= 1;
        } else if (c >= 'A' && c <= 'Z') {
            mask |= 2;
        } else if (c >= '0' && c <= '9') {
            mask |= 4;
        } else if (specialChars.has(c)) {
            mask |= 8;
        }
    }

    // Must satisfy all 4 character type requirements (1 | 2 | 4 | 8 = 15)
    return mask === 15;
}

// Tests
console.log(strongPasswordCheckerII("IloveLe3tcode!")); // true
console.log(strongPasswordCheckerII("Me+You--IsMyDream")); // false (adjacent '--' and missing digit)

```

#### Complexity

* **Time Complexity:** $\mathcal{O}(N)$ where $N$ is the length of `password`.
* **Space Complexity:** $\mathcal{O}(1)$ auxiliary space.

---

## Part 2: Strong Password Checker (LeetCode 428 - Hard)

LeetCode 428 is notoriously one of the hardest string manipulation problems on LeetCode due to the greedy deletion priority rules required when length $N > 20$.

---

### Algorithm Strategy Breakdown

When analyzing password length $N$:

#### Case 1: $N < 6$ (Insertion Needed)

When length is less than 6, deletions are never necessary. Inserting a character can simultaneously fix a missing type (uppercase/lowercase/digit) and break up a triple repeating character.

$$\text{Steps} = \max(6 - N, 3 - \text{types})$$

#### Case 2: $6 \le N \le 20$ (Replacement / Insertion)

Length is already valid. We only need replacements to break repeating trios and missing character types. A contiguous run of length $L$ requires $\lfloor L / 3 \rfloor$ replacements.

$$\text{Steps} = \max(\sum \lfloor L / 3 \rfloor, 3 - \text{types})$$

#### Case 3: $N > 20$ (Greedy Deletion)

We must delete $D = N - 20$ characters. Deletions should be used **greedily** to reduce required replacements:

1. **$L \bmod 3 == 0$ (e.g., "aaa"):** Deleting 1 character reduces the replacement count by 1!
2. **$L \bmod 3 == 1$ (e.g., "aaaa"):** Deleting 2 characters reduces the replacement count by 1.
3. **$L \bmod 3 == 2$ (e.g., "aaaaa"):** Deleting 3 characters reduces the replacement count by 1.

---

### Clean & Bug-Free JavaScript Solution

Here is a streamlined, clean implementation for LeetCode 428 using greedy heap/array priority for $N > 20$:

```javascript
class Solution {
  /**
   * @param {string} password
   * @returns {number} Minimum steps required
   */
  strongPasswordChecker(password) {
    const n = password.length;

    // 1. Count character types missing
    let missingTypes = 3;
    if (/[a-z]/.test(password)) missingTypes--;
    if (/[A-Z]/.test(password)) missingTypes--;
    if (/\d/.test(password)) missingTypes--;

    // Case 1: Length < 6
    if (n < 6) {
      return Math.max(6 - n, missingTypes);
    }

    // Build run lengths of repeating characters
    const runs = [];
    for (let i = 0; i < n; ) {
      let j = i;
      while (j < n && password[j] === password[i]) j++;
      const len = j - i;
      if (len >= 3) runs.push(len);
      i = j;
    }

    // Case 2: 6 <= Length <= 20
    if (n <= 20) {
      const replaces = runs.reduce((acc, len) => acc + Math.floor(len / 3), 0);
      return Math.max(replaces, missingTypes);
    }

    // Case 3: Length > 20 (Greedy Deletion)
    let deletions = n - 20;
    const totalDeletions = deletions;

    // Priority 1: Delete 1 char from runs where len % 3 == 0
    for (let i = 0; i < runs.length && deletions > 0; i++) {
      if (runs[i] % 3 === 0) {
        runs[i] -= 1;
        deletions -= 1;
      }
    }

    // Priority 2: Delete 2 chars from runs where len % 3 == 1
    for (let i = 0; i < runs.length && deletions >= 2; i++) {
      if (runs[i] % 3 === 1) {
        runs[i] -= 2;
        deletions -= 2;
      }
    }

    // Priority 3: Delete 3 chars from remaining runs
    for (let i = 0; i < runs.length && deletions > 0; i++) {
      if (runs[i] >= 3) {
        const canRemove = Math.min(deletions, runs[i] - 2);
        runs[i] -= canRemove;
        deletions -= canRemove;
      }
    }

    // Calculate remaining replacements needed after optimal deletions
    const replaces = runs.reduce((acc, len) => acc + Math.floor(len / 3), 0);

    return totalDeletions + Math.max(replaces, missingTypes);
  }
}

// --- Test Verification ---
const solution = new Solution();
console.log(solution.strongPasswordChecker("a"));         // 5
console.log(solution.strongPasswordChecker("aA1"));       // 3
console.log(solution.strongPasswordChecker("1337C0d3"));  // 0
console.log(solution.strongPasswordChecker("aaaaaaaaaaaaaaaaaaaaa")); // 3

```

---

### Comparison of the Two Problems

| Feature              | LeetCode 2299 (Easy/Medium)           | LeetCode 428 (Hard)                                 |
| -------------------- | ------------------------------------- | --------------------------------------------------- |
| **Length Bounds**    | $\ge 8$                               | $6 \le N \le 20$                                    |
| **Adjacent Repeats** | No 2 adjacent identical (`"aa"`)      | No 3 adjacent identical (`"aaa"`)                   |
| **Special Chars**    | Requires explicit `!@#$%^&*()-+`      | Not required                                        |
| **Goal**             | Boolean verification (`true`/`false`) | Minimum edit operations (Insert / Delete / Replace) |
| **Time Complexity**  | $\mathcal{O}(N)$                      | $\mathcal{O}(N)$                                    |

A single regular expression can validate complex password requirements in a single pass using **positive lookaheads** (`(?=...)`).

Positive lookaheads assert that a specific pattern exists somewhere ahead in the string *without consuming any characters* or moving the matching index. This allows you to stack multiple independent rules at the beginning of the regex.

---

### The All-in-One Password Validation Regex

```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/])[A-Za-z\d!@#$%^&*()\-_=+\[\]{}|;:',.<>?/]{8,32}$/;

```

---

### Anatomy & Step-by-Step Breakdown

The expression reads left-to-right starting from the anchor `^`:

| Pattern                        | Rule Evaluated                   | Mechanism                                                                                                   |
| ------------------------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **`^`**                        | Start anchor                     | Asserts position at the beginning of the string.                                                            |
| **`(?=.*[a-z])`**              | At least **1 lowercase** letter  | Looks ahead to verify at least one lowercase character exists.                                              |
| **`(?=.*[A-Z])`**              | At least **1 uppercase** letter  | Looks ahead to verify at least one uppercase character exists.                                              |
| **`(?=.*\d)`**                 | At least **1 digit**             | Looks ahead to verify at least one numeric digit (`0-9`) exists.                                            |
| **`(?=.*[!@#$%^&*...])`**      | At least **1 special character** | Looks ahead to verify at least one special symbol exists.                                                   |
| **`[A-Za-z\d!@#$%...]{8,32}`** | Allowed characters & length      | **Consumes characters:** ensures total length is 8 to 32 characters and contains *only* allowed characters. |
| **`$`**                        | End anchor                       | Asserts position at the end of the string.                                                                  |

> 💡 **Why `.*` inside lookaheads?**
> `(?=.*[A-Z])` tells the engine: "Scan forward through any number of characters (`.*`) until you hit an uppercase letter (`[A-Z]`)." Once checked, the cursor resets back to `^` for the next lookahead assertion.

---

### JavaScript Implementation Example

```javascript
function validatePassword(password) {
  // 8 to 32 chars, >=1 lower, >=1 upper, >=1 digit, >=1 special symbol
  const strongPasswordRegex = 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/])[A-Za-z\d!@#$%^&*()\-_=+\[\]{}|;:',.<>?/]{8,32}$/;

  return strongPasswordRegex.test(password);
}

// --- Test Cases ---
console.log(validatePassword("P@ssword123")); // true
console.log(validatePassword("password123")); // false (missing uppercase & special)
console.log(validatePassword("P@ss1"));       // false (too short, < 8 chars)
console.log(validatePassword("P@sswordRule"));// false (missing digit)

```

---

### Adding Advanced Rules: Preventing Repeated Characters

If you want to enforce **no 2 or 3 adjacent identical characters** (e.g., disallow `"aa"` or `"aaa"`), you can append a **negative lookahead** (`(?!...)`) right after `^`:

```javascript
// Adds (?!.*(.)\1) -> Disallows any character followed immediately by itself ("aa", "11", "@@")
const noRepeatsRegex = 
  /^(?!.*(.)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/;

console.log(noRepeatsRegex.test("P@sword123")); // true
console.log(noRepeatsRegex.test("P@@sword123")); // false (contains '@@')

```

---

### UX Consideration: Single Regex vs. Multiple Rules

While a single regex is concise, returning a generic `false` can degrade user experience because the user doesn't know *which* requirement failed.

In real-world frontend applications (like sign-up forms with live checkmarks), checking each rule individually is often preferred:

```javascript
// ✅ Better UX for dynamic UI feedback
const passwordRules = {
  hasMinLength: (s) => s.length >= 8 && s.length <= 32,
  hasLowerCase: (s) => /[a-z]/.test(s),
  hasUpperCase: (s) => /[A-Z]/.test(s),
  hasDigit:     (s) => /\d/.test(s),
  hasSpecial:   (s) => /[!@#$%^&*()\-_=+]/.test(s),
};

function getPasswordFeedback(password) {
  return {
    isMinLengthValid: passwordRules.hasMinLength(password),
    isLowerCaseValid: passwordRules.hasLowerCase(password),
    isUpperCaseValid: passwordRules.hasUpperCase(password),
    isDigitValid:     passwordRules.hasDigit(password),
    isSpecialValid:   passwordRules.hasSpecial(password),
  };
}

```

Building an interactive password strength indicator in React involves measuring password criteria in real time, calculating an overall score (or percentage), and updating an accessible visual meter.

Here is a complete, production-ready React component with real-time feedback, visual strength bars, and accessibility support (`aria-*` attributes).

---

### Interactive React Password Component

```jsx
import React, { useState } from 'react';

// 1. Rule definition configuration
const CRITERIA = [
  { id: 'length', label: 'At least 8 characters', test: (s) => s.length >= 8 },
  { id: 'lowercase', label: 'One lowercase letter', test: (s) => /[a-z]/.test(s) },
  { id: 'uppercase', label: 'One uppercase letter', test: (s) => /[A-Z]/.test(s) },
  { id: 'digit', label: 'One number', test: (s) => /\d/.test(s) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (s) => /[!@#$%^&*()\-_=+]/.test(s) },
];

// Strength levels mapped to scores (0 to 5)
const STRENGTH_CONFIG = [
  { label: 'Very Weak', color: 'bg-gray-300' },
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-orange-500' },
  { label: 'Good', color: 'bg-yellow-500' },
  { label: 'Strong', color: 'bg-emerald-500' },
  { label: 'Very Strong', color: 'bg-green-600' },
];

export default function PasswordStrengthInput() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Evaluate passed criteria
  const passedCriteria = CRITERIA.map((criterion) => ({
    ...criterion,
    isPassed: criterion.test(password),
  }));

  const score = password ? passedCriteria.filter((c) => c.isPassed).length : 0;
  const currentStrength = STRENGTH_CONFIG[score];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <label htmlFor="password-input" className="block text-sm font-semibold text-gray-700 mb-2">
        Password
      </label>

      {/* Input Field with Toggle Visibility */}
      <div className="relative mb-4">
        <input
          id="password-input"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a strong password"
          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-indigo-600 focus:outline-none"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Strength Progress Meter */}
      <div className="mb-4" aria-live="polite">
        <div className="flex justify-between items-center mb-1 text-sm font-medium">
          <span className="text-gray-600">Strength:</span>
          <span className={`font-semibold ${score > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
            {password ? currentStrength.label : 'None'}
          </span>
        </div>

        {/* 5-segment bar */}
        <div className="grid grid-cols-5 gap-1.5 h-2" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-full rounded-full transition-colors duration-300 ${
                level <= score ? currentStrength.color : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Real-time Checklist */}
      <ul className="space-y-1.5 text-xs text-gray-600">
        {passedCriteria.map(({ id, label, isPassed }) => (
          <li key={id} className="flex items-center space-x-2">
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {isPassed ? '✓' : '✕'}
            </span>
            <span className={isPassed ? 'line-through text-gray-400' : 'text-gray-600'}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

### Key Architectural Considerations

1. **Derived State Over Redundant State:**
Avoid storing `score` or `passedCriteria` in `useState`. Derive them synchronously during render from `password`. This prevents synchronization bugs and keeps the state clean.
2. **Segmented Visual Indicator:**
A 5-segmented bar (rather than a continuous slider) provides clearer visual feedback for distinct criteria milestones.
3. **Accessibility (`aria-live`):**
Wrapping the strength level text in `aria-live="polite"` ensures screen reader users receive auditory updates as they type without disrupting their focus.
