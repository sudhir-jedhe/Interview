```js
export const validateEmailAddress = (email) => {
  const emailRegex = /^[^@]+@[^@.]+(\.[^@.]+)+[^@]*$/;
  return emailRegex.test(email);
};

/******************************* */
export const validateEmailAddress = (email) => {
  // Check for empty input or missing "@" symbol
  if (!email || email.indexOf("@") === -1) {
    return false;
  }

  // Check that "@" symbol is not first or last character
  if (email[0] === "@" || email[email.length - 1] === "@") {
    return false;
  }

  // Split the string at the "@" symbol
  const parts = email.split("@");
  // Check that there is only one "@" symbol
  if (parts.length !== 2) {
    return false;
  }

  // Check that the part after the "@" symbol contains at least one "."
  if (parts[1].indexOf(".") === -1) {
    return false;
  }

  // Check that the first character after the "@" symbol is not "."
  if (parts[1][0] === ".") {
    return false;
  }

  // Check that the last character after the "@" symbol is not "."
  if (parts[1][parts[1].length - 1] === ".") {
    return false;
  }

  // Check that there are no consecutive "." characters after the "@" symbol
  for (let i = 0; i < parts[1].length - 1; i++) {
    if (parts[1][i] === "." && parts[1][i + 1] === ".") {
      return false;
    }
  }

  // All checks passed, so the email is valid
  return true;
};
