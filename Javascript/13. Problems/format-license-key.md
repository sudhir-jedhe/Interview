```js
// Input: str = "dsf354g4dsg1";
// k = 4;
// Output: "DSF3-54G4-DSG1";

// Input: str = "d-sf354g4ds-g1dsfgdf-sfd5ds65-46";
// k = 6;
// Output: "D-SF354G-40DSGS-FGFSFD-DS6546";

// Input: str = "   d-sf354';.;.';.'...,k/]gcs-hsfgdf-sfs6-46";
// Output: k = 5;

// Output: "DS-F354K-GCSHS-FGDFS-FS646";

function format(str, k) {
  str = str

    // Remove the white spaces
    .trim()

    // Replace all the special
    // characters with ""
    .replace(/[^a-zA-Z0-9]/g, "")

    // Transform the string into
    // uppercase characters
    .toUpperCase()

    // Convert the string into array
    .split("");

  // Store the length of the
  // array into len
  let len = str.length;

  for (let i = len; i > 0; i = i - k) {
    if (i != len) {
      // Concatenate the string with "-"
      str[i - 1] = str[i - 1] + "-";
    }
  }

  // Join the array to make it a string
  return str.join("");
}

console.log(format("dsf354g4dsg1", 4));
console.log(format("d-sf354g40ds-gsfgf-sfdds65-46", 6));
console.log(format(" d-sf354';.;.';.'...,k/]gcs-hsfgdf-sfs6-46", 5));
