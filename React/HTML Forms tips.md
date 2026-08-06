![alt text](image-8.png)

To handle custom validation UI while keeping HTML semantic and accessible, the sweet spot is leveraging the native **HTML5 Constraint Validation API** alongside CSS state pseudo-classes and ARIA attributes.

This pattern gives you complete control over custom error tooltips, messaging, and styling without throwing away native browser capabilities or accessibility.

---

# The Semantic & Accessible Custom Validation Pattern

Here is a full pattern that combines semantic HTML5 attributes, JavaScript Constraint Validation APIs, and accessible live regions.

### 1. The Accessible HTML Structure

```html
<form id="signup-form" novalidate>
  <div class="form-group">
    <label for="email">Email Address</label>
    
    <!-- Native attributes set baseline rules -->
    <input 
      type="email" 
      id="email" 
      name="email" 
      required
      autocomplete="email"
      aria-describedby="email-error"
      aria-invalid="false"
    />
    
    <!-- Accessible error message container -->
    <span id="email-error" class="error-message" aria-live="polite"></span>
  </div>

  <button type="submit">Create Account</button>
</form>

```

---

### 2. The JavaScript (Constraint Validation API)

Instead of manually checking `if (!value.includes('@'))`, inspect `input.validity` to read the browser's native validation engine state:

```javascript
const form = document.getElementById('signup-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');

// 1. Disable default browser error popups
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!form.checkValidity()) {
    validateEmailInput();
    // Focus the first invalid field for keyboard & screen reader users
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
  } else {
    // Submit data via fetch() or Server Action
    console.log('Form is valid! Submitting...');
  }
});

// 2. Real-time / Blur validation logic
emailInput.addEventListener('blur', validateEmailInput);
emailInput.addEventListener('input', () => {
  // Clear error on active typing if previously invalid
  if (emailInput.getAttribute('aria-invalid') === 'true') {
    validateEmailInput();
  }
});

function validateEmailInput() {
  const validity = emailInput.validity;

  if (validity.valid) {
    emailError.textContent = '';
    emailInput.setAttribute('aria-invalid', 'false');
    return;
  }

  // Map native validity state to custom, localized messages
  let message = '';
  if (validity.valueMissing) {
    message = 'Email address is required.';
  } else if (validity.typeMismatch) {
    message = 'Please enter a valid email format (e.g. name@company.com).';
  }

  // Update UI & Accessibility attributes
  emailError.textContent = message;
  emailInput.setAttribute('aria-invalid', 'true');
}

```

---

### 3. Accessible CSS Styling

Use `aria-invalid` or `:user-invalid` to style error states without flashing errors before user interaction:

```css
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

/* Style input when marked invalid */
input[aria-invalid="true"] {
  border-color: #dc2626;
  outline-color: #dc2626;
}

/* Error message label */
.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.375rem;
  min-height: 1.25rem; /* Prevents layout shift when text appears */
}

```

---

# Why This Pattern Works Best

1. **`novalidate` on `<form>`:** Disables ugly, inconsistent native browser popups without disabling the underlying JS validation API (`input.validity`).
2. **`aria-invalid` Sync:** Signals screen readers instantly when a field transitions into an error state.
3. **`aria-describedby` & `aria-live="polite"`:** Ensures screen readers automatically read custom error messages aloud when triggered or focused.
4. **Zero State-Management Overhead:** You read directly from `input.validity.valueMissing`, `input.validity.typeMismatch`, or `input.validity.patternMismatch` rather than managing complex React state objects for every keystroke.
