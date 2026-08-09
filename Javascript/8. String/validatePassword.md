Here is how to write a password validation function in JavaScript that checks for uppercase letters, lowercase letters, numbers, symbols, and a minimum length.

---

### Option 1: Detailed Validation (Returns Error List)

This approach returns an object containing an overall `isValid` boolean along with individual test results. This is best for giving users real-time feedback on forms.

```javascript
function validatePassword(password, minLength = 8) {
  const checks = {
    hasMinLength: password.length >= minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    // Matches common special characters / symbols
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
  };

  // True if every requirement is satisfied
  const isValid = Object.values(checks).every(Boolean);

  return {
    isValid,
    checks
  };
}

// Example usage:
const result = validatePassword("P@ssword123");
console.log(result);
/*
Output:
{
  isValid: true,
  checks: {
    hasMinLength: true,
    hasUppercase: true,
    hasLowercase: true,
    hasNumber: true,
    hasSymbol: true
  }
}
*/

```

---

### Option 2: Single Regular Expression (Boolean Output)

If you only need a quick `true` or `false` check, you can use **lookahead assertions** (`(?=...)`) in a single regex:

```javascript
function isPasswordStrong(password, minLength = 8) {
  // Lookaheads:
  // (?=.*[a-z]) -> At least one lowercase letter
  // (?=.*[A-Z]) -> At least one uppercase letter
  // (?=.*\d)     -> At least one digit
  // (?=.*[^\w\s]) -> At least one symbol/special character (non-word, non-space)
  // .{8,}       -> At least 8 characters long
  const passwordRegex = new RegExp(
    `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{${minLength},}$`
  );

  return passwordRegex.test(password);
}

// Examples:
console.log(isPasswordStrong("Weak123"));      // false (missing symbol)
console.log(isPasswordStrong("weak@123"));     // false (missing uppercase)
console.log(isPasswordStrong("P@ssword123"));  // true

```

---

### Real-Time UI Example (HTML + JS)

Here is a quick pattern for updating UI checklists as a user types into an input field:

```html
<input type="password" id="passwordInput" placeholder="Enter password" />
<div id="feedback"></div>

<script>
  const passwordInput = document.getElementById('passwordInput');
  const feedback = document.getElementById('feedback');

  passwordInput.addEventListener('input', (e) => {
    const { isValid, checks } = validatePassword(e.target.value);
    
    feedback.innerHTML = `
      <ul>
        <li style="color: ${checks.hasMinLength ? 'green' : 'red'}">At least 8 characters</li>
        <li style="color: ${checks.hasUppercase ? 'green' : 'red'}">At least 1 uppercase letter</li>
        <li style="color: ${checks.hasLowercase ? 'green' : 'red'}">At least 1 lowercase letter</li>
        <li style="color: ${checks.hasNumber ? 'green' : 'red'}">At least 1 number</li>
        <li style="color: ${checks.hasSymbol ? 'green' : 'red'}">At least 1 symbol</li>
      </ul>
    `;
  });
</script>

```

---

### Regex Pattern Summary

| Rule           | Regex Pattern       | Description                                                       |
| -------------- | ------------------- | ----------------------------------------------------------------- |
| **Min Length** | `.length >= 8`      | Native string length property                                     |
| **Uppercase**  | `/[A-Z]/`           | Matches any ASCII capital letter                                  |
| **Lowercase**  | `/[a-z]/`           | Matches any ASCII small letter                                    |
| **Numbers**    | `/\d/` or `/[0-9]/` | Matches any single digit                                          |
| **Symbols**    | `/[^\w\s]/`         | Matches any character that is not a letter, number, or whitespace |
