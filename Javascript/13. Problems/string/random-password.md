```js
/* Function to generate combination of password */
function generatePass() {
  let pass = "";
  let str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 8; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}

console.log(generatePass());

/********************************************************* */
function randomPassword() {
  console.log(
    Math.random().toString(36).slice(2) +
      Math.random().toString(36).toUpperCase().slice(2)
  );
}

randomPassword();
