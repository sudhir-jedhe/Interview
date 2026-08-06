```js
// Function to generate OTP
//one-time password (OTP) Only Numeric
function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  let digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

console.log("OTP of 6 digits: ");
console.log(generateOTP());

/*************************************************************** */

// Function to generate OTP  one-time password (OTP) with Alphanumeric
// Function to generate OTP
function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  let digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

console.log("OTP of 6 digits: ");
console.log(generateOTP());

/************************************************ */
// Function to generate OTP one-time password (OTP) with Special Characters
function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  let digits =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

console.log("OTP of 6 digits: ");
console.log(generateOTP());
