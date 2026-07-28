```js
export const checkPasswordStrength = (password) => {
  let strength = 0;

  if (password.length < 6) {
    return "weak";
  }

  if (password.match(/[a-z]+/)) {
    strength += 1;
  }
  if (password.match(/[A-Z]+/)) {
    strength += 1;
  }
  if (password.match(/[0-9]+/)) {
    strength += 1;
  }
  if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) {
    strength += 1;
  }

  if (strength < 2) {
    return "weak";
  } else if (strength === 2) {
    return "medium";
  } else {
    return "strong";
  }
};
