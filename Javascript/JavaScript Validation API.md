The **JavaScript Constraint Validation API** provides built-in methods and properties on HTML form elements (like `<input>`, `<select>`, and `<textarea>`) to validate user inputs before form submission.

---

## 1. Core Validation Properties

Every form input element exposes properties to inspect its current validity status:

| Property                        | Type            | Description                                                                  |
| ------------------------------- | --------------- | ---------------------------------------------------------------------------- |
| **`element.willValidate`**      | `boolean`       | Returns `true` if the element will be validated when submitted.              |
| **`element.validity`**          | `ValidityState` | Returns an object containing detailed validation status flags.               |
| **`element.validationMessage`** | `string`        | Contains the localized browser error message, or empty string `""` if valid. |

---

## 2. The `validity` State Object (`ValidityState`)

The `input.validity` property returns a `ValidityState` object containing boolean flags for specific failure reasons:

```javascript
const input = document.querySelector("#username");

console.log(input.validity.valid); // true if input satisfies all constraints

```

| `ValidityState` Property | Fails When...                                                   | Related HTML5 Attribute      |
| ------------------------ | --------------------------------------------------------------- | ---------------------------- |
| **`valueMissing`**       | A required input field is left empty.                           | `required`                   |
| **`typeMismatch`**       | Input format doesn't match expected type (e.g., invalid email). | `type="email"`, `type="url"` |
| **`patternMismatch`**    | Input value does not match the regular expression pattern.      | `pattern="[A-Z]{3}"`         |
| **`tooShort`**           | Text length is below `minlength`.                               | `minlength="5"`              |
| **`tooLong`**            | Text length exceeds `maxlength`.                                | `maxlength="20"`             |
| **`rangeUnderflow`**     | Numeric value is less than `min`.                               | `min="18"`                   |
| **`rangeOverflow`**      | Numeric value exceeds `max`.                                    | `max="100"`                  |
| **`stepMismatch`**       | Numeric value does not align with `step`.                       | `step="2"`                   |
| **`customError`**        | A custom message was set via `setCustomValidity()`.             | `setCustomValidity("Error")` |
| **`valid`**              | Returns `true` if **all** validation flags above are `false`.   | —                            |

---

## 3. Key Validation Methods

### A. `setCustomValidity(message)`

Sets a custom validation message on an input element. Passing an empty string `""` clears the custom error and marks the field as valid.

```javascript
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm");

confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value !== password.value) {
    // Setting a string marks confirmPassword as invalid (customError: true)
    confirmPassword.setCustomValidity("Passwords do not match!");
  } else {
    // Passing an empty string clears the error
    confirmPassword.setCustomValidity("");
  }
});

```

---

### B. `checkValidity()` & `reportValidity()`

* **`element.checkValidity()`:** Returns `true` if the input passes all constraints; otherwise fires an `invalid` event on the element and returns `false`.
* **`element.reportValidity()`:** Checks validity **AND** triggers the browser's native popup message tooltip if invalid.

```javascript
const emailInput = document.querySelector("#email");

// Check validity without showing native popup tooltip
if (!emailInput.checkValidity()) {
  console.log("Email is invalid:", emailInput.validationMessage);
}

// Check validity AND show native browser error tooltip
document.querySelector("#my-form").addEventListener("submit", (e) => {
  const form = e.target;
  if (!form.reportValidity()) {
    e.preventDefault(); // Stop form submission
  }
});

```

---

## 4. Complete Code Example: Custom Form Validation

```html
<form id="signupForm" novalidate>
  <div>
    <label for="age">Age (18+):</label>
    <input type="number" id="age" min="18" max="120" required />
    <span class="error-message" id="ageError"></span>
  </div>
  <button type="submit">Submit</button>
</form>

<script>
  const form = document.getElementById("signupForm");
  const ageInput = document.getElementById("age");
  const ageError = document.getElementById("ageError");

  // Real-time custom validation logic
  ageInput.addEventListener("input", () => {
    if (ageInput.validity.valid) {
      ageError.textContent = ""; // Clear error
    } else {
      showError();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default browser submit
    
    if (!ageInput.checkValidity()) {
      showError();
    } else {
      alert("Form submitted successfully!");
    }
  });

  function showError() {
    if (ageInput.validity.valueMissing) {
      ageError.textContent = "Please enter your age.";
    } else if (ageInput.validity.rangeUnderflow) {
      ageError.textContent = "You must be at least 18 years old.";
    } else if (ageInput.validity.rangeOverflow) {
      ageError.textContent = "Please enter a valid age under 120.";
    }
  }
</script>

```

> **Note:** Applying the **`novalidate`** attribute to the `<form>` disables the browser's default popup tooltips, allowing you to render custom error messages in the DOM using CSS and JavaScript.
